import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './lib/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FF2D78',
                    50: '#FFE5EF',
                    100: '#FFCCE0',
                    200: '#FF99C1',
                    300: '#FF66A3',
                    400: '#FF3384',
                    500: '#FF2D78',
                    600: '#E6005C',
                    700: '#B30047',
                    800: '#800033',
                    900: '#4D001F',
                },
                secondary: {
                    DEFAULT: '#00F5FF',
                    50: '#E5FEFF',
                    100: '#CCFDFF',
                    200: '#99FBFF',
                    300: '#66F9FF',
                    400: '#33F7FF',
                    500: '#00F5FF',
                    600: '#00C4CC',
                    700: '#009399',
                    800: '#006266',
                    900: '#003133',
                },
                accent: {
                    DEFAULT: '#FFE500',
                    500: '#FFE500',
                },
                purple: {
                    DEFAULT: '#7B2FFF',
                    500: '#7B2FFF',
                },
                dark: {
                    DEFAULT: '#0A0A1A',
                    50: '#1A1A2E',
                    100: '#16162B',
                    200: '#121225',
                    300: '#0E0E1F',
                    400: '#0A0A1A',
                    500: '#060614',
                    600: '#02020E',
                },
                card: 'rgba(255,255,255,0.04)',
                border: 'rgba(255,255,255,0.10)',
            },
            fontFamily: {
                heading: ['Orbitron', 'sans-serif'],
                body: ['Poppins', 'sans-serif'],
                sinhala: ['Noto Sans Sinhala', 'sans-serif'],
                tamil: ['Noto Sans Tamil', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 2s infinite',
                'float-slow': 'float 8s ease-in-out 1s infinite',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'slide-up': 'slide-up 0.5s ease-out',
                'fade-in': 'fade-in 0.6s ease-out',
                'blob': 'blob 7s infinite',
                'rocket': 'rocket 0.5s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(3deg)' },
                },
                'glow-pulse': {
                    '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
                    '50%': { opacity: '0.8', filter: 'brightness(1.3)' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                blob: {
                    '0%': { transform: 'translate(0, 0) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0, 0) scale(1)' },
                },
                rocket: {
                    '0%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                    '100%': { transform: 'translateY(0)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-gradient': 'linear-gradient(135deg, #0A0A1A 0%, #1A0A2E 50%, #0A0A1A 100%)',
            },
            boxShadow: {
                'glow-pink': '0 0 20px rgba(255, 45, 120, 0.3), 0 0 60px rgba(255, 45, 120, 0.1)',
                'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.3), 0 0 60px rgba(0, 245, 255, 0.1)',
                'glow-purple': '0 0 20px rgba(123, 47, 255, 0.3), 0 0 60px rgba(123, 47, 255, 0.1)',
                'card-hover': '0 8px 32px rgba(255, 45, 120, 0.2), 0 0 0 1px rgba(255, 45, 120, 0.3)',
            },
        },
    },
    plugins: [],
};

export default config;
