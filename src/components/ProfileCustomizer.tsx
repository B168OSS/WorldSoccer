import React, { useState } from 'react';
import { useGameStore } from '../store';
import { Sparkles, Trophy, User, Zap, Shield, Volume2, VolumeX, Share2, Copy, X } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

export const ProfileCustomizer: React.FC = () => {
  const { user, customizeAvatar, countries, matchHistory, settings, toggleSetting } = useGameStore();
  const [compareActive, setCompareActive] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);

  const emojis = ['⚽', '🏆', '👑', '🔥', '🦁', '🦅', '🦄', '🐆', '⚡', '🎯', '🎸', '🎮'];
  const backgrounds = [
    'bg-zinc-800',
    'bg-zinc-900',
    'bg-neutral-950',
    'bg-stone-900',
    'bg-slate-900',
    'bg-black',
  ];

  // Dynamic Metrics Calculations
  const completedTeams = countries.filter(c => c.completed);
  const totalCompleted = completedTeams.length;
  const totalStarsEarned = countries.reduce((sum, c) => sum + c.stars, 0);

  // 1. Accuracy
  const accuracyBase = 55;
  const accuracyBoosterBonus = (user.boosters.shoes || 0) * 4;
  const accuracyMatchesBonus = totalCompleted * 1.5;
  const accuracy = Math.min(100, accuracyBase + accuracyBoosterBonus + accuracyMatchesBonus);

  // 2. Reaction Time
  const difficultWins = countries.filter(c => c.completed && (c.difficulty === 'DIFFICULT' || c.difficulty === 'HARD')).length;
  const reactionBase = 60;
  const reactionBonus = difficultWins * 3.5 + (user.boosters.gloves || 0) * 2;
  const reactionTime = Math.min(100, reactionBase + reactionBonus);

  // 3. Power
  const powerBase = 50;
  const powerBoosterBonus = (user.boosters.shoes || 0) * 5;
  const powerStarsBonus = totalStarsEarned * 0.4;
  const power = Math.min(100, powerBase + powerBoosterBonus + powerStarsBonus);

  // 4. Defense
  const defenseBase = 50;
  const defenseBoosterBonus = (user.boosters.gloves || 0) * 6;
  const defenseCompletions = countries.filter(c => c.completed && c.difficulty === 'MEDIUM').length * 2.5;
  const defense = Math.min(100, defenseBase + defenseBoosterBonus + defenseCompletions);

  // 5. Tactics
  const tacticsBase = 45;
  const tacticsBonus = totalCompleted * 2;
  const tactics = Math.min(100, tacticsBase + tacticsBonus);

  // Global Performance average benchmarks for contrast display
  const globalAvg = {
    Accuracy: 68,
    Reaction: 65,
    Power: 72,
    Defense: 58,
    Tactics: 62
  };

  const performanceData = [
    { name: 'Accuracy', value: accuracy, globalAvg: globalAvg.Accuracy },
    { name: 'Reaction', value: reactionTime, globalAvg: globalAvg.Reaction },
    { name: 'Power', value: power, globalAvg: globalAvg.Power },
    { name: 'Defense', value: defense, globalAvg: globalAvg.Defense },
    { name: 'Tactics', value: tactics, globalAvg: globalAvg.Tactics },
  ];

  const handleExportCard = () => {
    setShowExportModal(true);
    setCopiedStatus(false);
  };

  const handleCopyCode = () => {
    const textCode = `------------------------------------
WORLD SOCCER™ // ATHLETE DISPATCH
------------------------------------
REGISTRY: ${user.username}
AVATAR ID: ${user.avatarEmoji}
STARS: ${totalStarsEarned} ★
COMPLETED TEAMS: ${totalCompleted} / 55

ATHLETE VECTOR METRICS:
- Accuracy: ${accuracy}%
- Reaction Speed: ${reactionTime}%
- Power Factor: ${power}%
- Defense Coefficient: ${defense}%
- Tactical Alignment: ${tactics}%
------------------------------------
SECURED VERIFICATION VIA PI APP STUDIO
------------------------------------`;
    
    navigator.clipboard.writeText(textCode).then(() => {
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-lg bg-black border border-white p-5 flex flex-col gap-5 animate-scale-up font-sans select-none pb-20">
      
      {/* Header HUD Banner */}
      <div className="flex items-center gap-3 bg-[#09090b] p-4 border border-zinc-800">
        <div className={`w-14 h-14 ${user.avatarBg || 'bg-zinc-800'} flex items-center justify-center text-3xl shrink-0 border border-white`}>
          {user.avatarEmoji || '⚽'}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wider">
            <User size={15} className="text-white" />
            <span>Player Registry Card</span>
          </h3>
          <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-widest">Active state: {user.isGuest ? 'Guest Matchmaker' : 'Verified Pi Player'}</p>
        </div>
        <button
          onClick={handleExportCard}
          className="px-3 py-2 border border-white text-[9px] uppercase tracking-widest font-black flex items-center gap-1 bg-black text-white hover:bg-white hover:text-black cursor-pointer"
        >
          <Share2 size={11} />
          <span>Export Card</span>
        </button>
      </div>

      {/* AUDIO FEEDBACK TOGGLE HUB */}
      <div className="border border-white bg-black p-4 flex flex-col gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1.5 border-b border-zinc-800 pb-2">
          <Volume2 size={13} className="text-white" />
          Persistent Audio Configuration
        </span>
        <div className="grid grid-cols-2 gap-3 text-left">
          
          <button 
            onClick={() => toggleSetting('audioGoals')}
            className={`p-3 border text-left flex flex-col justify-between cursor-pointer ${settings.audioGoals ? 'border-white bg-white text-black' : 'border-zinc-800 bg-[#09090b] text-zinc-400 hover:border-zinc-500'}`}
          >
            <div className="flex justify-between items-center w-full">
              <span className="text-[9px] font-mono font-bold tracking-wider">GOAL CEREMONY</span>
              {settings.audioGoals ? <Volume2 size={12} /> : <VolumeX size={12} />}
            </div>
            <span className="text-[10px] font-black uppercase mt-1">Goal Sounds: {settings.audioGoals ? 'ON' : 'OFF'}</span>
          </button>

          <button 
            onClick={() => toggleSetting('audioWins')}
            className={`p-3 border text-left flex flex-col justify-between cursor-pointer ${settings.audioWins ? 'border-white bg-white text-black' : 'border-zinc-800 bg-[#09090b] text-zinc-400 hover:border-zinc-500'}`}
          >
            <div className="flex justify-between items-center w-full">
              <span className="text-[9px] font-mono font-bold tracking-wider">CHAMPIONSHIP APPLAUSE</span>
              {settings.audioWins ? <Volume2 size={12} /> : <VolumeX size={12} />}
            </div>
            <span className="text-[10px] font-black uppercase mt-1">Win Sound: {settings.audioWins ? 'ON' : 'OFF'}</span>
          </button>

        </div>
      </div>

      {/* RECHARTS RADAR PLAYER PERFORMANCE FIELD & COMPARATIVE GRID */}
      <div className="border border-white bg-black p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1.5">
            <Trophy size={11} className="text-white" />
            Performance Radar Index
          </span>
          <button
            onClick={() => setCompareActive(!compareActive)}
            className={`px-2 py-0.5 border text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer ${compareActive ? 'bg-white text-black border-white' : 'border-zinc-650 text-white bg-[#09090b] hover:border-white'}`}
          >
            {compareActive ? 'Disable Compare' : 'Compare Avg'}
          </button>
        </div>

        {/* radar container */}
        <div className="w-full h-56 bg-[#09090b] flex items-center justify-center relative border border-zinc-900">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={performanceData}>
              <PolarGrid stroke="#27272a" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="name" stroke="#e4e4e7" fontSize={9} tickLine={false} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#27272a" tick={false} axisLine={false} />
              
              <Radar name="Your Player" dataKey="value" stroke="#ffffff" fill="#ffffff" fillOpacity={0.25} />
              {compareActive && (
                <Radar name="Global average" dataKey="globalAvg" stroke="#71717a" fill="#3f3f46" fillOpacity={0.15} strokeDasharray="3 3" />
              )}
              <Legend verticalAlign="bottom" height={10} fontSize={8} iconSize={6} wrapperStyle={{ fontSize: '9px', fontFamily: 'monospace', textTransform: 'uppercase' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* stats readout table grids */}
        <div className="grid grid-cols-5 text-center gap-1 font-mono text-[9px]">
          {performanceData.map((d, index) => (
            <div key={index} className="bg-[#09090b] border border-zinc-900 p-1.5 flex flex-col justify-between">
              <span className="text-zinc-500 uppercase text-[8px] tracking-tight">{d.name}</span>
              <span className="text-white font-black mt-0.5">{d.value}%</span>
              {compareActive && (
                <span className="text-zinc-400 text-[7.5px] mt-0.5 border-t border-zinc-800/80 pt-0.5">Avg: {d.globalAvg}%</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MATCH HISTORY (LAST 5 RESULTS) GEAR TABLE */}
      <div className="border border-white bg-black p-4 flex flex-col gap-2.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1.5 border-b border-zinc-800 pb-2">
          <Zap size={11} className="text-white" />
          Recent Match Journals (Last 5)
        </span>
        <div className="overflow-x-auto">
          {matchHistory && matchHistory.length > 0 ? (
            <table className="w-full text-left font-mono text-[10px] border-collapse">
              <thead>
                <tr className="bg-[#09090b] border-b border-white">
                  <th className="p-2 text-zinc-400 font-bold uppercase tracking-wider">Opponent Match</th>
                  <th className="p-2 text-zinc-400 font-bold uppercase tracking-wider text-center">Score</th>
                  <th className="p-2 text-zinc-400 font-bold uppercase tracking-wider text-right font-black">Result</th>
                </tr>
              </thead>
              <tbody>
                {matchHistory.slice(0, 5).map((h, i) => (
                  <tr key={h.id || i} className="border-b border-zinc-900 hover:bg-[#09090b]">
                    <td className="p-2 flex items-center gap-1.5">
                      <span className="text-sm leading-none">{h.opponentFlag}</span>
                      <span className="text-white font-bold">{h.opponentName}</span>
                    </td>
                    <td className="p-2 text-center text-white">{h.userScore} - {h.aiScore}</td>
                    <td className="p-2 text-right">
                      <span className={`px-1.5 py-0.5 text-[9px] font-black leading-none ${h.won ? 'bg-white text-black font-black border border-white' : 'bg-transparent text-zinc-500 border border-zinc-800'}`}>
                        {h.won ? 'WIN' : 'LOSS'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-zinc-500 text-[10px]">NO MATCH ENTRIES REGISTERED. PLAY A PENALTY SHOOTOUT NOW.</div>
          )}
        </div>
      </div>

      {/* Select Mascot Avatar */}
      <div>
        <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 block mb-2">Select avatar mascot</span>
        <div className="grid grid-cols-6 gap-2 bg-[#09090b] p-3 border border-zinc-800 text-center">
          {emojis.map((emoji, i) => (
            <button
              key={i}
              onClick={() => customizeAvatar(emoji, user.avatarBg)}
              className={`w-full aspect-square text-xl flex items-center justify-center transition-all cursor-pointer ${
                user.avatarEmoji === emoji
                  ? 'bg-white text-black border border-white font-black'
                  : 'bg-black border border-zinc-900 hover:border-zinc-500 text-white'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Select Background Frame */}
      <div>
        <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 block mb-2">Select background frame</span>
        <div className="grid grid-cols-3 gap-2 bg-[#09090b] p-3 border border-zinc-800">
          {backgrounds.map((bg, i) => (
            <button
              key={i}
              onClick={() => customizeAvatar(user.avatarEmoji, bg)}
              className={`h-10 ${bg} border border-zinc-800 relative transition-all cursor-pointer ${
                user.avatarBg === bg ? 'ring-1 ring-white border-white' : 'opacity-70 hover:opacity-100'
               }`}
            >
              {user.avatarBg === bg && (
                <span className="absolute inset-0 bg-white/10 text-[9px] font-black uppercase text-white flex items-center justify-center gap-0.5">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Select National Jersey (Booster-based for Pi accounts, locked for Guest) */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Select Team Jersey Kit</span>
          {user.isGuest ? (
            <span className="text-[9px] bg-zinc-900 border border-zinc-805 text-zinc-550 px-1.5 py-0.5 font-bold uppercase">Locked for Guest</span>
          ) : (
            <span className="text-[9px] bg-pink-950/25 border border-pink-900/60 text-pink-400 px-1.5 py-0.5 font-bold uppercase font-sans">
              👕 {(user.boosters as any).jersey || 0} Boosters left
            </span>
          )}
        </div>

        {user.isGuest ? (
          <div className="bg-[#09090b] border border-zinc-800 p-4 text-center rounded">
            <div className="flex justify-center text-4xl mb-2">👕</div>
            <p className="text-[11px] text-zinc-400 uppercase font-black tracking-wider">Default Pi Network Jersey (Purple)</p>
            <p className="text-[9px] text-zinc-500 mt-1 uppercase font-semibold">Sign in with permanent Pi Account to unlock national teams!</p>
          </div>
        ) : (
          <div className="bg-[#09090b] border border-zinc-800 p-3 rounded flex flex-col gap-3 font-sans">
            {/* Active kit preview */}
            <div className="flex justify-between items-center bg-black p-2.5 border border-zinc-850">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">ACTIVE JERSEY:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm">
                  {user.activeJerseyId === 'pi' ? '🛡️' : (countries.find(c => c.id === user.activeJerseyId)?.flag || '👕')}
                </span>
                <span className="text-xs font-black text-white uppercase tracking-wider font-sans">
                  {user.activeJerseyId === 'pi' ? 'Pi Network (Default)' : `${countries.find(c => c.id === user.activeJerseyId)?.en_name || 'Country'}`}
                </span>
              </div>
            </div>

            {/* Scrollable grid of all countries */}
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
              {/* Default Pi Option */}
              <div className="flex justify-between items-center bg-black/65 p-2 border border-zinc-900 hover:border-zinc-750 rounded transition-all">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🛡️</span>
                  <span className="text-[11px] font-bold text-zinc-200">Pi Network (Default Kit)</span>
                </div>
                {user.activeJerseyId === 'pi' ? (
                  <span className="text-[9px] bg-white text-black font-black uppercase px-2 py-0.5">Active</span>
                ) : (
                  <button
                    onClick={() => {
                      const { setActiveJersey } = useGameStore.getState();
                      setActiveJersey('pi');
                    }}
                    className="text-[9px] border border-white bg-transparent hover:bg-white hover:text-black font-bold uppercase px-2 py-0.5 transition-colors cursor-pointer"
                  >
                    Select
                  </button>
                )}
              </div>

              {/* National team items */}
              {countries.map(country => {
                const isUnlocked = user.unlockedJerseys?.includes(country.id);
                const isActive = user.activeJerseyId === country.id;

                return (
                  <div key={country.id} className="flex justify-between items-center bg-black/60 p-2 border border-zinc-900 hover:border-zinc-700 rounded transition-all">
                    <div className="flex items-center gap-2">
                      <span className="text-sm leading-none">{country.flag}</span>
                      <span className="text-[11px] font-bold text-zinc-200">{country.en_name} Kit</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isActive ? (
                        <span className="text-[9px] bg-white text-black font-black uppercase px-2 py-0.5">Active</span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => {
                            const { setActiveJersey } = useGameStore.getState();
                            setActiveJersey(country.id);
                          }}
                          className="text-[9px] border border-white bg-transparent hover:bg-white hover:text-black font-bold uppercase px-2 py-0.5 transition-colors cursor-pointer"
                        >
                          Select
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const { unlockJersey } = useGameStore.getState();
                            if (((user.boosters as any).jersey || 0) <= 0) {
                              alert("You don't have secondary Jersey Booster options! Purchase more Jerseys Booster packs in the PI STORE.");
                              return;
                            }
                            if (confirm(`Unlock ${country.en_name} jersey kit? This consumes 1 Jersey Booster Token.`)) {
                              unlockJersey(country.id);
                            }
                          }}
                          className="text-[9px] bg-pink-600 hover:bg-pink-500 text-white font-black uppercase px-2 py-0.5 transition-colors rounded cursor-pointer"
                        >
                          Unlock (1 👕)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* STARK GEOMETRIC CARD POPUP MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-black border-2 border-white p-5 flex flex-col gap-4 relative">
            
            {/* Close */}
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-white hover:text-zinc-400 cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Title */}
            <div className="border-b border-zinc-800 pb-2">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">AUTHORIZED EXPORT CHANNEL</span>
              <h4 className="text-sm font-black text-white uppercase tracking-wider mt-1">OFFICIAL ATHLETE IDENTIFICATION CARD</h4>
            </div>

            {/* Card Content mockup */}
            <div className="border border-white bg-black p-4 flex flex-col gap-3 font-mono text-[10.5px]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-zinc-500 text-[8px] uppercase">ATHLETE NAME</p>
                  <p className="font-sans text-xs text-white font-black uppercase tracking-wider">{user.username}</p>
                </div>
                <div className={`w-11 h-11 ${user.avatarBg || 'bg-zinc-800'} border border-white flex items-center justify-center text-2xl`}>
                  {user.avatarEmoji}
                </div>
              </div>

              {/* Barcode artwork */}
              <div className="text-[8px] text-zinc-400 tracking-tighter leading-none select-none text-center">
                |||||||| | |||||| ||| ||||||| | |||| |||||||| ||||| | |||
                <br />
                <span className="text-[7px] text-zinc-500 uppercase tracking-widest mt-1 block">REGISTRATION NO. WS2026PX9</span>
              </div>

              <div className="grid grid-cols-2 gap-2 border-y border-zinc-800 py-3 text-[9px]">
                <div>
                  <span className="text-zinc-500 block uppercase">STARS COLLECTED</span>
                  <span className="text-white font-black">{totalStarsEarned} ★</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase">COUNTRIES CONQUERED</span>
                  <span className="text-white font-black">{totalCompleted} / 55</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-[9px]">
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">Accuracy Factor</span>
                  <span className="text-white font-black">{accuracy}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 border border-zinc-800">
                  <div className="bg-white h-full" style={{ width: `${accuracy}%` }}></div>
                </div>

                <div className="flex justify-between mt-1">
                  <span className="text-zinc-500 uppercase">Reaction Time Index</span>
                  <span className="text-white font-black">{reactionTime}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 border border-zinc-800">
                  <div className="bg-white h-full" style={{ width: `${reactionTime}%` }}></div>
                </div>
                
                <div className="flex justify-between mt-1">
                  <span className="text-zinc-500 uppercase">Power Output</span>
                  <span className="text-white font-black">{power}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 border border-zinc-800">
                  <div className="bg-white h-full" style={{ width: `${power}%` }}></div>
                </div>
              </div>
            </div>

            {/* Actions modal */}
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handleCopyCode}
                className="w-full py-2.5 bg-white text-black font-black uppercase text-xs tracking-widest flex items-center justify-center gap-1.5 transition-all hover:bg-zinc-200 cursor-pointer"
              >
                <Copy size={13} />
                <span>{copiedStatus ? 'ATHLETE CODE COPIED!' : 'COPY ATHLETE CARD CODE'}</span>
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full py-2 bg-transparent text-white border border-zinc-800 hover:border-zinc-500 font-mono text-[9px] uppercase tracking-widest"
              >
                Return to Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default ProfileCustomizer;
