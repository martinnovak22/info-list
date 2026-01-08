import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

type ToastAction = {
    label: string;
    onPress: () => void;
};

type ToastState = {
    visible: boolean;
    message: string;
    type: ToastType;
    action?: ToastAction;
    duration?: number;
    showToast: (message: string, type?: ToastType, action?: ToastAction, duration?: number) => void;
    hideToast: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
    visible: false,
    message: '',
    type: 'info',
    action: undefined,
    duration: 3000,
    showToast: (message, type = 'info', action, duration = 3000) => {
        set({ visible: true, message, type, action, duration });
    },
    hideToast: () => set({ visible: false, action: undefined }),
}));
