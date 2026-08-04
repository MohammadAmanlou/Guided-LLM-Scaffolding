import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatUIContext = createContext();

export const ChatUIProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [font, setFont] = useState('Vazirmatn');
  const [fontSize, setFontSize] = useState(16);
  const [userBubbleColor, setUserBubbleColor] = useState('#4f46e5');
  const [aiBubbleColor, setAiBubbleColor] = useState('#16a34a');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.setProperty('--chat-font', font);
    document.documentElement.style.setProperty('--chat-font-size', `${fontSize}px`);
    document.documentElement.style.setProperty('--user-bubble-color', userBubbleColor);
    document.documentElement.style.setProperty('--ai-bubble-color', aiBubbleColor);
  }, [theme, font, fontSize, userBubbleColor, aiBubbleColor]);

  return (
    <ChatUIContext.Provider
      value={{
        theme,
        font,
        fontSize,
        userBubbleColor,
        aiBubbleColor,
        setTheme,
        setFont,
        setFontSize,
        setUserBubbleColor,
        setAiBubbleColor,
      }}
    >
      {children}
    </ChatUIContext.Provider>
  );
};

export const useChatUI = () => useContext(ChatUIContext);
