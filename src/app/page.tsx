"use client";
import { useTimer } from "../hooks/useTimer";
import { useGameLogic } from "../hooks/useGameLogic";
import { BoardComponent } from "../components/Board";
import { HeaderComponent } from "../components/Header";

export default function Demo() {
  // ロジックはHooksから呼び出すだけ
  const {
    pieces,
    selectedId,
    isCleared,
    message,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    initGame,
  } = useGameLogic();
  const { elapsed, resetTimer } = useTimer(isCleared);

  // リセット処理の結合
  const resetGame = () => {
    initGame();
    resetTimer();
  };

  return (
    <div className="flex flex-col items-center justify-center p-10 min-h-screen bg-gray-50">
      <HeaderComponent
        elapsed={elapsed}
        message={message}
        isCleared={isCleared}
        resetGame={resetGame}
      />

      <BoardComponent
        pieces={pieces}
        selectedId={selectedId}
        handlePointerDown={handlePointerDown}
        handlePointerMove={handlePointerMove}
        handlePointerUp={handlePointerUp}
      />
    </div>
  );
}
