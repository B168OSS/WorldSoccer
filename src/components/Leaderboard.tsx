import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store';
import { translate } from '../utils/translate';
import { Trophy, RefreshCw, Award, Star, Zap } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { leaderboard, fetchLeaderboard, language, isOffline } = useGameStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    setLoading(true);
    await fetchLeaderboard();
    setLoading(false);
  };

  return (
    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-lg p-5 shadow flex flex-col gap-4 animate-scale-up">
      {/* HUD Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-slate-950 to-slate-905 p-4 rounded border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-950/40 p-2.5 rounded border border-indigo-800/50">
            <Trophy className="text-indigo-400 w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black tracking-wider uppercase text-white">
              {translate('leaderboardBtn', language)}
            </h3>
            <p className="text-[9px] text-indigo-400 font-mono uppercase tracking-widest mt-1 font-bold">
              Weekly Tournament Rankings
            </p>
          </div>
        </div>
        <button
          disabled={loading}
          onClick={refresh}
          className="p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded transition-colors cursor-pointer text-indigo-400 disabled:opacity-40"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {isOffline && (
        <div className="bg-yellow-950/20 border border-dashed border-yellow-700/50 rounded-xl p-3 text-center text-xs text-yellow-300">
          Showing cached offline rankings. Connect internet to fetch latest competitive updates.
        </div>
      )}

      {/* Ranks list */}
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
        {leaderboard.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500">
            Loading leaderboard standings...
          </div>
        ) : (
          leaderboard.map((entry, index) => {
            const isTop3 = index < 3;
            const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;
            return (
              <div
                key={entry.username + index}
                className={`flex items-center justify-between p-3 rounded border transition-all ${
                  index === 0
                    ? 'bg-indigo-600/10 border-indigo-500/40'
                    : 'bg-slate-950/60 border-slate-805'
                }`}
              >
                {/* Left side Rank + Avatar info */}
                <div className="flex items-center gap-3 min-w-0 font-sans">
                  <div className="w-7 text-center font-mono font-black text-xs">
                    {medalEmoji ? <span className="text-sm">{medalEmoji}</span> : `#${index + 1}`}
                  </div>
                  <div className="w-10 h-10 rounded bg-slate-900 text-base flex justify-center items-center font-extrabold shrink-0 border border-slate-800">
                    {entry.avatarEmoji || '⚽'}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-slate-105 font-extrabold block truncate leading-tight">
                      {entry.username}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-0.5 mt-1">
                      Wins: {entry.matchesWon}/{entry.matchesPlayed} games
                    </span>
                  </div>
                </div>

                {/* Right side Score info */}
                <div className="flex flex-col items-end text-right shrink-0 font-sans">
                  <span className="text-xs text-indigo-400 font-mono font-black flex items-center gap-1.5">
                    <Star className="fill-indigo-500 text-indigo-400 w-3 h-3" />
                    <span>{entry.totalStars} Stars</span>
                  </span>
                  <span className="text-[9px] text-slate-500 mt-1 font-mono uppercase font-black">
                    {entry.countryCode ? entry.countryCode : 'Global Player'}
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
export default Leaderboard;
