
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  onExpire?: () => void;
}

const CountdownTimer = ({ onExpire }: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    const storedExpiry = localStorage.getItem('offerExpiryTime');
    
    if (storedExpiry) {
      const expiryTime = parseInt(storedExpiry);
      startCountdown(expiryTime);
    } else {
      const expiryTime = Date.now() + (6 * 60 * 60 * 1000);
      localStorage.setItem('offerExpiryTime', expiryTime.toString());
      startCountdown(expiryTime);
    }
  }, [onExpire]);

  const startCountdown = (expiryTimestamp: number) => {
    let intervalId: NodeJS.Timeout;
    
    const updateCountdown = () => {
      const now = Date.now();
      const diff = expiryTimestamp - now;
      
      if (diff <= 0) {
        setTimeRemaining(0);
        clearInterval(intervalId);
        onExpire?.();
      } else {
        setTimeRemaining(diff);
      }
    };
    
    updateCountdown();
    intervalId = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(intervalId);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (timeRemaining === null || timeRemaining <= 0) return null;

  return (
    <div className="flex items-center">
      <Clock className="h-4 w-4 mr-2" />
      <span className="font-mono text-sm md:text-base font-bold">
        Expira em: {formatTime(timeRemaining)}
      </span>
    </div>
  );
};

export default CountdownTimer;
