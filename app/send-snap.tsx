import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, query, getDocs, addDoc, serverTimestamp, Timestamp, where, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

interface UserItem {
  uid: string;
  displayName: string;
  username?: string;
}

export default function SendSnapScreen() {
  const { uri, mediaType } = useLocalSearchParams<{ uri: string; mediaType: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const q = query(collection(db, 'users'), limit(50));
        const snap = await getDocs(q);
        const list: UserItem[] = [];
        snap.forEach((doc) => {
          const d = doc.data();
          if (d.uid !== user?.uid) {
            list.push({
              uid: d.uid,
              displayName: d.displayName || 'User',
              username: d.username,
            });
          }
        });
        // Always allow sending to self for testing
        if (user) {
          list.unshift({
            uid: user.uid,
            displayName: 'My Story / Me',
            username: 'me',
          });
        }
        setUsers(list);
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, [user]);

  const toggleSelect = (uid: string) => {
    setSelected((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const filtered = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      (u.username || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = async () => {
    if (!uri || !user || selected.length === 0) {
      Alert.alert('Select at least one person');
      return;
    }
    setSending(true);
    try {
      // Upload once
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `snaps/${user.uid}/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const mediaUrl = await getDownloadURL(storageRef);

      const expiresAt = Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000));

      // Send snap to each selected user
      for (const recipientId of selected) {
        await addDoc(collection(db, 'snaps'), {
          senderId: user.uid,
          senderName: user.displayName || 'Someone',
          recipientId,
          mediaUrl,
          mediaType: mediaType || 'image',
          createdAt: serverTimestamp(),
          expiresAt,
          viewed: false,
          durationSeconds: 10,
        });
      }

      // Always add to my story
      await addDoc(collection(db, 'stories'), {
        userId: user.uid,
        userName: user.displayName || 'Someone',
        mediaUrl,
        mediaType: mediaType || 'image',
        createdAt: serverTimestamp(),
        expiresAt,
        viewCount: 0,
        viewers: [],
      });

      Alert.alert('Sent! 🤗', `Snap sent to ${selected.length} person(s)`, [
        { text: 'OK', onPress: () => router.replace('/(tabs)/friends') },
      ]);
    } catch (error: any) {
      Alert.alert('Failed', error.message || 'Check Firebase config & rules');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Send To</Text>
        <TouchableOpacity
          onPress={handleSend}
          disabled={sending || selected.length === 0}
          style={[styles.sendBtn, (sending || selected.length === 0) && styles.sendDisabled]}
        >
          {sending ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <Text style={styles.sendText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>

      {uri ? (
        <Image source={{ uri }} style={styles.preview} resizeMode="cover" />
      ) : null}

      <TextInput
        style={styles.search}
        placeholder="Search friends..."
        placeholderTextColor="#666"
        value={search}
        onChangeText={setSearch}
      />

      {loadingUsers ? (
        <ActivityIndicator color="#00C853" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isSelected = selected.includes(item.uid);
            return (
              <TouchableOpacity
                style={[styles.userRow, isSelected && styles.userSelected]}
                onPress={() => toggleSelect(item.uid)}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.displayName[0]?.toUpperCase() || '?'}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.displayName}</Text>
                  {item.username && (
                    <Text style={styles.username}>@{item.username}</Text>
                  )}
                </View>
                <View style={[styles.check, isSelected && styles.checkOn]}>
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  cancel: {
    color: '#888',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  sendBtn: {
    backgroundColor: '#00C853',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendDisabled: {
    opacity: 0.4,
  },
  sendText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  },
  preview: {
    width: '100%',
    height: 180,
    backgroundColor: '#111',
  },
  search: {
    backgroundColor: '#1a1a1a',
    margin: 16,
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  userSelected: {
    backgroundColor: '#0a1f0a',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 18,
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  username: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkOn: {
    backgroundColor: '#00C853',
    borderColor: '#00C853',
  },
  checkMark: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
  },
});
