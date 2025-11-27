import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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


// Функции для работы с API
export const agentAPI = {
  getAgents: (): Promise<Agent[]> => {
    return api.get<Agent[]>('/agents').then(res => res.data);
  },
  
  getAgent: (id: number): Promise<Agent> => {
    return api.get<Agent>(`/agents/${id}`).then(res => res.data);
  },
  
  createAgent: (agentData: AgentCreate): Promise<Agent> => {
    return api.post<Agent>('/agents', agentData).then(res => res.data);
  },
  
  deleteAgent: (id: number): Promise<void> => {
    return api.delete(`/agents/${id}`).then(() => {});
  },
  
  trainAgent: (id: number): Promise<void> => {
    return api.post(`/agents/${id}/train`).then(() => {});
  },
  
  sendMessage: (id: number, message: MessageRequest): Promise<MessageResponse> => {
    return api.post<MessageResponse>(`/agents/${id}/message`, message).then(res => res.data);
  },
};
// Функция для проверки состояния API
export const healthCheck = (): Promise<{ status: string }> =>
  api.get('/health').then(res => res.data);
