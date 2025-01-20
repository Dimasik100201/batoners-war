import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #1a1a1a;
    color: #ffffff;
    overflow-x: hidden;
  }

  button {
    font-family: inherit;
  }

  /* Стили для Telegram Mini App */
  body {
    --tg-theme-bg-color: #1a1a1a;
    --tg-theme-text-color: #ffffff;
    --tg-theme-hint-color: #7d7d7d;
    --tg-theme-link-color: #ffeb3b;
    --tg-theme-button-color: #ffeb3b;
    --tg-theme-button-text-color: #000000;
  }
`; 