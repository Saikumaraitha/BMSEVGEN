type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
 
type QueryValue = string | number | boolean | null | undefined;
 
interface RequestOptions {
  query?: Record<string, QueryValue>;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}
 
interface WebSocketPresignOptions {
  expiresInSeconds?: number;
  query?: Record<string, QueryValue>;
}
 
interface TemporaryCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  expiration?: string;
}
 
const AWS_ALGORITHM = 'AWS4-HMAC-SHA256';
 
const hex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};
 
const toUtf8 = (value: string): ArrayBuffer => {
  const encoded = new TextEncoder().encode(value);
  return encoded.buffer.slice(
    encoded.byteOffset,
    encoded.byteOffset + encoded.byteLength
  ) as ArrayBuffer;
};
 
const sha256Hex = async (value: string): Promise<string> => {
  const hash = await crypto.subtle.digest('SHA-256', toUtf8(value));
  return hex(hash);
};
 
const hmac = async (key: ArrayBuffer, message: string): Promise<ArrayBuffer> => {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
 
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, toUtf8(message));
  return signature;
};
 
const formatAmzDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
  const day = `${date.getUTCDate()}`.padStart(2, '0');
  const hour = `${date.getUTCHours()}`.padStart(2, '0');
  const minute = `${date.getUTCMinutes()}`.padStart(2, '0');
  const second = `${date.getUTCSeconds()}`.padStart(2, '0');
  return `${year}${month}${day}T${hour}${minute}${second}Z`;
};
 
const dateStampFromAmzDate = (amzDate: string): string => amzDate.slice(0, 8);
 
const encodeRfc3986 = (value: string): string => {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
};
 
const canonicalQueryString = (url: URL): string => {
  const entries: Array<[string, string]> = [];
  url.searchParams.forEach((value, key) => {
    entries.push([encodeRfc3986(key), encodeRfc3986(value)]);
  });
 
  entries.sort(([aKey, aValue], [bKey, bValue]) => {
    if (aKey === bKey) {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    }
    if (aKey < bKey) return -1;
    return 1;
  });
 
  return entries
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};
 
const normalizeHeaderValue = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ');
};
 
const extractCredentials = (payload: any): TemporaryCredentials => {
  const source = payload?.credentials || payload?.Credentials || payload?.data || payload;
 
  const accessKeyId =
    source?.accessKeyId || source?.AccessKeyId || source?.access_key_id;
  const secretAccessKey =
    source?.secretAccessKey || source?.SecretAccessKey || source?.secret_access_key;
  const sessionToken =
    source?.sessionToken || source?.SessionToken || source?.token || source?.Token;
  const expiration = source?.expiration || source?.Expiration || source?.expiresAt || source?.expires_at;
 
  if (!accessKeyId || !secretAccessKey) {
    throw new Error('TCWS credentials response missing access key or secret key');
  }
 
  return {
    accessKeyId,
    secretAccessKey,
    sessionToken,
    expiration,
  };
};
 
class AwsSigV4ApiClient {
  private credentialCache: TemporaryCredentials | null = null;
  private credentialExpirationMs = 0;
  private inflightCredentialRequest: Promise<TemporaryCredentials> | null = null;
  private forceTcwsRefreshOnce = false;
  private logoutRedirectInProgress = false;
 
  private invalidateCachedCredentials(): void {
    this.credentialCache = null;
    this.credentialExpirationMs = 0;
  }
 
  private requestForcedTcwsRefreshOnce(): void {
    this.forceTcwsRefreshOnce = true;
  }
 
