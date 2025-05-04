'use client';

import { useState } from 'react';
import Upload from '@/components/upload';
import Graph from '@/components/graph';
import { parseMessages } from '@/lib/parser';
import { analyzeRelationships } from '@/lib/analyzer';
import { Message } from '@/types';
import type { ElementDefinition } from 'cytoscape';

export default function HomePage() {
  const [elements, setElements] = useState<ElementDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = (lines: string[]) => {
    setLoading(true);
    setError('');

    try {
      const messages: Message[] = parseMessages(lines);
      if (messages.length === 0) {
        setError('⚠️ メッセージが読み取れませんでした。形式をご確認ください。');
        return;
      }
      const graphElements = analyzeRelationships(messages, 6);
      if (graphElements.length === 0) {
        setError('⚠️ 有効な発言者が見つかりません。');
        return;
      }
      setElements(graphElements);
    } catch {
      setError('⚠️ エラーが発生しました。ファイル内容をご確認ください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 space-y-6 max-w-lg w-full mx-auto">
      <h1 className="text-2xl font-bold text-center text-red-600">
        文春グループ砲｜相関図ジェネレータ
      </h1>

      <Upload onTextLoaded={handleUpload} />

      {loading && <p className="text-center text-gray-500">解析中...</p>}
      {error && <p className="text-center text-red-500 text-sm">{error}</p>}

      {elements.length > 0 && (
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <Graph elements={elements} />
        </div>
      )}
    </main>
  );
}
