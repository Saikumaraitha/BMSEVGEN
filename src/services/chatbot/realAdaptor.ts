import { CHAT_ENDPOINTS } from './endpoints';
import { awsSigV4Api } from '../../services/http';
import { chatWebSocketManager } from './chatWebSocketManager';
import {
  AddChatToProjectRequest,
  AddChatToProjectResponse,
  ChatMessagesResponse,
  ChatApiAdapter,
  ContextReferencesRequest,
  ContextReferenceResponse,
  CreateChatRequest,
  CreateChatResponse,
  CreateProjectRequest,
  CreateProjectResponse,
  DeleteProjectRequest,
  DeleteProjectResponse,
  DeleteChatRequest,
  DeleteChatResponse,
  FrequentQueriesRequest,
  FrequentQueriesResponse,
  NavigationResponse,
  RecentChatsResponse,
  RenameChatRequest,
  RenameChatResponse,
  RenameProjectRequest,
  RenameProjectResponse,
  SaveChatRequest,
  SaveChatResponse,
  SendMessageRequest,
  SendMessageResponse,
  SendMessageStreamHandlers,
  StreamDonePayload,
  SubmitFeedbackRequest,
  SubmitFeedbackResponse,
  UnlinkChatFromProjectRequest,
  UnlinkChatFromProjectResponse,
} from './contracts';
 
const STATIC_CHAT_PROJECT_NAME = 'voc_assistant_fast';
 
const WS_CONNECT_RETRY_ATTEMPTS = 1;
const WS_CONNECT_RETRY_BACKOFF_MS = 1_200;
const WS_FIRST_EVENT_TIMEOUT_MS = 10_000;
const WS_PRESIGN_DEFAULT_EXPIRES_SECONDS = 300;
 

 
const safeJsonParse = (value: string): any | null => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};
 
const decodeJwtUserId = (token: string): string | null => {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }
 
  const base64Url = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64Url.padEnd(base64Url.length + ((4 - (base64Url.length % 4)) % 4), '=');
  const payload = safeJsonParse(atob(padded));
  if (!payload || typeof payload !== 'object') {
    return null;
  }
 
  return payload.userId || payload.sub || payload['cognito:username'] || null;
};
 
const getCookieValue = (cookieName: string): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }
 
  const encodedName = encodeURIComponent(cookieName);
  const cookieParts = document.cookie.split(';');
 
  for (const part of cookieParts) {
    const trimmed = part.trim();
    if (!trimmed || !trimmed.startsWith(`${encodedName}=`)) {
      continue;
    }
 
    const rawValue = trimmed.slice(encodedName.length + 1);
    try {
      return decodeURIComponent(rawValue).trim() || null;
    } catch {
      return rawValue.trim() || null;
    }
  }
 
  return null;
};
 
const getIdToken = (): string | null => {
  const source = `${import.meta.env.VITE_AWS_ID_TOKEN_SOURCE ?? 'cookie_then_env'}`
    .trim()
    .toLowerCase();
  const envValue = `${import.meta.env.VITE_AWS_ID_TOKEN ?? ''}`.trim() || null;
 
  if (source === 'none') {
    return null;
  }
 
  if (source === 'env') {
    return envValue;
  }
 
  const cookieName = `${import.meta.env.VITE_AWS_ID_TOKEN_COOKIE_NAME ?? 'id_token'}`.trim();
  const cookieValue = getCookieValue(cookieName);
 
  if (source === 'cookie') {
    return cookieValue;
  }
 
  return cookieValue || envValue;
};
 
const resolveWsBaseUrl = (): string | null => {
  const configuredWsUrl = `${import.meta.env.VITE_CHAT_WS_BASE_URL ?? ''}`.trim();
  if (!configuredWsUrl) {
    return null;
  }
 
  return configuredWsUrl.endsWith('/')
    ? configuredWsUrl.slice(0, -1)
    : configuredWsUrl;
};
 
