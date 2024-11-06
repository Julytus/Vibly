import { useState, useEffect } from 'react';

const useMiniChatToggle = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('miniChatOpen');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('miniChatOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  const toggleMiniChat = () => {
    setIsOpen(!isOpen);
  };

  return { isOpen, toggleMiniChat };
};

export default useMiniChatToggle; 