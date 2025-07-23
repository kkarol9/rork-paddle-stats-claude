import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Score, Team } from '@/types';
import { colors } from '@/constants/colors';

type ScoreDisplayProps = {
  score: Score;
  teams: [Team, Team];
};

export default function ScoreDisplay({ score, teams }: ScoreDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.scoreHeader}>
        <Text style={styles.headerText}>Sets</Text>
        <Text style={styles.headerText}>Games</Text>
        <Text style={styles.headerText}>Points</Text>
      </View>
      
      <View style={styles.teamScoreRow}>
        <View style={styles.teamNameContainer}>
          <Text style={styles.teamName} numberOfLines={1} ellipsizeMode="tail">
            {teams[0].players.map(p => p.name.split(' ')[0]).join('/')}
          </Text>
        </View>
        <Text style={styles.scoreValue}>{score.sets[0]}</Text>
        <Text style={styles.scoreValue}>{score.games[0]}</Text>
        <Text style={styles.scoreValue}>
          {score.tiebreak ? score.tiebreak.points[0] : score.points[0]}
        </Text>
      </View>
      
      <View style={styles.teamScoreRow}>
        <View style={styles.teamNameContainer}>
          <Text style={styles.teamName} numberOfLines={1} ellipsizeMode="tail">
            {teams[1].players.map(p => p.name.split(' ')[0]).join('/')}
          </Text>
        </View>
        <Text style={styles.scoreValue}>{score.sets[1]}</Text>
        <Text style={styles.scoreValue}>{score.games[1]}</Text>
        <Text style={styles.scoreValue}>
          {score.tiebreak ? score.tiebreak.points[1] : score.points[1]}
        </Text>
      </View>
      
      {score.tiebreak && (
        <View style={styles.tiebreakIndicator}>
          <Text style={styles.tiebreakText}>
            {score.tiebreak.isFinalTiebreak ? 'Final Tiebreak (to 10)' : 'Tiebreak (to 7)'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
    paddingRight: 8,
  },
  headerText: {
    width: 60,
    textAlign: 'center',
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  teamScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  teamNameContainer: {
    flex: 1,
    marginRight: 8,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  scoreValue: {
    width: 60,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  tiebreakIndicator: {
    marginTop: 8,
    padding: 6,
    backgroundColor: colors.primary + '20',
    borderRadius: 6,
    alignItems: 'center',
  },
  tiebreakText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});