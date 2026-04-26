import { useMemo } from 'react';

interface RadarChartProps {
  data: { label: string; value: number; maxValue?: number }[];
  size?: number;
  className?: string;
}

export function RadarChart({ data, size = 300, className = '' }: RadarChartProps) {
  const center = size / 2;
  const radius = size / 2 - 40;
  const levels = 5;

  const { points, gridPoints, labelPoints } = useMemo(() => {
    const angleStep = (2 * Math.PI) / data.length;

    // 计算数据点
    const dataPoints = data.map((item, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const maxVal = item.maxValue || 100;
      const normalizedValue = Math.min(item.value / maxVal, 1);
      return {
        x: center + radius * normalizedValue * Math.cos(angle),
        y: center + radius * normalizedValue * Math.sin(angle),
      };
    });

    // 计算网格点
    const grid: { level: number; points: { x: number; y: number }[] }[] = [];
    for (let level = 1; level <= levels; level++) {
      const levelRadius = (radius * level) / levels;
      const points = data.map((_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        return {
          x: center + levelRadius * Math.cos(angle),
          y: center + levelRadius * Math.sin(angle),
        };
      });
      grid.push({ level, points });
    }

    // 计算标签位置
    const labels = data.map((item, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const labelRadius = radius + 25;
      return {
        x: center + labelRadius * Math.cos(angle),
        y: center + labelRadius * Math.sin(angle),
        label: item.label,
        value: item.value,
      };
    });

    return { points: dataPoints, gridPoints: grid, labelPoints: labels };
  }, [data, center, radius]);

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className={`flex justify-center ${className}`}>
      <svg width={size} height={size} className="overflow-visible">
        {/* 网格线 */}
        {gridPoints.map((grid) => (
          <polygon
            key={grid.level}
            points={grid.points.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="currentColor"
            className="text-gray-200 dark:text-slate-700"
            strokeWidth="1"
          />
        ))}

        {/* 轴线 */}
        {data.map((_, i) => {
          const angle = ((2 * Math.PI) / data.length) * i - Math.PI / 2;
          const endX = center + radius * Math.cos(angle);
          const endY = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={endX}
              y2={endY}
              stroke="currentColor"
              className="text-gray-200 dark:text-slate-700"
              strokeWidth="1"
            />
          );
        })}

        {/* 数据区域 */}
        <path
          d={pathD}
          fill="url(#radarGradient)"
          fillOpacity="0.3"
          stroke="url(#radarStrokeGradient)"
          strokeWidth="2"
        />

        {/* 数据点 */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#6366f1"
            className="drop-shadow"
          />
        ))}

        {/* 标签 */}
        {labelPoints.map((label, i) => (
          <text
            key={i}
            x={label.x}
            y={label.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-gray-600 dark:fill-gray-300 font-medium"
          >
            {label.label}
          </text>
        ))}

        {/* 渐变定义 */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="radarStrokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