  private createSessionTimeoutOverlay(messageText: string): HTMLElement | null {
    if (typeof document === 'undefined') {
      return null;
    }
 
    const existing = document.getElementById('session-timeout-overlay');
    if (existing?.parentElement) {
      existing.parentElement.removeChild(existing);
    }
 
    const overlay = document.createElement('div');
    overlay.id = 'session-timeout-overlay';
    overlay.setAttribute('role', 'status');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '999999',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255, 255, 255, 0.35)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
    });
 
    const message = document.createElement('div');
    message.textContent = messageText;
    Object.assign(message.style, {
      color: '#BE2BBB',
      fontSize: '24px',
      fontWeight: '700',
      textAlign: 'center',
      lineHeight: '1.3',
      fontFamily: 'BMS Humanity, sans-serif',
      background: 'transparent',
      textShadow: '0 1px 1px rgba(255,255,255,0.5)',
      padding: '0 24px',
    });
 
    overlay.appendChild(message);
    document.body.appendChild(overlay);
    return overlay;
  }
 
  private redirectToLogout(): void {
    if (typeof window === 'undefined' || this.logoutRedirectInProgress) {
      return;
    }
 
    this.logoutRedirectInProgress = true;
 
    // Brief user-facing notice before redirecting to login.
    try {
      this.createSessionTimeoutOverlay('Session expired. Redirecting to sign in...');
    } catch {
      // Best-effort banner only.
    }
 
    window.setTimeout(() => {
      window.location.href =
        'https://' +
        window.location.hostname +
        '/logout?domain=' +
        window.location.hostname;
    }, 1000);
  }
 
  private get credentialsSource(): 'auto' | 'env' | 'tcws' {
    const source = `${import.meta.env.VITE_AWS_CREDENTIALS_SOURCE ?? 'tcws'}`
      .trim()
      .toLowerCase();
 
    if (source === 'auto' || source === 'env' || source === 'tcws') {
      return source;
    }
 
    return 'tcws';
  }
 
  private getStaticCredentialsFromEnv(): TemporaryCredentials | null {
    const accessKeyId = (import.meta.env.VITE_AWS_ACCESS_KEY_ID ?? '').trim();
    const secretAccessKey = (import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ?? '').trim();
    const sessionToken = (import.meta.env.VITE_AWS_SESSION_TOKEN ?? '').trim();
    const expiration = (import.meta.env.VITE_AWS_CREDENTIALS_EXPIRATION ?? '').trim();
 
    if (!accessKeyId || !secretAccessKey) {
      return null;
    }
 
    return {
      accessKeyId,
      secretAccessKey,
      sessionToken: sessionToken || undefined,
      expiration: expiration || undefined,
    };
  }
 
  private get apiBaseUrl(): string {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim();
    if (!baseUrl) {
      throw new Error('VITE_API_BASE_URL is required for SigV4 requests');
    }
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }
 
  private get region(): string {
    const region = (import.meta.env.VITE_AWS_REGION ?? '').trim();
    if (!region) {
      throw new Error('VITE_AWS_REGION is required for SigV4 signing');
    }
    return region;
  }
 
  private get service(): string {
    return (import.meta.env.VITE_AWS_SERVICE ?? 'execute-api').trim();
  }
 
  private get apiIncludeCredentials(): boolean {
    return `${import.meta.env.VITE_AWS_API_INCLUDE_CREDENTIALS ?? 'false'}`.toLowerCase() === 'true';
  }
 
  private get idTokenHeaderName(): string {
    return (import.meta.env.VITE_AWS_ID_TOKEN_HEADER_NAME ?? 'id_token').trim().toLowerCase();
  }
 
  private get idTokenCookieName(): string {
    return (import.meta.env.VITE_AWS_ID_TOKEN_COOKIE_NAME ?? 'id_token').trim();
  }
 
  private get idTokenSource(): 'cookie_then_env' | 'cookie' | 'env' | 'none' {
    const source = `${import.meta.env.VITE_AWS_ID_TOKEN_SOURCE ?? 'cookie_then_env'}`
      .trim()
      .toLowerCase();
 
    if (source === 'cookie' || source === 'env' || source === 'none') {
      return source;
    }
 
    return 'cookie_then_env';
  }
 
  private getCookieValue(cookieName: string): string | null {
    if (typeof document === 'undefined') {
      return null;
    }
 
    const encodedName = encodeURIComponent(cookieName);
    const cookieParts = document.cookie.split(';');
 
    for (const part of cookieParts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (!trimmed.startsWith(`${encodedName}=`)) continue;
 
      const rawValue = trimmed.slice(encodedName.length + 1);
      try {
        return decodeURIComponent(rawValue).trim() || null;
      } catch {
        return rawValue.trim() || null;
      }
    }
 
    return null;
  }
 
  private getIdTokenValue(): string | null {
    const envValue = (import.meta.env.VITE_AWS_ID_TOKEN ?? '').trim() || null;
    if (this.idTokenSource === 'none') {
      return null;
    }
 
    if (this.idTokenSource === 'env') {
      return envValue;
    }
 
    const cookieValue = this.getCookieValue(this.idTokenCookieName);
    if (cookieValue || this.idTokenSource === 'cookie') {
      return cookieValue;
    }
 
    return envValue;
  }
 
  private buildUrl(path: string, query?: Record<string, QueryValue>): URL {
    const absolute = /^https?:\/\//i.test(path)
      ? path
      : `${this.apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
 
    const url = new URL(absolute);
 
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        url.searchParams.set(key, String(value));
      });
    }
 
    return url;
  }
 
  private isCredentialsFresh(): boolean {
    if (!this.credentialCache) return false;
    if (!this.credentialExpirationMs) return true;
    return Date.now() + 60_000 < this.credentialExpirationMs;
  }
 
  private async getTemporaryCredentials(): Promise<TemporaryCredentials> {
    if (this.isCredentialsFresh() && this.credentialCache) {
      return this.credentialCache;
    }
 
    const shouldTryStaticCredentials =
      this.credentialsSource !== 'tcws' && !this.forceTcwsRefreshOnce;
 
    const staticCredentials = shouldTryStaticCredentials
      ? this.getStaticCredentialsFromEnv()
      : null;
 
    if (staticCredentials) {
      this.credentialCache = staticCredentials;
      this.credentialExpirationMs = staticCredentials.expiration
        ? new Date(staticCredentials.expiration).getTime()
        : 0;
      return staticCredentials;
    }
 
    if (this.credentialsSource === 'env' && !this.forceTcwsRefreshOnce) {
      throw new Error(
        'VITE_AWS_CREDENTIALS_SOURCE=env but static credentials are missing from env'
      );
    }
 
    if (this.inflightCredentialRequest) {
      return this.inflightCredentialRequest;
    }
 
    const tcwsUrl = (import.meta.env.VITE_AWS_TCWS_CREDENTIALS_URL ?? '').trim();
    if (!tcwsUrl) {
      throw new Error('VITE_AWS_TCWS_CREDENTIALS_URL is required for temp IAM credentials');
    }
 
    const method = ((import.meta.env.VITE_AWS_TCWS_METHOD ?? 'GET').trim().toUpperCase() as 'GET' | 'POST');
    const includeCredentials = `${import.meta.env.VITE_AWS_TCWS_INCLUDE_CREDENTIALS ?? 'true'}`.toLowerCase() !== 'false';
 
    this.inflightCredentialRequest = (async () => {
      const response = await fetch(tcwsUrl, {
        method,
        credentials: includeCredentials ? 'include' : 'same-origin',
        headers: {
          Accept: 'application/json',
        },
      });
 
      if (!response.ok) {
        let errorPayload: any = null;
        try {
          errorPayload = await response.json();
        } catch {
          errorPayload = null;
        }
 
        const errorType = `${
          errorPayload?.ErrorType ||
          errorPayload?.errorType ||
          errorPayload?.error?.type ||
          errorPayload?.error?.code ||
          ''
        }`;
 
        // TCWS returns 401 + UnauthorizedCookie/invalid cookie when the
        // browser session has expired. Force logout so user can sign in again.
        if (response.status === 401 && /UnauthorizedCookie/i.test(errorType)) {
          this.redirectToLogout();
          throw new Error('Unauthorized cookie. Redirecting to logout.');
        }
 
        throw new Error(`Unable to get temporary credentials from TCWS (${response.status})`);
      }
 
      const payload = await response.json();
      const credentials = extractCredentials(payload);
 
      this.credentialCache = credentials;
      this.credentialExpirationMs = credentials.expiration ? new Date(credentials.expiration).getTime() : 0;
      this.forceTcwsRefreshOnce = false;
 
      return credentials;
    })();
 
    try {
      return await this.inflightCredentialRequest;
    } finally {
      this.inflightCredentialRequest = null;
    }
  }
 
  private async signRequest(
    method: HttpMethod,
    url: URL,
    headers: Record<string, string>,
    payload: string
  ): Promise<Record<string, string>> {
    const credentials = await this.getTemporaryCredentials();
    const now = new Date();
    const amzDate = formatAmzDate(now);
    const dateStamp = dateStampFromAmzDate(amzDate);
    const payloadHash = await sha256Hex(payload);
 
    const signingHeaders: Record<string, string> = {
      ...headers,
      host: url.host,
      'x-amz-date': amzDate,
      'x-amz-content-sha256': payloadHash,
    };
 
    if (credentials.sessionToken) {
      signingHeaders['x-amz-security-token'] = credentials.sessionToken;
    }
 
    const canonicalHeaderEntries = Object.entries(signingHeaders)
      .map(([key, value]) => [key.toLowerCase(), normalizeHeaderValue(value)] as const)
      .sort(([a], [b]) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
 
    const canonicalHeaders = canonicalHeaderEntries
      .map(([key, value]) => `${key}:${value}\n`)
      .join('');
 
    const signedHeaders = canonicalHeaderEntries.map(([key]) => key).join(';');
    const canonicalRequest = [
      method,
      url.pathname || '/',
      canonicalQueryString(url),
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join('\n');
 
    const credentialScope = `${dateStamp}/${this.region}/${this.service}/aws4_request`;
    const canonicalRequestHash = await sha256Hex(canonicalRequest);
    const stringToSign = [AWS_ALGORITHM, amzDate, credentialScope, canonicalRequestHash].join('\n');
 
    const kDate = await hmac(toUtf8(`AWS4${credentials.secretAccessKey}`), dateStamp);
    const kRegion = await hmac(kDate, this.region);
    const kService = await hmac(kRegion, this.service);
    const kSigning = await hmac(kService, 'aws4_request');
    const signature = hex(await crypto.subtle.sign('HMAC', await crypto.subtle.importKey('raw', kSigning, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']), toUtf8(stringToSign)));
 
    signingHeaders.Authorization = `${AWS_ALGORITHM} Credential=${credentials.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
 
    return signingHeaders;
  }
 
  private async presignUrl(method: HttpMethod, url: URL, expiresInSeconds: number): Promise<URL> {
    const credentials = await this.getTemporaryCredentials();
    const now = new Date();
    const amzDate = formatAmzDate(now);
    const dateStamp = dateStampFromAmzDate(amzDate);
    const credentialScope = `${dateStamp}/${this.region}/${this.service}/aws4_request`;
    const payloadHash = await sha256Hex('');
 
    const presignedUrl = new URL(url.toString());
    presignedUrl.searchParams.set('X-Amz-Algorithm', AWS_ALGORITHM);
    presignedUrl.searchParams.set('X-Amz-Credential', `${credentials.accessKeyId}/${credentialScope}`);
    presignedUrl.searchParams.set('X-Amz-Date', amzDate);
    presignedUrl.searchParams.set('X-Amz-Expires', String(Math.max(1, Math.min(3600, Math.floor(expiresInSeconds)))));
    presignedUrl.searchParams.set('X-Amz-SignedHeaders', 'host');
 
    if (credentials.sessionToken) {
      presignedUrl.searchParams.set('X-Amz-Security-Token', credentials.sessionToken);
    }
 
    const canonicalRequest = [
      method,
      presignedUrl.pathname || '/',
      canonicalQueryString(presignedUrl),
      `host:${presignedUrl.host}\n`,
      'host',
      payloadHash,
    ].join('\n');
 
    const canonicalRequestHash = await sha256Hex(canonicalRequest);
    const stringToSign = [AWS_ALGORITHM, amzDate, credentialScope, canonicalRequestHash].join('\n');
 
    const kDate = await hmac(toUtf8(`AWS4${credentials.secretAccessKey}`), dateStamp);
    const kRegion = await hmac(kDate, this.region);
    const kService = await hmac(kRegion, this.service);
    const kSigning = await hmac(kService, 'aws4_request');
    const signature = hex(
      await crypto.subtle.sign(
        'HMAC',
        await crypto.subtle.importKey('raw', kSigning, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
        toUtf8(stringToSign)
      )
    );
 
    presignedUrl.searchParams.set('X-Amz-Signature', signature);
 
    return presignedUrl;
  }
 
  async presignWebSocketUrl(wsUrl: string, options: WebSocketPresignOptions = {}): Promise<string> {
    const parsed = new URL(wsUrl);
    if (parsed.protocol !== 'wss:' && parsed.protocol !== 'ws:') {
      throw new Error('WebSocket URL must start with ws:// or wss://');
    }
 
    if (options.query) {
      Object.entries(options.query).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        parsed.searchParams.set(key, String(value));
      });
    }
 
    const signingUrl = new URL(parsed.toString());
    signingUrl.protocol = parsed.protocol === 'wss:' ? 'https:' : 'http:';
 
    const signed = await this.presignUrl('GET', signingUrl, options.expiresInSeconds ?? 300);
    signed.protocol = parsed.protocol;
 
    return signed.toString();
  }
 
  forceRefreshCredentials(): void {
    this.invalidateCachedCredentials();
    this.requestForcedTcwsRefreshOnce();
  }
 
  async raw(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<Response> {
    return this.rawWithRetry(method, path, options, true);
  }
 
  private async rawWithRetry(
    method: HttpMethod,
    path: string,
    options: RequestOptions,
    allowRetryOnForbidden: boolean
  ): Promise<Response> {
    const url = this.buildUrl(path, options.query);
 
    const normalizedHeaders: Record<string, string> = {};
    Object.entries(options.headers || {}).forEach(([key, value]) => {
      normalizedHeaders[key.toLowerCase()] = value;
    });
 
    let payload = '';
    if (options.body !== undefined && options.body !== null) {
      if (typeof options.body === 'string') {
        payload = options.body;
      } else {
        payload = JSON.stringify(options.body);
        if (!normalizedHeaders['content-type']) {
          normalizedHeaders['content-type'] = 'application/json';
        }
      }
    }
 
    if (!normalizedHeaders.accept) {
      normalizedHeaders.accept = 'application/json';
    }
 
    const idToken = this.getIdTokenValue();
    if (idToken && !normalizedHeaders[this.idTokenHeaderName]) {
      normalizedHeaders[this.idTokenHeaderName] = idToken;
    }
 
    const signedHeaders = await this.signRequest(method, url, normalizedHeaders, payload);
 
    const response = await fetch(url.toString(), {
      method,
      headers: signedHeaders,
      body: payload || undefined,
      credentials: this.apiIncludeCredentials ? 'include' : 'omit',
      signal: options.signal,
    });
 
    if (response.status === 403 && allowRetryOnForbidden) {
      this.invalidateCachedCredentials();
      this.requestForcedTcwsRefreshOnce();
      return this.rawWithRetry(method, path, options, false);
    }
 
    return response;
  }
 
  async requestJson<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
    const response = await this.raw(method, path, options);
 
    if (!response.ok) {
      let message = `API request failed (${response.status})`;
      try {
        const errorPayload = await response.json();
        message =
          errorPayload?.detail ||
          errorPayload?.message ||
          errorPayload?.error?.message ||
          errorPayload?.error?.code ||
          message;
      } catch {
        // Keep fallback message.
      }
      throw new Error(message);
    }
 
    if (response.status === 204) {
      return {} as T;
    }
 
    return (await response.json()) as T;
  }
 
  get<T>(path: string, options: Omit<RequestOptions, 'body'> = {}): Promise<T> {
    return this.requestJson<T>('GET', path, options);
  }
 
  post<T>(path: string, body?: unknown, options: Omit<RequestOptions, 'body'> = {}): Promise<T> {
    return this.requestJson<T>('POST', path, { ...options, body });
  }
 
  put<T>(path: string, body?: unknown, options: Omit<RequestOptions, 'body'> = {}): Promise<T> {
    return this.requestJson<T>('PUT', path, { ...options, body });
  }
 
  patch<T>(path: string, body?: unknown, options: Omit<RequestOptions, 'body'> = {}): Promise<T> {
    return this.requestJson<T>('PATCH', path, { ...options, body });
  }
 
  delete<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.requestJson<T>('DELETE', path, options);
  }
 
  logoutToSignIn(): void {
    this.redirectToLogout();
  }
}
 
export const awsSigV4Api = new AwsSigV4ApiClient();
 