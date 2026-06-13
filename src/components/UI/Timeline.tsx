import { useState, useCallback } from 'react';

interface TimelineProps {
  year: number;
  onChange: (year: number) => void;
  minYear?: number;
  maxYear?: number;
}

export function Timeline({ year, onChange, minYear = 1700, maxYear = 2020 }: TimelineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (prev) return false;

      const startYear = year < maxYear ? year : minYear;
      let current = startYear;
      const interval = setInterval(() => {
        current += speed;
        if (current >= maxYear) {
          current = maxYear;
          clearInterval(interval);
          setIsPlaying(false);
        }
        onChange(current);
      }, 100 / speed);
      return true;
    });
  }, [year, speed, minYear, maxYear, onChange]);

  const marks = [1700, 1800, 1850, 1900, 1950, 2000];

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'min(700px, 85vw)',
      background: 'rgba(13, 26, 45, 0.92)',
      border: '1px solid #1a3a5c',
      borderRadius: 8,
      padding: '12px 20px 16px',
      color: '#aaccdd',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      zIndex: 10,
    }}>
      {/* Year display */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>{Math.round(year)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{ fontSize: 10, color: '#556677', cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setSpeed((s) => (s % 5) + 1)}
            title="Click to change speed"
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
              padding: '2px 8px',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </div>

      {/* Slider */}
      <div style={{ position: 'relative', height: 24, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute',
          left: 0, right: 0, height: 2,
          background: '#1a3a5c',
          borderRadius: 1,
        }} />
        <div style={{
          position: 'absolute',
          left: 0,
          width: `${((year - minYear) / (maxYear - minYear)) * 100}%`,
          height: 2,
          background: '#4fc3f7',
          borderRadius: 1,
        }} />
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={year}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: 'absolute',
            left: 0, right: 0,
            width: '100%',
            height: 24,
            WebkitAppearance: 'none',
            background: 'transparent',
            cursor: 'pointer',
            margin: 0,
          }}
        />
      </div>

      {/* Year markers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {marks.map((m) => (
          <span
            key={m}
            onClick={() => onChange(m)}
            style={{
              fontSize: 10,
              color: Math.abs(year - m) < 10 ? '#4fc3f7' : '#556677',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {m}
          </span>
        ))}
      </div>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
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
      `}</style>
    </div>
  );
}
