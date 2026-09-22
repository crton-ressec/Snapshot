# Firebase Setup for Snapshot 🤗

Follow these steps exactly to make the app work.

## 1. Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project**
3. Name it `Snapshot` (or anything you like)
4. Disable Google Analytics if you want (optional)
5. Create the project

## 2. Register a Web App

1. On the project overview, click the **Web** icon (`</>`)
2. App nickname: `Snapshot Web`
3. **Do not** check Firebase Hosting
4. Click **Register app**
5. Copy the `firebaseConfig` object — it looks like this:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "snapshot-xxxxx.firebaseapp.com",
  projectId: "snapshot-xxxxx",
  storageBucket: "snapshot-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

6. Open `lib/firebase.ts` in the repo and replace the placeholder values with yours.

## 3. Enable Authentication

1. Left sidebar → **Build** → **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** (just the first one, not Email link)
5. Save

## 4. Create Firestore Database

1. Left sidebar → **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we will replace rules next)
4. Pick a location close to you (e.g. `us-central1`)
5. Enable

### Firestore Rules (important)

Go to **Rules** tab and paste this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read any profile, write only their own
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Snaps: only sender or recipient can read; only sender can create
    match /snaps/{snapId} {
      allow read: if request.auth != null && 
        (resource.data.senderId == request.auth.uid || resource.data.recipientId == request.auth.uid);
      allow create: if request.auth != null && request.resource.data.senderId == request.auth.uid;
      allow update: if request.auth != null && 
        (resource.data.senderId == request.auth.uid || resource.data.recipientId == request.auth.uid);
      allow delete: if request.auth != null && resource.data.senderId == request.auth.uid;
    }

    // Stories: anyone logged in can read; only owner can write
    match /stories/{storyId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Chats
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      allow create: if request.auth != null && 
        request.auth.uid in request.resource.data.participants;
    }

    // Messages inside chats
    match /chats/{chatId}/messages/{messageId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
    }
  }
}
```

Click **Publish**.

### Indexes (may be required)

If the app shows an error about missing indexes when loading snaps/stories, Firebase will give you a link in the error. Click it and create the index.

Typical composite indexes needed:
- Collection `snaps`: `recipientId` Ascending + `viewed` Ascending + `createdAt` Descending
- Collection `stories`: `createdAt` Descending

## 5. Enable Storage

1. Left sidebar → **Build** → **Storage**
2. Click **Get started**
3. Start in **test mode**
4. Choose same location as Firestore

### Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /snaps/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

Publish.

## 6. Test

1. Run the app (`npx expo start`)
2. Create an account
3. Take a snap — it should upload and appear in Friends (sent to yourself for demo)
4. Open it — timer counts down and it disappears

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Permission denied" | Check Firestore / Storage rules above |
| "Missing index" | Click the link in the error, create the index |
| Upload fails | Make sure Storage is enabled and rules allow write |
| Auth fails | Email/Password must be enabled in Authentication |
| Config error | Double-check `lib/firebase.ts` values |

---

Once this is done the app is fully functional.
