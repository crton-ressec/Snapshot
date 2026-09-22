# Snapshot 🤗

A Snapchat-style social app built with **React Native (Expo)** + **Firebase**.

- Ephemeral snaps that disappear after viewing
- Stories (24h)
- Camera capture
- Friends feed
- Chat
- Auth (email/password)

App icon: 🤗 on green background.

## Quick Start

### 1. Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password
3. Create a **Firestore** database
4. Enable **Storage**
5. Register a **Web app** and copy the config
6. Paste the config into `lib/firebase.ts`

Recommended Firestore rules (for development):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Storage rules (dev):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. Install & Run

```bash
npm install
npx expo start
```

Press `i` for iOS simulator (requires Mac + Xcode).

### 3. Build unsigned IPA (GitHub Actions)

This repo includes a GitHub Actions workflow that builds an **unsigned IPA** on every push to `main` (or manually).

Go to the **Actions** tab → "Build Unsigned IPA" → Run workflow.

The artifact will appear when the job finishes.

> Note: Unsigned IPAs can be installed on devices with developer mode / via AltStore, Sideloadly, or after re-signing with your own certificate.

## Project Structure

```
app/
  (auth)/     → Login & Sign up
  (tabs)/     → Main tab screens (Friends, Stories, Camera, Chat, Profile)
  camera.tsx  → Full-screen camera
  view-snap.tsx → Ephemeral snap viewer with timer
lib/firebase.ts
context/AuthContext.tsx
types/
assets/       → App icon (🤗 on green)
```

## Features Implemented

- [x] Email/password auth with Firebase
- [x] Camera capture (photo)
- [x] Upload snap to Firebase Storage
- [x] Ephemeral snaps (view once + timer)
- [x] Stories (24h expiry)
- [x] Friends list of unopened snaps
- [x] Basic chat list
- [x] Profile + sign out
- [x] Dark Snapchat-like UI
- [x] Custom app icon

## Next Steps You Can Add

- Friend requests / search users
- Video capture + recording
- Real AR filters / lenses
- Push notifications
- Better chat (real-time messages)
- Location / Snap Map style features

---

Built with 🤗 for the Snapshot project.
