import { Message } from '@/types';
import cytoscape from 'cytoscape';

/**
 * トーク履歴から人物間の関係を解析し、相関図のノードとエッジを生成する
 * @param messages LINEのトーク履歴をMessage型で受け取る
 * @param topN 表示する上位の人数（デフォルト6名）
 * @returns Cytoscape.js 用の ElementDefinition 配列
 */
export const analyzeRelationships = (
  messages: Message[],
  topN: number = 6
): cytoscape.ElementDefinition[] => {
  // 1. 各発言者の発言数をカウント
  const freq: Record<string, number> = {};
  for (const msg of messages) {
    freq[msg.sender] = (freq[msg.sender] || 0) + 1;
  }

  // 2. 発言数の多い順にソートし、上位 topN 名を抽出
  const topUsers = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name]) => name);

  // 3. 上位ユーザーのノードを作成（発言数に応じたサイズ設定用に freq を保持）
  const nodes = topUsers.map((name) => ({
    data: { id: name, freq: freq[name] },
  }));

  // 4. 上位ユーザー同士の会話関係を抽出（連続メッセージを元に関係構築）
  const edges: Record<string, number> = {};
  for (let i = 1; i < messages.length; i++) {
    const from = messages[i - 1].sender;
    const to = messages[i].sender;

    if (from !== to && topUsers.includes(from) && topUsers.includes(to)) {
      const key = `${from}->${to}`;
      edges[key] = (edges[key] || 0) + 1;
    }
  }

  // 5. エッジを Cytoscape 形式で作成（関係の強さを weight に反映）
  const edgeElements = Object.entries(edges).map(([key, weight]) => {
    const [source, target] = key.split('->');
    return {
      data: {
        source,
        target,
        weight,
        label: `${weight}`, // オプション：ラベル表示用
      },
    };
  });

  return [...nodes, ...edgeElements];
};
