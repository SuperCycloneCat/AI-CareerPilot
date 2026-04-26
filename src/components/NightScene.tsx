import { useEffect, useState } from 'react';

interface Meteor {
  id: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
}

export function NightScene() {
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useEffect(() => {
    // 生成随机流星，从屏幕左上角外面飞入
    const initialMeteors: Meteor[] = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      top: -(5 + Math.random() * 15), // 负值，在屏幕上方外面
      left: -(5 + Math.random() * 20), // 负值，在屏幕左方外面
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 12,
    }));
    setMeteors(initialMeteors);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 夜空渐变背景 */}
      <div className="absolute inset-0 night-bg" />

      {/* 星星背景 */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.7,
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* 月亮 */}
      <div className="absolute top-8 right-12 md:top-12 md:right-24">
        <div className="relative">
          {/* 月光光晕 */}
          <div className="absolute -inset-6 bg-blue-200/10 rounded-full blur-2xl" />
          <div className="absolute -inset-3 bg-blue-100/20 rounded-full blur-xl" />
          {/* 月亮本体 */}
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full shadow-lg relative overflow-hidden">
            {/* 环形山 */}
            <div className="absolute w-3 h-3 bg-gray-300/60 rounded-full top-3 left-4" />
            <div className="absolute w-4 h-4 bg-gray-300/50 rounded-full top-8 left-8" />
            <div className="absolute w-2 h-2 bg-gray-300/40 rounded-full top-5 left-2" />
            <div className="absolute w-2.5 h-2.5 bg-gray-300/30 rounded-full top-10 left-5" />
            <div className="absolute w-1.5 h-1.5 bg-gray-300/50 rounded-full top-3 left-10" />
          </div>
        </div>
      </div>

      {/* 流星 */}
      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          className="meteor"
          style={{
            top: `${meteor.top}%`,
            left: `${meteor.left}%`,
            animationDuration: `${meteor.duration}s`,
            animationDelay: `${meteor.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
