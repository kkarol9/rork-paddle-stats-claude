import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMatchStore } from '@/stores/matchStore';
import { colors } from '@/constants/colors';
import ScoreDisplay from '@/components/ScoreDisplay';
import StatisticsCard from '@/components/StatisticsCard';
import { Download, MapPin, Trophy, ArrowLeft } from 'lucide-react-native';
import { generateMatchCSV, downloadCSV } from '@/utils/csvExport';

export default function MatchStatistics() {
  const router = useRouter();
  const { matchId } = useLocalSearchParams();
  const { matches, currentMatch } = useMatchStore();
  
  const match = matchId 
    ? matches.find(m => m.id === matchId) || currentMatch
    : currentMatch;
  
  if (!match) {
    router.replace('/');
    return null;
  }
  
  const team1Name = match.teams[0].players.map(p => p.name.split(' ')[0]).join('/');
  const team2Name = match.teams[1].players.map(p => p.name.split(' ')[0]).join('/');
  
  const matchTitle = `${team1Name} vs ${team2Name}`;
  
  const handleDownloadCSV = () => {
    try {
      const csvContent = generateMatchCSV(match);
      const filename = `paddle_match_${match.date}_${team1Name}_vs_${team2Name}.csv`;
      downloadCSV(csvContent, filename);
      
      Alert.alert(
        'CSV Export',
        'Match data has been exported successfully!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Export Error',
        'Failed to export match data. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };
  
  const handleBackToDashboard = () => {
    router.push('/');
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Match Statistics',
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackToDashboard} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>{matchTitle}</Text>
            <View style={styles.matchMetadata}>
              <View style={styles.metadataItem}>
                <MapPin size={16} color={colors.textLight} />
                <Text style={styles.metadataText}>{match.location}</Text>
              </View>
              <View style={styles.metadataItem}>
                <Trophy size={16} color={colors.textLight} />
                <Text style={styles.metadataText}>{match.round}</Text>
              </View>
            </View>
            <Text style={styles.date}>
              {new Date(match.date).toLocaleDateString()}
            </Text>
          </View>
          
          <ScoreDisplay score={match.score} teams={match.teams} />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Team 1 Statistics</Text>
            {match.teams[0].players.map((player) => (
              <StatisticsCard key={player.id} match={match} player={player} />
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Team 2 Statistics</Text>
            {match.teams[1].players.map((player) => (
              <StatisticsCard key={player.id} match={match} player={player} />
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Match Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Points:</Text>
                <Text style={styles.summaryValue}>{match.events.length}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Winners:</Text>
                <Text style={styles.summaryValue}>
                  {match.events.filter(e => e.eventType === 'winner').length}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Unforced Errors:</Text>
                <Text style={styles.summaryValue}>
                  {match.events.filter(e => e.eventType === 'unforced_error').length}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Forced Errors:</Text>
                <Text style={styles.summaryValue}>
                  {match.events.filter(e => e.eventType === 'forced_error').length}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Events with Descriptions:</Text>
                <Text style={styles.summaryValue}>
                  {match.events.filter(e => e.description && e.description.trim().length > 0).length}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Winner:</Text>
                <Text style={[styles.summaryValue, styles.winnerText]}>
                  {match.winner !== undefined ? (match.winner === 0 ? team1Name : team2Name) : 'Match not completed'}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.exportSection}>
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={handleDownloadCSV}
            >
              <Download size={20} color="white" />
              <Text style={styles.downloadButtonText}>Download Match Data (CSV)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  matchMetadata: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 4,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metadataText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
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
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.text,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  winnerText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  exportSection: {
    padding: 16,
    paddingBottom: 32,
  },
  downloadButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});