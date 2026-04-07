export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://viaja-seguro-mvp.onrender.com/api';
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

const SESSION_TOKEN_KEY = 'vs_token';
const SESSION_ROLE_KEY = 'vs_role';
const SESSION_NAME_KEY = 'vs_name';

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: 'passenger' | 'driver' | 'admin';
  };
}

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage;
}

function migrateLegacySession(storage: Storage) {
  const legacyToken = window.localStorage.getItem(SESSION_TOKEN_KEY);
  const legacyRole = window.localStorage.getItem(SESSION_ROLE_KEY);
  const legacyName = window.localStorage.getItem(SESSION_NAME_KEY);

  if (legacyToken && !storage.getItem(SESSION_TOKEN_KEY)) {
    storage.setItem(SESSION_TOKEN_KEY, legacyToken);
  }

  if (legacyRole && !storage.getItem(SESSION_ROLE_KEY)) {
    storage.setItem(SESSION_ROLE_KEY, legacyRole);
  }

  if (legacyName && !storage.getItem(SESSION_NAME_KEY)) {
    storage.setItem(SESSION_NAME_KEY, legacyName);
  }
}

function getApiErrorMessage(body: unknown) {
  if (!body || typeof body !== 'object') {
    return 'Ocurrio un error al conectar con la API';
  }

  const maybeBody = body as { message?: string | string[] };
  if (Array.isArray(maybeBody.message)) {
    return maybeBody.message.join(', ');
  }

  return maybeBody.message ?? 'Ocurrio un error al conectar con la API';
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const isFormData = typeof FormData !== 'undefined' && options?.body instanceof FormData;
  const headers = new Headers(options?.headers ?? {});

  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor API. Verifica NEXT_PUBLIC_API_URL y CORS_ORIGIN.');
  }

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(getApiErrorMessage(body));
  }

  return body as T;
}

export function buildApiAssetUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${API_ORIGIN}${path}`;
}

export function saveSession(token: string, role: string, fullName: string) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(SESSION_TOKEN_KEY, token);
  storage.setItem(SESSION_ROLE_KEY, role);
  storage.setItem(SESSION_NAME_KEY, fullName);

  window.localStorage.removeItem(SESSION_TOKEN_KEY);
  window.localStorage.removeItem(SESSION_ROLE_KEY);
  window.localStorage.removeItem(SESSION_NAME_KEY);
}

export function saveToken(token: string) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(SESSION_TOKEN_KEY, token);
  window.localStorage.removeItem(SESSION_TOKEN_KEY);
}

export function getToken() {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  migrateLegacySession(storage);
  return storage.getItem(SESSION_TOKEN_KEY);
}

export function getSessionRole() {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  migrateLegacySession(storage);
  return storage.getItem(SESSION_ROLE_KEY);
}

export function getSessionName() {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  migrateLegacySession(storage);
  return storage.getItem(SESSION_NAME_KEY);
}

export function clearSession() {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(SESSION_TOKEN_KEY);
    storage.removeItem(SESSION_ROLE_KEY);
    storage.removeItem(SESSION_NAME_KEY);
  }

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(SESSION_TOKEN_KEY);
    window.localStorage.removeItem(SESSION_ROLE_KEY);
    window.localStorage.removeItem(SESSION_NAME_KEY);
  }
}
