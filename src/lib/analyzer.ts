import { Message } from '@/types';
import cytoscape from 'cytoscape';

export const analyzeRelationships = (
  messages: Message[]
): cytoscape.ElementDefinition[] => {
  const users = [...new Set(messages.map((m) => m.sender))];
  const nodes = users.map((name) => ({ data: { id: name } }));

  const links: Record<string, number> = {};
  for (let i = 1; i < messages.length; i++) {
    const from = messages[i - 1].sender;
    const to = messages[i].sender;
    if (from !== to) {
      const key = `${from}->${to}`;
      links[key] = (links[key] || 0) + 1;
    }
  }

  const edges = Object.entries(links).map(([key, value]) => {
    const [source, target] = key.split('->');
    return {
      data: { source, target, label: `${value}` },
    };
  });

  return [...nodes, ...edges];
};
