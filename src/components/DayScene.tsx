import { useEffect, useState } from 'react';

interface Cloud {
  id: number;
  top: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export function DayScene() {
  const [clouds, setClouds] = useState<Cloud[]>([]);

  useEffect(() => {
    // 生成随机云朵
    const initialClouds: Cloud[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      top: 5 + Math.random() * 25,
      size: 60 + Math.random() * 80,
      opacity: 0.5 + Math.random() * 0.4,
      duration: 40 + Math.random() * 40,
      delay: Math.random() * -60,
    }));
    setClouds(initialClouds);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 天空渐变背景 */}
      <div className="absolute inset-0 day-bg" />

      {/* 太阳 */}
      <div className="absolute top-8 right-12 md:top-12 md:right-24">
        <div className="relative">
          {/* 光晕 */}
          <div className="absolute -inset-8 bg-yellow-200/30 rounded-full blur-2xl animate-pulse-slow" />
          <div className="absolute -inset-4 bg-yellow-100/50 rounded-full blur-xl" />
          {/* 太阳本体 */}
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full shadow-lg relative">
            {/* 太阳纹理 */}
            <div className="absolute inset-2 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full opacity-80" />
          </div>
        </div>
      </div>

      {/* 云朵 */}
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute"
          style={{
            top: `${cloud.top}%`,
            opacity: cloud.opacity,
            animation: `cloud ${cloud.duration}s linear infinite`,
            animationDelay: `${cloud.delay}s`,
          }}
        >
          <CloudSVG size={cloud.size} />
        </div>
      ))}
    </div>
  );
}

function CloudSVG({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 100 60"
      fill="white"
      className="drop-shadow-lg"
    >
      <ellipse cx="25" cy="40" rx="20" ry="15" />
      <ellipse cx="50" cy="35" rx="25" ry="20" />
      <ellipse cx="75" cy="40" rx="18" ry="14" />
      <ellipse cx="40" cy="25" rx="18" ry="14" />
      <ellipse cx="60" cy="28" rx="15" ry="12" />
    </svg>
  );
}
