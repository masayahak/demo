"use client";

import { useEffect, useRef, useState } from "react";

// ================================================================
//                            定数・型定義
// ================================================================

// --- 盤面 ---
const BOARD_LAYOUT = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 9, 9, 1, 1, 1],
];
const CELL_SIZE = 50;
const ROWS = BOARD_LAYOUT.length;
const COLS = BOARD_LAYOUT[0].length;

// --- 駒 ---
type Piece = {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  colorClass: string;
};

// prettier-ignore
const INITIAL_PIECES: Piece[] = [
{ id: 1, name: '父', x: 2, y: 1, width: 1, height: 2, colorClass: 'bg-blue-800' },
  { id: 2, name: '娘', x: 3, y: 1, width: 2, height: 2, colorClass: 'bg-pink-300' },
  { id: 3, name: '母', x: 5, y: 1, width: 1, height: 2, colorClass: 'bg-rose-700' },
  { id: 4, name: '手代', x: 1, y: 3, width: 1, height: 1, colorClass: 'bg-green-600' },
  { id: 5, name: '大番頭', x: 2, y: 3, width: 4, height: 1, colorClass: 'bg-purple-800' },
  { id: 6, name: '兄嫁', x: 6, y: 3, width: 1, height: 1, colorClass: 'bg-emerald-800' },
  { id: 7, name: '丁稚', x: 1, y: 4, width: 1, height: 1, colorClass: 'bg-gray-400' },
  { id: 8, name: '女中', x: 2, y: 4, width: 2, height: 1, colorClass: 'bg-orange-400' },
  { id: 9, name: '番頭', x: 4, y: 4, width: 2, height: 1, colorClass: 'bg-indigo-600' },
  { id: 10, name: '丁稚', x: 6, y: 4, width: 1, height: 1, colorClass: 'bg-gray-400' },
  { id: 11, name: '番犬', x: 1, y: 5, width: 1, height: 1, colorClass: 'bg-stone-500' },
  { id: 12, name: '祖父', x: 2, y: 5, width: 2, height: 1, colorClass: 'bg-teal-700' },
  { id: 13, name: '祖母', x: 4, y: 5, width: 2, height: 1, colorClass: 'bg-teal-600' },
  { id: 14, name: '丁稚', x: 6, y: 5, width: 1, height: 1, colorClass: 'bg-gray-400' },
];

// ================================================================
//                            コンポーネント
// ================================================================
export default function Demo() {
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_PIECES);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [elapsed, setElapsed] = useState(0);
  const [isCleared, setIsCleared] = useState(false);
  const [message, setMessage] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dragState = useRef({
    startX: 0, // クリック開始したX座標
    startY: 0, // クリック開始したY座標
  });

  // 起動時・終了時処理
  useEffect(() => {
    // クリア済みならタイマーを進めない
    if (isCleared) return;

    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    // 終了時に必ず実行される処理
    // 画面が消えるときにタイマーを破棄（クリーンアップ）
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCleared]); // isClearedが変化したら再評価

  // リセット処理
  const initGame = () => {
    setPieces(INITIAL_PIECES);
    setElapsed(0);
    setIsCleared(false);
    setMessage("");
    setSelectedId(null);
  };

  // ▼ 追加：駒を押したときの処理
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

  // --------------------------------------------------------
  // 衝突判定ロジック
  // --------------------------------------------------------
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

  // ポインター移動
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
          prev.map((p) => (p.id === selectedId ? { ...p, x: newX, y: newY } : p))
        );
        dragState.current = { startX: currentX, startY: currentY };
      }
    }
  };

  // ポインターアップ
  const handlePointerUp = (e: React.PointerEvent) => {
    setSelectedId(null);
    dragState.current = { startX: 0, startY: 0 };
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="flex flex-col items-center justify-center p-10 min-h-screen bg-gray-50">
      {/* ヘッダーエリア */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-800">箱入り娘</h1>
        <p className="text-xl text-gray-800">娘だけを出してね！</p>
        
        <div className="flex items-center gap-4">
          <div className="text-xl text-gray-800 font-mono bg-white px-4 py-1 rounded border">
            経過時間: {elapsed}
          </div>
          <button
            onClick={initGame}
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shadow"
          >
            リセット
          </button>
        </div>

        {/* メッセージエリア */}
        <div className="h-8 flex items-center">
            {message && (
                <span className={`font-bold ${isCleared ? "text-red-500 text-xl animate-bounce" : "text-red-600"}`}>
                    {message}
                </span>
            )}
        </div>
      </div>

      {/* 盤面（ここをCSS Gridにする） */}
      <div
        className="relative grid w-fit border-2 border-black"
        style={{
          // ここで列と行の定義をするのがポイント
          gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
        }}
      >
        {/* 2重ループでセルを描画 */}
        {BOARD_LAYOUT.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`
      flex items-center justify-center text-xs text-gray-400
      ${cell === 0 ? "bg-amber-100 border border-amber-100" : ""}
      ${cell === 1 ? "bg-stone-600 border border-stone-600" : ""}
      ${cell === 9 ? "bg-red-100/50" : ""}
    `}
            >
              {cell === 9 && (
                <span className="text-neutral-800/50 font-bold">玄関</span>
              )}
            </div>
          ))
        )}

        {/* 駒描画 */}
        {pieces.map((p) => (
          <div
            key={p.id}
            onPointerDown={(e) => handlePointerDown(e, p.id)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`
      absolute flex items-center justify-center
      border-2 border-white/50 rounded shadow-md
      text-white font-bold text-sm select-none
      ${p.colorClass}
            /* ▼ 選択中のスタイル適用 (リング表示 + 最前面へ) */
              ${
                selectedId === p.id ? "ring-4 ring-yellow-400 z-10" : "z-0"
              }    `}
            style={{
              left: p.x * CELL_SIZE,
              top: p.y * CELL_SIZE,
              width: p.width * CELL_SIZE,
              height: p.height * CELL_SIZE,
            }}
          >
            {p.name}
          </div>
        ))}
      </div>
    </div>
  );
}
