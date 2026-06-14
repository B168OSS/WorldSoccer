import React from 'react';
import { useGameStore } from '../store';
import { Trophy, Clock, ShieldAlert } from 'lucide-react';

export const HistoryTab: React.FC = () => {
  const { matchHistory } = useGameStore();

  // Fetch only the last 10 outcomes as requested
  const lastTenHistories = matchHistory.slice(0, 10);

  return (
    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-lg p-5 shadow flex flex-col gap-4 animate-scale-up font-sans">
      <div className="flex justify-between items-center bg-slate-950 border border-slate-800 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-black uppercase tracking-wider text-slate-100">MATCH GAME OUTCOMES</span>
        </div>
        <span className="text-[10px] bg-slate-900 px-2 py-1 rounded text-slate-400 border border-slate-800 font-mono">
          LAST {lastTenHistories.length} OUTCOMES
        </span>
      </div>

      <div className="flex flex-col gap-3.5 max-h-[420px] overflow-y-auto pr-1">
        {lastTenHistories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2 border border-dashed border-slate-800 rounded">
            <ShieldAlert size={32} className="text-slate-600 animate-pulse" />
            <p className="text-xs uppercase font-extrabold tracking-widest text-slate-500">No match records found</p>
          </div>
        ) : (
          lastTenHistories.map((m) => {
            const isUserWin = m.won;
            return (
              <div
                key={m.id}
                className="bg-slate-950 border border-slate-850/80 rounded-lg p-3.5 hover:border-slate-800 transition-colors flex flex-col gap-2 relative overflow-hidden"
              >
                {/* Horizontal status border indicator */}
                <div className={`absolute top-0 bottom-0 left-0 w-1 ${isUserWin ? 'bg-indigo-500' : 'bg-red-500'}`} />

                <div className="flex justify-between items-center pl-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Match Detail</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-500">
                    <Clock size={11} className="text-slate-600" />
                    <span>{m.date} {m.timestamp || ''}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-black/60 py-2.5 px-4 rounded border border-slate-900 mx-1">
                  {/* Left Player Team */}
                  <div className="flex items-center gap-2.5 w-[42%] truncate justify-end">
                    <span className="text-xs font-black text-white truncate text-right">
                      {m.userTeamName || 'Player Indonesia'}
                    </span>
                    <span className="text-xl leading-none">{m.userTeamFlag || '🇮🇩'}</span>
                  </div>

                  {/* Score HUD */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded font-mono text-xs font-black shrink-0">
                    <span className={isUserWin ? 'text-indigo-400' : 'text-slate-300'}>{m.userScore}</span>
                    <span className="text-slate-700">:</span>
                    <span className={!isUserWin ? 'text-indigo-400' : 'text-slate-300'}>{m.aiScore}</span>
                  </div>

                  {/* Right Opponent Team */}
                  <div className="flex items-center gap-2.5 w-[42%] truncate justify-start">
                    <span className="text-xl leading-none">{m.opponentFlag}</span>
                    <span className="text-xs font-black text-white truncate text-left">
                      {m.opponentName}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pl-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                        isUserWin
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {isUserWin ? 'VICTORY' : 'DEFEAT'}
                    </span>
                    <span className="text-slate-600 text-[10px]">•</span>
                    <div className="flex text-xs leading-none text-amber-500">
                      {Array.from({ length: m.stars || 0 }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold font-mono">
                    VERIFIED SECURE
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HistoryTab;
