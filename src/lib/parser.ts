import { Message } from '@/types';

export const parseMessages = (lines: string[]): Message[] => {
  const messages: Message[] = [];
  let currentDate: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 日付行（例：2025.04.29 火曜日）
    if (/^\d{4}\.\d{2}\.\d{2}/.test(line)) {
      currentDate = line.split(' ')[0].replace(/\./g, '-');
      continue;
    }

    const parts = line.split(' ');
    if (parts.length >= 3 && currentDate) {
      const time = parts[0];
      const sender = parts.slice(1, parts.length - 1).join(' ');
      const content = parts.slice(-1).join(' ');
      const datetimeStr = `${currentDate}T${time}`;
      const timestamp = new Date(datetimeStr);
      messages.push({ sender, timestamp, content });
    }
  }

  return messages;
};
