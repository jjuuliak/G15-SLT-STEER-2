import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import './HamsterChat.css';
import SendIcon from "@mui/icons-material/Send";

const HamsterChat = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    navigate('/chat', { state: { initialMessage: input } });
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat" style={{ gridArea: 'chat' }}>
      <div className="hamster-container">
        <img src="/doctor-hamster.JPG" alt="Doctor Hamster" className="hamster-img" />
        <div className="chat-bubble">
          <p>{`Hi${user?.name ? ' ' + user.name : ''}!`}<br />
            It’s a brand new day to look after your health.<br />
            <strong>How can I help?</strong></p>
        </div>
      </div>
      <div className="chat-input">
        <input 
          type="text" 
          placeholder={t('ChatBoxPlaceholder')} 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend}>
          <span role="img" aria-label="send"><SendIcon /></span>
        </button>
      </div>
    </div>
  );
};

export default HamsterChat;