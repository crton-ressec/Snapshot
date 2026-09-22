import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// This tab just opens the full-screen camera modal
export default function CameraTab() {
  const router = useRouter();

  useEffect(() => {
    router.push('/camera');
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00C853" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
