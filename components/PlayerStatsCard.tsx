import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Match, Player } from '@/types';
import { colors } from '@/constants/colors';

type PlayerStatsCardProps = {
  match: Match;
  player: Player;
};

export default function PlayerStatsCard({ match, player }: PlayerStatsCardProps) {
  // Filter events for this player
  const playerEvents = match.events.filter(event => event.playerId === player.id);
  
  // Group events by type
  const winnerEvents = playerEvents.filter(event => event.eventType === 'winner');
  const unforcedErrorEvents = playerEvents.filter(event => event.eventType === 'unforced_error');
  const forcedErrorEvents = playerEvents.filter(event => event.eventType === 'forced_error');
  
  // Count event types
  const winners = winnerEvents.length;
  const unforcedErrors = unforcedErrorEvents.length;
  const forcedErrors = forcedErrorEvents.length;
  
  return (
    <View style={styles.container}>
      <Text style={styles.playerName}>{player.name}</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{winners}</Text>
          <Text style={styles.statLabel}>Winners</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{unforcedErrors}</Text>
          <Text style={styles.statLabel}>Unforced Errors</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{forcedErrors}</Text>
          <Text style={styles.statLabel}>Forced Errors</Text>
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
    marginHorizontal: 8,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
});