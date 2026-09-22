# Snapshot 🤗

Snapchat-style app (React Native + Expo + Firebase)

**Repo:** https://github.com/crton-ressec/Snapshot

## 1. Add your Firebase config (required)

Open this file and replace the placeholders:

**`lib/firebase.ts`**

```ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                    // ← paste here
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

Full step-by-step: **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

## 2. Run the app

```bash
git clone https://github.com/crton-ressec/Snapshot.git
cd Snapshot
npm install
npx expo start
```

## 3. Get the unsigned IPA

1. Go to **Actions** tab
2. Click **Build Unsigned IPA**
3. Click **Run workflow** → Run
4. When it finishes, download the **Snapshot-unsigned-ipa** artifact

## Features

- Full-screen camera
- Take photo → Send To screen (pick friends)
- Ephemeral snaps with timer
- Stories (24h)
- Friends feed
- Chat list
- Profile
- Dark Snapchat-style UI + green 🤗 icon

---

After you paste your Firebase config, the app works.
