import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainChatInterface.css';

const MainChatInterface: React.FC = () => {
  const navigate = useNavigate();
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Привет! Я ваш чат-бот. Как я могу вам помочь?', sender: 'bot' },
    { id: 2, text: 'Здравствуйте! Я хотел бы узнать больше о ваших услугах.', sender: 'user' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [diagnosticData, setDiagnosticData] = useState({
    intent: 'greeting',
    confidence: 0.95,
    entities: [
      { name: 'name', value: 'Иван', confidence: 0.87 }
    ]
  });

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user' as 'user' | 'bot'
    };
    
    setMessages([...messages, newMessage]);
    setInputValue('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: 'Это пример ответа бота. В реальной системе здесь будет ответ от AI агента.',
        sender: 'bot' as 'user' | 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="main-chat-interface">
      {/* Left Panel */}
      <div className={`left-panel ${isLeftPanelOpen ? 'open' : 'collapsed'}`}>
        <div className="panel-header">
          <h2>Управление</h2>
          <button 
            className="toggle-panel-btn"
            onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
          >
            {isLeftPanelOpen ? '◀' : '▶'}
          </button>
        </div>
        
        {isLeftPanelOpen && (
          <div className="panel-content">
            <div className="panel-section">
              <button
                className="btn btn-primary btn-block"
                onClick={() => navigate('/agents')}
              >
                Добавить агента
              </button>
              <button
                className="btn btn-secondary btn-block"
                onClick={() => navigate('/create-entity')}
              >
                Добавить сущность
              </button>
            </div>
            
            <div className="panel-section">
              <h3>Агенты</h3>
              <div className="agent-list">
                <div className="agent-item">
                  <span>FAQ Бот</span>
                  <div className="agent-actions">
                    <button className="btn-icon">✏️</button>
                    <button className="btn-icon">🗑️</button>
                  </div>
                </div>
                <div className="agent-item">
                  <span>Поддержка</span>
                  <div className="agent-actions">
                    <button className="btn-icon">✏️</button>
                    <button className="btn-icon">🗑️</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="panel-section">
              <h3>Сущности</h3>
              <div className="entity-list">
                <div className="entity-item">
                  <span>Имя пользователя</span>
                  <div className="entity-actions">
                    <button className="btn-icon">✏️</button>
                    <button className="btn-icon">🗑️</button>
                  </div>
                </div>
                <div className="entity-item">
                  <span>Номер телефона</span>
                  <div className="entity-actions">
                    <button className="btn-icon">✏️</button>
                    <button className="btn-icon">🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Chat Area */}
      <div className="chat-area">
        <div className="chat-header">
          <h2>Чат с ботом</h2>
        </div>
        
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                {message.text}
              </div>
            </div>
          ))}
        </div>
        
        <div className="chat-input-area">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение..."
            rows={3}
          />
          <button 
            className="send-button"
            onClick={handleSendMessage}
            disabled={inputValue.trim() === ''}
          >
            Отправить
          </button>
        </div>
      </div>
      
      {/* Diagnostic Panel */}
      <div className="diagnostic-panel">
        <div className="panel-header">
          <h2>Диагностика</h2>
        </div>
        
        <div className="diagnostic-content">
          <div className="diagnostic-section">
            <h3>Определенный интент</h3>
            <div className="intent-info">
              <span className="intent-name">{diagnosticData.intent}</span>
              <span className="confidence">({(diagnosticData.confidence * 100).toFixed(0)}%)</span>
            </div>
          </div>
          
          <div className="diagnostic-section">
            <h3>Найденные сущности</h3>
            <div className="entities-list">
              {diagnosticData.entities.map((entity, index) => (
                <div key={index} className="entity-info">
                  <span className="entity-name">{entity.name}:</span>
                  <span className="entity-value">{entity.value}</span>
                  <span className="confidence">({(entity.confidence * 100).toFixed(0)}%)</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="diagnostic-section">
            <h3>Трассировка</h3>
            <div className="trace-info">
              <div className="trace-item">
                <span className="trace-label">Шаг 1:</span>
                <span className="trace-value">Определение интента</span>
              </div>
              <div className="trace-item">
                <span className="trace-label">Шаг 2:</span>
                <span className="trace-value">Извлечение сущностей</span>
              </div>
              <div className="trace-item">
                <span className="trace-label">Шаг 3:</span>
                <span className="trace-value">Формирование ответа</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainChatInterface;