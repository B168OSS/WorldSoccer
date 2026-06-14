import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store';
import { translate } from '../utils/translate';
import { ChatMessage } from '../types';
import { Send, MessageSquare, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

export const ChatRoom: React.FC = () => {
  const { user, chatMessages, addChatMessage, language } = useGameStore();
  const [inputText, setInputText] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll chats to bottom on loads
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    // Initiate Live WebSocket synchronization connection
    const setupWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/chat/ws`;
        
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          setWsConnected(true);
          console.log('WS connectivity established');
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && data.type === 'CHAT_MESSAGE') {
              useGameStore.setState((state) => {
                // Deduplicate incoming messages
                if (state.chatMessages.find(m => m.id === data.msg.id)) return state;
                return { chatMessages: [data.msg, ...state.chatMessages].slice(0, 100) };
              });
            }
          } catch (e) {
            console.error('Error reading chat websocket frames', e);
          }
        };

        socket.onclose = () => {
          setWsConnected(false);
          // Try reconnecting after a small delay
          setTimeout(setupWebSocket, 5000);
        };
      } catch (err) {
        setWsConnected(false);
        console.warn('WebSocket connection bypassed, using dynamic offline queues', err);
      }
    };

    setupWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (user.isGuest) {
      alert("Sign in with Pi Network to send live lobby chat messages!");
      return;
    }

    const newMessage: ChatMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random(),
      username: user.username,
      avatarEmoji: user.avatarEmoji,
      message: inputText.trim(),
      timestamp: new Date().toISOString()
    };

    // Dispatch locally
    useGameStore.setState((state) => ({ chatMessages: [newMessage, ...state.chatMessages].slice(0, 100) }));

    // Send via socket frame if connected
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'CHAT_MESSAGE', msg: newMessage }));
    } else {
      // HTTP API proxy dispatch
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msg: newMessage })
      }).catch(err => console.error('Fallback chat dispatch failed', err));
    }

    setInputText('');
  };

  return (
    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-lg p-5 shadow flex flex-col h-[400px] justify-between gap-4 animate-scale-up font-sans">
      {/* Upper header */}
      <div className="flex justify-between items-center bg-slate-950 px-4 py-3 rounded border border-slate-800">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="text-indigo-400 w-5 h-5 animate-pulse" />
          <div>
            <h3 className="text-sm font-black tracking-wider text-slate-200 uppercase">
              {translate('chatBtn', language)}
            </h3>
            <p className="text-[9px] text-indigo-400 font-mono uppercase font-bold tracking-widest mt-1">
              {wsConnected ? '● REAL-TIME CHAT SYNCED' : '● OFFLINE LOCAL CHAT'}
            </p>
          </div>
        </div>
        {user.isGuest && (
          <span className="text-[9px] bg-slate-900 text-indigo-300 px-2 py-0.5 rounded border border-indigo-900/50 font-black uppercase tracking-wider">
            ReadOnly Mode
          </span>
        )}
      </div>

      {/* Messages scrolling view */}
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto space-y-3 pr-1 py-1 flex flex-col-reverse"
      >
        {chatMessages.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs flex flex-col items-center justify-center gap-1">
            <AlertCircle size={20} className="text-slate-600" />
            <span>Welcome to the stadium chat! Be the first to cheer.</span>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isMe = msg.username === user.username;
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {/* avatar */}
                <div className="w-8 h-8 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-sm shrink-0">
                  {msg.avatarEmoji || '⚽'}
                </div>
                {/* bubble */}
                <div
                  className={`p-2.5 rounded border text-xs leading-relaxed ${
                    isMe
                      ? 'bg-indigo-650/10 border-indigo-500/30 text-indigo-200 rounded-tr-none'
                      : 'bg-slate-950 border-slate-805 text-slate-350 rounded-tl-none'
                  }`}
                >
                  <span className="font-black text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">
                    {msg.username}
                  </span>
                  <span>{msg.message}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Inputs controls */}
      <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-800/80 pt-3">
        <input
          disabled={user.isGuest}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={user.isGuest ? "Sign in to join stadium chats..." : "Type stadium cheers here..."}
          className="flex-grow bg-slate-950 border border-slate-800 px-4 py-2.5 rounded text-xs text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500/65 disabled:opacity-40"
        />
        <button
          disabled={user.isGuest || !inputText.trim()}
          type="submit"
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-all disabled:opacity-40 shrink-0 cursor-pointer shadow-indigo-950/40 shadow"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
export default ChatRoom;
