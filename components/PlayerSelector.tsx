import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Player, Team } from '@/types';
import { colors } from '@/constants/colors';

type PlayerSelectorProps = {
  teams: [Team, Team];
  onSelectPlayer: (playerId: string) => void;
  onBack: () => void;
  title: string;
};

export default function PlayerSelector({ teams, onSelectPlayer, onBack, title }: PlayerSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
      >
        <Text style={styles.backButtonText}>← Back to event selection</Text>
      </TouchableOpacity>
      
      <View style={styles.teamContainer}>
        <Text style={styles.teamLabel}>Team 1</Text>
        <View style={styles.playerList}>
          {teams[0].players.map((player) => (
            <TouchableOpacity
              key={player.id}
              style={styles.playerButton}
              onPress={() => onSelectPlayer(player.id)}
            >
              <Text style={styles.playerName}>{player.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.teamContainer}>
        <Text style={styles.teamLabel}>Team 2</Text>
        <View style={styles.playerList}>
          {teams[1].players.map((player) => (
            <TouchableOpacity
              key={player.id}
              style={styles.playerButton}
              onPress={() => onSelectPlayer(player.id)}
            >
              <Text style={styles.playerName}>{player.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  backButton: {
    marginBottom: 16,
    padding: 8,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  teamContainer: {
    marginBottom: 16,
  },
  teamLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 8,
  },
  playerList: {
    gap: 8,
  },
  playerButton: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
});