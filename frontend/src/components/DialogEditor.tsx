import React, { useState } from 'react';
import './DialogEditor.css';

interface DialogEditorProps {
  agentId: number;
}

interface DialogNode {
  id: string;
  type: 'intent' | 'action' | 'response' | 'condition' | 'redirect';
  content: string;
  position: { x: number; y: number };
}

interface DialogConnection {
  id: string;
  sourceId: string;
  targetId: string;
}

const DialogEditor: React.FC<DialogEditorProps> = ({ agentId }) => {
  const [nodes, setNodes] = useState<DialogNode[]>([
    {
      id: 'start',
      type: 'intent',
      content: 'Приветствие',
      position: { x: 100, y: 100 }
    }
  ]);
  
  const [connections, setConnections] = useState<DialogConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);

  const addNode = (type: DialogNode['type']) => {
    const newNode: DialogNode = {
      id: `node-${Date.now()}`,
      type,
      content: type === 'intent' ? 'Новый интент' : 
               type === 'action' ? 'Новое действие' :
               type === 'response' ? 'Новый ответ' :
               type === 'condition' ? 'Новое условие' : 'Перенаправление',
      position: { x: 200, y: 200 }
    };
    
    setNodes([...nodes, newNode]);
  };

  const updateNodeContent = (id: string, content: string) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, content } : node
    ));
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
    setConnections(connections.filter(
      conn => conn.sourceId !== id && conn.targetId !== id
    ));
    if (selectedNode === id) setSelectedNode(null);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNode(nodeId);
    setDraggingNode(nodeId);
    
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setDragOffset({
        x: e.clientX - node.position.x,
        y: e.clientY - node.position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode) {
      setNodes(nodes.map(node => {
        if (node.id === draggingNode) {
          return {
            ...node,
            position: {
              x: e.clientX - dragOffset.x,
              y: e.clientY - dragOffset.y
            }
          };
        }
        return node;
      }));
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const startConnection = (nodeId: string) => {
    setIsConnecting(true);
    setConnectionStart(nodeId);
  };

  const completeConnection = (targetNodeId: string) => {
    if (isConnecting && connectionStart && connectionStart !== targetNodeId) {
      const newConnection: DialogConnection = {
        id: `conn-${Date.now()}`,
        sourceId: connectionStart,
        targetId: targetNodeId
      };
      setConnections([...connections, newConnection]);
    }
    setIsConnecting(false);
    setConnectionStart(null);
  };

  const getNodeClass = (type: DialogNode['type']) => {
    switch (type) {
      case 'intent': return 'node-intent';
      case 'action': return 'node-action';
      case 'response': return 'node-response';
      case 'condition': return 'node-condition';
      case 'redirect': return 'node-redirect';
      default: return '';
    }
  };

  return (
    <div className="dialog-editor">
      <div className="editor-toolbar">
        <h2>Визуальный конструктор диалогов</h2>
        <div className="toolbar-buttons">
          <button className="btn btn-primary" onClick={() => addNode('intent')}>
            Добавить интент
          </button>
          <button className="btn btn-secondary" onClick={() => addNode('action')}>
            Добавить действие
          </button>
          <button className="btn btn-secondary" onClick={() => addNode('response')}>
            Добавить ответ
          </button>
          <button className="btn btn-secondary" onClick={() => addNode('condition')}>
            Добавить условие
          </button>
          <button className="btn btn-secondary" onClick={() => addNode('redirect')}>
            Добавить перенаправление
          </button>
          <button className="btn btn-success">
            Сохранить сценарий
          </button>
        </div>
      </div>

      <div 
        className="editor-canvas"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => setSelectedNode(null)}
      >
        {nodes.map(node => (
          <div
            key={node.id}
            className={`dialog-node ${getNodeClass(node.type)} ${selectedNode === node.id ? 'selected' : ''}`}
            style={{
              left: node.position.x,
              top: node.position.y
            }}
            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNode(node.id);
              if (isConnecting) {
                completeConnection(node.id);
              }
            }}
            onDoubleClick={() => {
              const newContent = prompt('Введите содержимое узла:', node.content);
              if (newContent !== null) {
                updateNodeContent(node.id, newContent);
              }
            }}
          >
            <div className="node-header">
              <span className="node-type">{node.type}</span>
              <button 
                className="delete-node-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
              >
                ×
              </button>
            </div>
            <div className="node-content">
              {node.content}
            </div>
            <div className="node-connectors">
              <div 
                className="connector input"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isConnecting) {
                    startConnection(node.id);
                  }
                }}
              />
              <div 
                className="connector output"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isConnecting) {
                    startConnection(node.id);
                  }
                }}
              />
            </div>
          </div>
        ))}

        {connections.map(conn => {
          const sourceNode = nodes.find(n => n.id === conn.sourceId);
          const targetNode = nodes.find(n => n.id === conn.targetId);
          
          if (!sourceNode || !targetNode) return null;
          
          const startX = sourceNode.position.x + 150;
          const startY = sourceNode.position.y + 50;
          const endX = targetNode.position.x;
          const endY = targetNode.position.y + 50;
          
          return (
            <svg key={conn.id} className="connection-svg">
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="#4A90E2"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            </svg>
          );
        })}

        <svg className="defs">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#4A90E2" />
            </marker>
          </defs>
        </svg>
      </div>

      {selectedNode && (
        <div className="node-properties">
          <h3>Свойства узла</h3>
          {(() => {
            const node = nodes.find(n => n.id === selectedNode);
            if (!node) return null;
            
            return (
              <>
                <div className="form-group">
                  <label>Тип узла:</label>
                  <select 
                    value={node.type}
                    onChange={(e) => {
                      setNodes(nodes.map(n => 
                        n.id === selectedNode 
                          ? { ...n, type: e.target.value as DialogNode['type'] } 
                          : n
                      ));
                    }}
                  >
                    <option value="intent">Интент</option>
                    <option value="action">Действие</option>
                    <option value="response">Ответ</option>
                    <option value="condition">Условие</option>
                    <option value="redirect">Перенаправление</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Содержимое:</label>
                  <textarea
                    value={node.content}
                    onChange={(e) => updateNodeContent(node.id, e.target.value)}
                    rows={4}
                  />
                </div>
                
                {node.type === 'redirect' && (
                  <div className="form-group">
                    <label>Целевой агент:</label>
                    <select>
                      <option>Выберите агента...</option>
                      <option>Агент поддержки</option>
                      <option>Агент продаж</option>
                      <option>Агент техподдержки</option>
                    </select>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default DialogEditor;