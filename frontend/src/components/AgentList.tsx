import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { agentAPI } from '../services/api';
import './AgentList.css';

const AgentList: React.FC = () => {
  const { 
    data: agents, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['agents'],
    queryFn: agentAPI.getAgents,
  });

  if (isLoading) return <div className="loading">Загрузка агентов...</div>;
  if (error) {
    console.error('Ошибка загрузки агентов:', error);
    return (
      <div className="error">
        Не удалось загрузить агентов. Убедитесь, что бэкенд запущен на порту 8000
      </div>
    );
  }

  return (
    <div className="agent-list">
      <div className="agent-list-header">
        <h2>Мои агенты</h2>
        <button onClick={() => refetch()} className="refresh-btn">
          Обновить
        </button>
      </div>
      
      <div className="agents-grid">
        {agents?.map(agent => (
          <div key={agent.id} className="agent-card">
            <div className="agent-card-header">
              <h3>{agent.name}</h3>
              <span className={`status-badge status-${agent.status}`}>
                {agent.status}
              </span>
            </div>
            <p className="agent-description">{agent.description}</p>
            <div className="agent-card-footer">
              <span className="agent-type">{agent.agent_type}</span>
              <div className="agent-actions">
                <button className="btn btn-primary">Тестировать</button>
                <button className="btn btn-secondary">Редактировать</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {agents?.length === 0 && (
        <div className="empty-state">
          <p>Агентов пока нет. Создайте первого агента!</p>
        </div>
      )}
    </div>
  );
};

export default AgentList;