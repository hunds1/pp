import axios from 'axios';

// Пока бэкенд не доступен
// const API_BASE_URL = 'http://localhost:8000/api';

// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

export enum AgentType {
  FAQ = "faq",
  FORM = "form"
}

export enum AgentStatus {
  CREATED = "created",
  TRAINING = "training", 
  READY = "ready",
  ERROR = "error"
}

export interface Agent {
  id: number;
  name: string;
  description: string;
  agent_type: AgentType;
  status: AgentStatus;
  config_path?: string;
  domain_path?: string;
  model_path?: string;
}

export interface AgentCreate {
  name: string;
  description: string;
  agent_type: AgentType;
}

export interface MessageRequest {
  message: string;
  sender?: string;
}

export interface MessageResponse {
  response: string[];
  agent_id: number;
  intent?: string;
  entities?: Array<{ entity: string; value: string; confidence: number }>;
}

// Временные моковые данные
let mockAgents: Agent[] = [
  {
    id: 1,
    name: "FAQ помощник",
    description: "Отвечает на частые вопросы о доставке",
    agent_type: AgentType.FAQ,
    status: AgentStatus.READY,
    config_path: "/configs/faq",
    domain_path: "/domains/faq",
    model_path: "/models/faq"
  },
  {
    id: 2,
    name: "Форма записи",
    description: "Собирает данные для записи на услуги",
    agent_type: AgentType.FORM,
    status: AgentStatus.TRAINING,
    config_path: "/configs/form",
    domain_path: "/domains/form", 
    model_path: "/models/form"
  }
];

// Временные моковые функции пока нет доступа к бэкенду
export const agentAPI = {
  getAgents: (): Promise<Agent[]> => {
    console.log('📦 Получаем список агентов (мок)');
    return Promise.resolve([...mockAgents]); // возвращаем копию массива
  },
  
  getAgent: (id: number): Promise<Agent> => {
    const agent = mockAgents.find(a => a.id === id);
    if (agent) {
      return Promise.resolve({...agent}); // возвращаем копию объекта
    }
    return Promise.reject('Agent not found');
  },
  
  createAgent: (agentData: AgentCreate): Promise<Agent> => {
    console.log('🆕 Создаем агента:', agentData);
    
    // Имитируем небольшую задержку как при реальном запросе
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAgent: Agent = {
          ...agentData,
          id: Math.max(0, ...mockAgents.map(a => a.id)) + 1,
          status: AgentStatus.CREATED,
        };
        mockAgents = [...mockAgents, newAgent]; // создаем новый массив
        console.log('✅ Агент создан:', newAgent);
        resolve(newAgent);
      }, 500);
    });
  },
  
  deleteAgent: (id: number): Promise<void> => {
    mockAgents = mockAgents.filter(a => a.id !== id);
    return Promise.resolve();
  },
  
  trainAgent: (id: number): Promise<void> => {
    return new Promise((resolve) => {
      const agent = mockAgents.find(a => a.id === id);
      if (agent) {
        agent.status = AgentStatus.TRAINING;
        // Имитируем обучение
        setTimeout(() => {
          agent.status = AgentStatus.READY;
          console.log(`✅ Агент ${id} обучен`);
        }, 2000);
      }
      resolve();
    });
  },
  
  sendMessage: (id: number, message: MessageRequest): Promise<MessageResponse> => {
    return Promise.resolve({
      response: [`Это тестовый ответ от агента ${id} на сообщение: "${message.message}"`],
      agent_id: id,
      intent: 'test_intent',
      entities: []
    });
  },
};

// Временный мок для healthCheck
export const healthCheck = (): Promise<{ status: string }> => 
  Promise.resolve({ status: 'ok' });

// Временный мок для api если где-то используется
export const api = {
  get: () => Promise.resolve({ data: [] }),
  post: () => Promise.resolve({ data: {} }),
  delete: () => Promise.resolve({}),
};