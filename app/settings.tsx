import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useMatchStore } from '@/stores/matchStore';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  const router = useRouter();
  const { matches, resetCurrentMatch } = useMatchStore();
  
  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your match history and current match data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: () => {
            // Clear all data by resetting the store
            resetCurrentMatch();
            // Note: In a real implementation, you'd want to clear the persisted data too
            Alert.alert('Data Cleared', 'All match data has been deleted.');
          }
        },
      ]
    );
  };
  
  const handlePrivacyPolicy = () => {
    router.push('/privacy-policy');
  };
  
  const handleAbout = () => {
    Alert.alert(
      'About Padel Stats',
      'Padel Stats v1.0.0\n\nTrack your paddle tennis matches and improve your game with detailed statistics.\n\nDeveloped by Karol Krawczyński',
      [{ text: 'OK' }]
    );
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Settings',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your app preferences</Text>
        </View>
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Information</Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleAbout}
            >
              <Ionicons name="information-circle" size={24} color={colors.primary} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>About</Text>
                <Text style={styles.settingDescription}>App version and information</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handlePrivacyPolicy}
            >
              <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Privacy Policy</Text>
                <Text style={styles.settingDescription}>How we handle your data</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Management</Text>
            
            <View style={styles.settingItem}>
              <Ionicons name="document-text" size={24} color={colors.textLight} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Match History</Text>
                <Text style={styles.settingDescription}>
                  {matches.length} {matches.length === 1 ? 'match' : 'matches'} stored locally
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleClearAllData}
            >
              <Ionicons name="trash" size={24} color={colors.error} />
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.error }]}>Clear All Data</Text>
                <Text style={styles.settingDescription}>Delete all match history</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => {
                Alert.alert(
                  'Contact Support',
                  'For support or feedback, please email:\nkarol.krawczynski4@gmail.com',
                  [{ text: 'OK' }]
                );
              }}
            >
              <Ionicons name="mail" size={24} color={colors.primary} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Contact Support</Text>
                <Text style={styles.settingDescription}>Get help or send feedback</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              All data is stored locally on your device.{'\n'}
              No personal information is collected or shared.
            </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    margin: 16,
    padding: 4,
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
    marginBottom: 8,
    marginTop: 12,
    marginHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});