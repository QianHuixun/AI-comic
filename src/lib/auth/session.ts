export interface StoredAuthUser {
  id: number;
  phoneNumber: string;
  name: string | null;
}

interface StoredAuthSessionInput {
  token: string;
  user: StoredAuthUser;
}

const tokenStorageKey = "token";
const userStorageKey = "authUser";

function parseJson<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function decodeTokenPayload(token: string): Record<string, unknown> | null {
  const segments = token.split(".");

  if (segments.length < 2) {
    return null;
  }

  try {
    const normalized = segments[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = window.atob(normalized);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isStoredAuthUser(value: unknown): value is StoredAuthUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const id = Reflect.get(value, "id");
  const phoneNumber = Reflect.get(value, "phoneNumber");
  const name = Reflect.get(value, "name");

  return (
    Number.isInteger(id) &&
    typeof phoneNumber === "string" &&
    (typeof name === "string" || name === null || name === undefined)
  );
}

export function storeAuthSession(input: StoredAuthSessionInput) {
  localStorage.setItem(tokenStorageKey, input.token);
  localStorage.setItem(userStorageKey, JSON.stringify(input.user));
}

export function clearAuthSession() {
  localStorage.removeItem(tokenStorageKey);
  localStorage.removeItem(userStorageKey);
}

export function getStoredToken(): string | null {
  return localStorage.getItem(tokenStorageKey);
}

export function getStoredAuthUser(): StoredAuthUser | null {
  const storedUser = parseJson<StoredAuthUser>(localStorage.getItem(userStorageKey));

  if (storedUser && isStoredAuthUser(storedUser)) {
    return {
      id: storedUser.id,
      phoneNumber: storedUser.phoneNumber,
      name: storedUser.name ?? null,
    };
  }

  const token = getStoredToken();

  if (!token) {
    return null;
  }

  const payload = decodeTokenPayload(token);
  const userId = payload?.userId;
  const phoneNumber = payload?.phoneNumber;
  const name = payload?.name;

  if (!Number.isInteger(userId) || typeof phoneNumber !== "string") {
    return null;
  }

  const user = {
    id: Number(userId),
    phoneNumber,
    name: typeof name === "string" ? name : null,
  };

  localStorage.setItem(userStorageKey, JSON.stringify(user));
  return user;
}
