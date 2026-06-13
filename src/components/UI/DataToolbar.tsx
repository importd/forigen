import { useRef } from 'react';
import { useAppContext } from '../../context/AppContext';

export function DataToolbar() {
  const { notes, setNote } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().slice(0, 10);
    a.download = `forigen-notes-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (typeof data !== 'object' || Array.isArray(data)) {
          alert('格式错误：需要 JSON 对象');
          return;
        }
        let count = 0;
        for (const [id, content] of Object.entries(data)) {
          if (typeof content === 'string' && content.trim()) {
            setNote(id, content as string);
            count++;
          }
        }
        alert(`已导入 ${count} 条笔记 · Imported ${count} notes`);
      } catch {
        alert('文件解析失败，请检查 JSON 格式');
      }
    };
    reader.readAsText(file);

    // Reset so the same file can be re-imported
    e.target.value = '';
  };

  const noteCount = Object.values(notes).filter(v => v.trim()).length;

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      right: 24,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      zIndex: 20,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <span style={{ fontSize: 10, color: '#556677' }}>
        {noteCount} 条笔记
      </span>
      <button
        onClick={handleExport}
        title="导出所有笔记"
        style={{
          background: '#1a2a3d',
          border: '1px solid #2a5078',
          borderRadius: 4,
          color: '#aaccdd',
          cursor: 'pointer',
          fontSize: 11,
          padding: '4px 10px',
        }}
      >
        ⬇ 导出
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        title="从文件导入笔记"
        style={{
          background: '#1a2a3d',
          border: '1px solid #2a5078',
          borderRadius: 4,
          color: '#aaccdd',
          cursor: 'pointer',
          fontSize: 11,
          padding: '4px 10px',
        }}
      >
        ⬆ 导入
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: 'none' }}
      />
    </div>
  );
}
