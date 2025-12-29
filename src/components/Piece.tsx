import { Piece } from "../types";
import { CELL_SIZE } from "../constants/gameConfig";

type Props = {
  piece: Piece;
  isSelected: boolean;
  onPointerDown: (e: React.PointerEvent, id: number) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
};

export const PieceComponent = ({
  piece,
  isSelected,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: Props) => {
  return (
    <div
      onPointerDown={(e) => onPointerDown(e, piece.id)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={`
        absolute flex items-center justify-center
        border-2 border-white/50 rounded shadow-md
        text-white font-bold text-sm select-none
        ${piece.colorClass}
              /* ▼ 選択中のスタイル適用 (リング表示 + 最前面へ) */
                ${isSelected ? "ring-4 ring-yellow-400 z-10" : "z-0"}    `}
      style={{
        left: piece.x * CELL_SIZE,
        top: piece.y * CELL_SIZE,
        width: piece.width * CELL_SIZE,
        height: piece.height * CELL_SIZE,
      }}
    >
      {piece.name}
    </div>
  );
};
