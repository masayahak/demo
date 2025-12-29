import { useState, useRef } from "react";
import { Piece } from "../app/types";
import {
  INITIAL_PIECES,
  BOARD_LAYOUT,
  CELL_SIZE,
  COLS,
  ROWS,
} from "../constants/gameConfig";

export const useGameLogic = () => {
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_PIECES);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCleared, setIsCleared] = useState(false);
  const [message, setMessage] = useState("");

  const dragState = useRef({ startX: 0, startY: 0 });

  const checkCollision = (
    target: Piece,
    newX: number,
    newY: number
  ): { allowed: boolean; msg?: string; win?: boolean } => {
    // 1. 盤外チェック
    if (newX < 0 || newX + target.width > COLS) return { allowed: false };
    if (newY < 0 || newY + target.height > ROWS) return { allowed: false };

    // 2. 壁・出口チェック
    let hitExit = false;
    for (let y = 0; y < target.height; y++) {
      for (let x = 0; x < target.width; x++) {
        const cell = BOARD_LAYOUT[newY + y][newX + x];
        if (cell === 1) return { allowed: false }; // 壁
        if (cell === 9) hitExit = true; // 出口
      }
    }

    // 出口に入った場合の判定
    if (hitExit) {
      if (target.name === "娘") {
        return { allowed: true, win: true };
      } else {
        return { allowed: false, msg: "娘以外は出られません！" };
      }
    }

    // 3. 他の駒との衝突チェック
    const collision = pieces.some((p) => {
      if (p.id === target.id) return false;
      return (
        newX < p.x + p.width &&
        newX + target.width > p.x &&
        newY < p.y + p.height &&
        newY + target.height > p.y
      );
    });

    if (collision) return { allowed: false };

    return { allowed: true };
  };

  const handlePointerDown = (e: React.PointerEvent, id: number) => {
    // クリア済みなら操作無効
    if (isCleared) return;

    setMessage(""); // クリック時にメッセージを一旦消す
    setSelectedId(id);
    e.preventDefault();

    // ▼ 追加：ポインター（マウス・指）をこの要素にロックする
    e.currentTarget.setPointerCapture(e.pointerId);

    // ▼ 追加：開始位置を記憶
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (selectedId === null || isCleared) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const startX = dragState.current.startX;
    const startY = dragState.current.startY;
    const THRESHOLD = CELL_SIZE / 2;

    let dx = 0;
    let dy = 0;

    if (Math.abs(currentX - startX) > THRESHOLD) {
      dx = currentX > startX ? 1 : -1;
    } else if (Math.abs(currentY - startY) > THRESHOLD) {
      dy = currentY > startY ? 1 : -1;
    }
    // 移動量に達してなければ終了
    if (dx === 0 && dy === 0) return;

    const target = pieces.find((p) => p.id === selectedId);
    if (target) {
      const newX = target.x + dx;
      const newY = target.y + dy;

      const result = checkCollision(target, newX, newY);

      // メッセージがあれば表示
      if (result.msg) setMessage(result.msg);

      if (result.allowed) {
        // 勝利判定
        if (result.win) {
          setIsCleared(true);
          setMessage("🎉ゲームクリア！🎉");
        }

        setPieces((prev) =>
          prev.map((p) =>
            p.id === selectedId ? { ...p, x: newX, y: newY } : p
          )
        );
        dragState.current = { startX: currentX, startY: currentY };
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setSelectedId(null);
    dragState.current = { startX: 0, startY: 0 };
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const initGame = () => {
    setPieces(INITIAL_PIECES);
    setIsCleared(false);
    setMessage("");
    setSelectedId(null);
  };
  // View（JSX）に必要なものだけをreturnする
  return {
    pieces,
    selectedId,
    isCleared,
    message,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    initGame,
  };
};
