export type Player = {
  id: string;
  name: string;
};

export type Team = {
  id: string;
  players: Player[];
};

export type EventType = 'unforced_error' | 'winner' | 'forced_error';
export type ShotType = 'smash' | 'volley' | 'groundstroke' | 'lob' | 'return' | 'bajada' | 'other';
export type ShotSpecification = 'vibora' | 'smash' | 'forehand' | 'backhand';
export type ScoringSystem = 'no-ad' | 'ad';

export type MatchEvent = {
  id: string;
  playerId: string;
  eventType: EventType;
  shotType: ShotType;
  shotSpecification: ShotSpecification;
  description?: string;
  timestamp: number;
};

export type Score = {
  sets: [number, number];
  games: [number, number];
  points: [string, string];
  tiebreak?: {
    points: [number, number];
    isFinalTiebreak: boolean;
  };
  currentServer?: string;
};

export type Match = {
  id: string;
  date: number;
  location: string;
  round: string;
  teams: [Team, Team];
  events: MatchEvent[];
  score: Score;
  scoringSystem: ScoringSystem;
  isCompleted: boolean;
  winner?: 0 | 1; // Index of winning team
};