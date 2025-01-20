import WebApp from '@twa-dev/sdk';

type PopupButton = {
  id?: string;
  type?: 'default' | 'destructive' | 'ok' | 'close';
  text: string;
};

export const telegram = {
  ready: () => WebApp.ready(),
  close: () => WebApp.close(),
  expand: () => WebApp.expand(),
  showPopup: (title: string, message: string, buttons: PopupButton[] = []) => {
    WebApp.showPopup({
      title,
      message,
      buttons
    });
  },
  showAlert: (message: string) => WebApp.showAlert(message),
  showConfirm: (message: string) => WebApp.showConfirm(message),
  hapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => 
      WebApp.HapticFeedback.impactOccurred(style),
    notificationOccurred: (type: 'error' | 'success' | 'warning') =>
      WebApp.HapticFeedback.notificationOccurred(type),
    selectionChanged: () => WebApp.HapticFeedback.selectionChanged()
  },
  user: WebApp.initDataUnsafe?.user,
  themeParams: WebApp.themeParams,
  isExpanded: WebApp.isExpanded,
  viewportHeight: WebApp.viewportHeight,
  viewportStableHeight: WebApp.viewportStableHeight
}; 