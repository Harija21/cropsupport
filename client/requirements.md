## Packages
framer-motion | Page transitions, beautiful interactive animations, and fluid layout changes
date-fns | Human-readable date formatting for community posts and histories

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
}

JWT Auth Assumption:
The app uses localStorage to store the JWT token as 'token'. All authenticated requests must include `Authorization: Bearer <token>` in the headers.

Image Uploads:
The disease detection endpoint expects `multipart/form-data` with a field named `image`.
