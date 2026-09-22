# Snapshot 🤗

Snapchat-style app — React Native (Expo) + Firebase.

**Repo:** https://github.com/crton-ressec/Snapshot

---

## 1. Add your Firebase config (required)

Open this file and paste your values:

```
lib/firebase.ts
```

Get the values from [Firebase Console](https://console.firebase.google.com) → Project → Web app.

Also enable:
- Authentication → Email/Password
- Firestore Database
- Storage

Full guide with rules: **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

---

## 2. Get the unsigned IPA

1. Go to **Actions** tab: https://github.com/crton-ressec/Snapshot/actions
2. Click the latest **Build Unsigned IPA** run
3. When it finishes green, download the artifact **Snapshot-unsigned-ipa**

Install with Sideloadly, AltStore, or re-sign with your Apple certificate.

---

## 3. Run locally (optional)

```bash
git clone https://github.com/crton-ressec/Snapshot.git
cd Snapshot
npm install
npx expo start
```

---

## Features

- Camera + Send To (pick friends)
- Ephemeral snaps (timer + disappear)
- Stories (24h)
- Friends feed
- Chat list
- Auth (email/password)
- Dark Snapchat-style UI + 🤗 green icon

---

After you paste Firebase config the app is ready.
