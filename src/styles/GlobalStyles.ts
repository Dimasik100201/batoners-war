import { createGlobalStyle, keyframes } from 'styled-components';

const floatingStars = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  @keyframes gradientBG {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  body {
    font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(-45deg, #FFB347, #FFCC33, #FFD700, #FDB347);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    color: #ffffff;
    overflow-x: hidden;
  }

  .star {
    position: absolute;
    width: 20px;
    height: 20px;
    animation: ${floatingStars} 3s ease-in-out infinite;
    opacity: 0.6;
    pointer-events: none;
  }

  button {
    font-family: inherit;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }

  /* Стили для Telegram Mini App */
  body {
    --tg-theme-bg-color: transparent;
    --tg-theme-text-color: #ffffff;
    --tg-theme-hint-color: #7d7d7d;
    --tg-theme-link-color: #FFD700;
    --tg-theme-button-color: #FFD700;
    --tg-theme-button-text-color: #000000;
  }
`; 