import { Match } from '@/types';
import { Platform } from 'react-native';

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

export function downloadCSV(csvContent: string, filename: string) {
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
  } else {
    // For mobile platforms, you would typically use expo-sharing or similar
    console.log('CSV download not implemented for mobile platforms');
    console.log('CSV Content:', csvContent);
  }
}