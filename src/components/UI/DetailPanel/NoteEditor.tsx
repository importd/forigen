import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { SectionLabel } from './CoreIdeasSection';

export function NoteEditor({ thinkerId }: { thinkerId: string }) {
  const { getNote, setNote } = useAppContext();
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(false);
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load note on thinker change
  const getNoteRef = useRef(getNote);
  getNoteRef.current = getNote;

  useEffect(() => {
    setText(getNoteRef.current(thinkerId));
    setEditing(false);
    setPreview(false);
    setSaved(true);
  }, [thinkerId]);

  // Auto-save with debounce
  const handleChange = useCallback((value: string) => {
    setText(value);
    setSaved(false);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setNote(thinkerId, value);
      setSaved(true);
    }, 600);
  }, [thinkerId, setNote]);

  const doSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setNote(thinkerId, text);
    setSaved(true);
  }, [thinkerId, setNote, text]);

  const hasContent = !!text.trim();

  // Toolbar actions for inserting markdown
  const insertMarkdown = useCallback((before: string, after: string = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = text.slice(start, end);
    const newText = text.slice(0, start) + before + selected + after + text.slice(end);
    setText(newText);
    handleChange(newText);
    // Restore cursor position
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + selected.length;
    });
  }, [text, handleChange]);

  // State 1: No content, not editing
  if (!editing && !hasContent) {
    return (
      <div style={{ padding: '12px 20px 20px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => setEditing(true)}
          style={{
            background: 'none', border: '1px dashed var(--border)',
            borderRadius: 6, color: 'var(--text-muted)',
            cursor: 'pointer', fontSize: 11, padding: '8px 14px',
            width: '100%', textAlign: 'left',
          }}
        >
          📝 添加笔记 · Add note...
        </button>
      </div>
    );
  }

  // Simple Markdown rendering
  const renderMarkdown = (md: string) => {
    let html = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/^- (.+)$/gm, '<li style="margin-left:12px;color:var(--text-secondary);">$1</li>');
    html = html.replace(/\n/g, '<br/>');
    return html;
  };

  // State 2: Has content, not editing → show rendered + controls
  if (!editing && hasContent) {
    return (
      <div style={{ padding: '12px 20px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 8,
        }}>
          <SectionLabel zh="📝 笔记" en="Notes" />
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>
              {saved ? '✓ 已保存 · Saved' : '... 保存中 · Saving'}
            </span>
          </div>
        </div>

        {preview ? (
          <div
            onClick={() => setEditing(true)}
            style={{
              fontSize: 12, color: 'var(--text-primary)', cursor: 'pointer',
              padding: '8px 0', lineHeight: 1.6,
            }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
          />
        ) : (
          <div
            onClick={() => setEditing(true)}
            style={{
              fontSize: 12, color: 'var(--text-primary)', cursor: 'pointer',
              padding: '8px 0', whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
            }}
          >
            {text.length > 300 ? text.slice(0, 300) + '...' : text}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            onClick={() => setEditing(true)}
            style={smallBtn}
          >
            ✏️ 编辑 · Edit
          </button>
          <button
            onClick={() => setPreview(!preview)}
            style={smallBtn}
          >
            {preview ? '📄 原文 · Raw' : '👁️ 预览 · Preview'}
          </button>
        </div>
      </div>
    );
  }

  // State 3: Editing
  return (
    <div style={{ padding: '12px 20px 20px', borderTop: '1px solid var(--border)' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <SectionLabel zh="📝 编辑笔记" en="Editing Notes" />
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 9, color: saved ? 'var(--text-muted)' : '#ffa726' }}>
            {saved ? '✓ 已保存' : '○ 未保存'}
          </span>
          <button onClick={() => { doSave(); setEditing(false); }} style={{
            background: 'none', border: '1px solid var(--border)',
            borderRadius: 4, color: 'var(--text-secondary)', cursor: 'pointer',
            fontSize: 10, padding: '2px 8px',
          }}>
            完成 · Done
          </button>
        </div>
      </div>

      {/* Formatting toolbar */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 8,
        flexWrap: 'wrap',
      }}>
        <ToolButton label="B" title="粗体 Bold" onClick={() => insertMarkdown('**', '**')} />
        <ToolButton label="I" title="斜体 Italic" onClick={() => insertMarkdown('*', '*')} />
        <ToolButton label="H" title="标题 Heading" onClick={() => insertMarkdown('## ')} />
        <ToolButton label="-" title="列表 List" onClick={() => insertMarkdown('- ')} />
        <ToolButton label="〉" title="引用 Quote" onClick={() => insertMarkdown('> ')} />
      </div>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => doSave()}
        placeholder={'学术笔记... 支持 Markdown\n# 标题\n**粗体** *斜体*\n- 列表\n> 引用'}
        autoFocus
        style={{
          width: '100%',
          minHeight: '140px',
          background: 'var(--paper)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          color: 'var(--text-primary)',
          fontSize: 12,
          padding: '10px 12px',
          resize: 'vertical',
          outline: 'none',
          fontFamily: 'inherit',
          lineHeight: 1.6,
        }}
      />
    </div>
  );
}

const smallBtn: React.CSSProperties = {
  background: 'none',
  border: '1px solid var(--border)',
  borderRadius: 4,
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  fontSize: 10,
  padding: '3px 8px',
};

function ToolButton({ label, title, onClick }: { label: string; title: string; onClick: () => void }) {
  return (
    <button
      title={title}
      onClick={(e) => { e.preventDefault(); onClick(); }}
      style={{
        background: 'var(--paper)',
        border: '1px solid var(--border)',
        borderRadius: 3,
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: 11,
        padding: '2px 7px',
        fontFamily: 'monospace',
        fontWeight: 700,
      }}
    >
      {label}
    </button>
  );
}
