import { useState, useCallback, useRef, useMemo } from 'react';

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

  const getStepSize = (y: number): number => {
    if (y < 0) return 100;
    if (y < 1500) return 50;
    if (y < 1700) return 25;
    if (y < 1800) return 10;
    if (y < 1900) return 5;
    if (y < 2000) return 2;
    return 1;
  };
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

  // Adaptive tick marks — sparse in ancient, dense in modern
  const marks = useMemo(() => {
    const result: number[] = [];
    let y = Math.floor(sliderMin);
    while (y <= sliderMax) {
      result.push(y);
      let step = 200;
      if (y < 0) step = 200;
      else if (y < 500) step = 100;
      else if (y < 1500) step = 100;
      else if (y < 1700) step = 50;
      else if (y < 1800) step = 25;
      else if (y < 1900) step = 10;
      else if (y < 2000) step = 5;
      else step = 2;
      step = Math.max(1, Math.round(step / (zoomLevel + 1)));
      y += step;
    }
    return result;
  }, [sliderMin, sliderMax, zoomLevel]);

  // Determine if a mark is "major" (gets a year label)
  const isMajorMark = (y: number): boolean => {
    if (y < 0) return y % 200 === 0;
    if (y < 1500) return y % 100 === 0;
    if (y < 1800) return y % 50 === 0;
    if (y < 1900) return y % 25 === 0;
    if (y < 2000) return y % 10 === 0;
    return y % 5 === 0;
  };

  const getTickSymbol = (y: number): string => {
    if (y < 0) return y % 100 === 0 ? '|' : '·';
    if (y < 1500) return y % 50 === 0 ? '|' : '·';
    if (y < 1800) return y % 25 === 0 ? '|' : '·';
    return y % 5 === 0 ? '|' : '·';
  };

  const btnStyle = (active: boolean): React.CSSProperties => ({
    background: 'none',
    border: '1px solid var(--border)',
    borderRadius: 3,
    color: active ? 'var(--stamp-red)' : 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: 10,
    padding: '1px 6px',
    fontFamily: 'var(--font-mono)',
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
        background: 'rgba(242, 237, 228, 0.92)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '10px 18px 14px',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        zIndex: 10,
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => step(-getStepSize(year) * 10)} style={btnStyle(false)} title="大步后退">⏮</button>
          <button onClick={() => step(-getStepSize(year))} style={btnStyle(false)} title="小步后退">◀</button>
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
                color: 'var(--text-primary)',
                background: 'var(--paper)',
                border: '1px solid var(--stamp-red)',
                borderRadius: 4,
                padding: '2px 8px',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontVariantNumeric: 'tabular-nums',
                outline: 'none',
              }}
            />
          ) : (
            <span
              onClick={() => { setJumpInput(String(Math.round(year))); setShowJump(true); }}
              style={{
                fontSize: 20, fontWeight: 'bold', color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                fontVariantNumeric: 'tabular-nums',
                cursor: 'pointer', userSelect: 'none',
              }}
              title="点击输入年份跳转"
            >
              {Math.round(year)}
            </span>
          )}
          {thinkerCount !== undefined && (
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 'normal', marginLeft: 6 }}>
              {thinkerCount} 人
            </span>
          )}
          {zoomLevel > 0 && (
            <span style={{ fontSize: 9, color: 'var(--stamp-red)', fontFamily: 'var(--font-mono)', marginLeft: 6 }}>
              ±{halfRange}y
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button onClick={() => step(getStepSize(year))} style={btnStyle(false)} title="小步前进">▶</button>
          <button onClick={() => step(getStepSize(year) * 10)} style={btnStyle(false)} title="大步前进">⏭</button>
          <span style={{ width: 6 }} />
          <span
            style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setSpeed((s) => (s % 5) + 1)}
            title="切换播放速度"
          >
            {speed}×
          </span>
          <button
            onClick={togglePlay}
            style={{
              background: isPlaying ? 'var(--stamp-red)' : 'var(--surface-hover)',
              border: '1px solid var(--border)',
              borderRadius: 4,
              color: 'var(--text-primary)',
              padding: '2px 10px',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
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
          background: 'var(--border)', borderRadius: 1,
        }} />
        <div style={{
          position: 'absolute', left: 0,
          width: `${((year - sliderMin) / (sliderMax - sliderMin)) * 100}%`,
          height: 2,
          background: 'var(--stamp-red)',
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

      {/* Tick marks — adaptive density: sparse in ancient, dense in modern */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, position: 'relative' }}>
        {marks.map((m) => {
          const major = isMajorMark(m);
          const near = Math.abs(year - m) < (halfRange < 20 ? 1 : halfRange < 80 ? 2 : 5);
          return (
            <span
              key={m}
              onClick={() => onChange(m)}
              style={{
                fontSize: major ? 9 : 6,
                color: near ? 'var(--stamp-red)' : major ? 'var(--text-muted)' : 'var(--border)',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                userSelect: 'none',
                fontWeight: near ? 'bold' : 'normal',
              }}
            >
              {major ? m : getTickSymbol(m)}
            </span>
          );
        })}
      </div>

      {/* Hint */}
      {zoomLevel === 0 && (
        <div style={{ textAlign: 'center', marginTop: 3, fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          滚轮缩放 · Scroll to zoom
        </div>
      )}

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: var(--stamp-red);
          border: 2px solid var(--paper);
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
