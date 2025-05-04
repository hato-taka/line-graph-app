'use client';

import { useState } from 'react';

type Props = {
  onTextLoaded: (lines: string[]) => void;
};

const DEBUG_MODE = true;

const Upload = ({ onTextLoaded }: Props) => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setDebugInfo(['⚠️ ファイルが選択されていません']);
      return;
    }

    if (!file.name.endsWith('.txt')) {
      setDebugInfo([`⚠️ 拡張子が .txt ではありません: ${file.name}`]);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split(/\r?\n|\r/).filter(Boolean);

      if (DEBUG_MODE) {
        const preview = lines.slice(0, 5).map((line, i) => `#${i + 1}: ${line}`);
        setDebugInfo([
          `📄 ファイル名: ${file.name}`,
          `📏 行数: ${lines.length}`,
          `🔍 内容プレビュー（先頭5行）:`,
          ...preview,
        ]);
      }

      onTextLoaded(lines);
    };

    reader.onerror = () => {
      setDebugInfo(['❌ ファイルの読み込みに失敗しました']);
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full px-4">
      <input
        type="file"
        accept=".txt"
        onChange={handleFile}
        className="block w-full text-sm text-gray-700
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-red-500 file:text-white
                   hover:file:bg-red-600"
      />

      <p className="text-xs text-gray-500 text-center">
        LINEの「トーク履歴を送信」でエクスポートした .txt ファイルを選択してください。
      </p>

      {DEBUG_MODE && (
        <div className="w-full max-w-md text-xs text-left whitespace-pre-wrap bg-gray-100 p-3 rounded shadow-inner border border-gray-300">
          <strong className="text-red-600">[デバッグログ]</strong>
          {'\n'}
          {debugInfo.join('\n')}
        </div>
      )}
    </div>
  );
};

export default Upload;