const getWsPresignExpiresSeconds = (): number => {
  const configured = Number(import.meta.env.VITE_CHAT_WS_PRESIGN_EXPIRES_IN ?? WS_PRESIGN_DEFAULT_EXPIRES_SECONDS);
  if (!Number.isFinite(configured)) {
    return WS_PRESIGN_DEFAULT_EXPIRES_SECONDS;
  }
  return Math.max(1, Math.min(3600, Math.floor(configured)));
};
 
const mapFilters = (request: SendMessageRequest): Record<string, unknown> => {
  return {
    market: request.context.market,
    therapeutic_area: request.context.therapeuticArea,
    product: request.context.product,
    indication: request.context.indication,
    data_sources: request.context.source,
  };
};
 
const extractTextFromChunk = (chunk: unknown): string => {
  if (!chunk) {
    return '';
  }
 
  if (typeof chunk === 'string') {
    // Prefer JSON parse when possible (well-formed chunks), then recurse.
    const parsed = safeJsonParse(chunk);
    if (parsed && parsed !== chunk) {
      return extractTextFromChunk(parsed);
    }
 
    // Fallback for pseudo-JSON / repr-like payloads. This captures quoted
    // `text` values while allowing escaped quotes/newlines inside the value.
    const regex = /['\"]text['\"]\s*:\s*(['\"])((?:\\.|(?!\1)[\s\S])*)\1/g;
    const matches: string[] = [];
    let match = regex.exec(chunk);
    while (match) {
      const rawValue = match[2];
      const normalized = rawValue
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, '\\');
      matches.push(normalized);
      match = regex.exec(chunk);
    }
    return matches.join('');
  }
 
  if (typeof chunk === 'object') {
    const maybeObject = chunk as Record<string, unknown>;
    const content = maybeObject.content;
    if (Array.isArray(content)) {
      return content
        .map((part) => {
          if (typeof part === 'string') {
            return part;
          }
          if (part && typeof part === 'object') {
            const text = (part as Record<string, unknown>).text;
            return typeof text === 'string' ? text : '';
          }
          return '';
        })
        .join('');
    }
 
    if (typeof content === 'string') {
      return content;
    }
 
    const text = maybeObject.text;
    if (typeof text === 'string') {
      return text;
    }
  }
 
  return '';
};
 
const extractReferenceOptions = (
  payload: unknown,
  ...collectionKeys: string[]
): Array<{ id: string; name: string }> => {
  if (!payload || typeof payload !== 'object') {
    return [];
  }
 
  const source = payload as Record<string, unknown>;
  const candidates: unknown[] = [];
 
  // Legacy shape used in this codebase.
  candidates.push(source.items);
 
  // Newer/alternate shapes seen from reference endpoints.
  for (const key of collectionKeys) {
    candidates.push(source[key]);
  }
 
  // Common wrapped payloads: { data: {...} }, { payload: {...} }, { result: {...} }
  const wrappers: Array<Record<string, unknown> | null> = [
    source.data && typeof source.data === 'object' ? (source.data as Record<string, unknown>) : null,
    source.payload && typeof source.payload === 'object' ? (source.payload as Record<string, unknown>) : null,
    source.result && typeof source.result === 'object' ? (source.result as Record<string, unknown>) : null,
  ];
 
  for (const wrapper of wrappers) {
    if (!wrapper) continue;
    candidates.push(wrapper.items);
    for (const key of collectionKeys) {
      candidates.push(wrapper[key]);
    }
  }
 
  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) {
      continue;
    }
 
    const normalized = candidate
      .map((item) => {
        if (!item || typeof item !== 'object') {
          return null;
        }
        const obj = item as Record<string, unknown>;
        const name = typeof obj.name === 'string' ? obj.name.trim() : '';
        if (!name) {
          return null;
        }
        const idRaw = typeof obj.id === 'string' ? obj.id.trim() : '';
        return {
          id: idRaw || name,
          name,
        };
      })
      .filter((item): item is { id: string; name: string } => Boolean(item));
 
    return normalized;
  }
 
  return [];
};
 
