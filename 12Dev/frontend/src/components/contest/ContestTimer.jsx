import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const ContestTimer = ({ endTime, duration, startedAt, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      let targetTime;

      if (startedAt) {
        // Virtual contest: timer runs relative to user's individual start time
        const start = new Date(startedAt).getTime();
        const durationMs = duration * 60 * 1000;
        targetTime = start + durationMs;
      } else if (endTime) {
        // Standard contest: ends at designated time
        targetTime = new Date(endTime).getTime();
      } else {
        return;
      }

      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft('Contest Ended');
        setIsCritical(false);
        if (onTimeUp) onTimeUp();
        return;
      }

      // Check if less than 5 minutes remain
      if (difference < 5 * 60 * 1000) {
        setIsCritical(true);
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const formatted = [
        hours > 0 ? String(hours).padStart(2, '0') : null,
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0')
      ].filter(Boolean).join(':');

      setTimeLeft(formatted);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime, duration, startedAt, onTimeUp]);

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold shadow-sm ${
      isCritical 
        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse' 
        : 'bg-slate-900 border-slate-800 text-indigo-400'
    }`}>
      <Clock size={16} />
      <span>{timeLeft}</span>
    </div>
  );
};

export default ContestTimer;
