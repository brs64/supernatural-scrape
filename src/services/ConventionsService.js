import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// URL du fichier JSON généré par GitHub Actions
// À remplacer par votre URL GitHub après configuration
const CONVENTIONS_URL = 'https://raw.githubusercontent.com/brs64/supernatural-scraper/main/data/conventions.json';

const STORAGE_KEY = '@supernatural_conventions';
const LAST_CHECK_KEY = '@last_check_timestamp';

class ConventionsService {
  /**
   * Récupère les conventions depuis GitHub
   */
  async fetchConventions() {
    try {
      const response = await fetch(CONVENTIONS_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.conventions || [];
    } catch (error) {
      console.error('Erreur lors du fetch des conventions:', error);
      // Retourne les données en cache si disponibles
      return await this.getCachedConventions();
    }
  }

  /**
   * Récupère les conventions en cache
   */
  async getCachedConventions() {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Erreur lecture cache:', error);
      return [];
    }
  }

  /**
   * Sauvegarde les conventions en cache
   */
  async cacheConventions(conventions) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(conventions));
      await AsyncStorage.setItem(LAST_CHECK_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Erreur sauvegarde cache:', error);
    }
  }

  /**
   * Compare les nouvelles conventions avec le cache et retourne les nouvelles
   */
  async getNewConventions(newConventions) {
    const cachedConventions = await this.getCachedConventions();

    if (cachedConventions.length === 0) {
      return []; // Première fois, pas de notification
    }

    const cachedIds = new Set(cachedConventions.map(c => c.id));
    return newConventions.filter(c => !cachedIds.has(c.id));
  }

  /**
   * Envoie une notification pour les nouvelles conventions
   */
  async notifyNewConventions(newConventions) {
    if (newConventions.length === 0) return;

    const hasPermission = await this.requestNotificationPermissions();
    if (!hasPermission) return;

    for (const convention of newConventions) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔥 Nouvelle convention Supernatural !',
          body: `${convention.name} - ${convention.location} (${convention.date})`,
          data: { convention },
          sound: true,
        },
        trigger: null, // Notification immédiate
      });
    }
  }

  /**
   * Demande les permissions pour les notifications
   */
  async requestNotificationPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }

  /**
   * Rafraîchit les conventions et notifie si nouvelles
   */
  async refreshConventions() {
    const newConventions = await this.fetchConventions();
    const additions = await this.getNewConventions(newConventions);

    if (additions.length > 0) {
      await this.notifyNewConventions(additions);
    }

    await this.cacheConventions(newConventions);
    return newConventions;
  }

  /**
   * Récupère le timestamp du dernier check
   */
  async getLastCheckTime() {
    try {
      const timestamp = await AsyncStorage.getItem(LAST_CHECK_KEY);
      return timestamp ? new Date(timestamp) : null;
    } catch (error) {
      return null;
    }
  }
}

export default new ConventionsService();
