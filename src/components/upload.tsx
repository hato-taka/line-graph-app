'use client';

type Props = {
  onTextLoaded: (lines: string[]) => void;
};

const Upload = ({ onTextLoaded }: Props) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert('ファイルが選択されていません');
      return;
    }

    // ファイル形式チェック
    if (!file.name.endsWith('.txt')) {
      alert('対応しているのは .txt ファイルのみです');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split(/\r?\n/).filter(Boolean);
      console.log('読み込んだ行数:', lines.length);
      onTextLoaded(lines);
    };
    reader.onerror = () => {
      alert('ファイルの読み込みに失敗しました');
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full px-4">
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
    </div>
  );
};

export default Upload;
