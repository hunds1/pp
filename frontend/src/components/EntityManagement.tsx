import React, { useState, useEffect } from 'react';
import { Entity, EntityCreate } from '../services/api';
import './EntityManagement.css';

interface EntityManagementProps {
  agentId: number;
}

const EntityManagement: React.FC<EntityManagementProps> = ({ agentId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [formData, setFormData] = useState<Partial<EntityCreate>>({
    name: '',
    type: 'text',
    description: '',
    regex_pattern: ''
  });
  const [entities, setEntities] = useState<Entity[]>([
    {
      id: 1,
      name: "email",
      type: "regex",
      description: "Email адрес",
      regex_pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
    },
    {
      id: 2,
      name: "phone",
      type: "regex",
      description: "Номер телефона",
      regex_pattern: "\\+7\\d{10}"
    }
  ]);

  useEffect(() => {
    if (editingEntity) {
      setFormData({
        name: editingEntity.name,
        type: editingEntity.type,
        description: editingEntity.description || '',
        regex_pattern: editingEntity.regex_pattern || ''
      });
    } else if (!isAdding) {
      resetForm();
    }
  }, [editingEntity, isAdding]);

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'text',
      description: '',
      regex_pattern: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) return;
    
    const entityData: EntityCreate = {
      name: formData.name,
      type: formData.type,
      description: formData.description,
      regex_pattern: formData.regex_pattern
    };
    
    if (editingEntity) {
      // Update existing entity
      setEntities(entities.map(entity =>
        entity.id === editingEntity.id
          ? { ...entity, ...entityData }
          : entity
      ));
      setEditingEntity(null);
    } else {
      // Add new entity
      const newEntity: Entity = {
        id: Date.now(),
        ...entityData
      };
      setEntities([...entities, newEntity]);
    }
    
    setIsAdding(false);
    resetForm();
  };

  const handleEdit = (entity: Entity) => {
    setEditingEntity(entity);
    setIsAdding(true);
  };

  const handleDelete = (entityId: number, entityName: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить сущность "${entityName}"?`)) {
      setEntities(entities.filter(entity => entity.id !== entityId));
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingEntity(null);
    resetForm();
  };

  return (
    <div className="entity-management">
      <div className="entity-header">
        <h2>Управление сущностями</h2>
        {!isAdding && (
          <button 
            className="btn btn-primary"
            onClick={() => setIsAdding(true)}
          >
            Добавить сущность
          </button>
        )}
      </div>

      {(isAdding || editingEntity) && (
        <div className="entity-form">
          <h3>{editingEntity ? 'Редактировать сущность' : 'Добавить новую сущность'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Название *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Тип *</label>
              <select
                value={formData.type || 'text'}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                required
              >
                <option value="text">Текст</option>
                <option value="number">Число</option>
                <option value="date">Дата</option>
                <option value="regex">Регулярное выражение</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Описание</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
            
            {formData.type === 'regex' && (
              <div className="form-group">
                <label>Паттерн регулярного выражения *</label>
                <input
                  type="text"
                  value={formData.regex_pattern || ''}
                  onChange={(e) => setFormData({...formData, regex_pattern: e.target.value})}
                  placeholder="Например: \d{4}-\d{4}-\d{4}-\d{4}"
                />
              </div>
            )}
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingEntity ? 'Сохранить' : 'Создать'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="entities-list">
        {entities && entities.length > 0 ? (
          <div className="entities-grid">
            {entities.map(entity => (
              <div key={entity.id} className="entity-card">
                <div className="entity-card-header">
                  <h4>{entity.name}</h4>
                  <span className="entity-type">{entity.type}</span>
                </div>
                {entity.description && (
                  <p className="entity-description">{entity.description}</p>
                )}
                {entity.regex_pattern && (
                  <p className="entity-regex">Паттерн: {entity.regex_pattern}</p>
                )}
                <div className="entity-actions">
                  <button 
                    className="btn btn-secondary btn-small"
                    onClick={() => handleEdit(entity)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="btn btn-danger btn-small"
                    onClick={() => handleDelete(entity.id, entity.name)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Сущностей пока нет. {isAdding ? '' : 'Добавьте первую сущность!'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityManagement;

export {};