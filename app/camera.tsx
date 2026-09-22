import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission is required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || capturing || !user) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });
      if (photo?.uri) {
        // Go to Snapchat-style "Send To" screen
        router.push({
          pathname: '/send-snap',
          params: { uri: photo.uri, mediaType: 'image' },
        });
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to take picture');
    } finally {
      setCapturing(false);
    }
  };

  const toggleFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode="picture"
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.topButton}>
            <Text style={styles.topButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.appName}>Snapshot</Text>
          <TouchableOpacity onPress={toggleFacing} style={styles.topButton}>
            <Text style={styles.topButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom controls - Snapchat style big shutter */}
        <View style={styles.bottomBar}>
          <View style={styles.sideButton} />
          <TouchableOpacity
            style={[styles.captureButton, capturing && styles.captureDisabled]}
            onPress={takePicture}
            disabled={capturing}
            activeOpacity={0.7}
          >
            {capturing ? (
              <ActivityIndicator color="#00C853" size="large" />
            ) : (
              <View style={styles.captureInner} />
            )}
          </TouchableOpacity>
          <View style={styles.sideButton}>
            <Text style={styles.hint}>Tap to snap</Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  appName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  captureButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 6,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  captureDisabled: {
    opacity: 0.6,
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  sideButton: {
    width: 80,
    alignItems: 'center',
  },
  hint: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.85,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#00C853',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
  },
  closeText: {
    color: '#888',
    fontSize: 16,
  },
});
