import { create } from 'zustand';

interface PlayerState {
    isPlaying: boolean;
    isTheaterMode: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    playbackSpeed: number;
    currentSubtitle: 'en' | 'si' | 'ta' | 'off';
    showSkipIntro: boolean;
    showAutoplayCountdown: boolean;
    autoplaySeconds: number;
    setPlaying: (playing: boolean) => void;
    setTheaterMode: (theater: boolean) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setVolume: (volume: number) => void;
    setMuted: (muted: boolean) => void;
    setPlaybackSpeed: (speed: number) => void;
    setSubtitle: (sub: 'en' | 'si' | 'ta' | 'off') => void;
    setShowSkipIntro: (show: boolean) => void;
    setShowAutoplayCountdown: (show: boolean) => void;
    setAutoplaySeconds: (secs: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    isPlaying: false,
    isTheaterMode: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    playbackSpeed: 1,
    currentSubtitle: 'off',
    showSkipIntro: false,
    showAutoplayCountdown: false,
    autoplaySeconds: 10,
    setPlaying: (isPlaying) => set({ isPlaying }),
    setTheaterMode: (isTheaterMode) => set({ isTheaterMode }),
    setCurrentTime: (currentTime) => set({ currentTime }),
    setDuration: (duration) => set({ duration }),
    setVolume: (volume) => set({ volume }),
    setMuted: (isMuted) => set({ isMuted }),
    setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
    setSubtitle: (currentSubtitle) => set({ currentSubtitle }),
    setShowSkipIntro: (showSkipIntro) => set({ showSkipIntro }),
    setShowAutoplayCountdown: (showAutoplayCountdown) => set({ showAutoplayCountdown }),
    setAutoplaySeconds: (autoplaySeconds) => set({ autoplaySeconds }),
}));
