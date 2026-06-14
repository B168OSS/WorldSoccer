import React, { useRef, useEffect, useState } from 'react';
import { useGameStore } from '../store';
import { translate } from '../utils/translate';
import { AudioManager } from '../utils/audio';
import { CountryTeam, ActiveMatch, MatchRound } from '../types';
import { Trophy, Compass, Shield, Zap, RefreshCw, X, Play, Volume2, VolumeX, Flame, Share2 } from 'lucide-react';

// pre-cached image assets using user's specific cloud links
const piJerseyImg = new Image();
piJerseyImg.src = "https://raw.githubusercontent.com/B168OSS/Soccer/35a8130df01c223af495a137f1ca6d3296d113a9/jersey/Jersey-%CF%80-3.png";

const ballImg = new Image();
ballImg.src = "https://raw.githubusercontent.com/B168OSS/Soccer/9f9ab13fd48ca62082c01b723fb21e6323fc9d20/med/Ball_%CF%80.png";

const gkImg = new Image();
gkImg.src = "https://raw.githubusercontent.com/B168OSS/Soccer/cdbd9f1cfd022cbb74d574ef853e41dc5805aac5/kiper/kpryl.png";

const jerseyImgCache = new Map<string, HTMLImageElement>();
const getJerseyImg = (countryId: string) => {
  if (!jerseyImgCache.has(countryId)) {
    const img = new Image();
    if (countryId === 'ID') {
      img.src = "https://raw.githubusercontent.com/B168OSS/Soccer/cdbd9f1cfd022cbb74d574ef853e41dc5805aac5/jersey/INA10.png";
    } else {
      img.src = `https://raw.githubusercontent.com/B168OSS/Soccer/35a8130df01c223af495a137f1ca6d3296d113a9/jersey/${countryId}.png`;
    }
    jerseyImgCache.set(countryId, img);
  }
  return jerseyImgCache.get(countryId)!;
};

interface PenaltyGameProps {
  onClose: () => void;
}

