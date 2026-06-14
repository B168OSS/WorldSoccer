import React, { useState } from 'react';
import { useGameStore } from '../store';
import { translate } from '../utils/translate';
import { ProfileCustomizer } from './ProfileCustomizer';
import { LANGUAGES } from '../utils/translate';
import { Settings, User, Languages, Volume2, LogOut, ChevronDown, ChevronUp, Check } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { user, language, setLanguage, settings, toggleSetting, initializeUser } = useGameStore();
  const [openSection, setOpenSection] = useState<'profile' | 'language' | 'audio' | null>('profile');

  const toggleSection = (section: 'profile' | 'language' | 'audio') => {
    setOpenSection(prev => (prev === section ? null : section));
  };

  const handleLogout = () => {
    if (window.confirm(translate('confirmLogout', language) || 'Are you sure you want to sign out and return to Guest Mode? Progress might not be cloud-saved!')) {
      localStorage.removeItem('world_soccer_token');
      // Set user profile back to guest
      initializeUser('Guest_User_' + Math.floor(Math.random() * 10000), true);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 backdrop-blur-md flex flex-col gap-4 animate-fade-in text-white pb-20 select-none">
      <div className="flex items-center gap-2.5 border-b border-indigo-500/20 pb-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
          <Settings size={20} className="animate-spin-slow" />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-100">
            {translate('settingsTitle', language) || 'GAME SETTINGS'}
          </h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
            {user.isGuest ? 'Guest Profile Mode' : `@${user.username} Signed In Verified`}
          </p>
        </div>
      </div>

      {/* Accordion List Options */}
      <div className="flex flex-col gap-3">
        
        {/* 1. PROFILE SECTION (Moved inside setting) */}
        <div className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden shadow-md">
          <button
            onClick={() => toggleSection('profile')}
            className="w-full px-4 py-3.5 flex justify-between items-center bg-slate-900/80 hover:bg-slate-900 transition-colors cursor-pointer text-left font-sans"
            id="setting-profile-toggle"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-purple-500/10 rounded text-purple-400">
                <User size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-wider text-slate-100">
                  {translate('profileBtn', language) || 'USER PROFILE'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {user.isGuest ? 'Customize and view guest stats' : 'View live Pi network player statistics'}
                </span>
              </div>
            </div>
            {openSection === 'profile' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>

          {openSection === 'profile' && (
            <div className="p-3 border-t border-slate-850/60 bg-slate-950/70 animate-slide-down max-h-[500px] overflow-y-auto">
              <ProfileCustomizer />
            </div>
          )}
        </div>

        {/* 2. LANGUAGE SELECTOR SECTION */}
        <div className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden shadow-md">
          <button
            onClick={() => toggleSection('language')}
            className="w-full px-4 py-3.5 flex justify-between items-center bg-slate-900/80 hover:bg-slate-900 transition-colors cursor-pointer text-left font-sans"
            id="setting-language-toggle"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-amber-500/10 rounded text-amber-400">
                <Languages size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-wider text-slate-100">
                  {translate('selectLanguage', language) || 'SELECT LANGUAGE'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Current Language: {LANGUAGES.find(l => l.code === language)?.label || 'English'}
                </span>
              </div>
            </div>
            {openSection === 'language' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>

          {openSection === 'language' && (
            <div className="p-4 border-t border-slate-850 bg-slate-950/70 mt-0.5 animate-slide-down">
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs font-black transition-all cursor-pointer ${
                      language === lang.code
                        ? 'bg-amber-500/10 border-amber-500/80 text-amber-400'
                        : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900/90 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span className="uppercase tracking-wider">{lang.label}</span>
                    </div>
                    {language === lang.code && <Check size={14} className="text-amber-400 animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. AUDIO PREFERENCES */}
        <div className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden shadow-md">
          <button
            onClick={() => toggleSection('audio')}
            className="w-full px-4 py-3.5 flex justify-between items-center bg-slate-900/80 hover:bg-slate-900 transition-colors cursor-pointer text-left font-sans"
            id="setting-audio-toggle"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-indigo-500/10 rounded text-indigo-400">
                <Volume2 size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-wider text-slate-100">
                  {translate('soundSettings', language) || 'SOUND & MUSIC'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Toggle sound effects, goals and cheers volume
                </span>
              </div>
            </div>
            {openSection === 'audio' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>

          {openSection === 'audio' && (
            <div className="p-4 border-t border-slate-850 bg-slate-950/70 flex flex-col gap-4 animate-slide-down">
              {/* Goals Cheer Toggle */}
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-100">GOALKEEPER & GOAL CHEER</span>
                  <span className="text-[10px] text-slate-400 font-mono">Play claps on goals</span>
                </div>
                <button
                  onClick={() => toggleSetting('audioGoals')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                    settings.audioGoals
                      ? 'bg-emerald-500/10 border border-emerald-500 text-emerald-400'
                      : 'bg-rose-500/10 border border-rose-500 text-rose-400'
                  }`}
                >
                  {settings.audioGoals ? 'ACTIVE 🟢' : 'MUTED 🔴'}
                </button>
              </div>

              {/* Tournament Wins Toggle */}
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-100">MATCH WHISTLE & WIN EFFETS</span>
                  <span className="text-[10px] text-slate-400 font-mono">Play cheers and whistles</span>
                </div>
                <button
                  onClick={() => toggleSetting('audioWins')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                    settings.audioWins
                      ? 'bg-emerald-500/10 border border-emerald-500 text-emerald-400'
                      : 'bg-rose-500/10 border border-rose-500 text-rose-400'
                  }`}
                >
                  {settings.audioWins ? 'ACTIVE 🟢' : 'MUTED 🔴'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. LOGOUT DIRECT OPTION */}
        <div className="border border-rose-950/40 rounded-xl bg-rose-950/10 overflow-hidden shadow-md mt-2">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-4 flex justify-between items-center hover:bg-rose-500/5 transition-all text-left font-sans cursor-pointer group"
            id="setting-logout-btn"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-rose-500/10 rounded text-rose-400 group-hover:bg-rose-500/20 transition-all">
                <LogOut size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-wider text-rose-400 group-hover:text-rose-300">
                  {user.isGuest ? 'SWITCH TO GUEST PROFILE / RESET' : 'LOGOUT / SIGN OUT'}
                </span>
                <span className="text-[10px] text-rose-400/60 font-mono">
                  {user.isGuest ? 'Reset current temporary guest stats' : 'Sign out from Pi Network to guest'}
                </span>
              </div>
            </div>
            <LogOut size={16} className="text-rose-400/50 group-hover:scale-110 transition-all" />
          </button>
        </div>

      </div>
    </div>
  );
};
