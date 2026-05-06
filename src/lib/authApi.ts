export type AuthRole = 'rider' | 'driver' | 'admin';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: AuthRole;
}

interface ApiResponse {
  success?: boolean;
  error?: string;
  redirect?: string;
  user?: AuthUser;
}

interface SignUpPayload {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
  role: 'rider' | 'driver';
  licenseNumber?: string;
  cnic?: string;
}

function normalizeError(status: number, body: ApiResponse): string {
  if (body?.error) {
    return body.error;
  }
  if (status >= 500) {
    return 'Server error. Please try again.';
  }
  return 'Request failed. Please try again.';
}

export async function signUpRequest(payload: SignUpPayload): Promise<{ user: AuthUser; redirect: string }> {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      fullName: payload.fullName,
      email: payload.email,
      countryCode: payload.countryCode,
      phone: payload.phone,
      password: payload.password,
      role: payload.role,
      licenseNumber: payload.licenseNumber,
      cnic: payload.cnic,
    }),
  });

  const body = (await res.json().catch(() => ({}))) as ApiResponse;
  if (!res.ok || !body.user || !body.redirect) {
    throw new Error(normalizeError(res.status, body));
  }

  return { user: body.user, redirect: body.redirect };
}

export async function loginRequest(emailOrPhone: string, password: string): Promise<{ user: AuthUser; redirect: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ emailOrPhone, password }),
  });

  const body = (await res.json().catch(() => ({}))) as ApiResponse;
  if (!res.ok || !body.user || !body.redirect) {
    throw new Error(normalizeError(res.status, body));
  }

  return { user: body.user, redirect: body.redirect };
}
