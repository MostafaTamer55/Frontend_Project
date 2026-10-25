# Authentication frontend handoff

The browser-side authentication flow is complete and runs in demo mode when
`VITE_API_BASE_URL` is empty. Production integration should only require
adapting endpoint paths or response mapping in `src/api/auth.ts`.

## Expected backend contract

All production requests use `credentials: "include"` and expect the backend to
own an HttpOnly, Secure, SameSite session cookie.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/signup` | Create an account |
| `POST` | `/auth/login` | Create a session and return the user |
| `GET` | `/auth/me` | Return the current user or `401` |
| `POST` | `/auth/logout` | Revoke the current session |
| `POST` | `/auth/password/forgot` | Send a generic reset response |
| `POST` | `/auth/password/reset` | Consume a token and update the password |
| `DELETE` | `/auth/password/reset-token` | Optional reset-link cancellation |

Errors should use this shape so the UI can place validation messages beside the
correct fields:

```json
{
  "code": "EMAIL_IN_USE",
  "message": "An account already exists with this email.",
  "fields": {
    "email": "Use another email or log in."
  }
}
```

## Security ownership

- The frontend never stores passwords or production access tokens.
- The backend must validate every protected request; route guards are UX only.
- Password reset responses must not disclose whether an email exists.
- Rate limits, token expiry, one-time token use, session expiry, and CSRF
  protection must be enforced by the backend.
- If CSRF uses a readable token/header pair, add that public header centrally
  in the `request()` function rather than in individual screens.

## Removing demo mode

1. Set `VITE_API_BASE_URL` per environment.
2. Confirm cookie CORS settings for the deployed frontend origin.
3. Remove the demo branches and `reset-demo.ts` after real email delivery is
   verified.
4. Connect an error-monitoring vendor at the app boundary, ensuring passwords,
   reset tokens, and personal data are scrubbed.
