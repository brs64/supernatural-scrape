import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConventionsService from '../services/ConventionsService';
import ConventionCard from '../components/ConventionCard';

const HomeScreen = () => {
  const [conventions, setConventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    loadConventions();
    setupNotifications();

    // Rafraîchir toutes les 30 minutes
    const interval = setInterval(() => {
      refreshConventions();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const setupNotifications = async () => {
    await ConventionsService.requestNotificationPermissions();
  };

  const loadConventions = async () => {
    try {
      const cached = await ConventionsService.getCachedConventions();
      if (cached.length > 0) {
        setConventions(cached);
      }
      await refreshConventions();
    } catch (error) {
      console.error('Erreur chargement conventions:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshConventions = async () => {
    setRefreshing(true);
    try {
      const updated = await ConventionsService.refreshConventions();
      setConventions(updated);
      const checkTime = await ConventionsService.getLastCheckTime();
      setLastCheck(checkTime);
    } catch (error) {
      console.error('Erreur refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatLastCheck = () => {
    if (!lastCheck) return 'Jamais';
    const now = new Date();
    const diff = Math.floor((now - lastCheck) / 1000 / 60); // minutes
    if (diff < 1) return "À l'instant";
    if (diff < 60) return `Il y a ${diff} min`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return lastCheck.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
        <ActivityIndicator size="large" color="#FF6600" />
        <Text style={styles.loadingText}>Chargement des conventions...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Supernatural Conventions</Text>
        <Text style={styles.headerSubtitle}>
          {conventions.length} convention{conventions.length > 1 ? 's' : ''} · {formatLastCheck()}
        </Text>
      </View>

      {/* Liste des conventions */}
      <FlatList
        data={conventions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ConventionCard convention={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshConventions}
            tintColor="#888"
            colors={['#888']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Aucune convention</Text>
            <Text style={styles.emptySubtitle}>
              Tirez pour actualiser
            </Text>
          </View>
        }
        contentContainerStyle={
          conventions.length === 0 ? styles.emptyList : styles.list
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#888',
  },
  header: {
    backgroundColor: '#111',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  list: {
    paddingVertical: 12,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#888',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;
