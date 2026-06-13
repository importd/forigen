import { useState, useCallback, useRef } from 'react';

interface TimelineProps {
  year: number;
  onChange: (year: number) => void;
  thinkerCount?: number;
  minYear?: number;
  maxYear?: number;
}

const ZOOM_HALF_RANGES = [320, 160, 80, 40, 20, 10];

export function Timeline({ year, onChange, thinkerCount, minYear = 1700, maxYear = 2026 }: TimelineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [jumpInput, setJumpInput] = useState('');
  const [showJump, setShowJump] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const jumpInputRef = useRef<HTMLInputElement>(null);

  const halfRange = ZOOM_HALF_RANGES[zoomLevel];
  const sliderMin = zoomLevel === 0
    ? minYear
    : Math.round(Math.max(minYear, year - halfRange));
  const sliderMax = zoomLevel === 0
    ? maxYear
    : Math.round(Math.min(maxYear, year + halfRange));

  const step = useCallback((delta: number) => {
    onChange(Math.max(minYear, Math.min(maxYear, year + delta)));
  }, [year, minYear, maxYear, onChange]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      const startYear = year < maxYear ? year : minYear;
      let current = startYear;
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        current += speed;
        if (current >= maxYear) {
          current = maxYear;
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsPlaying(false);
        }
        onChange(current);
      }, 100 / speed);
    }
  }, [isPlaying, year, speed, minYear, maxYear, onChange]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      setZoomLevel((z) => Math.min(ZOOM_HALF_RANGES.length - 1, z + 1));
    } else {
      setZoomLevel((z) => Math.max(0, z - 1));
    }
  }, []);

  const handleJump = useCallback(() => {
    const n = parseInt(jumpInput);
    if (!isNaN(n) && n >= minYear && n <= maxYear) {
      onChange(n);
      setJumpInput('');
      setShowJump(false);
    }
  }, [jumpInput, minYear, maxYear, onChange]);

  // Adaptive tick marks based on zoom level
  const tickInterval = [25, 10, 5, 5, 1, 1][zoomLevel];
  const majorEvery = [2, 5, 5, 10, 5, 5][zoomLevel];
  const marks: number[] = [];
  for (let y = Math.ceil(sliderMin / tickInterval) * tickInterval; y <= sliderMax; y += tickInterval) {
    marks.push(y);
  }

  const btnStyle = (active: boolean): React.CSSProperties => ({
    background: 'none',
    border: '1px solid #1a3a5c',
    borderRadius: 3,
    color: active ? '#4fc3f7' : '#556677',
    cursor: 'pointer',
    fontSize: 10,
    padding: '1px 6px',
    fontFamily: 'inherit',
    lineHeight: '16px',
    userSelect: 'none',
  });

  return (
    <div
      onWheel={handleWheel}
      title="滚轮缩放时间刻度 · 点击年份可输入跳转"
      style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(720px, 88vw)',
        background: 'rgba(13, 26, 45, 0.92)',
        border: '1px solid #1a3a5c',
        borderRadius: 8,
        padding: '10px 18px 14px',
        color: '#aaccdd',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        zIndex: 10,
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => step(-10)} style={btnStyle(false)} title="后退十年">⏮</button>
          <button onClick={() => step(-1)} style={btnStyle(false)} title="后退一年">◀</button>
        </div>

        <div style={{ textAlign: 'center' }}>
          {showJump ? (
            <input
              ref={jumpInputRef}
              type="number"
              min={minYear}
              max={maxYear}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleJump(); if (e.key === 'Escape') setShowJump(false); }}
              onBlur={() => { handleJump(); }}
              placeholder={`${minYear}–${maxYear}`}
              autoFocus
              style={{
                width: 72,
                fontSize: 16,
                fontWeight: 'bold',
                color: '#fff',
                background: '#111d2d',
                border: '1px solid #4fc3f7',
                borderRadius: 4,
                padding: '2px 8px',
                textAlign: 'center',
                fontFamily: 'inherit',
                fontVariantNumeric: 'tabular-nums',
                outline: 'none',
              }}
            />
          ) : (
            <span
              onClick={() => { setJumpInput(String(Math.round(year))); setShowJump(true); }}
              style={{
                fontSize: 20, fontWeight: 'bold', color: '#fff',
                fontVariantNumeric: 'tabular-nums',
                cursor: 'pointer', userSelect: 'none',
              }}
              title="点击输入年份跳转"
            >
              {Math.round(year)}
            </span>
          )}
          {thinkerCount !== undefined && (
            <span style={{ fontSize: 11, color: '#556677', fontWeight: 'normal', marginLeft: 6 }}>
              {thinkerCount} 人
            </span>
          )}
          {zoomLevel > 0 && (
            <span style={{ fontSize: 9, color: '#4fc3f7', marginLeft: 6 }}>
              ±{halfRange}y
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button onClick={() => step(1)} style={btnStyle(false)} title="前进一年">▶</button>
          <button onClick={() => step(10)} style={btnStyle(false)} title="前进十年">⏭</button>
          <span style={{ width: 6 }} />
          <span
            style={{ fontSize: 10, color: '#556677', cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setSpeed((s) => (s % 5) + 1)}
            title="切换播放速度"
          >
            {speed}×
          </span>
          <button
            onClick={togglePlay}
            style={{
              background: isPlaying ? '#ff7043' : '#1a3a5c',
              border: '1px solid #334455',
              borderRadius: 4,
              color: '#fff',
              padding: '2px 10px',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </div>

      {/* Slider */}
      <div style={{ position: 'relative', height: 22, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: '#1a3a5c', borderRadius: 1,
        }} />
        <div style={{
          position: 'absolute', left: 0,
          width: `${((year - sliderMin) / (sliderMax - sliderMin)) * 100}%`,
          height: 2,
          background: '#4fc3f7',
          borderRadius: 1,
        }} />
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          value={year}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: 'absolute', left: 0, right: 0,
            width: '100%', height: 22,
            WebkitAppearance: 'none', background: 'transparent',
            cursor: 'pointer', margin: 0,
          }}
        />
      </div>

      {/* Tick marks — adaptive density */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, position: 'relative' }}>
        {marks.map((m, i) => {
          const isMajor = i % majorEvery === 0;
          const near = Math.abs(year - m) < (halfRange < 20 ? 1 : halfRange < 80 ? 2 : 5);
          return (
            <span
              key={m}
              onClick={() => onChange(m)}
              style={{
                fontSize: isMajor ? 10 : 7,
                color: near ? '#4fc3f7' : isMajor ? '#556677' : '#334455',
                cursor: 'pointer',
                userSelect: 'none',
                fontWeight: near ? 'bold' : 'normal',
              }}
            >
              {isMajor ? m : (halfRange < 40 ? '│' : '')}
            </span>
          );
        })}
      </div>

      {/* Hint */}
      {zoomLevel === 0 && (
        <div style={{ textAlign: 'center', marginTop: 3, fontSize: 8, color: '#334455' }}>
          滚轮缩放 · Scroll to zoom
        </div>
      )}

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #4fc3f7;
          border: 2px solid #0a0a1a;
          cursor: pointer;
          margin-top: -6px;
        }
        input[type='range']::-webkit-slider-runnable-track {
          height: 2px;
          background: transparent;
        }
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
