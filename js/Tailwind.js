tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: '#3ad59fcd', 
            secondary: '#EC4899', // 辅助色
            accent: '#10B981', // 强调色
            glass: 'rgba(255, 255, 255, 0.15)', // 玻璃态背景
            'glass-dark': 'rgba(17, 24, 39, 0.85)', // 深色模式玻璃态
            'glass-hover': 'rgba(255, 255, 255, 0.25)', // 玻璃态悬停背景
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
          },
          animation: {
            'float': 'float 6s ease-in-out infinite',
            'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            'fade-in': 'fadeIn 0.6s ease-out forwards', // 新增淡入动画
            'slide-up': 'slideUp 0.5s ease-out forwards', // 新增上滑动画
          },
           keyframes: {
            float: {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-10px)' },
            },
            fadeIn: {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' },
            },
            slideUp: {
              '0%': { transform: 'translateY(20px)', opacity: '0' },
              '100%': { transform: 'translateY(0)', opacity: '1' },
            }
          }
        },
      }
    }