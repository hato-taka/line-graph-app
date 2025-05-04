'use client';

import { useState } from 'react';
import { parseMessages } from '@/lib/parser';
import { Message } from '@/types';

type Props = {
  onTextLoaded: (lines: string[]) => void;
};

const DEBUG_MODE = true;

const Upload = ({ onTextLoaded }: Props) => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [parsedPreview, setParsedPreview] = useState<Message[]>([]);

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

      const previewLines = lines.slice(0, 5).map((line, i) => `#${i + 1}: ${line}`);

      let parsed: Message[] = [];
      try {
        parsed = parseMessages(lines);
      } catch (err) {
        previewLines.push('❌ パース中にエラーが発生しました');
      }

      if (DEBUG_MODE) {
        setDebugInfo([
          `📄 ファイル名: ${file.name}`,
          `📏 行数: ${lines.length}`,
          `🔍 内容プレビュー（先頭5行）:`,
          ...previewLines,
        ]);
        setParsedPreview(parsed.slice(0, 3));
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
        <div className="w-full max-w-md text-sm text-left whitespace-pre-wrap bg-gray-100 p-4 rounded shadow-inner border border-gray-300 leading-relaxed text-gray-800">
          <strong className="text-red-600">[デバッグログ]</strong>
          <br />
          {debugInfo.map((line, index) => (
            <div key={index}>{line}</div>
          ))}

          {parsedPreview.length > 0 && (
            <>
              <div className="mt-3 text-blue-800 font-bold">🛠 整形後データ（先頭3件）:</div>
              {parsedPreview.map((msg, i) => (
                <div key={i} className="text-xs text-gray-700 mt-1 border-b border-gray-300 pb-1">
                  👤 {msg.sender} <br />
                  🕒 {msg.timestamp.toString()} <br />
                  💬 {msg.content}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;
