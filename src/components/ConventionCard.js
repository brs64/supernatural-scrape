import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const ConventionCard = ({ convention }) => {
  const handlePress = () => {
    if (convention.url) {
      Linking.openURL(convention.url);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.headerBar} />

      <View style={styles.content}>
        <Text style={styles.title}>{convention.name}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.location}>{convention.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.date}>{convention.date}</Text>
        </View>

        {convention.guests && convention.guests.length > 0 && (
          <View style={styles.guestsContainer}>
            <Text style={styles.guestsLabel}>Invités confirmés:</Text>
            {convention.guests.map((guest, index) => (
              <Text key={index} style={styles.guest}>• {guest}</Text>
            ))}
          </View>
        )}

        {convention.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>🔥 NOUVEAU</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#FF6600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  headerBar: {
    height: 6,
    backgroundColor: '#8B0000',
    background: 'linear-gradient(90deg, #8B0000, #FF6600)',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6600',
    marginBottom: 12,
    textShadowColor: '#8B0000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  location: {
    fontSize: 16,
    color: '#CCCCCC',
    flex: 1,
  },
  date: {
    fontSize: 16,
    color: '#CCCCCC',
    flex: 1,
  },
  guestsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  guestsLabel: {
    fontSize: 14,
    color: '#FF6600',
    fontWeight: '600',
    marginBottom: 6,
  },
  guest: {
    fontSize: 14,
    color: '#AAAAAA',
    marginLeft: 8,
    marginBottom: 4,
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#8B0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF6600',
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ConventionCard;
