import { Message } from '@/types';

export const parseMessages = (lines: string[]): Message[] => {
  const messages: Message[] = [];
  let currentDate: string | null = null;

  const dateRegex = /^\d{4}\/\d{1,2}\/\d{1,2}/; // 例: 2025/4/19

  for (const line of lines) {
    const trimmed = line.trim();

    // 日付行の検出（例: 2025/4/19(土)）
    if (dateRegex.test(trimmed)) {
      const rawDate = trimmed.match(dateRegex)?.[0]; // "2025/4/19"
      if (rawDate) {
        const parts = rawDate.split('/').map((n) => n.padStart(2, '0'));
        currentDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
      }
      continue;
    }

    // メッセージ行の処理（タブ区切り）
    const parts = trimmed.split('\t');
    if (parts.length < 3 || !currentDate) continue;

    const time = parts[0]; // "10:09"
    const sender = parts[1];
    const content = parts.slice(2).join(' '); // [写真] など含む

    const datetime = new Date(`${currentDate}T${time}`);
    if (isNaN(datetime.getTime())) continue;

    messages.push({
      sender,
      timestamp: datetime,
      content,
    });
  }

  return messages;
};
