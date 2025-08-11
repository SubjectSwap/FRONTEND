# SubjectSwap — FRONTEND

> This README explains the routes, components and design choices in the `SubjectSwap/FRONTEND` repo (React + Vite frontend).  
> For general evaluation repository <a href="https://github.com/SubjectSwap/SubjectSwap/">https://github.com/SubjectSwap/SubjectSwap/</a>  
> For backend repository <a href="https://github.com/SubjectSwap/BACKEND/">https://github.com/SubjectSwap/BACKEND/</a>

# Quick start

```bash
git clone https://github.com/SubjectSwap/FRONTEND
cd FRONTEND
npm install
npm run dev
# configure VITE_BACKEND_URL (see .env.example)
```

`package.json` uses Vite and lists the main dependencies (`react`, `react-router-dom`, `socket.io-client`, `lucide-react`, `jwt-decode`). (See `package.json`.)

---

# High-level project structure (key files)

```
src/
├─ App.jsx                 # Router + route registration
├─ main.jsx                # app bootstrap
├─ context/
│  └─ AuthProvider.jsx     # central auth/context (login/register/logout/verify)
├─ routes/
│  ├─ Dashboard.jsx
│  ├─ Login.jsx
│  ├─ CreateAccount.jsx
│  ├─ ProtectedRoute.jsx
│  ├─ Profile.jsx
│  ├─ matchMakingPage/Match.jsx
│  ├─ search/Search.jsx
│  └─ sockets/
│     ├─ ConnectChat.jsx
│     ├─ ListChats.jsx
│     ├─ SpecificChat.jsx
│     ├─ ChatInput.jsx
│     ├─ ChatMessages.jsx
│     └─ cryptoUtils.js
├─ components/
│  ├─ CircularProgress.jsx
│  ├─ NavTab.jsx
│  └─ FilterSection.jsx
└─ utils/
   └─ jwt.js
```

---

# Routes (what the app exposes)

Below are the main route endpoints and what they do (based on route components & `navigate` usages in code):

* **`/login`** — Login form, uses `AuthProvider.login(...)` to authenticate.
* **`/create-account`** — Signup / account creation UI that calls the backend create-account endpoint and displays the email verification notice.
* **`/dashboard`** — User dashboard (stats, quick actions, subject lists). Requires authentication (rendered inside `ProtectedRoute`).
* **`/match`** — Matchmaking UI (select subject, filter candidates, start chat).
* **`/search`** — Search people by name / subjects; quick “Chat Now” links.
* **`/profile/:id`** — User profile page. Shows ratings, subjects, languages and action buttons. (Owner vs visitor view discussed below.)
* **Chat routes:**

  * **chat list** — a route/view that lists conversations (`ListChats`).)
  * **`/chat-to-connect/:uuid`** — connects a private chat session and establishes the socket & key exchange (`ConnectChat`).)
  * **(chat view)** — specific conversation UI composed of `SpecificChat`, `ChatHeader`, `ChatMessages` and `ChatInput`.)
* **fallback** — `NotFoundPage` (404).)

> Note: `ProtectedRoute` is used to protect pages behind login; it renders a navigation bar and the requested page for authenticated users and redirects to `/login` otherwise.)

---

# AuthProvider — benefits, implementation and parallels to Clerk

* `AuthProvider.jsx` is a React context that:

  * holds `user`, `loading`, and `error` states;
  * exposes `login(email,password)`, `logout()`, `register(...)`, and `fetchUser()` helper functions;
  * on mount calls `fetchUser()` to attempt verification of an existing token.

Key implementation notes:

* On successful login the code:

  * stores the token in `localStorage` (`localStorage.setItem('token', resData.token)`),
  * writes a cookie named `SubjectSwapLoginJWT` via `document.cookie = ...` (the cookie string includes `SameSite=None; Secure;`.
* `fetchUser()` posts to `/verify-user` to the backend, including the token (body JSON) and uses `credentials: 'include'` to allow cookie exchange. `register()` posts to `/create-account`. `logout()` clears cookies/localStorage and navigates to `/login`.

### Benefits of using this single context/provider

* **Single source of truth**: Centralizes auth state and methods so routes/components can `useAuth()` rather than passing props down the tree. This avoids prop-drilling and keeps route protection logic in one place.
* **Easily pluggable**: You can swap the backend auth flow (for example, to a managed provider) by changing a few functions.
* **Convenient hooks**: components can check `isAuthenticated` and `user` directly in render logic and conditionally render/enable actions.

### Inspiration & parallels to Clerk

* Our inspiration Clerk and similar providers offer an auth SDK that exposes `AuthProvider`-like contexts/hooks (current user, isAuthenticated, signIn, signOut, etc.). This repo implements a **homegrown** version of that idea: a provider that exposes `user` + auth methods and is used to guard routes. The high-level pattern – provider + hooks + route guards – is the same.

### Important differences & security notes

* Clerk typically uses **server-set, HttpOnly cookies** or secure SDK-managed flows to avoid exposing raw JWTs to JavaScript, plus built-in refresh tokens and session handling. The current implementation **stores the JWT in `localStorage` and also writes a cookie from client JS** (so the cookie is not HttpOnly). This was a on-the-fly decision to prevent continous errors while hosting the app otherwise it relied on the same principle.

---

# Chat architecture — hierarchy & encrypted tunneling

### Component hierarchy (client-side)

* **`ConnectChat`** — top-level socket manager for a private conversation. It:

  * creates the `socket.io` connection to `VITE_BACKEND_URL + '/private_chat'` namespace, passing `auth: { token }` in `io(...)` options and `withCredentials: true`. It also generates the RSA keypair with `generateKeyPair()` and exports the public key.)
