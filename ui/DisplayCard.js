import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DisplayCard = ({ title, value }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#3B1A74',
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '48%'
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  value: {
    fontSize: 14,
    color: 'white',
    fontStyle: 'italic'
  },
});

export default DisplayCard;
