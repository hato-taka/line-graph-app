'use client';

type Props = {
  onTextLoaded: (lines: string[]) => void;
};

const Upload = ({ onTextLoaded }: Props) => {
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    onTextLoaded(lines);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <label
        htmlFor="file-upload"
        className="bg-red-500 text-white py-2 px-4 rounded-full text-sm shadow-sm active:opacity-80"
      >
        トーク履歴を選択
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".txt"
        onChange={handleFile}
        className="hidden"
      />
      <p className="text-xs text-gray-500 text-center">
        ※ LINEの「トーク履歴を送信」でエクスポートした.txtファイルを選択してください
      </p>
    </div>
  );
};

export default Upload;
