import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AgentList from './components/AgentList';
import CreateAgentForm from './components/CreateAgentForm';
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
      <div className="App">
        <header className="app-header">
          <h1>Лабораторный комплекс чат-ботов</h1>
          <p>Создание и тестирование AI агентов</p>
        </header>
        <main className="app-main">
          <div className="container">
            <CreateAgentForm />
            <AgentList />
          </div>
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;