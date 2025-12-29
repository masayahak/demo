type Props = {
  elapsed: number;
  message: string;
  isCleared: boolean;
  resetGame: () => void;
};

export const HeaderComponent = ({
  elapsed,
  message,
  isCleared,
  resetGame,
}: Props) => {
  return (
    <div>
      {/* ヘッダーエリア */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-800">箱入り娘</h1>
        <p className="text-xl text-gray-800">娘だけを出してね！</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-xl text-gray-800 font-mono bg-white px-4 py-1 rounded border">
          経過時間: {elapsed}
        </div>
        <button
          onClick={resetGame}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shadow"
        >
          リセット
        </button>
      </div>

      {/* メッセージエリア */}
      <div className="h-8 flex items-center">
        {message && (
          <span
            className={`font-bold ${
              isCleared ? "text-red-500 text-xl animate-bounce" : "text-red-600"
            }`}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
};
