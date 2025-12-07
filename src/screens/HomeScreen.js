import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
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
        <Text style={styles.headerTitle}>🔥 SUPERNATURAL 🔥</Text>
        <Text style={styles.headerSubtitle}>Conventions en Europe</Text>
        <Text style={styles.lastCheckText}>
          Dernière vérification: {formatLastCheck()}
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
            tintColor="#FF6600"
            colors={['#FF6600', '#8B0000']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>😈</Text>
            <Text style={styles.emptyTitle}>Aucune convention trouvée</Text>
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
    fontSize: 16,
    color: '#CCCCCC',
  },
  header: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#8B0000',
    elevation: 4,
    shadowColor: '#FF6600',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6600',
    textAlign: 'center',
    textShadowColor: '#8B0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 4,
  },
  lastCheckText: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    marginTop: 8,
  },
  list: {
    paddingVertical: 16,
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
  emptyText: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#CCCCCC',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
  },
});

export default HomeScreen;
