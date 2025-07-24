import { Match } from '@/types';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export function generateMatchCSV(match: Match): string {
  const headers = [
    'Timestamp',
    'Date',
    'Time',
    'Player',
    'Team',
    'Event Type',
    'Shot Type',
    'Shot Specification',
    'Description',
    'Score Sets',
    'Score Games',
    'Score Points'
  ];

  const rows = match.events.map(event => {
    const eventDate = new Date(event.timestamp);
    const player = [...match.teams[0].players, ...match.teams[1].players]
      .find(p => p.id === event.playerId);
    
    const team0HasPlayer = match.teams[0].players.some(p => p.id === event.playerId);
    const teamName = team0HasPlayer 
      ? match.teams[0].players.map(p => p.name.split(' ')[0]).join('/')
      : match.teams[1].players.map(p => p.name.split(' ')[0]).join('/');

    return [
      event.timestamp.toString(),
      eventDate.toLocaleDateString(),
      eventDate.toLocaleTimeString(),
      player?.name || 'Unknown',
      teamName,
      event.eventType.replace('_', ' '),
      event.shotType,
      event.shotSpecification,
      event.description || '',
      `${match.score.sets[0]}-${match.score.sets[1]}`,
      `${match.score.games[0]}-${match.score.games[1]}`,
      match.score.tiebreak 
        ? `${match.score.tiebreak.points[0]}-${match.score.tiebreak.points[1]}`
        : `${match.score.points[0]}-${match.score.points[1]}`
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return csvContent;
}

export async function downloadCSV(csvContent: string, filename: string): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } else {
      // For mobile platforms, save to device and share
      const fileUri = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Save CSV file',
        });
        return true;
      } else {
        console.log('Sharing is not available on this platform');
        return false;
      }
    }
  } catch (error) {
    console.error('Error downloading CSV:', error);
    return false;
  }
}