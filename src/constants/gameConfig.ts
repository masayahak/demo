import { Piece } from "../types";

// --- 盤面 ---
export const BOARD_LAYOUT = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 9, 9, 1, 1, 1],
];
export const CELL_SIZE = 50;
export const ROWS = BOARD_LAYOUT.length;
export const COLS = BOARD_LAYOUT[0].length;

// prettier-ignore
export const INITIAL_PIECES: Piece[] = [
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
