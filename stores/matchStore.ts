import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Match, Player, Team, MatchEvent, EventType, ShotType, ShotSpecification } from '@/types';
import { getInitialScore, updateScore, isMatchCompleted, getWinner } from '@/utils/scoreUtils';

interface MatchState {
  currentMatch: Match | null;
  matches: Match[];
  createMatch: (teams: [Team, Team], location: string, round: string) => void;
  addEvent: (playerId: string, eventType: EventType, shotType: ShotType, shotSpecification: ShotSpecification, description?: string) => void;
  undoLastEvent: () => void;
  updateMatchScore: (teamIndex: 0 | 1) => void;
  completeMatch: () => void;
  resetCurrentMatch: () => void;
}

export const useMatchStore = create<MatchState>()(
  persist(
    (set, get) => ({
      currentMatch: null,
      matches: [],
      
      createMatch: (teams: [Team, Team], location: string, round: string) => {
        const newMatch: Match = {
          id: Date.now().toString(),
          date: Date.now(),
          location,
          round,
          teams,
          events: [],
          score: getInitialScore(),
          isCompleted: false,
        };
        
        set({ currentMatch: newMatch });
      },
      
      addEvent: (playerId: string, eventType: EventType, shotType: ShotType, shotSpecification: ShotSpecification, description?: string) => {
        const { currentMatch } = get();
        if (!currentMatch) return;
        
        const newEvent: MatchEvent = {
          id: Date.now().toString(),
          playerId,
          eventType,
          shotType,
          shotSpecification,
          description,
          timestamp: Date.now(),
        };
        
        // Find which team scored based on the event type
        let scoringTeamIndex: 0 | 1 | null = null;
        
        // Find which team the player belongs to
        const team0HasPlayer = currentMatch.teams[0].players.some(p => p.id === playerId);
        const playerTeamIndex = team0HasPlayer ? 0 : 1;
        const opposingTeamIndex = playerTeamIndex === 0 ? 1 : 0;
        
        // Determine which team scores a point based on event type
        if (eventType === 'winner') {
          // Player who hit the winner scores
          scoringTeamIndex = playerTeamIndex;
        } else if (eventType === 'unforced_error' || eventType === 'forced_error') {
          // Opposing team scores when a player makes an error
          scoringTeamIndex = opposingTeamIndex;
        }
        
        set(state => ({
          currentMatch: {
            ...state.currentMatch!,
            events: [...state.currentMatch!.events, newEvent],
            score: scoringTeamIndex !== null 
              ? updateScore(state.currentMatch!.score, scoringTeamIndex)
              : state.currentMatch!.score,
          }
        }));
        
        // Check if match is completed after updating score
        const updatedMatch = get().currentMatch;
        if (updatedMatch && isMatchCompleted(updatedMatch.score)) {
          get().completeMatch();
        }
      },

      undoLastEvent: () => {
        const { currentMatch } = get();
        if (!currentMatch || currentMatch.events.length === 0) return;

        // Remove the last event
        const eventsWithoutLast = currentMatch.events.slice(0, -1);
        
        // Recalculate score from scratch
        let newScore = getInitialScore();
        
        for (const event of eventsWithoutLast) {
          // Find which team scored based on the event type
          let scoringTeamIndex: 0 | 1 | null = null;
          
          // Find which team the player belongs to
          const team0HasPlayer = currentMatch.teams[0].players.some(p => p.id === event.playerId);
          const playerTeamIndex = team0HasPlayer ? 0 : 1;
          const opposingTeamIndex = playerTeamIndex === 0 ? 1 : 0;
          
          // Determine which team scores a point based on event type
          if (event.eventType === 'winner') {
            scoringTeamIndex = playerTeamIndex;
          } else if (event.eventType === 'unforced_error' || event.eventType === 'forced_error') {
            scoringTeamIndex = opposingTeamIndex;
          }
          
          if (scoringTeamIndex !== null) {
            newScore = updateScore(newScore, scoringTeamIndex);
          }
        }

        set(state => ({
          currentMatch: {
            ...state.currentMatch!,
            events: eventsWithoutLast,
            score: newScore,
            isCompleted: false,
            winner: undefined,
          }
        }));
      },
      
      updateMatchScore: (teamIndex: 0 | 1) => {
        const { currentMatch } = get();
        if (!currentMatch) return;
        
        set(state => ({
          currentMatch: {
            ...state.currentMatch!,
            score: updateScore(state.currentMatch!.score, teamIndex),
          }
        }));
        
        // Check if match is completed after updating score
        const updatedMatch = get().currentMatch;
        if (updatedMatch && isMatchCompleted(updatedMatch.score)) {
          get().completeMatch();
        }
      },
      
      completeMatch: () => {
        const { currentMatch } = get();
        if (!currentMatch) return;
        
        const winner = getWinner(currentMatch.score);
        
        const completedMatch: Match = {
          ...currentMatch,
          isCompleted: true,
          winner,
        };
        
        set(state => ({
          currentMatch: completedMatch,
          matches: [completedMatch, ...state.matches],
        }));
      },
      
      resetCurrentMatch: () => {
        set({ currentMatch: null });
      },
    }),
    {
      name: 'paddle-match-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);