const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
 
const isAuthTokenError = (error: unknown): boolean => {
  const message =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : '';
 
  const normalized = message.toLowerCase();
  return (
    normalized.includes('id_token') ||
    normalized.includes('jwt') ||
    normalized.includes('unauthorized') ||
    normalized.includes('not authenticated') ||
    normalized.includes('authentication failed')
  );
};
 
const connectManagedSocketWithRetry = async (
  sessionId: string,
  wsBaseUrl: string,
  idToken: string,
  userId: string
): Promise<WebSocket> => {
  let lastError: unknown = null;
 
  for (let attempt = 0; attempt <= WS_CONNECT_RETRY_ATTEMPTS; attempt += 1) {
    let wsUrl = '';
    try {
      wsUrl = await awsSigV4Api.presignWebSocketUrl(wsBaseUrl, {
        expiresInSeconds: getWsPresignExpiresSeconds(),
        query: {
          user_id: userId,
          token: idToken,
        },
      });
      return await chatWebSocketManager.connect(sessionId, wsUrl);
    } catch (error) {
      lastError = error;
      if (attempt < WS_CONNECT_RETRY_ATTEMPTS) {
        awsSigV4Api.forceRefreshCredentials();
        await wait(WS_CONNECT_RETRY_BACKOFF_MS * (attempt + 1));
      }
    }
  }
 
  throw lastError instanceof Error
    ? lastError
    : new Error('WebSocket connection timeout');
};
 
