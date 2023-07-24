import { createAuthProvider } from 'react-token-auth';

export const { useAuth, authFetch, login, logout } = createAuthProvider({
  // getAccessToken: (data) => data.access_token,
  getAccessToken: access_token => access_token,
  storage: localStorage,
  onUpdateToken: token =>
    fetch('/api/refresh', {
      method: 'POST',
      body: token.refresh_token,
    }).then(r => r.json()),
});
