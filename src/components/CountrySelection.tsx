import React, { useState } from 'react';
import { useGameStore } from '../store';
import { translate } from '../utils/translate';
import { CountryTeam, LevelType } from '../types';
import { Shield, Sparkles, Trophy, Star, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface CountrySelectionProps {
  onSelected: (userTeam: CountryTeam, aiTeam: CountryTeam) => void;
}

export const CountrySelection: React.FC<CountrySelectionProps> = ({ onSelected }) => {
  const { countries, user, language } = useGameStore();
  const [activeTab, setActiveTab] = useState<LevelType>('EASY');
  const [selectedUserTeam, setSelectedUserTeam] = useState<CountryTeam | null>(null);

  // Group teams by their corresponding difficulty level
  const filteredTeams = countries.filter(c => c.difficulty === activeTab);

  // Pagination bounds
  const [page, setPage] = useState(0);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);
  const paginatedTeams = filteredTeams.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handleTabChange = (tab: LevelType) => {
    setActiveTab(tab);
    setPage(0);
  };

  const selectTeam = (team: CountryTeam) => {
    // If guest, prevent styling selection of customized country flags/jerseys (force purple kit)
    if (user.isGuest) {
      // Guest warning lock
      const alertMsg = translate('guestLimitWarning', language);
      alert(alertMsg);
      return;
    }
    setSelectedUserTeam(team);
  };

  const autoMatch = () => {
    // Automatically match selected user team against random opponent from the SAME level group!
    if (!selectedUserTeam) {
      // Guest fallback: auto-assign default Indonesia team vs Germany or similar
      const defaultUserTeam = countries.find(c => c.id === 'ID') || countries[0];
      const candidates = countries.filter(c => c.id !== defaultUserTeam.id && c.difficulty === 'HARD');
      const randomOpponent = candidates[Math.floor(Math.random() * candidates.length)];
      onSelected(defaultUserTeam, randomOpponent);
      return;
    }

    const availableOpponents = countries.filter(c => c.id !== selectedUserTeam.id && c.difficulty === activeTab);
    const randomOpponent = availableOpponents[Math.floor(Math.random() * availableOpponents.length)] || countries[0];
    onSelected(selectedUserTeam, randomOpponent);
  };

  return (
    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-lg p-5 shadow flex flex-col gap-4 animate-scale-up font-sans">
      {/* Upper Title */}
      <div className="flex justify-between items-center bg-slate-950 border border-slate-800 p-4 rounded-lg">
        <div>
          <h2 className="text-base font-black tracking-wider uppercase text-white flex items-center gap-1.5">
            <Trophy className="text-indigo-400 w-5 h-5 animate-pulse" />
            <span>{translate('selectTeam', language)}</span>
          </h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">
            {user.isGuest ? 'Guest locked to Purple Team' : 'Unlocking 55 FIFA teams'}
          </p>
        </div>
        <div className="flex gap-1">
          {user.isGuest && (
            <span className="text-[10px] bg-indigo-950/40 text-indigo-300 border border-indigo-750 font-black uppercase px-2 py-1 rounded leading-none">
              Guest Locked
            </span>
          )}
        </div>
      </div>

      {/* Levels Tab selectors (EASY, MEDIUM, DIFFICULT, HARD) */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-805">
        {(['EASY', 'MEDIUM', 'DIFFICULT', 'HARD'] as LevelType[]).map((tab) => {
          const isActive = activeTab === tab;
          const labelKey = tab === 'EASY' ? 'levelEasy' : tab === 'MEDIUM' ? 'levelMedium' : tab === 'DIFFICULT' ? 'levelDifficult' : 'levelHard';
          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`py-1.5 px-2 rounded text-[10px] font-black uppercase transition-all tracking-wider text-center cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              {translate(labelKey, language)}
            </button>
          )}
        )}
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-2 gap-3 min-h-[220px]">
        {user.isGuest ? (
          // Guest standard dummy lock screen
          <div className="col-span-2 flex flex-col justify-center items-center p-6 bg-slate-900/60 rounded-xl border border-dashed border-slate-800 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-900-30 flex items-center justify-center p-3 mb-3 border border-purple-800">
              <span className="text-3xl">⚽</span>
            </div>
            <p className="text-sm font-semibold mb-2">Guest Defaults Active</p>
            <p className="text-xs text-slate-400 max-w-[250px] mb-4">
              {translate('guestLimitWarning', language)}
            </p>
          </div>
        ) : (
          paginatedTeams.map((team) => {
            const isSelected = selectedUserTeam?.id === team.id;
            return (
              <button
                key={team.id}
                onClick={() => selectTeam(team)}
                className={`group flex items-center gap-3 p-3 rounded-lg border transition-all text-left overflow-hidden relative cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40 hover:border-slate-750'
                }`}
              >
                {/* 3D Representation Jersey Color rendering block */}
                <div
                  className="w-8 h-10 rounded shadow relative flex flex-col justify-between items-center p-1 border border-black/10 shrink-0"
                  style={{ backgroundColor: team.jerseyColor }}
                >
                  {/* Pattern representation overlay */}
                  {team.jerseyPattern === 'stripes' && (
                    <div className="absolute inset-y-0 left-1/3 right-1/3 bg-white/20" />
                  )}
                  {/* Flag logo inside */}
                  <span className="text-sm z-15 drop-shadow-sm">{team.flag}</span>
                  {/* Pants part bottom border render */}
                  <div
                    className="w-full h-2 rounded-b"
                    style={{ backgroundColor: team.pantsColor }}
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-300 font-extrabold truncate">{team.name}</span>
                  </div>
                  {/* Star indicators */}
                  <div className="flex gap-0.5 mt-1 text-indigo-400">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className={i < team.stars ? 'fill-indigo-500' : 'text-slate-800'}
                      />
                    ))}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute right-1 top-1 w-3 h-3 bg-indigo-600 rounded-full flex items-center justify-center p-0.5 animate-pulse">
                    <Sparkles className="text-white w-2 h-2" />
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Pagination indicators footer */}
      {!user.isGuest && totalPages > 1 && (
        <div className="flex justify-between items-center border-t border-slate-800/80 pt-3">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded disabled:opacity-40 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-slate-500">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded disabled:opacity-40 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Launch Play Button and quick matching */}
      <button
        onClick={autoMatch}
        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-lg shadow-lg shadow-indigo-950/40 text-sm uppercase flex justify-center items-center gap-2 tracking-widest transform hover:-translate-y-0.5 transition-all cursor-pointer"
      >
        <Play size={14} className="fill-white" />
        <span>
          {user.isGuest
            ? 'Play as Guest (Indonesia Preset)'
            : selectedUserTeam
            ? `Start: ${selectedUserTeam.name} Match`
            : 'Select Team First'}
        </span>
      </button>
    </div>
  );
};
export default CountrySelection;
