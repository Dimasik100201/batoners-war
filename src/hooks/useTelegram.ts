declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        close: () => void;
        expand: () => void;
        MainButton: {
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
          onClick: (fn: () => void) => void;
          offClick: (fn: () => void) => void;
          enable: () => void;
          disable: () => void;
        };
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (fn: () => void) => void;
          offClick: (fn: () => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        isExpanded: boolean;
        initData: string;
        initDataUnsafe: {
          query_id: string;
          user: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          auth_date: string;
          hash: string;
        };
      };
    };
  }
}

export function useTelegram() {
  const tg = window.Telegram?.WebApp;

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    queryId: tg?.initDataUnsafe?.query_id,
    onClose: () => tg?.close(),
    onExpand: () => tg?.expand(),
    ready: () => tg?.ready(),
    mainButton: {
      show: () => tg?.MainButton.show(),
      hide: () => tg?.MainButton.hide(),
      setText: (text: string) => tg?.MainButton.setText(text),
      onClick: (fn: () => void) => tg?.MainButton.onClick(fn),
      offClick: (fn: () => void) => tg?.MainButton.offClick(fn),
      enable: () => tg?.MainButton.enable(),
      disable: () => tg?.MainButton.disable()
    },
    backButton: {
      show: () => tg?.BackButton.show(),
      hide: () => tg?.BackButton.hide(),
      onClick: (fn: () => void) => tg?.BackButton.onClick(fn),
      offClick: (fn: () => void) => tg?.BackButton.offClick(fn)
    },
    hapticFeedback: {
      impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => 
        tg?.HapticFeedback.impactOccurred(style),
      notificationOccurred: (type: 'error' | 'success' | 'warning') =>
        tg?.HapticFeedback.notificationOccurred(type),
      selectionChanged: () => tg?.HapticFeedback.selectionChanged()
    }
  };
} 