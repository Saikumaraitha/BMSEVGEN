/// <reference types="vite/client" />
 
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_LANDING_DATA_PATH?: string;
  readonly VITE_EXPLORE_INSIGHTS_PATH?: string;
  readonly VITE_CHAT_API_MODE?: 'mock' | 'real';
  readonly VITE_AWS_REGION?: string;
  readonly VITE_AWS_SERVICE?: string;
  readonly VITE_AWS_TCWS_CREDENTIALS_URL?: string;
  readonly VITE_AWS_TCWS_METHOD?: 'GET' | 'POST';
  readonly VITE_AWS_TCWS_INCLUDE_CREDENTIALS?: 'true' | 'false';
  readonly VITE_AWS_API_INCLUDE_CREDENTIALS?: 'true' | 'false';
  readonly VITE_AWS_CREDENTIALS_SOURCE?: 'auto' | 'env' | 'tcws';
  readonly VITE_AWS_ACCESS_KEY_ID?: string;
  readonly VITE_AWS_SECRET_ACCESS_KEY?: string;
  readonly VITE_AWS_SESSION_TOKEN?: string;
  readonly VITE_AWS_CREDENTIALS_EXPIRATION?: string;
  readonly VITE_AWS_ID_TOKEN_SOURCE?: 'cookie_then_env' | 'cookie' | 'env' | 'none';
  readonly VITE_AWS_ID_TOKEN?: string;
  readonly VITE_AWS_ID_TOKEN_HEADER_NAME?: string;
  readonly VITE_AWS_ID_TOKEN_COOKIE_NAME?: string;
  readonly VITE_CHAT_WS_PRESIGN_EXPIRES_IN?: string;
}
 
interface ImportMeta {
  readonly env: ImportMetaEnv;
}