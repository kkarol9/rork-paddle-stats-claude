import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useMatchStore } from '@/stores/matchStore';
import { colors } from '@/constants/colors';
import { Player, Team, ScoringSystem, ThirdSetFormat, StatisticsType } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserRound, Users, MapPin, Trophy, AlertCircle, Target, Zap, BarChart3 } from 'lucide-react-native';

export default function NewMatch() {
  const router = useRouter();
  const { createMatch, currentMatch } = useMatchStore();
  
  const [team1Player1, setTeam1Player1] = useState('');
  const [team1Player2, setTeam1Player2] = useState('');
  const [team2Player1, setTeam2Player1] = useState('');
  const [team2Player2, setTeam2Player2] = useState('');
  const [location, setLocation] = useState('');
  const [round, setRound] = useState('');
  const [scoringSystem, setScoringSystem] = useState<ScoringSystem>('no-ad');
  const [thirdSetFormat, setThirdSetFormat] = useState<ThirdSetFormat>('regular');
  const [statisticsType, setStatisticsType] = useState<StatisticsType>('basic');
  
  // Check if there's an unfinished match
  const hasUnfinishedMatch = currentMatch && !currentMatch.isCompleted;
  
  const handleStartMatch = () => {
    if (hasUnfinishedMatch) {
      Alert.alert(
        'Unfinished Match',
        'You have an unfinished match. Please complete it first before starting a new one.',
        [
          { text: 'OK' },
          { 
            text: 'Go to Match', 
            onPress: () => router.push('/match-tracking')
          }
        ]
      );
      return;
    }
    
    // Validate all players are entered
    if (!team1Player1 || !team1Player2 || !team2Player1 || !team2Player2) {
      Alert.alert('Missing Information', 'Please enter names for all players');
      return;
    }
    
    // Check for duplicate names
    const names = [team1Player1, team1Player2, team2Player1, team2Player2];
    const uniqueNames = new Set(names);
    if (uniqueNames.size !== 4) {
      Alert.alert('Duplicate Names', 'Please use unique names for all players');
      return;
    }
    
    // Create player objects
    const players: Player[] = [
      { id: 'p1', name: team1Player1 },
      { id: 'p2', name: team1Player2 },
      { id: 'p3', name: team2Player1 },
      { id: 'p4', name: team2Player2 },
    ];
    
    // Create team objects
    const teams: [Team, Team] = [
      { id: 't1', players: [players[0], players[1]] },
      { id: 't2', players: [players[2], players[3]] },
    ];
    
    // Create the match
    createMatch(teams, location || 'Unknown Location', round || 'Friendly Match', scoringSystem, thirdSetFormat, statisticsType);
    
    // Navigate to match tracking
    router.push('/match-tracking');
  };
  
  if (hasUnfinishedMatch) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.unfinishedMatchContainer}>
          <AlertCircle size={64} color={colors.warning} />
          <Text style={styles.unfinishedTitle}>Unfinished Match</Text>
          <Text style={styles.unfinishedMessage}>
            You have an unfinished match in progress. Please complete it before starting a new one.
          </Text>
          
          <View style={styles.matchInfo}>
            <Text style={styles.matchTeams}>
              {currentMatch.teams[0].players.map(p => p.name.split(' ')[0]).join('/')} vs {currentMatch.teams[1].players.map(p => p.name.split(' ')[0]).join('/')}
            </Text>
            <Text style={styles.matchDetails}>
              {currentMatch.location} • {currentMatch.round}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.push('/match-tracking')}
          >
            <Text style={styles.continueButtonText}>Continue Match</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>New Match</Text>
            <Text style={styles.subtitle}>Enter match details to start tracking</Text>
          </View>
          
          <View style={styles.matchDetailsSection}>
            <Text style={styles.sectionTitle}>Match Details</Text>
            
            <View style={styles.inputContainer}>
              <MapPin size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Location (e.g. Club Name)"
                value={location}
                onChangeText={setLocation}
                placeholderTextColor={colors.textLight}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Trophy size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Round (e.g. Finals, Semifinals)"
                value={round}
                onChangeText={setRound}
                placeholderTextColor={colors.textLight}
              />
            </View>
            
            <View style={styles.scoringSystemContainer}>
              <View style={styles.scoringSystemHeader}>
                <Target size={20} color={colors.textLight} />
                <Text style={styles.scoringSystemTitle}>Scoring System</Text>
              </View>
              
              <View style={styles.scoringOptions}>
                <TouchableOpacity 
                  style={[
                    styles.scoringOption,
                    scoringSystem === 'no-ad' && styles.scoringOptionSelected
                  ]}
                  onPress={() => setScoringSystem('no-ad')}
                >
                  <Text style={[
                    styles.scoringOptionText,
                    scoringSystem === 'no-ad' && styles.scoringOptionTextSelected
                  ]}>No-Ad Scoring</Text>
                  <Text style={styles.scoringOptionDescription}>Golden Point</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.scoringOption,
                    scoringSystem === 'ad' && styles.scoringOptionSelected
                  ]}
                  onPress={() => setScoringSystem('ad')}
                >
                  <Text style={[
                    styles.scoringOptionText,
                    scoringSystem === 'ad' && styles.scoringOptionTextSelected
                  ]}>Ad Scoring</Text>
                  <Text style={styles.scoringOptionDescription}>With Advantage</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.thirdSetContainer}>
              <View style={styles.thirdSetHeader}>
                <Zap size={20} color={colors.textLight} />
                <Text style={styles.thirdSetTitle}>Third Set Format</Text>
              </View>
              
              <View style={styles.thirdSetOptions}>
                <TouchableOpacity 
                  style={[
                    styles.thirdSetOption,
                    thirdSetFormat === 'regular' && styles.thirdSetOptionSelected
                  ]}
                  onPress={() => setThirdSetFormat('regular')}
                >
                  <Text style={[
                    styles.thirdSetOptionText,
                    thirdSetFormat === 'regular' && styles.thirdSetOptionTextSelected
                  ]}>Regular Set</Text>
                  <Text style={styles.thirdSetOptionDescription}>Normal games to 6</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.thirdSetOption,
                    thirdSetFormat === 'super-tiebreak' && styles.thirdSetOptionSelected
                  ]}
                  onPress={() => setThirdSetFormat('super-tiebreak')}
                >
                  <Text style={[
                    styles.thirdSetOptionText,
                    thirdSetFormat === 'super-tiebreak' && styles.thirdSetOptionTextSelected
                  ]}>Super Tiebreak</Text>
                  <Text style={styles.thirdSetOptionDescription}>First to 10 points</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.statisticsContainer}>
              <View style={styles.statisticsHeader}>
                <BarChart3 size={20} color={colors.textLight} />
                <Text style={styles.statisticsTitle}>Statistics</Text>
              </View>
              
              <View style={styles.statisticsOptions}>
                <TouchableOpacity 
                  style={[
                    styles.statisticsOption,
                    statisticsType === 'basic' && styles.statisticsOptionSelected
                  ]}
                  onPress={() => setStatisticsType('basic')}
                >
                  <Text style={[
                    styles.statisticsOptionText,
                    statisticsType === 'basic' && styles.statisticsOptionTextSelected
                  ]}>Basic</Text>
                  <Text style={styles.statisticsOptionDescription}>Simple tracking</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.statisticsOption,
                    statisticsType === 'advanced' && styles.statisticsOptionSelected
                  ]}
                  onPress={() => setStatisticsType('advanced')}
                >
                  <Text style={[
                    styles.statisticsOptionText,
                    statisticsType === 'advanced' && styles.statisticsOptionTextSelected
                  ]}>Advanced</Text>
                  <Text style={styles.statisticsOptionDescription}>With rally description</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.teamSection}>
            <View style={styles.teamHeader}>
              <Users size={20} color={colors.primary} />
              <Text style={styles.teamTitle}>Team 1</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <UserRound size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Player 1 Name"
                value={team1Player1}
                onChangeText={setTeam1Player1}
                placeholderTextColor={colors.textLight}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <UserRound size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Player 2 Name"
                value={team1Player2}
                onChangeText={setTeam1Player2}
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>
          
          <View style={styles.teamSection}>
            <View style={styles.teamHeader}>
              <Users size={20} color={colors.secondary} />
              <Text style={styles.teamTitle}>Team 2</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <UserRound size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Player 1 Name"
                value={team2Player1}
                onChangeText={setTeam2Player1}
                placeholderTextColor={colors.textLight}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <UserRound size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Player 2 Name"
                value={team2Player2}
                onChangeText={setTeam2Player2}
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartMatch}
          >
            <Text style={styles.startButtonText}>Start Match</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
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
  unfinishedMatchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  unfinishedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  unfinishedMessage: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  matchInfo: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  matchTeams: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  matchDetails: {
    fontSize: 14,
    color: colors.textLight,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 32,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  matchDetailsSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  teamSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    color: colors.text,
    fontSize: 16,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoringSystemContainer: {
    marginTop: 8,
  },
  scoringSystemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoringSystemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  scoringOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  scoringOption: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  scoringOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  scoringOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  scoringOptionTextSelected: {
    color: colors.primary,
  },
  scoringOptionDescription: {
    fontSize: 12,
    color: colors.textLight,
  },
  thirdSetContainer: {
    marginTop: 16,
  },
  thirdSetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  thirdSetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  thirdSetOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  thirdSetOption: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thirdSetOptionSelected: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondary + '10',
  },
  thirdSetOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  thirdSetOptionTextSelected: {
    color: colors.secondary,
  },
  thirdSetOptionDescription: {
    fontSize: 12,
    color: colors.textLight,
  },
  statisticsContainer: {
    marginTop: 16,
  },
  statisticsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statisticsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  statisticsOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  statisticsOption: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statisticsOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  statisticsOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  statisticsOptionTextSelected: {
    color: colors.primary,
  },
  statisticsOptionDescription: {
    fontSize: 12,
    color: colors.textLight,
  },
});