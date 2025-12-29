import { useState, useRef, useEffect } from "react";

export const useTimer = (isStopped: boolean) => {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isStopped) return;
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStopped]);

  const resetTimer = () => setElapsed(0);

  return { elapsed, resetTimer };
};
