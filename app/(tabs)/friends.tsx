import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Snap } from '../../types';
import { formatDistanceToNow } from 'date-fns';

export default function FriendsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'snaps'),
      where('recipientId', '==', user.uid),
      where('viewed', '==', false),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Snap[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data() as Omit<Snap, 'id'>;
          if (d.expiresAt && d.expiresAt.toDate() > new Date()) {
            data.push({ id: doc.id, ...d });
          }
        });
        setSnaps(data);
      },
      (err) => console.log('Snaps listener error:', err)
    );

    return unsubscribe;
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const renderSnap = ({ item }: { item: Snap }) => (
    <TouchableOpacity
      style={styles.snapCard}
      onPress={() => router.push({ pathname: '/view-snap', params: { id: item.id } })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.senderName?.[0]?.toUpperCase() || '?'}
        </Text>
      </View>
      <View style={styles.snapInfo}>
        <Text style={styles.senderName}>{item.senderName}</Text>
        <Text style={styles.snapMeta}>
          {item.mediaType === 'video' ? '🎥 Video' : '📷 Photo'} ·{' '}
          {item.createdAt
            ? formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true })
            : 'just now'}
        </Text>
      </View>
      <View style={styles.newBadge}>
        <Text style={styles.newBadgeText}>NEW</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends</Text>
        <TouchableOpacity onPress={() => router.push('/camera')}>
          <Text style={styles.cameraButton}>📸</Text>
        </TouchableOpacity>
      </View>

      {snaps.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🤗</Text>
          <Text style={styles.emptyTitle}>No new snaps</Text>
          <Text style={styles.emptySubtitle}>
            When friends send you snaps, they'll appear here
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/camera')}
          >
            <Text style={styles.emptyButtonText}>Take a Snap</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={snaps}
          keyExtractor={(item) => item.id}
          renderItem={renderSnap}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#00C853"
            />
          }
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  cameraButton: {
    fontSize: 28,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  snapCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  snapInfo: {
    flex: 1,
    marginLeft: 14,
  },
  senderName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  snapMeta: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  newBadge: {
    backgroundColor: '#00C853',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newBadgeText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '800',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
  },
  emptyButton: {
    backgroundColor: '#00C853',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
  },
  emptyButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
});
