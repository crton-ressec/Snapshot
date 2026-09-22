import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Snap } from '../types';

const { width, height } = Dimensions.get('window');

export default function ViewSnapScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [snap, setSnap] = useState<Snap | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const snapDoc = await getDoc(doc(db, 'snaps', id));
        if (snapDoc.exists()) {
          const data = { id: snapDoc.id, ...snapDoc.data() } as Snap;
          setSnap(data);
          setTimeLeft(data.durationSeconds || 10);
          await updateDoc(doc(db, 'snaps', id), { viewed: true });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!snap || loading) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          router.back();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [snap, loading]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  if (!snap) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Snap not found or expired</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: snap.mediaUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.topBar}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${(timeLeft / (snap.durationSeconds || 10)) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.timer}>{timeLeft}s</Text>
      </View>

      <View style={styles.senderBar}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {snap.senderName?.[0]?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.senderName}>{snap.senderName}</Text>
      </View>

      <TouchableOpacity
        style={styles.tapArea}
        activeOpacity={1}
        onPress={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width,
    height,
  },
  topBar: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00C853',
  },
  timer: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  senderBar: {
    position: 'absolute',
    top: 80,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
  senderName: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tapArea: {
    ...StyleSheet.absoluteFillObject,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  closeText: {
    color: '#00C853',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});
