import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useMatchStore } from '@/stores/matchStore';
import { colors } from '@/constants/colors';
import { Score } from '@/types';
import { PlusCircle, Play, BarChart2, MapPin } from 'lucide-react-native';

export default function Dashboard() {
  const router = useRouter();
  const { currentMatch, matches } = useMatchStore();
  
  const recentMatches = matches.slice(0, 3);
  
  const formatScore = (score: Score): string => {
    if (score.tiebreak) {
      return `${score.sets[0]}-${score.sets[1]} | ${score.games[0]}-${score.games[1]} | ${score.tiebreak.points[0]}-${score.tiebreak.points[1]}`;
    } else {
      return `${score.sets[0]}-${score.sets[1]} | ${score.games[0]}-${score.games[1]} | ${score.points[0]}-${score.points[1]}`;
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Paddle Match Stats</Text>
        <Text style={styles.subtitle}>Track your paddle tennis statistics</Text>
      </View>
      
      {currentMatch && !currentMatch.isCompleted ? (
        <View style={styles.currentMatchCard}>
          <Text style={styles.cardTitle}>Current Match</Text>
          <Text style={styles.matchInfo}>
            {currentMatch.teams[0].players.map(p => p.name.split(' ')[0]).join('/')} vs {currentMatch.teams[1].players.map(p => p.name.split(' ')[0]).join('/')}
          </Text>
          
          <View style={styles.matchDetails}>
            <MapPin size={14} color={colors.textLight} />
            <Text style={styles.matchLocation}>{currentMatch.location}</Text>
            <Text style={styles.matchRound}>{currentMatch.round}</Text>
          </View>
          
          <View style={styles.scorePreview}>
            <Text style={styles.scoreText}>
              {formatScore(currentMatch.score)}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.push('/match-tracking')}
          >
            <Play size={20} color="white" />
            <Text style={styles.buttonText}>Continue Match</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.newMatchButton}
          onPress={() => router.push('/new-match')}
        >
          <PlusCircle size={24} color="white" />
          <Text style={styles.newMatchText}>Start New Match</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Matches</Text>
        
        {recentMatches.length > 0 ? (
          recentMatches.map((match) => (
            <TouchableOpacity 
              key={match.id} 
              style={styles.matchItem}
              onPress={() => router.push({
                pathname: '/match-statistics',
                params: { matchId: match.id }
              })}
            >
              <View>
                <Text style={styles.matchTeams}>
                  {match.teams[0].players.map(p => p.name.split(' ')[0]).join('/')} vs {match.teams[1].players.map(p => p.name.split(' ')[0]).join('/')}
                </Text>
                <View style={styles.matchDetails}>
                  <MapPin size={14} color={colors.textLight} />
                  <Text style={styles.matchLocation}>{match.location}</Text>
                  <Text style={styles.matchDate}>
                    {new Date(match.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.matchScore}>
                <Text style={styles.scoreText}>
                  {match.score.sets[0]}-{match.score.sets[1]}
                </Text>
                <BarChart2 size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No match history yet</Text>
          </View>
        )}
        
        {matches.length > 3 && (
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/history')}
          >
            <Text style={styles.viewAllText}>View All Matches</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 4,
  },
  currentMatchCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  matchInfo: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  matchDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchLocation: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
    marginRight: 8,
  },
  matchRound: {
    fontSize: 14,
    color: colors.textLight,
  },
  matchDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  scorePreview: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  newMatchButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  newMatchText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  matchItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  matchTeams: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  matchScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
  },
  viewAllButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
});