export const realChatApiAdapter: ChatApiAdapter = {
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    return awsSigV4Api.post<SendMessageResponse>(CHAT_ENDPOINTS.sendMessage, request);
  },
 
  async sendMessageStream(
    request: SendMessageRequest,
    handlers: SendMessageStreamHandlers
  ): Promise<SendMessageResponse> {
    const wsBaseUrl = resolveWsBaseUrl();
    const idToken = getIdToken();
    const userId = idToken ? decodeJwtUserId(idToken) : null;
 
    let socket: WebSocket | null = null;
    let isManagedSocket = false;
    let wsActive = false;
    let emittedContent = '';
    let deltaIndex = 0;
    let hasReceivedWsEvent = false;
    let donePayload: StreamDonePayload | null = null;
 
    const getNextIndex = () => {
      const next = deltaIndex;
      deltaIndex += 1;
      return next;
    };
 
    const closeSocketSafely = () => {
      if (isManagedSocket) {
        // Notify the manager the stream is done. If this socket was moved to
        // draining (user switched sessions), it will be cleanly closed now.
        // If it's still the active socket, the manager keeps it alive.
        chatWebSocketManager.notifyStreamDone(request.sessionId);
      }
    };
 
    const wireSocketEvents = (): Promise<StreamDonePayload> => {
      if (!socket) {
        return Promise.reject(new Error('WebSocket is not initialized'));
      }
 
      return new Promise<StreamDonePayload>((resolve, reject) => {
        const onMessage = (event: MessageEvent<string>) => {
          const frame = safeJsonParse(event.data);
          if (!frame || typeof frame !== 'object') {
            return;
          }
 
          const frameObject = frame as Record<string, unknown>;
          const eventType =
            (typeof frameObject.event_type === 'string' ? frameObject.event_type : null) ||
            (typeof frameObject['event type'] === 'string' ? (frameObject['event type'] as string) : null) ||
            (typeof frameObject.event === 'string' ? frameObject.event : null);
 
          if (!eventType || typeof eventType !== 'string') {
            return;
          }
 
          hasReceivedWsEvent = true;
          const nestedPayload =
            (frameObject.payload ?? frameObject.data ?? {}) as Record<string, unknown>;
          // New event contract emits fields at the frame root (alongside
          // `event_type`); older shapes nested them under `payload`/`data`.
          // Read from the nested payload first, then fall back to the frame
          // root so both shapes work transparently.
          const readField = (key: string): unknown => {
            const fromNested = nestedPayload[key];
            if (fromNested !== undefined) return fromNested;
            return frameObject[key];
          };
 
          const getStringField = (...keys: string[]): string | undefined => {
            for (const key of keys) {
              const value = readField(key);
              if (typeof value === 'string' && value.length > 0) {
                return value;
              }
            }
            return undefined;
          };
 
          const getStateField = (): 'start' | 'end' | undefined => {
            const raw = getStringField('state');
            return raw === 'start' || raw === 'end' ? raw : undefined;
          };
 
          if (eventType === 'keepalive') {
            return;
          }

          if (eventType === 'message_reset') {
            emittedContent = '';
            deltaIndex = 0;
            handlers.onMessageReset?.();
            return;
          }

          if (eventType === 'message_delta') {
            const rawDelta = readField('delta') ?? readField('text');
            const delta = typeof rawDelta === 'string' ? rawDelta : '';
            if (delta) {
              handlers.onDelta(delta, getNextIndex());
              emittedContent += delta;
            }
            return;
          }
 
          if (eventType === 'thinking') {
            const state = getStateField();
            if (state) {
              handlers.onIntermediateEvent?.({ type: 'thinking', state });
            }
            return;
          }
 
          if (eventType === 'status') {
            const activityId = getStringField('activity_id', 'activityId', 'id');
            const state = getStateField();
            if (!activityId || !state) {
              return;
            }
            const kindRaw = getStringField('kind');
            const kind = kindRaw === 'tool' || kindRaw === 'subagent' ? kindRaw : undefined;
            handlers.onIntermediateEvent?.({
              type: 'status',
              activityId,
              state,
              text: getStringField('text', 'label'),
              toolName: getStringField('tool_name', 'toolName', 'name'),
              kind,
            });
            return;
          }
 
          if (eventType === 'stage') {
            const stageId = getStringField('stage_id', 'stageId', 'id');
            const state = getStateField();
            if (!stageId || !state) {
              return;
            }
            handlers.onIntermediateEvent?.({
              type: 'stage',
              stageId,
              state,
              text: getStringField('text', 'label', 'name'),
            });
            return;
          }
 
          if (eventType === 'on_chat_model_stream') {
            // Ignored: chunk-level model stream text is replaced by the
            // canonical `done` payload for UI rendering.
            return;
          }
 
          if (eventType === 'tool_call_start') {
            const toolCallId = getStringField('tool_call_id', 'toolCallId', 'id');
            const toolName = getStringField('tool_name', 'toolName', 'name');
            if (!toolCallId || !toolName) {
              return;
            }
            const args = readField('args');
            const argsObject =
              args && typeof args === 'object' && !Array.isArray(args)
                ? (args as Record<string, unknown>)
                : undefined;
            handlers.onToolCallStart?.({
              tool_call_id: toolCallId,
              tool_name: toolName,
              args: argsObject,
            });
            handlers.onIntermediateEvent?.({
              type: 'tool_call_start',
              toolCallId,
              toolName,
              args: argsObject,
            });
            return;
          }
 
          if (eventType === 'tool_call_end') {
            const toolCallId = getStringField('tool_call_id', 'toolCallId', 'id');
            if (!toolCallId) {
              return;
            }
            const toolName = getStringField('tool_name', 'toolName', 'name');
            const outputRaw = readField('output');
            const output = typeof outputRaw === 'string' ? outputRaw : undefined;
            handlers.onToolCallEnd?.({
              tool_call_id: toolCallId,
              tool_name: toolName ?? '',
              output,
            });
            handlers.onIntermediateEvent?.({
              type: 'tool_call_end',
              toolCallId,
              toolName,
              output,
            });
            return;
          }
 
          if (eventType === 'subagent_start') {
            const subagentName = getStringField('subagent_name', 'subagentName', 'name', 'id');
            if (!subagentName) {
              return;
            }
            handlers.onIntermediateEvent?.({ type: 'subagent_start', subagentName });
            return;
          }
 
          if (eventType === 'subagent_end') {
            const subagentName = getStringField('subagent_name', 'subagentName', 'name', 'id');
            if (!subagentName) {
              return;
            }
            handlers.onIntermediateEvent?.({ type: 'subagent_end', subagentName });
            return;
          }
 
          if (eventType === 'interrupt') {
            handlers.onIntermediateEvent?.({ type: 'interrupt' });
            return;
          }
 
          if (eventType === 'error') {
            cleanup();
            const message = getStringField('message') ?? 'Streaming error';
            handlers.onIntermediateEvent?.({ type: 'error', message });
            reject(new Error(message));
            return;
          }
 
          if (eventType === 'done') {
            cleanup();
            const messageId = getStringField('message_id', 'messageId');
            const suggestionsRaw = readField('suggestions') ?? readField('follow_up_queries');
            const normalizeSuggestionList = (items: unknown[]): string[] =>
              items.filter((item): item is string => typeof item === 'string' && item.length > 0);
 
            let suggestions: string[] | undefined;
            if (Array.isArray(suggestionsRaw)) {
              suggestions = normalizeSuggestionList(suggestionsRaw);
            } else if (suggestionsRaw && typeof suggestionsRaw === 'object') {
              const nested = (suggestionsRaw as Record<string, unknown>).suggestions;
              if (Array.isArray(nested)) {
                suggestions = normalizeSuggestionList(nested);
              }
            }
            const responseRaw = readField('response');
            const responseText = emittedContent || (typeof responseRaw === 'string' ? responseRaw : '');
            donePayload = {
              response: responseText,
              follow_up_queries: suggestions,
              message_id: messageId,
            };
            resolve(donePayload);
            return;
          }
 
          if (eventType === 'on_chat_model_end') {
            const finalText = extractTextFromChunk(readField('output'));
            if (finalText) {
              emittedContent = finalText;
            }
          }
        };
 
        const onClose = () => {
          cleanup();
          reject(new Error('WebSocket disconnected before completion'));
        };
 
        const onError = () => {
          cleanup();
          reject(new Error('WebSocket error during message streaming'));
        };
 
        const cleanup = () => {
          socket?.removeEventListener('message', onMessage as EventListener);
          socket?.removeEventListener('close', onClose);
          socket?.removeEventListener('error', onError);
        };
 
        const ws = socket;
        if (!ws) {
          reject(new Error('WebSocket is not initialized'));
          return;
        }
 
        ws.addEventListener('message', onMessage as EventListener);
        ws.addEventListener('close', onClose);
        ws.addEventListener('error', onError);
      });
    };
 
    try {
      if (!wsBaseUrl || !userId || !idToken) {
        throw new Error('WebSocket streaming is unavailable. Configure VITE_CHAT_WS_BASE_URL and ensure id_token includes userId for signed WebSocket streaming.');
      }
 
      socket = await connectManagedSocketWithRetry(request.sessionId, wsBaseUrl, idToken, userId);
      isManagedSocket = true;
      wsActive = true;
 
      // Inform the manager a stream is starting so disconnect() knows to drain
      // instead of closing immediately if the user switches sessions mid-stream.
      if (isManagedSocket) {
        chatWebSocketManager.notifyStreamStart(request.sessionId);
      }
 
      const messageResponse = await awsSigV4Api.raw('POST', CHAT_ENDPOINTS.sendSessionMessage(request.sessionId), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: request.message,
          response_style: request.responseStyle,
          filters: mapFilters(request),
        }),
      });
 
      if (!messageResponse.ok) {
        throw new Error(`Message request failed with status ${messageResponse.status}`);
      }
 
      const messageBody = await messageResponse.json();
      if (messageBody?.status !== 'running' && messageBody?.response) {
        donePayload = {
          response: `${messageBody.response}`,
          follow_up_queries: Array.isArray(messageBody.follow_up_queries)
            ? messageBody.follow_up_queries
            : undefined,
          message_id: typeof messageBody.message_id === 'string' ? messageBody.message_id : undefined,
        };
        handlers.onDone?.(donePayload);
        return {
          response: donePayload.response,
          follow_up_queries: donePayload.follow_up_queries,
          message_id: donePayload.message_id,
        };
      }
 
      if (!wsActive) {
        throw new Error('WebSocket streaming is unavailable. Configure VITE_CHAT_WS_BASE_URL and ensure id_token includes userId for signed WebSocket streaming.');
      }
 
      const streamPromise = wireSocketEvents();
      const watchdogPromise = new Promise<StreamDonePayload>((_resolve, reject) => {
        window.setTimeout(() => {
          if (hasReceivedWsEvent) {
            return;
          }
 
          reject(new Error('WebSocket connected but no events were received in time.'));
        }, WS_FIRST_EVENT_TIMEOUT_MS);
      });
 
      donePayload = await Promise.race([streamPromise, watchdogPromise]);
 
      handlers.onDone?.(donePayload);
 
      return {
        response: donePayload.response || '',
        follow_up_queries: donePayload.follow_up_queries,
        message_id: donePayload.message_id,
      };
    } finally {
      closeSocketSafely();
    }
  },
 
  async getContextReferences(request?: ContextReferencesRequest): Promise<ContextReferenceResponse> {
    const countryQuery = {
      country_name: request?.country_name,
    };
 
    const therapeuticAreaQuery = {
      country_name: request?.country_name,
    };
 
    const productQuery = {
      country_name: request?.country_name,
      therapeutic_area_name: request?.therapeutic_area_name,
    };
 
    const indicationQuery = {
      country_name: request?.country_name,
      therapeutic_area_name: request?.therapeutic_area_name,
      product_name: request?.product_name,
    };
 
    const [countries, therapeuticAreas, products, indications, dataSources] = await Promise.allSettled([
      awsSigV4Api.get<any>(CHAT_ENDPOINTS.countries, {
        query: countryQuery,
      }),
      awsSigV4Api.get<any>(CHAT_ENDPOINTS.therapeuticAreas, {
        query: therapeuticAreaQuery,
      }),
      awsSigV4Api.get<any>(CHAT_ENDPOINTS.products, {
        query: productQuery,
      }),
      awsSigV4Api.get<any>(CHAT_ENDPOINTS.indications, {
        query: indicationQuery,
      }),
      awsSigV4Api.get<any>(CHAT_ENDPOINTS.dataSources),
    ]);
 
    const firstAuthFailure = [countries, therapeuticAreas, products, indications, dataSources].find(
      (result): result is PromiseRejectedResult =>
        result.status === 'rejected' && isAuthTokenError(result.reason)
    );
 
    if (firstAuthFailure) {
      throw firstAuthFailure.reason;
    }
 
    const unwrapSettled = (result: PromiseSettledResult<any>): any =>
      result.status === 'fulfilled' ? result.value : {};
 
    return {
      countries: extractReferenceOptions(
        unwrapSettled(countries),
        'countries',
        'data',
        'results'
      ),
      therapeutic_areas: extractReferenceOptions(
        unwrapSettled(therapeuticAreas),
        'therapeutic_areas',
        'therapeuticAreas',
        'data',
        'results'
      ),
      products: extractReferenceOptions(
        unwrapSettled(products),
        'products',
        'data',
        'results'
      ),
      indications: extractReferenceOptions(
        unwrapSettled(indications),
        'indications',
        'data',
        'results'
      ),
      data_sources: extractReferenceOptions(
        unwrapSettled(dataSources),
        'data_sources',
        'dataSources',
        'sources',
        'data',
        'results'
      ),
    };
  },
 
  async getTherapeuticAreaOptions(country_name?: string): Promise<string[]> {
    try {
      const result = await awsSigV4Api.get<any>(CHAT_ENDPOINTS.therapeuticAreas, {
        query: { country_name },
      });
      return extractReferenceOptions(result, 'therapeutic_areas', 'therapeuticAreas', 'data', 'results').map((i) => i.name).filter(Boolean);
    } catch (error) {
      if (isAuthTokenError(error)) {
        throw error;
      }
      return [];
    }
  },
 
  async getProductOptions(country_name?: string, therapeutic_area_name?: string): Promise<string[]> {
    try {
      const result = await awsSigV4Api.get<any>(CHAT_ENDPOINTS.products, {
        query: { country_name, therapeutic_area_name },
      });
      return extractReferenceOptions(result, 'products', 'data', 'results').map((i) => i.name).filter(Boolean);
    } catch (error) {
      if (isAuthTokenError(error)) {
        throw error;
      }
      return [];
    }
  },
 
  async getIndicationOptions(country_name?: string, therapeutic_area_name?: string, product_name?: string): Promise<string[]> {
    try {
      const result = await awsSigV4Api.get<any>(CHAT_ENDPOINTS.indications, {
        query: { country_name, therapeutic_area_name, product_name },
      });
      return extractReferenceOptions(result, 'indications', 'data', 'results').map((i) => i.name).filter(Boolean);
    } catch (error) {
      if (isAuthTokenError(error)) {
        throw error;
      }
      return [];
    }
  },
 
  async getDataSources(): Promise<string[]> {
    try {
      const result = await awsSigV4Api.get<any>(CHAT_ENDPOINTS.dataSources);
      return extractReferenceOptions(result, 'data_sources', 'dataSources', 'sources', 'data', 'results').map((s) => s.name).filter(Boolean);
    } catch {
      return [];
    }
  },
 
  async getLastRunAt(): Promise<string | null> {
    try {
      const result = await awsSigV4Api.get<any>(CHAT_ENDPOINTS.lastRunAt);
      // Accept common response shapes: { last_run_at }, { latest_run_at }, { date }, top-level string
      const raw: unknown =
        result?.last_updated ?? result?.last_run_at ?? result?.latest_run_at ?? result?.run_at ?? result?.date ?? result?.timestamp ?? null;
      if (!raw) return null;
      // If already a formatted string (e.g. "May 26, 2026, 1:05 PM"), return as-is.
      const date = new Date(raw as string);
      if (isNaN(date.getTime())) return String(raw);
      return date.toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true,
      });
    } catch {
      return null;
    }
  },
 
  async getFrequentQueries(request?: FrequentQueriesRequest): Promise<FrequentQueriesResponse> {
    return awsSigV4Api.get<FrequentQueriesResponse>(CHAT_ENDPOINTS.frequentQueries, {
      query: request as Record<string, string | number | boolean | null | undefined> | undefined,
    });
  },
 
  async getNavigationData(): Promise<NavigationResponse> {
    return awsSigV4Api.get<NavigationResponse>(CHAT_ENDPOINTS.navigation);
  },
 
  async createChat(request: CreateChatRequest): Promise<CreateChatResponse> {
    return awsSigV4Api.post<CreateChatResponse>(CHAT_ENDPOINTS.createChat, {
      project_name: request.project_name ?? STATIC_CHAT_PROJECT_NAME,
      project_id: request.project_id ?? null,
      response_style: request.response_style ?? 'concise',
      iep_id: request.iep_id,
      metadata: {
        source: 'evgen-chat-ui',
        ...request.metadata,
      },
    });
  },
 
  async getChatMessages(chatId: string, page = 1, pageSize = 50): Promise<ChatMessagesResponse> {
    const base = `${import.meta.env.VITE_AI_ENGINE_BASE_URL ?? ''}`.trim().replace(/\/$/, '');
    return awsSigV4Api.get<ChatMessagesResponse>(`${base}/api/v1/chats/${chatId}/messages`, {
      query: {
        page,
        page_size: pageSize,
      },
    });
  },
 
  async submitFeedback(request: SubmitFeedbackRequest): Promise<SubmitFeedbackResponse> {
    return awsSigV4Api.post<SubmitFeedbackResponse>(
      CHAT_ENDPOINTS.submitFeedback(request.chatId, request.messageId),
      {
        rating: request.rating,
        improve_reasons: request.improve_reasons,
        comments: request.comments,
      }
    );
  },
 
  async saveChat(request: SaveChatRequest): Promise<SaveChatResponse> {
    return awsSigV4Api.post<SaveChatResponse>(CHAT_ENDPOINTS.saveChat(request.chatId), {
      action: request.action,
      project_id: request.project_id,
      new_project_name: request.new_project_name,
    });
  },
 
  async createProject(request: CreateProjectRequest): Promise<CreateProjectResponse> {
    const response = await awsSigV4Api.post<any>(CHAT_ENDPOINTS.createProject, {
      name: request.name,
      iep_id: request.iep_id,
    });
    return {
      projectId: response.projectId || response.project_id || response.id,
      name: response.name || response.project,
    };
  },
 
  async addChatToProject(request: AddChatToProjectRequest): Promise<AddChatToProjectResponse> {
    return awsSigV4Api.post<AddChatToProjectResponse>(CHAT_ENDPOINTS.addChatToProject(request.projectId), {
      chatId: request.chatId,
    });
  },
 
  async unlinkChatFromProject(request: UnlinkChatFromProjectRequest): Promise<UnlinkChatFromProjectResponse> {
    return awsSigV4Api.delete<UnlinkChatFromProjectResponse>(
      CHAT_ENDPOINTS.unlinkChatFromProject(request.projectId, request.chatId)
    );
  },
 
  async deleteProject(request: DeleteProjectRequest): Promise<DeleteProjectResponse> {
    return awsSigV4Api.delete<DeleteProjectResponse>(CHAT_ENDPOINTS.deleteProject(request.projectId), {
      body: {
        retain_chats: request.retain_chats,
      },
    });
  },
 
  async deleteChat(request: DeleteChatRequest): Promise<DeleteChatResponse> {
    return awsSigV4Api.delete<DeleteChatResponse>(CHAT_ENDPOINTS.deleteChat(request.chatId));
  },
 
  async renameChat(request: RenameChatRequest): Promise<RenameChatResponse> {
    return awsSigV4Api.put<RenameChatResponse>(CHAT_ENDPOINTS.renameChat, {
      chatSessionId: request.chatId,
      chatNewName: request.title,
    });
  },
 
  async renameProject(request: RenameProjectRequest): Promise<RenameProjectResponse> {
    return awsSigV4Api.put<RenameProjectResponse>(CHAT_ENDPOINTS.renameProject, {
      projectId: request.projectId,
      projectNewName: request.name,
    });
  },
 
  async getRecentChats(): Promise<RecentChatsResponse> {
    const navigation = await awsSigV4Api.get<NavigationResponse>(CHAT_ENDPOINTS.recentChats);
    return {
      recentSessionIds: navigation.recents.map((recent) => recent.chat_id),
    };
  },
};
 
/**
 * Open a persistent WebSocket connection for the given chat session.
 * Closes any previous session's connection first.
 * Should be called whenever the active chat session changes.
 */
export const connectChatWebSocket = async (sessionId: string): Promise<void> => {
  const wsBaseUrl = resolveWsBaseUrl();
  const idToken = getIdToken();
  const userId = idToken ? decodeJwtUserId(idToken) : null;
 
  if (!wsBaseUrl || !userId || !idToken) {
    return;
  }
 
  try {
    await connectManagedSocketWithRetry(sessionId, wsBaseUrl, idToken, userId);
  } catch (error) {
    console.warn('[ChatWS] Failed to establish persistent WebSocket for session:', sessionId, error);
  }
};
 
/**
 * Close the currently active persistent WebSocket connection.
 * Should be called when the chat widget unmounts or the session is cleared.
 */
export const disconnectChatWebSocket = (): void => {
  chatWebSocketManager.disconnect();
};