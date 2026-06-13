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
      let msg = `已导入 ${count} 条笔记`;
      if (errors.length > 0) msg += `，${errors.length} 个失败`;
      alert(msg);
    } catch {
      alert('导入失败，请检查文件格式');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 24,
      left: 24,
      zIndex: 15,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <span
        onClick={handleExport}
        title="导出数据备份 (.zip)"
        style={{
          color: '#556677', cursor: 'pointer', fontSize: 11,
          marginRight: 12, userSelect: 'none',
        }}
      >
        ⬇ 备份
      </span>
      <span
        onClick={() => !importing && fileInputRef.current?.click()}
        title="从备份恢复"
        style={{
          color: importing ? '#334455' : '#556677',
          cursor: importing ? 'default' : 'pointer',
          fontSize: 11, userSelect: 'none',
        }}
      >
        {importing ? '...' : '⬆ 恢复'}
      </span>
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
