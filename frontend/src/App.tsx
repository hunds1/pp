import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AgentList from './components/AgentList';
import CreateAgentForm from './components/CreateAgentForm';
import AgentDashboard from './pages/AgentDashboard';
import MainChatInterface from './pages/MainChatInterface';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <header className="app-header">
            <h1>Лабораторный комплекс чат-ботов</h1>
            <p>Создание и тестирование AI агентов</p>
            <nav className="app-nav">
              <a href="/">Главная</a>
              <a href="/agents">Управление агентами</a>
            </nav>
          </header>
          <main className="app-main">
            <div className="container">
              <Routes>
                <Route path="/" element={<MainChatInterface />} />
                <Route path="/agents" element={
                  <>
                    <CreateAgentForm />
                    <AgentList />
                  </>
                } />
                <Route path="/agent/:id" element={<AgentDashboard />} />
              </Routes>
            </div>
          </main>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </Router>
    </QueryClientProvider>
  );
}

export default App;