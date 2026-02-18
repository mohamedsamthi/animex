import { create } from 'zustand';
import { ThemeMode } from '@/types';

interface UIState {
    theme: ThemeMode;
    language: string;
    isMobileMenuOpen: boolean;
    isSearchOpen: boolean;
    isNotificationsOpen: boolean;
    isKeyboardShortcutsOpen: boolean;
    setTheme: (theme: ThemeMode) => void;
    setLanguage: (lang: string) => void;
    toggleMobileMenu: () => void;
    setMobileMenuOpen: (open: boolean) => void;
    toggleSearch: () => void;
    setSearchOpen: (open: boolean) => void;
    toggleNotifications: () => void;
    setNotificationsOpen: (open: boolean) => void;
    setKeyboardShortcutsOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    theme: 'dark-cosmic',
    language: 'en',
    isMobileMenuOpen: false,
    isSearchOpen: false,
    isNotificationsOpen: false,
    isKeyboardShortcutsOpen: false,
    setTheme: (theme) => set({ theme }),
    setLanguage: (language) => set({ language }),
    toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
    setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
    toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
    setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
    toggleNotifications: () => set((s) => ({ isNotificationsOpen: !s.isNotificationsOpen })),
    setNotificationsOpen: (isNotificationsOpen) => set({ isNotificationsOpen }),
    setKeyboardShortcutsOpen: (isKeyboardShortcutsOpen) => set({ isKeyboardShortcutsOpen }),
}));
