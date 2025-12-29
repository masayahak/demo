import { COLS, CELL_SIZE, ROWS, BOARD_LAYOUT } from "../constants/gameConfig";
import { PieceComponent } from "./Piece";
import { Piece } from "../types";

interface BoardComponentProps {
  pieces: Piece[];
  selectedId: number | null;
  handlePointerDown: (e: React.PointerEvent, id: number) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
}

export const BoardComponent = ({
  pieces,
  selectedId,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
}: BoardComponentProps) => {
  return (
    <div
      className="relative grid w-fit border-2 border-black"
      style={{
        gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
      }}
    >
      {/* 背景描画 */}
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

      {/* 駒描画：ロジックがなくなりスッキリ */}
      {pieces.map((p) => (
        <PieceComponent
          key={p.id}
          piece={p}
          isSelected={selectedId === p.id}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      ))}
    </div>
  );
};
