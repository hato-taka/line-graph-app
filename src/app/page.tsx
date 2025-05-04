'use client';

import { useState } from 'react';
import Upload from '@/components/upload';
import Graph from '@/components/graph';
import { parseMessages } from '@/lib/parser';
import { analyzeRelationships } from '@/lib/analyzer';
import { Message } from '@/types';

import cytoscape from 'cytoscape';

export default function HomePage() {
  const [elements, setElements] = useState<cytoscape.ElementDefinition[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (lines: string[]) => {
    setLoading(true);
    try {
      const messages: Message[] = parseMessages(lines);
      const graphElements = analyzeRelationships(messages);
      setElements(graphElements);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 space-y-6 max-w-md w-full mx-auto">
      <h1 className="text-2xl font-bold text-center text-red-600">
        文春グループ砲｜相関図ジェネレータ
      </h1>

      <Upload onTextLoaded={handleUpload} />

      {loading && <p className="text-center text-gray-500">解析中...</p>}

      {elements.length > 0 && (
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <Graph elements={elements} />
        </div>
      )}
    </main>
  );
}
