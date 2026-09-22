import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Story } from '../../types';
import { formatDistanceToNow } from 'date-fns';

export default function StoriesScreen() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'stories'),
      orderBy('createdAt', 'desc'),
      limit(40)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Story[] = [];
      const now = new Date();
      snapshot.forEach((doc) => {
        const d = doc.data() as Omit<Story, 'id'>;
        if (d.expiresAt && d.expiresAt.toDate() > now) {
          data.push({ id: doc.id, ...d });
        }
      });
      setStories(data);
    });

    return unsubscribe;
  }, [user]);

  const renderStory = ({ item }: { item: Story }) => (
    <TouchableOpacity style={styles.storyCard}>
      <View style={styles.ring}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.userName?.[0]?.toUpperCase() || '?'}
          </Text>
        </View>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {item.userName}
      </Text>
      <Text style={styles.time}>
        {item.createdAt
          ? formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true })
          : ''}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stories</Text>
      </View>

      {stories.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📱</Text>
          <Text style={styles.emptyTitle}>No stories yet</Text>
          <Text style={styles.emptySubtitle}>
            Be the first to post a story that lasts 24 hours
          </Text>
        </View>
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={renderStory}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'flex-start',
    gap: 12,
  },
  storyCard: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  ring: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00C853',
  },
  name: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  time: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
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
  },
});
