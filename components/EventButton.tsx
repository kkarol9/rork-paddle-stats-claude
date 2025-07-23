import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { EventType } from '@/types';
import { eventTypes } from '@/constants/shotTypes';
import { colors } from '@/constants/colors';

type EventButtonProps = {
  eventType: EventType;
  onPress: () => void;
};

export default function EventButton({ eventType, onPress }: EventButtonProps) {
  const eventInfo = eventTypes.find(e => e.id === eventType);
  
  if (!eventInfo) return null;
  
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: eventInfo.color }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{eventInfo.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    minHeight: 60,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
  },
});