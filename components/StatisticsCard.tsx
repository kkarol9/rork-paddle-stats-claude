import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Match, Player, EventType, ShotType, ShotSpecification } from '@/types';
import { colors } from '@/constants/colors';

type StatisticsCardProps = {
  match: Match;
  player: Player;
};

type ShotBreakdown = {
  [key in ShotType]?: {
    [key in ShotSpecification]?: number;
  };
};

export default function StatisticsCard({ match, player }: StatisticsCardProps) {
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
  
  // Create shot breakdowns for each event type
  const winnerBreakdown = createShotBreakdown(winnerEvents);
  const unforcedErrorBreakdown = createShotBreakdown(unforcedErrorEvents);
  const forcedErrorBreakdown = createShotBreakdown(forcedErrorEvents);
  
  // Calculate total shots
  const totalShots = playerEvents.length;
  
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
      
      <ScrollView style={styles.breakdownContainer}>
        {winners > 0 && (
          <View style={styles.breakdownSection}>
            <Text style={styles.breakdownTitle}>Winners Breakdown</Text>
            {renderShotBreakdown(winnerBreakdown)}
          </View>
        )}
        
        {unforcedErrors > 0 && (
          <View style={styles.breakdownSection}>
            <Text style={styles.breakdownTitle}>Unforced Errors Breakdown</Text>
            {renderShotBreakdown(unforcedErrorBreakdown)}
          </View>
        )}
        
        {forcedErrors > 0 && (
          <View style={styles.breakdownSection}>
            <Text style={styles.breakdownTitle}>Forced Errors Breakdown</Text>
            {renderShotBreakdown(forcedErrorBreakdown)}
          </View>
        )}
      </ScrollView>
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Shots:</Text>
        <Text style={styles.totalValue}>{totalShots}</Text>
      </View>
    </View>
  );
}

function createShotBreakdown(events: any[]): ShotBreakdown {
  const breakdown: ShotBreakdown = {};
  
  events.forEach(event => {
    const { shotType, shotSpecification } = event;
    
    if (!breakdown[shotType]) {
      breakdown[shotType] = {};
    }
    
    if (!breakdown[shotType]![shotSpecification]) {
      breakdown[shotType]![shotSpecification] = 0;
    }
    
    breakdown[shotType]![shotSpecification]! += 1;
  });
  
  return breakdown;
}

function renderShotBreakdown(breakdown: ShotBreakdown) {
  return Object.entries(breakdown).map(([shotType, specifications]) => (
    <View key={shotType} style={styles.shotTypeBreakdown}>
      <Text style={styles.shotTypeLabel}>{formatShotType(shotType as ShotType)}</Text>
      
      {Object.entries(specifications).map(([spec, count]) => (
        <View key={spec} style={styles.specificationRow}>
          <Text style={styles.specificationLabel}>{formatSpecification(spec as ShotSpecification)}</Text>
          <Text style={styles.specificationCount}>{count}</Text>
        </View>
      ))}
    </View>
  ));
}

function formatShotType(shotType: ShotType): string {
  return shotType.charAt(0).toUpperCase() + shotType.slice(1);
}

function formatSpecification(spec: ShotSpecification): string {
  return spec.charAt(0).toUpperCase() + spec.slice(1);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  breakdownContainer: {
    maxHeight: 200,
    marginTop: 8,
  },
  breakdownSection: {
    marginBottom: 12,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 4,
  },
  shotTypeBreakdown: {
    marginBottom: 8,
  },
  shotTypeLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 4,
  },
  specificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 12,
    marginBottom: 2,
  },
  specificationLabel: {
    fontSize: 12,
    color: colors.text,
  },
  specificationCount: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: 8,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
});