* **`ListChats`** — lists previous conversations (fetches `/chat/previous_chats` and allows selecting a convo).)
* **`SpecificChat`** — per-conversation UI. It:

  * joins the conversation (`join_conversation`), requests `previous_chats`, receives a `server_public_key` (PEM), sets `serverPublicKey`, decrypts messages using the browser private key, and displays messages; it sends messages by encrypting their content using the `serverPublicKey` before emitting `message_sent`.)
* **`ChatHeader`** — shows conversation title / other user info.)
* **`ChatMessages`** / **`ChatInput`** — rendering and input; `ChatInput` supports pressing `Enter` to send and supports file attachments.)

### Crypto & tunneling details

* Keys are generated in the browser using the Web Crypto API (`RSA-OAEP`, 2048 bits). `cryptoUtils.js` provides:

  * `generateKeyPair()`, `exportPublicKey()` / `exportPrivateKey()` (PEM conversion), `importPublicKey()` / `importPrivateKey()`, and functions to `encryptWithPublicKey()` / `decryptWithPrivateKey()` that return base64 strings for transport.)
* Flow (as implemented client-side):

  1. Client generates an RSA key pair and exports the public key PEM.
  2. Client connects to socket.io with `auth: { token }` and emits `join_conversation` including `publicKey`.
  3. Server responds (in `previous_chats` payload) with `server_public_key` (naming is implementation-specific — it may be the peer's public key or a relay key depending on backend behavior).
  4. When sending, the client encrypts message payload using the provided/public key (PEM) via `encryptWithPublicKey(...)` and emits `message_sent`.
  5. On `message_received` events, the client attempts to decrypt payloads with its private key via `decryptWithPrivateKey(...)`.)

> **Note:** Don't be mistaken that the system is entirely end-to-end encypted.

---

# Permissions & isolation (non-logged-in / logged-in / profile owner)

`/profile/:id` behavior (based on `Profile.jsx`):

* **Is own profile**: `isOwnProfile` is computed as `currentUser?.user?._id === id`. If true:

  * shows **Edit Profile** button (links to `/edit-profile`).
  * owner can see and presumably edit their subjects, languages and profile info (edit UI implemented in `EditProfile` route — ensure that file exists and implements server calls).
* **Logged-in user (not owner)**:

  * sees **Start Chat** button that navigates to `chat-to-connect/:profileUser._id` to initiate a private chat.
  * can rate the user’s personality and subject expertise (POST `/rating_routes/personality` and `/rating_routes/subject`) — and can take back ratings via corresponding DELETE endpoints. The UI shows whether the current logged-in user already rated the profile and shows a “Take Back Rating” option.
* **Non-logged-in visitor**:

  * such users can only view things in shallow details. They cannot rate the user, view/update subject ratings or start a chat.

**Summary of isolation**

* `ProtectedRoute` enforces auth for the dashboards and main app flows; `Profile` exposes read-only profile info to unauthenticated users while showing owner-only actions when `isOwnProfile` is true.)

---

# Accessibility & UX notes (what's already there and opportunities)

What the code contains:

* Inputs use `placeholder`s and focus styling (many inputs change `borderColor` and `boxShadow` on focus, which helps keyboard users). Examples: login and create account inputs.
* `ChatInput` supports sending with `Enter` (keyboard accessibility).)
* Many large buttons and clear top-level navigation (in `ProtectedRoute`) — big click/tap targets.)

Future improvements:

* Add proper ARIA attributes for important interactive elements (e.g., labels for file preview controls, `aria-live` regions for incoming messages).
* Ensure color contrast (theme palette) and explicit `<label for="...">` elements where appropriate.
* Add `alt` text for profile images and role attributes for dialogs/modals.
* For forms, add server-side error mappings to concise accessible messages (and announce them to screen readers).

---

# Features (what the frontend implements)

* JWT-based signup/login/verification flows (register → email verification (UI note), login → sets token/cookie, fetchUser to verify).
* Protected routes and a top navigation rendered for authenticated users.)
* Matchmaking page with advanced filtering (languages, learning/teaching subjects, AND/OR logic).
* Profile page with:

  * personality rating and subject ratings,
  * ability to take back ratings,
  * start chat (if visitor is logged-in),
  * edit profile (if profile owner).
* Real-time chat with RSA-based encryption utilities and file/text messaging.)

---

# Where to look in the code (quick pointers)

* **Auth flow**: `src/context/AuthProvider.jsx`.
* **Protected navigation**: `src/routes/ProtectedRoute.jsx`.)
* **Matchmaking**: `src/routes/matchMakingPage/Match.jsx`.
* **Profile page / ratings**: `src/routes/Profile.jsx`.
* **Chat (socket) code**: `src/routes/sockets/ConnectChat.jsx`, `SpecificChat.jsx`, `cryptoUtils.js`, `ListChats.jsx`, `ChatInput.jsx`, `ChatMessages.jsx`. These files implement the socket connection, key generation/export/import, message encryption/decryption and the UI.)

---
