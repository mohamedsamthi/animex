import { create } from 'zustand';
import { Profile } from '@/types';

interface AuthState {
    user: Profile | null;
    session: { access_token: string } | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    setUser: (user: Profile | null) => void;
    setSession: (session: { access_token: string } | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    setUser: (user) =>
        set({
            user,
            isAuthenticated: !!user,
            isAdmin: user?.is_admin ?? false,
        }),
    setSession: (session) => set({ session }),
    setLoading: (isLoading) => set({ isLoading }),
    logout: () =>
        set({
            user: null,
            session: null,
            isAuthenticated: false,
            isAdmin: false,
        }),
}));
