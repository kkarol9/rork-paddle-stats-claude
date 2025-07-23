import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useMatchStore } from '@/stores/matchStore';
import { colors } from '@/constants/colors';
import { Match, Player } from '@/types';
import { BarChart2, MapPin, Settings } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MatchHistory() {
  const router = useRouter();
  const { matches } = useMatchStore();
  
  const renderMatchItem = ({ item: match }: { item: Match }) => (
    <TouchableOpacity 
      style={styles.matchItem}
      onPress={() => router.push({
        pathname: '/match-statistics',
        params: { matchId: match.id }
      })}
    >
      <View>
        <Text style={styles.matchTeams}>
          {match.teams[0].players.map((p: Player) => p.name.split(' ')[0]).join('/')} vs {match.teams[1].players.map((p: Player) => p.name.split(' ')[0]).join('/')}
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
        <Text style={[
          styles.scoreText, 
          match.winner === 0 ? styles.team1Winner : 
          match.winner === 1 ? styles.team2Winner : {}
        ]}>
          {match.score.sets[0]}-{match.score.sets[1]}
        </Text>
        <BarChart2 size={16} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Match History</Text>
            <Text style={styles.subtitle}>View your past matches</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Settings size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      {matches.length > 0 ? (
        <FlatList
          data={matches}
          renderItem={renderMatchItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Matches Yet</Text>
          <Text style={styles.emptyText}>
            Start a new match to begin tracking your statistics
          </Text>
          <TouchableOpacity 
            style={styles.newMatchButton}
            onPress={() => router.push('/new-match')}
          >
            <Text style={styles.newMatchText}>Create New Match</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  listContent: {
    padding: 16,
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
  matchDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchLocation: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
    marginRight: 8,
  },
  matchDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  matchScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  team1Winner: {
    color: colors.primary,
  },
  team2Winner: {
    color: colors.secondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  newMatchButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    paddingHorizontal: 24,
  },
  newMatchText: {
    color: 'white',
    fontWeight: 'bold',
  },
});