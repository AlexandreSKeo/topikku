import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY);

export interface AuthorizationURLOptions {
  redirectUri: string;
  state?: string;
  provider?: string;
}

export function getAuthorizationUrl(options: AuthorizationURLOptions): string {
  const clientId = process.env.WORKOS_CLIENT_ID;

  if (!clientId) {
    throw new Error('WORKOS_CLIENT_ID is not configured');
  }

  return workos.userManagement.getAuthorizationUrl({
    clientId,
    redirectUri: options.redirectUri,
    provider: options.provider || 'authkit',
    state: options.state,
  });
}

export interface AuthenticateWithCodeOptions {
  code: string;
  clientId?: string;
}

export async function authenticateWithCode(options: AuthenticateWithCodeOptions) {
  const clientId = options.clientId || process.env.WORKOS_CLIENT_ID;

  if (!clientId) {
    throw new Error('WORKOS_CLIENT_ID is not configured');
  }

  return await workos.userManagement.authenticateWithCode({
    code: options.code,
    clientId,
  });
}

export async function getUser(userId: string) {
  return await workos.userManagement.getUser(userId);
}

export async function getLogoutUrl(sessionId: string) {
  return workos.userManagement.getLogoutUrl({ sessionId });
}

export { workos };
