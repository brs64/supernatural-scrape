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
      activeOpacity={0.7}
    >
      <Text style={styles.title}>{convention.name}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Lieu</Text>
        <Text style={styles.value}>{convention.location}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{convention.date}</Text>
      </View>

      {convention.guests && convention.guests.length > 0 && (
        <View style={styles.guestsContainer}>
          <Text style={styles.label}>Invités</Text>
          <Text style={styles.guests}>{convention.guests.join(', ')}</Text>
        </View>
      )}

      <Text style={styles.source}>Source: {convention.source}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 16,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 13,
    color: '#888',
    width: 60,
    marginRight: 8,
  },
  value: {
    fontSize: 14,
    color: '#CCC',
    flex: 1,
  },
  guestsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  guests: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 4,
  },
  source: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default ConventionCard;
