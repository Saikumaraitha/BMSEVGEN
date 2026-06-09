
/**
 * Singleton WebSocket manager — one persistent connection per active chat session.
 *
 * Lifecycle:
 *   connect(sessionId, wsUrl)    — open (or reuse) a WS for the session
 *   disconnect()                 — drain if a stream is in-flight, else close immediately
 *   waitForSocket(sessionId)     — await the pending/open socket for sessionId
 *   notifyStreamStart(sessionId) — called when a stream begins
 *   notifyStreamDone(sessionId)  — called when a stream finishes; closes draining sockets
 *
 * Draining sockets: when the user switches sessions while a stream is in-flight,
 * the old socket stays alive in `draining` until notifyStreamDone closes it.
 * The new session's socket runs in parallel without interference.
 */
 
const WS_CONNECT_TIMEOUT_MS = 25_000;
const WS_KEEPALIVE_INTERVAL_MS = 4 * 60 * 1000;
 
interface ActiveConnection {
  socket: WebSocket;
  sessionId: string;
  openPromise: Promise<WebSocket>;
}
 
let active: ActiveConnection | null = null;
const draining = new Map<string, WebSocket>();
const activeStreams = new Set<string>(); // sessionIds with in-flight streams
const keepaliveTimers = new Map<WebSocket, number>();
 
const waitForOpen = (socket: WebSocket): Promise<void> => {
  if (socket.readyState === WebSocket.OPEN) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      socket.removeEventListener('open', onOpen);
      socket.removeEventListener('error', onError);
      socket.removeEventListener('close', onClose);
    };
    const onOpen = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error('WebSocket connection failed')); };
    const onClose = () => { cleanup(); reject(new Error('WebSocket closed before opening')); };
    socket.addEventListener('open', onOpen);
    socket.addEventListener('error', onError);
    socket.addEventListener('close', onClose);
  });
};
 
const withConnectTimeout = <T>(promise: Promise<T>, msg: string): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(msg)), WS_CONNECT_TIMEOUT_MS);
    promise
      .then(r => { window.clearTimeout(timer); resolve(r); })
      .catch(e => { window.clearTimeout(timer); reject(e); });
  });
 
const closeSocket = (socket: WebSocket, sessionId: string) => {
  const keepalive = keepaliveTimers.get(socket);
  if (keepalive !== undefined) {
    window.clearInterval(keepalive);
    keepaliveTimers.delete(socket);
  }
 
  try {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'unsubscribe', session_id: sessionId }));
    }
  } catch { /* best-effort */ }
  try { socket.close(); } catch { /* best-effort */ }
};
 
const startKeepalive = (socket: WebSocket) => {
  if (keepaliveTimers.has(socket)) {
    return;
  }
 
  const timer = window.setInterval(() => {
    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }
    try {
      socket.send(JSON.stringify({ type: 'ping' }));
    } catch (error) {
      console.warn('[ChatWS] Keepalive ping failed', error);
    }
  }, WS_KEEPALIVE_INTERVAL_MS);
 
  keepaliveTimers.set(socket, timer);
};
 
export const chatWebSocketManager = {
  /**
   * Wait for the managed socket for sessionId to be ready (handles CONNECTING
   * state). Returns null if no connection exists for this session.
   */
  async waitForSocket(sessionId: string): Promise<WebSocket | null> {
    if (!active || active.sessionId !== sessionId) return null;
    try {
      return await active.openPromise;
    } catch {
      return null;
    }
  },
 
  /**
   * Connect a persistent WS for sessionId. If a different session is active,
   * it is moved to draining (if a stream is running) or closed immediately.
   */
  async connect(sessionId: string, wsUrl: string): Promise<WebSocket> {
    // Reuse existing connection for the same session
    if (active && active.sessionId === sessionId) {
      return active.openPromise;
    }
 
    // Move old session's socket to draining or close it
    if (active) {
      if (activeStreams.has(active.sessionId)) {
        draining.set(active.sessionId, active.socket);
      } else {
        closeSocket(active.socket, active.sessionId);
      }
      active = null;
    }
 
    const socket = new WebSocket(wsUrl);
 
    const openPromise = withConnectTimeout(
      waitForOpen(socket).then(() => {
        startKeepalive(socket);
        socket.send(JSON.stringify({ type: 'subscribe', session_id: sessionId }));
        return socket;
      }),
      'WebSocket connection timeout'
    );
 
    socket.addEventListener('close', () => {
      const keepalive = keepaliveTimers.get(socket);
      if (keepalive !== undefined) {
        window.clearInterval(keepalive);
        keepaliveTimers.delete(socket);
      }
      if (active?.socket === socket) active = null;
      draining.forEach((s, sid) => { if (s === socket) draining.delete(sid); });
    });
 
    active = { socket, sessionId, openPromise };
    return openPromise;
  },
 
  /**
   * Close the active session's socket.
   * If a stream is currently in-flight for that session, move to draining
   * instead of closing immediately — notifyStreamDone will close it later.
   */
  disconnect() {
    if (!active) return;
    const { socket, sessionId } = active;
    active = null;
    if (activeStreams.has(sessionId)) {
      // Stream in-flight: keep socket alive until done
      draining.set(sessionId, socket);
    } else {
      closeSocket(socket, sessionId);
    }
  },
 
  /**
   * Called by sendMessageStream when a stream starts.
   */
  notifyStreamStart(sessionId: string) {
    activeStreams.add(sessionId);
  },
 
  /**
   * Called by sendMessageStream when a stream finishes (done or error).
   * - If the session's socket is draining → close it now.
   * - If the session's socket is still active → keep alive for next message.
   */
  notifyStreamDone(sessionId: string) {
    activeStreams.delete(sessionId);
    const socket = draining.get(sessionId);
    if (!socket) return;
    draining.delete(sessionId);
    closeSocket(socket, sessionId);
  },
};
 
 