import { Score, ScoringSystem, ThirdSetFormat } from '@/types';

// Tennis scoring system: 0, 15, 30, 40, Game
const pointsSequence = ['0', '15', '30', '40'];

export function updateScore(score: Score, teamIndex: 0 | 1, scoringSystem: ScoringSystem = 'no-ad', thirdSetFormat: ThirdSetFormat = 'regular'): Score {
  const newScore = { ...score };
  
  // Handle tiebreak scoring
  if (newScore.tiebreak) {
    const tiebreakPoints = [...newScore.tiebreak.points] as [number, number];
    tiebreakPoints[teamIndex]++;
    
    // Check if tiebreak is won
    const pointsNeeded = newScore.tiebreak.isFinalTiebreak ? 10 : 7;
    const otherTeam = teamIndex === 0 ? 1 : 0;
    
    if (tiebreakPoints[teamIndex] >= pointsNeeded && 
        tiebreakPoints[teamIndex] - tiebreakPoints[otherTeam] >= 2) {
      
      // Tiebreak won
      if (newScore.tiebreak.isFinalTiebreak) {
        // Final tiebreak (3rd set or super tiebreak)
        const sets = [...newScore.sets] as [number, number];
        sets[teamIndex]++;
        newScore.sets = sets;
        newScore.tiebreak = undefined;
      } else {
        // Regular tiebreak (end of set)
        const sets = [...newScore.sets] as [number, number];
        sets[teamIndex]++;
        
        // Reset games for new set
        const games = [0, 0] as [number, number];
        
        // Check if match is over or if we need a final set/tiebreak
        if (sets[0] === 1 && sets[1] === 1) {
          if (thirdSetFormat === 'super-tiebreak') {
            // Super tiebreak needed (to 10 points)
            newScore.tiebreak = {
              points: [0, 0],
              isFinalTiebreak: true
            };
          }
          // If regular format, continue with normal games
        } else {
          newScore.tiebreak = undefined;
        }
        
        newScore.sets = sets;
        newScore.games = games;
      }
    } else {
      // Tiebreak continues
      newScore.tiebreak.points = tiebreakPoints;
    }
    
    return newScore;
  }
  
  // Regular game scoring
  const currentPoints = [...newScore.points] as [string, string];
  
  // Handle deuce situation (40-40)
  if (currentPoints[0] === '40' && currentPoints[1] === '40') {
    if (scoringSystem === 'no-ad') {
      // Golden point - winner gets the game
      const games = [...newScore.games] as [number, number];
      games[teamIndex]++;
      
      // Reset points for new game
      currentPoints[0] = '0';
      currentPoints[1] = '0';
      
      newScore.games = games;
      newScore.points = currentPoints;
      
      // Check if set is won or tiebreak needed
      checkSetCompletion(newScore, teamIndex, thirdSetFormat);
    } else {
      // Advantage scoring - winner gets advantage
      const otherTeam = teamIndex === 0 ? 1 : 0;
      currentPoints[teamIndex] = 'Ad';
      currentPoints[otherTeam] = '40';
      newScore.points = currentPoints;
      return newScore;
    }
  } else if (currentPoints[0] === 'Ad' || currentPoints[1] === 'Ad') {
    // Handle advantage situations
    if (currentPoints[teamIndex] === 'Ad') {
      // Team with advantage wins the game
      const games = [...newScore.games] as [number, number];
      games[teamIndex]++;
      
      // Reset points for new game
      currentPoints[0] = '0';
      currentPoints[1] = '0';
      
      newScore.games = games;
      newScore.points = currentPoints;
      
      // Check if set is won or tiebreak needed
      checkSetCompletion(newScore, teamIndex, thirdSetFormat);
    } else {
      // Other team scores, back to deuce
      currentPoints[0] = '40';
      currentPoints[1] = '40';
      newScore.points = currentPoints;
    }
  } else if (currentPoints[teamIndex] === '40') {
    // Game won
    const games = [...newScore.games] as [number, number];
    games[teamIndex]++;
    
    // Reset points for new game
    currentPoints[0] = '0';
    currentPoints[1] = '0';
    
    newScore.games = games;
    newScore.points = currentPoints;
    
    // Check if set is won or tiebreak needed
    checkSetCompletion(newScore, teamIndex, thirdSetFormat);
  } else {
    // Normal point progression
    const currentIndex = pointsSequence.indexOf(currentPoints[teamIndex]);
    if (currentIndex < pointsSequence.length - 1) {
      currentPoints[teamIndex] = pointsSequence[currentIndex + 1];
    }
    newScore.points = currentPoints;
  }
  
  return newScore;
}

function checkSetCompletion(score: Score, teamIndex: 0 | 1, thirdSetFormat: ThirdSetFormat = 'regular') {
  const games = score.games;
  
  if (games[teamIndex] === 7) {
    // Set won with 7-5 or 7-6
    const sets = [...score.sets] as [number, number];
    sets[teamIndex]++;
    
    // Reset games for new set
    score.games = [0, 0];
    
    // Check if match is over or if we need a final set/tiebreak
    if (sets[0] === 1 && sets[1] === 1) {
      if (thirdSetFormat === 'super-tiebreak') {
        // Super tiebreak needed (to 10 points)
        score.tiebreak = {
          points: [0, 0],
          isFinalTiebreak: true
        };
      }
      // If regular format, continue with normal games
    }
    
    score.sets = sets;
  } else if (games[teamIndex] === 6 && games[1 - teamIndex] <= 4) {
    // Set won with 6-4 or better
    const sets = [...score.sets] as [number, number];
    sets[teamIndex]++;
    
    // Reset games for new set
    score.games = [0, 0];
    
    // Check if match is over or if we need a final set/tiebreak
    if (sets[0] === 1 && sets[1] === 1) {
      if (thirdSetFormat === 'super-tiebreak') {
        // Super tiebreak needed (to 10 points)
        score.tiebreak = {
          points: [0, 0],
          isFinalTiebreak: true
        };
      }
      // If regular format, continue with normal games
    }
    
    score.sets = sets;
  } else if (games[teamIndex] === 6 && games[1 - teamIndex] === 6) {
    // Tiebreak needed at 6-6
    score.tiebreak = {
      points: [0, 0],
      isFinalTiebreak: false
    };
  }
}

export function isMatchCompleted(score: Score): boolean {
  // Match is completed when one team has 2 sets
  // or when the final tiebreak is completed
  return score.sets[0] === 2 || score.sets[1] === 2;
}

export function getWinner(score: Score): 0 | 1 | undefined {
  if (score.sets[0] === 2) return 0;
  if (score.sets[1] === 2) return 1;
  return undefined;
}

export function getInitialScore(): Score {
  return {
    sets: [0, 0],
    games: [0, 0],
    points: ['0', '0'],
  };
}