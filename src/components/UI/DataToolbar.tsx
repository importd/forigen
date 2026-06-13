import { useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { Thinker } from '../../types';
import { exportAllMarkdown, importAllMarkdown } from '../../utils/markdownIO';

interface DataToolbarProps {
  thinkers: Thinker[];
}

export function DataToolbar({ thinkers }: DataToolbarProps) {
  const { notes, setNote, upsertCustomThinker } = useAppContext();
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
      const { notes: imported, newThinkers, noteCount, thinkerCount, errors } =
        await importAllMarkdown(file);

      for (const [id, content] of Object.entries(imported)) {
        setNote(id, content as string);
      }

      for (const thinker of newThinkers) {
        upsertCustomThinker(thinker);
      }

      const parts: string[] = [];
      if (noteCount > 0) parts.push(`${noteCount} 条笔记`);
      if (thinkerCount > 0) parts.push(`${thinkerCount} 位哲学家`);
      let msg = parts.length > 0 ? `已导入 ${parts.join('、')}` : '未发现新数据';
      if (errors.length > 0) msg += `（${errors.length} 个文件跳过）`;
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
        title="下载所有数据为 Markdown 文件 (.zip)"
        style={{
          color: '#556677', cursor: 'pointer', fontSize: 11,
          marginRight: 12, userSelect: 'none',
        }}
      >
        ⬇ 导出
      </span>
      <span
        onClick={() => !importing && fileInputRef.current?.click()}
        title="上传 .md 或 .zip 文件（新增哲学家 / 恢复笔记）"
        style={{
          color: importing ? '#334455' : '#556677',
          cursor: importing ? 'default' : 'pointer',
          fontSize: 11, userSelect: 'none',
        }}
      >
        {importing ? '...' : '⬆ 导入'}
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