export const PenaltyGame: React.FC<PenaltyGameProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    user,
    selectedUserTeam,
    selectedAiTeam,
    updateUserStats,
    useBooster,
    language,
    settings
  } = useGameStore();

  const [match, setMatch] = useState<ActiveMatch>({
    userTeam: selectedUserTeam!,
    aiTeam: selectedAiTeam!,
    userScore: 0,
    aiScore: 0,
    currentRound: 1,
    rounds: [],
    state: 'PRE_MATCH',
    whistlePlayed: false,
    timer: 10,
    turn: 'KICKER',
    suddenDeath: false,
    activeBoosterUsed: false
  });

  const [swipeStart, setSwipeStart] = useState<{ x: number; y: number } | null>(null);
  const [swipePath, setSwipePath] = useState<{ x: number; y: number }[]>([]);
  const [statusText, setStatusText] = useState<string>('');
  const [whistleTimerText, setWhistleTimerText] = useState<string>('');
  const [muted, setMuted] = useState(AudioManager.getMuted());
  
  // Game loop physical variables
  const ballPos = useRef({ x: 250, y: 400 });
  const ballVel = useRef({ x: 0, y: 0 });
  const ballRadius = 12;
  const keeperPos = useRef({ x: 250, y: 155 });
  const keeperTargetX = useRef(250);
  const keeperVelX = useRef(0);
  const keeperDivState = useRef<'CENTER' | 'LEFT' | 'RIGHT'>('CENTER');
  const animTime = useRef(0);

  // Hair styling for player & goalkeeper (generated randomly once per match)
  const playerHair = useRef({ style: Math.floor(Math.random() * 3), color: ['#FFD700', '#4A3B32', '#A0522D', '#D3D3D3', '#C0C0C0'][Math.floor(Math.random() * 5)] });
  const keeperHair = useRef({ style: Math.floor(Math.random() * 3), color: ['#FFD700', '#4A3B32', '#A0522D', '#D3D3D3', '#C0C0C0'][Math.floor(Math.random() * 5)] });

  useEffect(() => {
    AudioManager.setMuted(muted);
  }, [muted]);

  // Turn preparation and whistle 3s countdown trigger
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (match.state === 'PRE_MATCH') {
      setStatusText(translate('whistleWait', language));
      setWhistleTimerText('3...');
      AudioManager.playClick();
      
      let sec = 3;
      const countdown = setInterval(() => {
        sec -= 1;
        if (sec > 0) {
          setWhistleTimerText(`${sec}...`);
          AudioManager.playClick();
        } else {
          clearInterval(countdown);
          setWhistleTimerText('');
          AudioManager.playWhistle();
          setMatch(prev => ({ ...prev, state: 'KICKING', timer: 10, whistlePlayed: true }));
        }
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [match.currentRound, match.turn]);

  // 10s shot timer loop
  useEffect(() => {
    if (match.state === 'KICKING') {
      const countdown = setInterval(() => {
        setMatch(prev => {
          if (prev.timer <= 1) {
            clearInterval(countdown);
            // Automatic randomized shoot trigger
            const directions: ('LEFT' | 'CENTER' | 'RIGHT' | 'UP')[] = ['LEFT', 'CENTER', 'RIGHT', 'UP'];
            const randomDir = directions[Math.floor(Math.random() * directions.length)];
            triggerKick(randomDir, true);
            return { ...prev, timer: 0 };
          }
          return { ...prev, timer: prev.timer - 1 };
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [match.state, match.currentRound, match.turn]);

  const hasUpdatedStats = useRef(false);

  useEffect(() => {
    if (match.state === 'FINISHED' && !hasUpdatedStats.current) {
      hasUpdatedStats.current = true;
      const userWon = match.userScore > match.aiScore;
      let starsEarned = 0;
      if (userWon) {
        const goalDiff = Math.abs(match.userScore - match.aiScore);
        if (goalDiff >= 3) starsEarned = 3;
        else if (goalDiff === 2) starsEarned = 2;
        else starsEarned = 1;
      }
      updateUserStats(userWon, starsEarned, match.userTeam.id, match.userScore, match.aiScore, match.aiTeam);
      
      if (userWon && settings.audioWins) {
        AudioManager.playClaps();
      }
    }
  }, [match.state, match.userScore, match.aiScore, match.userTeam.id, match.aiTeam, settings.audioWins, updateUserStats]);

  // Render & Physics Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      animTime.current += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Football Field Pitch Background
      drawField(ctx, canvas);

      // 2. Draw Animated Billboards (Games by Te_eR™)
      drawBillboard(ctx, canvas);

      // 3. Draw Faceless Crowd Fans
      drawCrowd(ctx, canvas);

      // 4. Draw Goal Post
      drawGoal(ctx);

      // 5. Physics state updating
      updatePhysics();

      // 6. Draw Player/Shooter (Turn KICKER = User, Turn GOALKEEPER = AI)
      drawPlayer(ctx);

      // 7. Draw Goalkeeper
      drawGoalkeeper(ctx);

      // 8. Draw Footy Ball
      drawBall(ctx);

      // 9. Draw Swipe Overlay
      if (swipePath.length > 1) {
        ctx.strokeStyle = 'rgba(255, 235, 59, 0.7)';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(swipePath[0].x, swipePath[0].y);
        for (let i = 1; i < swipePath.length; i++) {
          ctx.lineTo(swipePath[i].x, swipePath[i].y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [match]);

  const drawField = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Empty per user explicit request to delete redundant pitch background decals (field lines are already in background image!)
  };

  const drawBillboard = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // vertical billboard slogan text drawn behind goal
    ctx.fillStyle = animTime.current % 30 < 15 ? '#FFD700' : '#FFF';
    ctx.font = 'italic bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Games by Te_eR™', canvas.width / 2, 85);
  };

  const drawCrowd = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Empty per user explicit request to delete crowd supporters graphics (stands and fans are already illustrated in background!)
  };

  const drawGoal = (ctx: CanvasRenderingContext2D) => {
    // Empty per user explicit request to delete goalposts graphics (posts are already illustrated in background!)
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D) => {
    // Only draw Kicker near penalty spot if states are correct
    if (match.state === 'FINISHED') return;
    
    const isUserKicking = match.turn === 'KICKER';
    const activeTeam = isUserKicking ? match.userTeam : match.aiTeam;
    
    // Position of player taking shot - left and behind the ball initially
    let px = 205;
    let py = 455;
    if (match.state !== 'KICKING' && match.state !== 'PRE_MATCH') {
      px = 250;
      py = 425;
    }

    if (isUserKicking) {
      if (user.isGuest) {
        if (piJerseyImg.complete && piJerseyImg.naturalWidth !== 0) {
          ctx.drawImage(piJerseyImg, px - 35, py - 45, 70, 70);
        }
      } else {
        const activeJerseyId = user.activeJerseyId || 'pi';
        if (activeJerseyId === 'pi') {
          if (piJerseyImg.complete && piJerseyImg.naturalWidth !== 0) {
            ctx.drawImage(piJerseyImg, px - 35, py - 45, 70, 70);
          }
        } else {
          const natJersey = getJerseyImg(activeJerseyId);
          if (natJersey.complete && natJersey.naturalWidth !== 0) {
            ctx.drawImage(natJersey, px - 35, py - 45, 70, 70);
          }
        }
      }
    } else {
      const natJersey = getJerseyImg(activeTeam.id);
      if (natJersey.complete && natJersey.naturalWidth !== 0) {
        ctx.drawImage(natJersey, px - 35, py - 45, 70, 70);
      }
    }
  };

  const drawGoalkeeper = (ctx: CanvasRenderingContext2D) => {
    const kx = keeperPos.current.x;
    const ky = keeperPos.current.y;

    if (gkImg.complete && gkImg.naturalWidth !== 0) {
      // Draw goalkeeper using beautiful PNG template!
      ctx.drawImage(gkImg, kx - 37, ky - 37, 75, 82);
    }
  };

  const drawBall = (ctx: CanvasRenderingContext2D) => {
    const bx = ballPos.current.x;
    const by = ballPos.current.y;

    // Shadow blob
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.arc(bx, by + 4, ballRadius - 2, 0, Math.PI * 2);
    ctx.fill();

    if (ballImg.complete && ballImg.naturalWidth !== 0) {
      // Draw the beautiful Pi Ball from user url
      ctx.drawImage(ballImg, bx - ballRadius, by - ballRadius, ballRadius * 2, ballRadius * 2);
    } else {
      // White ball base
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(bx, by, ballRadius, 0, Math.PI * 2);
      ctx.fill();

      // Classic black football pentagons
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(bx, by, ballRadius - 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(bx - 3, by - 2, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const updatePhysics = () => {
    // 1. Ball physical velocity translations
    ballPos.current.x += ballVel.current.x;
    ballPos.current.y += ballVel.current.y;

    if (match.state === 'CELEBRATION' || match.state === 'SAVED') {
      // Retard ball velocity after impact/saves
      ballVel.current.x *= 0.95;
      ballVel.current.y *= 0.95;
    }

    // 2. Goalkeeper position and smooth sliding movement
    if (match.state === 'PRE_MATCH') {
      // Lock precisely at center
      keeperTargetX.current = 250;
      keeperPos.current.x = 250;
    } else if (match.state === 'KICKING') {
      if (match.turn === 'GOALKEEPER') {
        // User is manually dragging the goalkeeper. Slide smoothly towards keeperTargetX!
        const speed = 0.18; // smooth horizontal glide/lerp
        const diffX = keeperTargetX.current - keeperPos.current.x;
        keeperPos.current.x += diffX * speed;
      } else {
        // AI GK during kicker turn stands centered or shifts smoothly to center
        keeperTargetX.current = 250;
        const speed = 0.18;
        const diffX = keeperTargetX.current - keeperPos.current.x;
        keeperPos.current.x += diffX * speed;
      }
    } else if (match.state === 'GK_PLAY') {
      // Smoothly slide/dive towards keeperTargetX (no instant warp, beautiful sliding dives)
      const speed = 0.22; // highly responsive fast slide
      const diffX = keeperTargetX.current - keeperPos.current.x;
      keeperPos.current.x += diffX * speed;
    }

    // Ball bounds detection (goal collision limits)
    // Goal dimensions: X (100 to 400), Y (150 up to 260)
    const bx = ballPos.current.x;
    const by = ballPos.current.y;

    if (match.state === 'GK_PLAY' && by <= 260) {
      // Evaluate kick result - proximity to keeper (increased radius to 38px to match 70% scaled character size)
      const distToGk = Math.hypot(bx - keeperPos.current.x, by - keeperPos.current.y);
      if (distToGk < ballRadius + 38) {
        // Goal saved!
        ballVel.current.x = -ballVel.current.x * 0.4 + (Math.random() * 4 - 2);
        ballVel.current.y = 8; // Rebound
        AudioManager.playOhhh();
        setMatch(prev => ({ ...prev, state: 'SAVED' }));
        setStatusText(translate('saved', language));
        evaluateRoundResult('SAVE');
      } else if (by <= 150) {
        // Ball went past goalkeeper bounds!
        if (bx >= 100 && bx <= 400) {
          // Inside goal mouth grid!
          ballVel.current.x = 0;
          ballVel.current.y = 0;
          if (settings.audioGoals) {
            AudioManager.playClaps();
          }
          setMatch(prev => ({ ...prev, state: 'CELEBRATION' }));
          setStatusText(translate('goal', language));
          evaluateRoundResult('GOAL');
        } else {
          // Went out side/missed
          AudioManager.playOhhh();
          setMatch(prev => ({ ...prev, state: 'OUT' }));
          setStatusText(translate('missed', language));
          evaluateRoundResult('MISS');
        }
      }
    }
  };

  const triggerKick = (targetDirection: 'LEFT' | 'CENTER' | 'RIGHT' | 'UP', expired: boolean = false) => {
    if (match.state !== 'KICKING') return;

    setMatch(prev => ({ ...prev, state: 'GK_PLAY' }));

    let ballTargetX = 250;
    let ballTargetY = 160;

    if (targetDirection === 'LEFT') {
      ballTargetX = 140;
    } else if (targetDirection === 'RIGHT') {
      ballTargetX = 360;
    } else if (targetDirection === 'UP') {
      ballTargetY = 135; // Overshoots over crossbar high!
      ballTargetX = 220 + Math.random() * 60;
    } else {
      ballTargetX = 250;
    }

    // Determine physics speed velocities
    const steps = 30;
    ballVel.current.x = (ballTargetX - ballPos.current.x) / steps;
    ballVel.current.y = (ballTargetY - ballPos.current.y) / steps;

    // AI Goalkeeper dive decision rates
    const levelKey = match.userTeam.difficulty; // EASY, MEDIUM, DIFFICULT, HARD
    let saveAccuracyPercent = 60; // Default Easy
    if (levelKey === 'MEDIUM') saveAccuracyPercent = 70;
    if (levelKey === 'DIFFICULT') saveAccuracyPercent = 80;
    if (levelKey === 'HARD') saveAccuracyPercent = 95;

    // If glove booster was applied
    if (match.activeBoosterUsed && match.turn === 'GOALKEEPER') {
      // Goalkeeper shoes/glove mechanics
      saveAccuracyPercent = 90; // Override to 90% for top booster
    }

    // AI Kicker success rate override
    let kickSuccessRatePercent = 60;
    if (levelKey === 'MEDIUM') kickSuccessRatePercent = 70;
    if (levelKey === 'DIFFICULT') kickSuccessRatePercent = 80;
    if (levelKey === 'HARD') kickSuccessRatePercent = 95;

    if (match.activeBoosterUsed && match.turn === 'KICKER') {
      kickSuccessRatePercent = 90; // 90% booster
    }

    if (match.turn === 'KICKER') {
      // User kicking, AI GK dives
      const diceRoll = Math.floor(Math.random() * 100);
      const gkWillSave = diceRoll < saveAccuracyPercent;

      if (gkWillSave && targetDirection !== 'UP') {
        keeperTargetX.current = ballTargetX; // Diver dives perfectly
      } else {
        // Diver dives opposite way or wrong side
        keeperTargetX.current = targetDirection === 'LEFT' ? 360 : 140;
      }
    } else {
      // User GK defending against AI Shooter
      // The user manually positioned keeper. If user did nothing (center), set 90% goal chance
      const keeperDiffFromBall = Math.abs(keeperPos.current.x - ballTargetX);
      const isManualMove = Math.abs(keeperPos.current.x - 250) > 20;

      const diceRoll = Math.floor(Math.random() * 100);
      if (!isManualMove) {
        // Automatic high goal accuracy for system shoot
        const systemWillGoal = diceRoll < 90;
        if (systemWillGoal) {
          // Guide shot far from center keeper
          ballTargetX = Math.random() < 0.5 ? 120 : 380;
          ballVel.current.x = (ballTargetX - ballPos.current.x) / steps;
        }
      }
    }

    if (expired) {
      alert(translate('timeExpired', language));
    }
  };

  const evaluateRoundResult = (result: 'GOAL' | 'SAVE' | 'MISS') => {
    // Prevent double round evaluate triggers
    if (match.state === 'FINISHED') return;

    setTimeout(() => {
      setMatch(prev => {
        let newUserScore = prev.userScore;
        let newAiScore = prev.aiScore;

        if (prev.turn === 'KICKER') {
          if (result === 'GOAL') newUserScore += 1;
        } else {
          if (result === 'GOAL') newAiScore += 1;
        }

        const newRoundRecord: MatchRound = {
          userShot: prev.turn === 'KICKER' ? 'CENTER' : null,
          userShotResult: prev.turn === 'KICKER' ? result : null,
          aiShot: prev.turn === 'GOALKEEPER' ? 'CENTER' : null,
          aiShotResult: prev.turn === 'GOALKEEPER' ? result : null
        };

        const updatedRounds = [...prev.rounds, newRoundRecord];
        
        // Shootout Logic: alternations, Sudden Death, victory checking
        let nextTurn: 'KICKER' | 'GOALKEEPER' = prev.turn === 'KICKER' ? 'GOALKEEPER' : 'KICKER';
        let nextRound = prev.currentRound;
        let finalFinished = false;

        if (prev.turn === 'GOALKEEPER') {
          nextRound += 1;
        }

        // Check if there is an early mathematically determined winner
        const remainingRounds = 5 - prev.currentRound;
        const userLead = newUserScore - newAiScore;
        const aiLead = newAiScore - newUserScore;

        // User is KICKER, meaning we just completed user session (turn alternated to GOALKEEPER) or vice versa
        // Wait! Let's check matching criteria early terminations:
        if (prev.currentRound >= 3) {
          if (userLead > remainingRounds + (prev.turn === 'KICKER' ? 1 : 0)) {
            finalFinished = true;
          } else if (aiLead > remainingRounds + (prev.turn === 'GOALKEEPER' ? 1 : 0)) {
            finalFinished = true;
          }
        }

        // Draw sudden death criteria after 5 completed rounds
        if (nextRound > 5 && !finalFinished) {
          if (newUserScore === newAiScore) {
            prev.suddenDeath = true;
          } else {
            finalFinished = true;
          }
        }

        // Absolute maximum 11:11 rounds end trigger: declare user Winner automatically
        if (nextRound > 11) {
          finalFinished = true;
          newUserScore = Math.max(newUserScore, newAiScore + 1); // Ensure user is the winner!
        }

        // Handle states
        ballPos.current = { x: 250, y: 400 };
        ballVel.current = { x: 0, y: 0 };
        keeperPos.current = { x: 250, y: 155 };

        if (finalFinished) {
          const userWon = newUserScore > newAiScore;
          
          // Compute Star Achievements
          let starsEarned = 0;
          if (userWon) {
            const goalDiff = Math.abs(newUserScore - newAiScore);
            if (goalDiff >= 3) starsEarned = 3;
            else if (goalDiff === 2) starsEarned = 2;
            else starsEarned = 1;
          }

          return {
            ...prev,
            userScore: newUserScore,
            aiScore: newAiScore,
            rounds: updatedRounds,
            state: 'FINISHED',
            activeBoosterUsed: false
          };
        }

        return {
          ...prev,
          userScore: newUserScore,
          aiScore: newAiScore,
          currentRound: nextRound,
          rounds: updatedRounds,
          turn: nextTurn,
          state: 'PRE_MATCH',
          activeBoosterUsed: false
        };
      });
    }, 1500);
  };

  // Drag and Swipe Handler logic
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (match.state !== 'KICKING' && match.turn !== 'GOALKEEPER') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setSwipeStart({ x, y });
    setSwipePath([{ x, y }]);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!swipeStart) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    // Smooth goalkeeper sliding control
    if (match.turn === 'GOALKEEPER') {
      keeperTargetX.current = Math.max(100, Math.min(400, x));
    } else {
      setSwipePath(prev => [...prev, { x, y }]);
    }
  };

  const handleTouchEnd = () => {
    if (!swipeStart) return;
    
    if (match.turn === 'KICKER' && swipePath.length > 2) {
      // Evaluate kick direction swipe vector
      const dy = swipePath[swipePath.length - 1].y - swipeStart.y;
      const dx = swipePath[swipePath.length - 1].x - swipeStart.x;

      if (dy < -45) {
        if (dx < -30) triggerKick('LEFT');
        else if (dx > 30) triggerKick('RIGHT');
        else triggerKick('CENTER');
      } else if (dy > 45) {
        triggerKick('UP');
      } else {
        triggerKick('CENTER');
      }
    }
    setSwipeStart(null);
    setSwipePath([]);
  };

  // Mouse fallback handlers for desktop
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (match.state !== 'KICKING' && match.turn !== 'GOALKEEPER') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSwipeStart({ x, y });
    setSwipePath([{ x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!swipeStart) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (match.turn === 'GOALKEEPER') {
      keeperTargetX.current = Math.max(100, Math.min(400, x));
    } else {
      setSwipePath(prev => [...prev, { x, y }]);
    }
  };

  const handleMouseUp = () => {
    handleTouchEnd();
  };

  const applyActiveBooster = (type: 'shoes' | 'gloves') => {
    if (match.activeBoosterUsed) return;
    const success = useBooster(type);
    if (success) {
      setMatch(prev => ({ ...prev, activeBoosterUsed: true }));
      AudioManager.playWhistle();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur flex flex-col items-center justify-between p-4 font-sans text-white select-none overflow-hidden animate-fade-in">
      {/* 1. Upper Panel HUD indicators */}
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-lg p-3 flex justify-between items-center z-10 shadow-lg">
        <div className="flex flex-col">
          <span className="text-xs uppercase text-green-300 font-bold">{translate('lives', language)}</span>
          <div className="flex gap-1 text-red-500 mt-1">
            {Array.from({ length: Math.max(0, user.lives) }).map((_, i) => (
              <span key={i} className="animate-pulse">❤️</span>
            ))}
            {user.lives === 0 && <span className="text-xs text-red-400 font-semibold">0 {translate('lives', language)}</span>}
          </div>
        </div>

        {/* Global Scores Grid Board */}
        <div className="flex flex-col items-center bg-black border-2 border-slate-800 px-4 py-2 rounded min-w-[150px] shadow-2xl">
          <div className="flex justify-between w-full text-xs font-mono font-black text-slate-300">
            <span>{match.userTeam.flag} {match.userTeam.id}</span>
            <span className="text-indigo-400 font-black">{match.userScore} : {match.aiScore}</span>
            <span>{match.aiTeam.flag} {match.aiTeam.id}</span>
          </div>
          <div className="flex gap-1 mt-1 text-xs justify-center">
            {/* Rounds balls/icons progress tracker */}
            {Array.from({ length: 5 }).map((_, r) => {
              const uR = match.rounds[r]?.userShotResult;
              const aR = match.rounds[r]?.aiShotResult;
              return (
                <div key={r} className="flex flex-col gap-0.5">
                  <span className="text-[10px]">{uR === 'GOAL' ? '🟢' : uR ? '❌' : '⚪'}</span>
                  <span className="text-[10px]">{aR === 'GOAL' ? '🟢' : aR ? '❌' : '⚪'}</span>
                </div>
              );
            })}
            {match.suddenDeath && (
              <div className="flex flex-col bg-red-900 px-1 rounded text-[9px] font-bold text-red-100 animate-pulse justify-center">
                <span>SD</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setMuted(!muted)}
          className="p-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-full transition-colors cursor-pointer"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* 2. Core Interactive Canvas Playfield Stage */}
      <div className="relative flex-grow flex items-center justify-center py-2 w-full max-w-lg">
        {whistleTimerText && (
          <div className="absolute inset-x-0 top-1/4 flex flex-col items-center justify-center animate-bounce z-20 pointer-events-none">
            <span className="text-7xl font-mono text-amber-400 font-extrabold stroke-black drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
              {whistleTimerText}
            </span>
          </div>
        )}

        {match.state === 'GK_PLAY' || match.state === 'CELEBRATION' || match.state === 'SAVED' || match.state === 'OUT' ? (
          <div className="absolute top-16 bg-slate-900/95 px-5 py-2.5 rounded-lg border border-slate-800 font-black text-sm text-indigo-400 uppercase tracking-widest animate-pulse z-20">
            {statusText}
          </div>
        ) : null}

        {/* 10s countdown bar */}
        {match.state === 'KICKING' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900 px-3 py-1 rounded border border-indigo-500/30 text-xs font-mono text-indigo-400">
            <Flame size={12} className="animate-pulse" />
            <span>00:{match.timer < 10 ? '0' + match.timer : match.timer}</span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="rounded-xl border-4 border-slate-900 shadow-xl touch-none aspect-square max-h-[80vw] sm:max-h-[70vh] max-w-full"
          style={{
            backgroundImage: "url('https://raw.githubusercontent.com/B168OSS/Soccer/975cde043bfdeffb341dd9b6cc2e7472fe74a7e9/med/PlayBack.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        {/* Swipe instructions banner overlays */}
        {match.state === 'KICKING' && (
          <div className="absolute bottom-4 left-0 right-0 text-center text-xs font-extrabold uppercase tracking-widest text-slate-300 bg-slate-950/90 py-2.5 px-4 rounded-b-lg border-t border-slate-800 pointer-events-none font-sans">
            {match.turn === 'KICKER' ? translate('swipeToKick', language) : translate('swipeToSave', language)}
          </div>
        )}
      </div>

      {/* 3. Lower Control Pad panel */}
      <div className="w-full max-w-lg flex flex-col gap-3 py-2 z-10">
        {/* Dynamic Boosters Shop Trigger HUD */}
        {match.state === 'KICKING' && (
          <div className="flex gap-2 justify-center">
            {match.turn === 'KICKER' && (
              <button
                disabled={match.activeBoosterUsed || user.boosters.shoes === 0}
                onClick={() => applyActiveBooster('shoes')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  match.activeBoosterUsed
                    ? 'bg-slate-800 text-slate-500 border-slate-700'
                    : user.boosters.shoes > 0
                    ? 'bg-indigo-600 hover:bg-indigo-505 text-white border-indigo-550 animate-pulse'
                    : 'bg-slate-900 text-slate-650 border-slate-850'
                }`}
              >
                <Zap size={13} />
                <span>Shoes ({user.boosters.shoes})</span>
              </button>
            )}

            {match.turn === 'GOALKEEPER' && (
              <button
                disabled={match.activeBoosterUsed || user.boosters.gloves === 0}
                onClick={() => applyActiveBooster('gloves')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  match.activeBoosterUsed
                    ? 'bg-slate-800 text-slate-500 border-slate-700'
                    : user.boosters.gloves > 0
                    ? 'bg-indigo-600 hover:bg-indigo-505 text-white border-indigo-550 animate-pulse'
                    : 'bg-slate-900 text-slate-650 border-slate-850'
                }`}
              >
                <Shield size={14} />
                <span>Gloves ({user.boosters.gloves})</span>
              </button>
            )}
          </div>
        )}

        {/* Lobby User Identification Panel (Corner bottom right) */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 px-1 uppercase tracking-wider font-extrabold font-sans">
          <span>{user.isGuest ? translate('guestTitle', language) : 'Pi Player'}</span>
          <span className="font-mono bg-slate-900 px-2.5 py-1 rounded text-[11px] text-indigo-400 border border-slate-800 leading-none">
            {user.username}
          </span>
        </div>

        {/* 4. Match Over Terminal panel overlay */}
        {match.state === 'FINISHED' && (
          <div className="fixed inset-0 bg-slate-950/98 backdrop-blur z-50 flex flex-col items-center justify-center p-6 text-center animate-scale-up">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-850 rounded-lg p-6 shadow-2xl">
              <Trophy className="mx-auto text-indigo-400 w-16 h-16 animate-pulse mb-3" />
              
              <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-1 animate-scale-up">
                {match.userScore > match.aiScore ? 'VICTORY' : 'GAME OVER'}
              </h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold mb-4">
                {match.userTeam.flag} {match.userTeam.name} vs {match.aiTeam.flag} {match.aiTeam.name}
              </p>

              <div className="flex justify-center items-center gap-3 bg-black py-4 rounded border border-slate-800 mb-4 font-mono text-3xl font-black">
                <span className="text-indigo-400">{match.userScore}</span>
                <span className="text-slate-700">:</span>
                <span className="text-indigo-400">{match.aiScore}</span>
              </div>

              {/* Special Play limit instructions for Guest vs Pi User */}
              <div className="bg-slate-950/80 p-3 rounded border border-slate-850 mb-4 text-left">
                {user.isGuest ? (
                  match.userScore > match.aiScore ? (
                    <div>
                      <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-widest block mb-1">🏁 GUEST MATCH COMPLETED (WIN)</span>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        Sesi bermain Guest dibatasi hanya 1x pertandingan per 24 jam. Masuk dengan <strong>Akun Pi Network</strong> untuk menikmati akses Unlimited bermain & membeli booster/jersey!
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest block mb-1">❌ GUEST MATCH COMPLETED (LOSS)</span>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        Anda kalah! Mode Guest dibatasi 1X bermain per 24 jam. Anda dapat bermain kembali setelah waktu 1x24 jam berikutnya selesai, atau Sign In dengan <strong>Akun Pi</strong> sekarang untuk langsung lanjut tanpa batas!
                      </p>
                    </div>
                  )
                ) : (
                  match.userScore > match.aiScore ? (
                    <div>
                      <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest block mb-1">👑 PI NETWORK PLAYER ACTIVE (WIN)</span>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        Selamat atas kemenangan Anda! Lanjutkan perjalanan sepakbola dunia Anda ke level berikutnya tanpa batasan bermain (Akses Unlimited aktif)!
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-widest block mb-1">👑 PI NETWORK PLAYER ACTIVE (LOSS)</span>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        Sayang sekali Anda kalah! Tapi sebagai <strong>Pi Network Player</strong>, Anda mempunyai akses bermain tanpa batasan (Unlimited). Silakan lanjut untuk langsung bermain lagi!
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* Stars Achievements Render */}
              <div className="flex flex-col items-center mb-6 bg-slate-950 py-3 px-4 rounded border border-slate-850">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold mb-2">{translate('ratingTitle', language)}</span>
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => {
                    const won = match.userScore > match.aiScore;
                    const diff = Math.abs(match.userScore - match.aiScore);
                    const stars = won ? (diff >= 3 ? 3 : diff === 2 ? 2 : 1) : 0;
                    return (
                      <span key={i} className={`text-2xl ${i < stars ? 'text-indigo-400 scale-110' : 'text-slate-800'}`}>
                        ★
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Medsos Social Share Section */}
              <div className="flex flex-col gap-2.5 mb-6">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black text-center">
                  SHARE YOUR VICTORY RESULTS
                </span>
                
                <div className="grid grid-cols-4 gap-2">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `⚽ World Soccer™ MATCH RESULT! ⚽\n🥅 Final Score: ${match.userTeam.flag} ${match.userTeam.name} ${match.userScore} - ${match.aiScore} ${match.aiTeam.flag} ${match.aiTeam.name}\n⭐ Level: ${match.userTeam.difficulty}\n🌍 Play on Pi Browser: https://worldsoccerced2510.pinet.com`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer"
                    title="Share via WhatsApp"
                    id="share-whatsapp"
                  >
                    <svg className="w-5 h-5 fill-emerald-400 mb-1" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.292 1.503 5.34 1.505 5.517 0 10.002-4.484 10.005-10.002.002-2.673-1.04-5.184-2.936-7.082C17.11 1.7 14.602.651 12.008.651c-5.523 0-10.01 4.487-10.014 10.007-.001 2.016.521 3.655 1.517 5.282l-.995 3.637 3.733-.979zm12.333-8.11c-.329-.165-1.947-.961-2.245-1.07-.297-.109-.514-.165-.73.165-.216.329-.838 1.07-1.026 1.285-.188.216-.375.243-.704.078-.329-.165-1.389-.512-2.645-1.633-.977-.872-1.637-1.95-1.828-2.28-.191-.329-.02-.507.145-.671.148-.148.329-.383.494-.575.165-.188.22-.329.329-.548.11-.219.055-.411-.027-.575-.082-.164-.73-1.758-.999-2.409-.261-.628-.529-.543-.73-.553-.21-.01-.448-.01-.689-.01-.24 0-.63.09-1.002.493-.372.404-1.419 1.385-1.419 3.377 0 1.992 1.45 3.92 1.652 4.195.202.274 2.854 4.357 6.914 6.113 1.155.498 2.058.796 2.76 1.02.966.307 1.847.264 2.541.161.774-.116 2.378-.973 2.717-1.916.338-.943.338-1.754.238-1.916-.1-.163-.371-.259-.7-.424z" />
                    </svg>
                    <span className="text-[7.5px] font-black uppercase tracking-wider text-emerald-400">WhatsApp</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent('https://worldsoccerced2510.pinet.com')}&text=${encodeURIComponent(
                      `⚽ World Soccer™ MATCH RESULT! ⚽\n🥅 Final Score: ${match.userTeam.flag} ${match.userTeam.name} ${match.userScore} - ${match.aiScore} ${match.aiTeam.flag} ${match.aiTeam.name}\n⭐ Level: ${match.userTeam.difficulty}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-sky-500/20 text-sky-400 hover:text-sky-300 transition-all cursor-pointer"
                    title="Share via Telegram"
                    id="share-telegram"
                  >
                    <svg className="w-5 h-5 fill-sky-400 mb-1" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.6 1.5-1.55 2.75-2.95 2.75-2.98.01-.04-.01-.06-.06-.06s-.2.03-.42.12c-.22.09-1.95 1.23-5.2 3.42-.48.33-.91.49-1.29.48-.42-.01-1.22-.24-1.82-.44-.73-.24-1.31-.37-1.26-.78.03-.22.33-.44.9-.68 3.52-1.53 5.87-2.54 7.05-3.03 3.35-1.39 4.05-1.63 4.51-1.64.1 0 .32.02.47.14.12.1.16.23.17.33.01.07-.01.21-.02.32z" />
                    </svg>
                    <span className="text-[7.5px] font-black uppercase tracking-wider text-sky-400">Telegram</span>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `⚽ World Soccer™ MATCH RESULT! ⚽\n🥅 Final Score: ${match.userTeam.flag} ${match.userTeam.name} ${match.userScore} - ${match.aiScore} ${match.aiTeam.flag} ${match.aiTeam.name}\n⭐ Level: ${match.userTeam.difficulty}\n🌍 Play on Pi Browser: https://worldsoccerced2510.pinet.com #PiNetwork`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-700 text-white hover:text-slate-200 transition-all cursor-pointer"
                    title="Share on Twitter/X"
                    id="share-twitter"
                  >
                    <svg className="w-5 h-5 fill-white mb-1" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="text-[7.5px] font-black uppercase tracking-wider text-white">X / Twitter</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://worldsoccerced2510.pinet.com')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-blue-600/20 text-blue-500 hover:text-blue-400 transition-all cursor-pointer"
                    title="Share on Facebook"
                    id="share-facebook"
                  >
                    <svg className="w-5 h-5 fill-blue-500 mb-1" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-[7.5px] font-black uppercase tracking-wider text-blue-500">Facebook</span>
                  </a>
                </div>

                <button
                  onClick={async () => {
                    const textToShare = `⚽ World Soccer™ MATCH RESULT! ⚽\n🥅 Final Score: ${match.userTeam.flag} ${match.userTeam.name} ${match.userScore} - ${match.aiScore} ${match.aiTeam.flag} ${match.aiTeam.name}\n🏆 Level: ${match.userTeam.difficulty}\n🌍 Play on Pi Browser: https://worldsoccerced2510.pinet.com`;
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: 'World Soccer™ Match Result',
                          text: textToShare,
                          url: 'https://worldsoccerced2510.pinet.com'
                        });
                      } catch (err) {
                        console.log(err);
                      }
                    } else {
                      try {
                        await navigator.clipboard.writeText(textToShare);
                        alert('Match results copied to clipboard! Share it with your friends.');
                      } catch (err) {
                        console.log(err);
                      }
                    }
                  }}
                  className="w-full py-1.5 px-3 mt-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-950 text-[10px] font-black text-indigo-400 border border-indigo-500/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase font-sans shadow-inner shadow-black"
                >
                  <Share2 size={12} />
                  <span>Copy Match Results link</span>
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-wider text-xs rounded-lg transition-all shadow-lg shadow-indigo-950/35 cursor-pointer"
                  id="btn-return-lobby"
                >
                  Return to Lobby
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PenaltyGame;
