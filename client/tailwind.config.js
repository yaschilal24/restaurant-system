// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,jsx}'],
//   theme: {
//     extend: {
//       colors: {
//         bg: {
//           primary: '#0B0B0D',
//           secondary: '#101014',
//           card: '#151518',
//           elevated: '#1B1B20',
//           input: '#202025',
//         },
//         primary: {
//           DEFAULT: '#FF1744',
//           hover: '#FF3157',
//           soft: 'rgba(255,23,68,0.12)',
//         },
//         success: '#00C896',
//         warning: '#F5A623',
//         danger: '#FF1744',
//         info: '#4A90E2',
//         txt: {
//           primary: '#FFFFFF',
//           secondary: '#A7A7AF',
//           muted: '#6F7078',
//           disabled: '#45464D',
//         },
//       },
//       border: {
//         DEFAULT: 'rgba(255,255,255,0.07)',
//         active: 'rgba(255,23,68,0.35)',
//       },
//       boxShadow: {
//         card: '0 4px 24px rgba(0,0,0,0.4)',
//         glow: '0 0 20px rgba(255,23,68,0.3)',
//       },
//       borderRadius: {
//         card: '1rem',
//         'card-lg': '1.25rem',
//       },
//       keyframes: {
//         'slide-in': {
//           '0%': { transform: 'translateX(100%)', opacity: 0 },
//           '100%': { transform: 'translateX(0)', opacity: 1 },
//         },
//         'fade-in': {
//           '0%': { opacity: 0, transform: 'translateY(-8px)' },
//           '100%': { opacity: 1, transform: 'translateY(0)' },
//         },
//       },
//       animation: {
//         'slide-in': 'slide-in 0.3s ease-out',
//         'fade-in': 'fade-in 0.2s ease-out',
//       },
//     },
//   },
//   plugins: [],
// };
//** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0B0B0D',
          secondary: '#101014',
          card: '#151518',
          elevated: '#1B1B20',
          input: '#202025',
        },
        primary: {
          DEFAULT: '#FF1744',
          hover: '#FF3157',
          soft: 'rgba(255,23,68,0.12)',
        },
        success: '#00C896',
        warning: '#F5A623',
        danger: '#FF1744',
        info: '#4A90E2',
        txt: {
          primary: '#FFFFFF',
          secondary: '#A7A7AF',
          muted: '#6F7078',
          disabled: '#45464D',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          active: 'rgba(255,23,68,0.35)',
        },
      },
      borderRadius: {
        card: '1rem',
        'card-lg': '1.25rem',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.4)',
        glow: '0 0 20px rgba(255,23,68,0.3)',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(-8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};