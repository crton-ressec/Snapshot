# Snapshot 🤗

Snapchat-style social app built with **React Native (Expo)** + **Firebase**.

**Live repo:** https://github.com/crton-ressec/Snapshot

## Features

- 📸 Full-screen camera (photo)
- ⏳ Ephemeral snaps with view timer (disappear after viewing)
- 📱 Stories (24-hour expiry)
- 👥 Friends feed of unopened snaps
- 💬 Chat list
- 🔐 Email/password authentication
- 🎨 Dark Snapchat-inspired UI with green accent + 🤗 icon

## Quick Start

### 1. Firebase (required)

**→ Follow the full guide: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

You must create a Firebase project, enable Auth + Firestore + Storage, and paste your config into `lib/firebase.ts`.

### 2. Run locally

```bash
git clone https://github.com/crton-ressec/Snapshot.git
cd Snapshot
npm install
npx expo start
```

Press `i` for iOS simulator (Mac + Xcode required).

### 3. Unsigned IPA via GitHub Actions

1. Go to the **Actions** tab
2. Select **Build Unsigned IPA**
3. Click **Run workflow**
4. Download the artifact when finished

Install with Sideloadly / AltStore or re-sign with your certificate.

## Project Structure

```
app/
  (auth)/          Login & Sign up
  (tabs)/          Friends · Stories · Camera · Chat · Profile
  camera.tsx       Full-screen camera capture
  view-snap.tsx    Ephemeral viewer with countdown timer
lib/firebase.ts    ← Put your Firebase config here
context/           Auth provider
types/             TypeScript interfaces
scripts/           Icon generator (🤗 on green)
```

## Snapchat-style UX notes

- Camera is one tap away from every screen
- Snaps open full-screen with a progress bar + auto-close timer
- Dark theme, large emoji icons, green accent (`#00C853`)
- Empty states encourage taking a snap
- Stories shown in a grid with green rings

## Coming / Easy to extend

- Friend search & requests
- Pick recipient before sending snap
- Video capture
- Real-time chat messages
- Push notifications
- AR filters / lenses

---

Built with 🤗
