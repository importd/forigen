import { useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { Thinker } from '../../types';
import { exportAllMarkdown, importAllMarkdown } from '../../utils/markdownIO';

interface DataToolbarProps {
  thinkers: Thinker[];
}

export function DataToolbar({ thinkers }: DataToolbarProps) {
  const { notes, setNote } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    await exportAllMarkdown(thinkers, notes);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const { notes: imported, count, errors } = await importAllMarkdown(file);

      for (const [id, content] of Object.entries(imported)) {
        setNote(id, content as string);
      }

      let msg = `已导入 ${count} 条笔记 · Imported ${count} notes`;
      if (errors.length > 0) {
        msg += `\n\n${errors.length} 个文件解析失败：\n${errors.slice(0, 5).join('\n')}`;
      }
      alert(msg);
    } catch {
      alert('导入失败，请检查文件格式。支持 .zip（导出格式）或 .md 文件');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
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
      <span style={{ fontSize: 10, color: '#556677', minWidth: 50, textAlign: 'right' }}>
        {noteCount} 条笔记
      </span>
      <button
        onClick={handleExport}
        title="导出所有思想家数据和笔记为 Markdown 文件 (zip)"
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
        ⬇ 导出 .md
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={importing}
        title="从 .zip 或 .md 文件导入笔记"
        style={{
          background: '#1a2a3d',
          border: '1px solid #2a5078',
          borderRadius: 4,
          color: importing ? '#556677' : '#aaccdd',
          cursor: importing ? 'default' : 'pointer',
          fontSize: 11,
          padding: '4px 10px',
        }}
      >
        {importing ? '...' : '⬆ 导入'}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip,.md"
        onChange={handleImport}
        style={{ display: 'none' }}
      />
    </div>
  );
}
