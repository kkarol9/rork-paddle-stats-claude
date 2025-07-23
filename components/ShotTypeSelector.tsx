import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ShotType, ShotSpecification } from '@/types';
import { shotTypes, shotSpecifications } from '@/constants/shotTypes';
import { colors } from '@/constants/colors';

type ShotTypeSelectorProps = {
  onSelectComplete: (shotType: ShotType, shotSpecification: ShotSpecification) => void;
  onBack: () => void;
  title: string;
};

export default function ShotTypeSelector({ onSelectComplete, onBack, title }: ShotTypeSelectorProps) {
  const [selectedShotType, setSelectedShotType] = useState<ShotType | null>(null);
  
  const handleShotTypeSelect = (shotType: ShotType) => {
    setSelectedShotType(shotType);
  };
  
  const handleSpecificationSelect = (specification: ShotSpecification) => {
    if (selectedShotType) {
      onSelectComplete(selectedShotType, specification);
    }
  };
  
  // If no shot type is selected yet, show the shot type selection
  if (!selectedShotType) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backButtonText}>← Back to player selection</Text>
        </TouchableOpacity>
        
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.shotTypeGrid}>
            {shotTypes.map((shot) => (
              <TouchableOpacity
                key={shot.id}
                style={styles.shotTypeButton}
                onPress={() => handleShotTypeSelect(shot.id as ShotType)}
              >
                <Text style={styles.shotTypeName}>{shot.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
  
  // If shot type is selected, show the specification selection
  const specifications = selectedShotType === 'smash' 
    ? shotSpecifications.smash 
    : selectedShotType === 'other'
    ? shotSpecifications.other
    : shotSpecifications.default;
  
  const getSpecificationTitle = () => {
    if (selectedShotType === 'smash') return 'What type of smash?';
    if (selectedShotType === 'other') return 'What type of other shot?';
    return 'Forehand or Backhand?';
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getSpecificationTitle()}</Text>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setSelectedShotType(null)}
      >
        <Text style={styles.backButtonText}>← Back to shot types</Text>
      </TouchableOpacity>
      
      <View style={styles.shotTypeList}>
        {specifications.map((spec) => (
          <TouchableOpacity
            key={spec.id}
            style={styles.shotTypeButton}
            onPress={() => handleSpecificationSelect(spec.id as ShotSpecification)}
          >
            <Text style={styles.shotTypeName}>{spec.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    maxHeight: '90%',
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
  scrollContainer: {
    maxHeight: 400,
  },
  shotTypeGrid: {
    gap: 12,
  },
  shotTypeList: {
    gap: 12,
  },
  shotTypeButton: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    minHeight: 56,
    justifyContent: 'center',
  },
  shotTypeName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
});