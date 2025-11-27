import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EntityCreate } from '../services/api';
import './CreateEntityForm.css';

const CreateEntityForm: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [type, setType] = useState<'lookup' | 'regex'>('lookup');
  const [values, setValues] = useState<string[]>(['']);
  const [regexPattern, setRegexPattern] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!name.trim()) {
      alert('Пожалуйста, введите название сущности');
      return;
    }
    
    if (type === 'lookup' && values.filter(v => v.trim() !== '').length === 0) {
      alert('Пожалуйста, добавьте хотя бы одно значение для lookup сущности');
      return;
    }
    
    if (type === 'regex' && !regexPattern.trim()) {
      alert('Пожалуйста, введите паттерн регулярного выражения');
      return;
    }
    
    // Создание объекта сущности
    const entityData: EntityCreate = {
      name: name.trim(),
      type: type,
      description: description.trim(),
      ...(type === 'regex' && { regex_pattern: regexPattern.trim() })
    };
    
    // В реальной реализации здесь будет вызов API
    console.log('Создание сущности:', entityData);
    alert('Сущность успешно создана!');
    
    // Очистка формы
    setName('');
    setType('lookup');
    setValues(['']);
    setRegexPattern('');
    setDescription('');
  };
  
  const addValue = () => {
    setValues([...values, '']);
  };
  
  const removeValue = (index: number) => {
    if (values.length > 1) {
      const newValues = [...values];
      newValues.splice(index, 1);
      setValues(newValues);
    }
  };
  
  const updateValue = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };
  
  return (
    <div className="create-entity-form">
      <div className="form-header">
        <h2>Создать новую сущность</h2>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/')}
        >
          Назад
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="entity-form">
        <div className="form-group">
          <label htmlFor="entity-name">Название сущности *</label>
          <input
            id="entity-name"
            type="text"
            placeholder="Например: цвет, размер, категория"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="entity-type">Тип сущности *</label>
          <select
            id="entity-type"
            value={type}
            onChange={(e) => setType(e.target.value as 'lookup' | 'regex')}
          >
            <option value="lookup">Lookup (список значений)</option>
            <option value="regex">Regex (регулярное выражение)</option>
          </select>
        </div>
        
        {type === 'lookup' ? (
          <div className="form-group">
            <label>Список возможных значений *</label>
            <div className="values-input">
              {values.map((value, index) => (
                <div key={index} className="value-input-group">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateValue(index, e.target.value)}
                    placeholder={`Значение ${index + 1}`}
                  />
                  {values.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-small"
                      onClick={() => removeValue(index)}
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addValue}
              >
                + Добавить значение
              </button>
            </div>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="regex-pattern">Паттерн регулярного выражения *</label>
            <input
              id="regex-pattern"
              type="text"
              placeholder="Например: \b(красный|синий|зеленый)\b"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
            />
            <small className="form-help">
              Регулярное выражение для извлечения сущности из текста
            </small>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="entity-description">Описание</label>
          <textarea
            id="entity-description"
            placeholder="Опишите назначение сущности..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Создать сущность
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEntityForm;