import React from 'react';
import { useGameStore } from '../store';
import { translate } from '../utils/translate';
import { Bell, Flame, Award, Shield } from 'lucide-react';

export const ChallengeTimer: React.FC = () => {
  const { user, countries } = useGameStore();

  const totalMatchesCount = countries.filter(c => c.completed).length;
  const isChallengeDone = totalMatchesCount >= 3;

  return (
    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-lg p-4 shadow flex flex-col gap-2 relative overflow-hidden animate-scale-up">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            <span>DAILY STADIUM CHALLENGE</span>
          </p>
          <p className="text-xs text-slate-300 mt-1">
            {isChallengeDone 
              ? '🔥 Challenge completed! Bonus +1 life is saved.' 
              : 'Win 3 matches against rival nations today to secure bonus rewards.'}
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
          {totalMatchesCount}/3 COMPLETE
        </span>
      </div>
      <div className="mt-1 flex gap-1.5">
        <div className={`w-1/3 h-1.5 rounded-full transition-all duration-300 ${totalMatchesCount >= 1 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
        <div className={`w-1/3 h-1.5 rounded-full transition-all duration-300 ${totalMatchesCount >= 2 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
        <div className={`w-1/3 h-1.5 rounded-full transition-all duration-300 ${totalMatchesCount >= 3 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
      </div>
    </div>
  );
};
export default ChallengeTimer;
