/* eslint-disable @typescript-eslint/no-unused-vars */
// src/App.tsx
import React, { useState } from 'react';
import { Download, Plus, Trash2, Move, Code, Link } from 'lucide-react';

// Types
interface Decorator {
  name: string;
  value: string | null;
}

interface Field {
  id: number;
  name: string;
  type: string;
  decorators: Decorator[];
  relationType: 'none' | 'belongsTo' | 'hasMany';
  relatedEntity?: string;
  isArray: boolean;
  enumValues?: string;
}

interface Entity {
  id: number;
  name: string;
  x: number;
  y: number;
  fields: Field[];
}

interface ErrorDefinition {
  code: string;
  message: string;
}

interface Endpoint {
  id: number;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  x: number;
  y: number;
  body?: string;
  returns: string;
  errors: ErrorDefinition[];
  decorators: Decorator[];
}

interface DraggingState {
  id: number;
  startX: number;
  startY: number;
}

interface SelectedState {
  type: 'entities' | 'endpoints';
  id: number;
}

type Mode = 'entities' | 'endpoints';

// Constants
const FIELD_TYPES = ['string', 'int', 'float', 'boolean', 'uuid', 'email', 'url', 'timestamp', 'enum', 'json'] as const;
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
const DECORATORS = ['unique', 'indexed', 'optional', 'generated', 'auto', 'min', 'max', 'precision', 'pattern'] as const;

// Components
interface DecoratorBadgeProps {
  decorator: Decorator;
  onRemove: (e: React.MouseEvent) => void;
  onChange: (value: string) => void;
}

const DecoratorBadge: React.FC<DecoratorBadgeProps> = ({ decorator, onRemove, onChange }) => (
  <div className="inline-flex items-center gap-1 bg-purple-100 px-2 py-1 rounded text-xs">
    <span className="text-purple-700">@{decorator.name}</span>
    {decorator.value !== null && (
      <input
        type="text"
        value={decorator.value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 px-1 bg-white border border-purple-300 rounded text-xs"
        onClick={(e) => e.stopPropagation()}
      />
    )}
    <button onClick={onRemove} className="text-purple-500 hover:text-purple-700 ml-1">×</button>
  </div>
);

interface EntityCardProps {
  entity: Entity;
  entities: Entity[];
  selected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onUpdate: (updates: Partial<Entity>) => void;
  onDelete: () => void;
  onAddField: () => void;
  onUpdateField: (fieldId: number, updates: Partial<Field>) => void;
  onDeleteField: (fieldId: number) => void;
}

const EntityCard: React.FC<EntityCardProps> = ({ 
  entity, 
  entities,
  selected, 
  onMouseDown, 
  onUpdate, 
  onDelete, 
  onAddField, 
  onUpdateField, 
  onDeleteField 
}) => {
  const [showDecorators, setShowDecorators] = useState<Record<number, boolean>>({});
  const [showRelation, setShowRelation] = useState<Record<number, boolean>>({});

  const addDecorator = (fieldId: number, decoratorName: string) => {
    const field = entity.fields.find(f => f.id === fieldId);
    if (!field) return;
    
    const needsValue = ['min', 'max', 'precision', 'pattern'].includes(decoratorName);
    onUpdateField(fieldId, {
      decorators: [...field.decorators, { name: decoratorName, value: needsValue ? '' : null }]
    });
    setShowDecorators({ ...showDecorators, [fieldId]: false });
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: entity.x,
        top: entity.y,
        cursor: 'grab',
        minWidth: '350px'
      }}
      onMouseDown={onMouseDown}
      className={`bg-white rounded-lg shadow-lg border-2 transition-all ${
        selected ? 'border-blue-500 shadow-xl' : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
        <input
          type="text"
          value={entity.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="bg-transparent border-b border-white/50 text-white font-bold outline-none px-1"
          onClick={(e) => e.stopPropagation()}
        />
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-white/80 hover:text-white p-1">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Fields */}
      <div className="p-4">
        {entity.fields.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-2">No fields yet</p>
        )}

        {entity.fields.map(field => (
          <div key={field.id} className="mb-3 p-2 bg-gray-50 rounded border border-gray-200">
            {/* Field Name & Type */}
            <div className="flex gap-2 items-center mb-2">
              <input
                type="text"
                value={field.name}
                onChange={(e) => onUpdateField(field.id, { name: e.target.value })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="field name"
                onClick={(e) => e.stopPropagation()}
              />
              
              {field.relationType === 'none' ? (
                <>
                  <select
                    value={field.type}
                    onChange={(e) => onUpdateField(field.id, { type: e.target.value })}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {FIELD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                  
                  <label className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={field.isArray || false}
                      onChange={(e) => onUpdateField(field.id, { isArray: e.target.checked })}
                      onClick={(e) => e.stopPropagation()}
                    />
                    []
                  </label>
                </>
              ) : (
                <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-mono">
                  {field.relationType === 'belongsTo' ? '→' : '←'} {field.relatedEntity}
                  {field.isArray && '[]'}
                </div>
              )}
              
              <button
                onClick={(e) => { e.stopPropagation(); setShowRelation({ ...showRelation, [field.id]: !showRelation[field.id] }); }}
                className="p-1 text-blue-500 hover:text-blue-700"
              >
                <Link size={14} />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteField(field.id); }}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Enum Values */}
            {field.type === 'enum' && field.relationType === 'none' && (
              <input
                type="text"
                value={field.enumValues || ''}
                onChange={(e) => onUpdateField(field.id, { enumValues: e.target.value })}
                placeholder='Enter values: "val1", "val2"'
                className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-xs"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Relationship Editor */}
            {showRelation[field.id] && (
              <div className="mb-2 p-2 bg-blue-50 rounded border border-blue-200">
                <select
                  value={field.relationType}
                  onChange={(e) => {
                    const relType = e.target.value as 'none' | 'belongsTo' | 'hasMany';
                    onUpdateField(field.id, { 
                      relationType: relType,
                      relatedEntity: relType !== 'none' ? '' : undefined,
                      type: relType !== 'none' ? 'relation' : 'string'
                    });
                  }}
                  className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="none">No Relationship</option>
                  <option value="belongsTo">→ Belongs To</option>
                  <option value="hasMany">← Has Many</option>
                </select>
                
                {field.relationType !== 'none' && (
                  <>
                    <select
                      value={field.relatedEntity || ''}
                      onChange={(e) => onUpdateField(field.id, { relatedEntity: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">Select Entity</option>
                      {entities.filter(e => e.id !== entity.id).map(e => (
                        <option key={e.id} value={e.name}>{e.name}</option>
                      ))}
                    </select>
                    {field.relationType === 'hasMany' && (
                      <label className="flex items-center gap-1 text-xs mt-1">
                        <input
                          type="checkbox"
                          checked={field.isArray || false}
                          onChange={(e) => onUpdateField(field.id, { isArray: e.target.checked })}
                        />
                        Array []
                      </label>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Decorators */}
            {field.relationType === 'none' && (
              <div className="flex flex-wrap gap-1 mb-2">
                {field.decorators.map((dec, idx) => (
                  <DecoratorBadge
                    key={idx}
                    decorator={dec}
                    onRemove={(e) => {
                      e.stopPropagation();
                      onUpdateField(field.id, {
                        decorators: field.decorators.filter((_, i) => i !== idx)
                      });
                    }}
                    onChange={(value) => {
                      const newDecs = [...field.decorators];
                      newDecs[idx].value = value;
                      onUpdateField(field.id, { decorators: newDecs });
                    }}
                  />
                ))}
              </div>
            )}

            {/* Add Decorator Button */}
            {field.relationType === 'none' && (
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowDecorators({ ...showDecorators, [field.id]: !showDecorators[field.id] }); }}
                  className="text-xs text-purple-500 hover:text-purple-700"
                >
                  + Add decorator
                </button>
                
                {showDecorators[field.id] && (
                  <div className="absolute z-10 mt-1 p-2 bg-white border border-gray-300 rounded shadow-lg flex flex-wrap gap-1 max-w-xs">
                    {DECORATORS.map(dec => (
                      <button
                        key={dec}
                        onClick={(e) => { e.stopPropagation(); addDecorator(field.id, dec); }}
                        className="text-xs px-2 py-1 bg-purple-100 hover:bg-purple-200 rounded"
                      >
                        @{dec}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={(e) => { e.stopPropagation(); onAddField(); }}
          className="w-full mt-2 py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          + Add Field
        </button>
      </div>
    </div>
  );
};

interface EndpointCardProps {
  endpoint: Endpoint;
  selected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onUpdate: (updates: Partial<Endpoint>) => void;
  onDelete: () => void;
}

const EndpointCard: React.FC<EndpointCardProps> = ({ endpoint, selected, onMouseDown, onUpdate, onDelete }) => {
  const [showErrors, setShowErrors] = useState(false);
  const [showDecorators, setShowDecorators] = useState(false);

  return (
    <div
      style={{ position: 'absolute', left: endpoint.x, top: endpoint.y, cursor: 'grab', minWidth: '350px' }}
      onMouseDown={onMouseDown}
      className={`bg-white rounded-lg shadow-lg border-2 ${selected ? 'border-green-500 shadow-xl' : 'border-gray-200'}`}
    >
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2 flex-1">
          <select
            value={endpoint.method}
            onChange={(e) => onUpdate({ method: e.target.value as Endpoint['method'] })}
            className="bg-white/20 border border-white/50 text-white font-bold px-2 py-1 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            {HTTP_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input
            type="text"
            value={endpoint.path}
            onChange={(e) => onUpdate({ path: e.target.value })}
            className="flex-1 bg-transparent border-b border-white/50 text-white font-mono outline-none px-1"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-white/80 hover:text-white p-1">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Body</label>
          <input
            type="text"
            value={endpoint.body || ''}
            onChange={(e) => onUpdate({ body: e.target.value })}
            placeholder="User(email, name, age?)"
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">Returns</label>
          <input
            type="text"
            value={endpoint.returns || 'void'}
            onChange={(e) => onUpdate({ returns: e.target.value })}
            placeholder="User or User[]"
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Errors */}
        <div>
          <button
            onClick={(e) => { e.stopPropagation(); setShowErrors(!showErrors); }}
            className="text-xs text-red-500 hover:text-red-700 mb-2"
          >
            {showErrors ? '− Hide' : '+ Add'} Error Responses
          </button>
          
          {showErrors && (
            <div className="space-y-2">
              {endpoint.errors?.map((err, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={err.code}
                    onChange={(e) => {
                      const newErrors = [...endpoint.errors];
                      newErrors[idx].code = e.target.value;
                      onUpdate({ errors: newErrors });
                    }}
                    placeholder="400"
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="text"
                    value={err.message}
                    onChange={(e) => {
                      const newErrors = [...endpoint.errors];
                      newErrors[idx].message = e.target.value;
                      onUpdate({ errors: newErrors });
                    }}
                    placeholder="Error message"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate({ errors: endpoint.errors.filter((_, i) => i !== idx) });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate({ errors: [...(endpoint.errors || []), { code: '400', message: 'Error' }] });
                }}
                className="text-xs text-red-500 hover:text-red-700"
              >
                + Add Error
              </button>
            </div>
          )}
        </div>

        {/* Decorators */}
        <div>
          <div className="flex flex-wrap gap-1 mb-2">
            {endpoint.decorators?.map((dec, idx) => (
              <DecoratorBadge
                key={idx}
                decorator={dec}
                onRemove={(e) => {
                  e.stopPropagation();
                  onUpdate({ decorators: endpoint.decorators.filter((_, i) => i !== idx) });
                }}
                onChange={(value) => {
                  const newDecs = [...endpoint.decorators];
                  newDecs[idx].value = value;
                  onUpdate({ decorators: newDecs });
                }}
              />
            ))}
          </div>
          
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowDecorators(!showDecorators); }}
              className="text-xs text-purple-500 hover:text-purple-700"
            >
              + Add decorator
            </button>
            
            {showDecorators && (
              <div className="absolute z-10 mt-1 p-2 bg-white border border-gray-300 rounded shadow-lg flex flex-wrap gap-1 max-w-xs">
                {['rate_limit', 'auth', 'cache', 'timeout'].map(dec => (
                  <button
                    key={dec}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate({ decorators: [...(endpoint.decorators || []), { name: dec, value: '' }] });
                      setShowDecorators(false);
                    }}
                    className="text-xs px-2 py-1 bg-purple-100 hover:bg-purple-200 rounded"
                  >
                    @{dec}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function App() {
  const [apiName, setApiName] = useState('MyAPI');
  const [apiVersion, setApiVersion] = useState('1.0.0');
  const [entities, setEntities] = useState<Entity[]>([]);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [dragging, setDragging] = useState<DraggingState | null>(null);
  const [selected, setSelected] = useState<SelectedState | null>(null);
  const [mode, setMode] = useState<Mode>('entities');
  const [showCode, setShowCode] = useState(false);

  const items = mode === 'entities' ? entities : endpoints;

  const addItem = () => {
    if (mode === 'entities') {
      const newEntity: Entity = {
        id: Date.now(),
        name: 'NewEntity',
        x: 100,
        y: 100,
        fields: []
      };
      setEntities([...entities, newEntity]);
      setSelected({ type: 'entities', id: newEntity.id });
    } else {
      const newEndpoint: Endpoint = {
        id: Date.now(),
        method: 'GET',
        path: '/endpoint',
        x: 100,
        y: 100,
        returns: 'void',
        errors: [],
        decorators: []
      };
      setEndpoints([...endpoints, newEndpoint]);
      setSelected({ type: 'endpoints', id: newEndpoint.id });
    }
  };

  const handleMouseDown = (e: React.MouseEvent, item: Entity | Endpoint) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'BUTTON') return;
    
    setDragging({ id: item.id, startX: e.clientX - item.x, startY: e.clientY - item.y });
    setSelected({ type: mode, id: item.id });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const item = items.find(i => i.id === dragging.id);
    if (!item) return;
    
    const newX = e.clientX - dragging.startX;
    const newY = e.clientY - dragging.startY;
    
    if (mode === 'entities') {
      setEntities(entities.map(i => i.id === dragging.id ? { ...i, x: newX, y: newY } : i));
    } else {
      setEndpoints(endpoints.map(i => i.id === dragging.id ? { ...i, x: newX, y: newY } : i));
    }
  };

  const generateCode = () => {
    let code = `api ${apiName}(version: ${apiVersion}) {\n\n`;
    
    entities.forEach(entity => {
      code += `    entity ${entity.name} {\n`;
      entity.fields.forEach(field => {
        code += `        ${field.name}: `;
        if (field.relationType === 'belongsTo') {
          code += `-> ${field.relatedEntity}`;
        } else if (field.relationType === 'hasMany') {
          code += `<- ${field.relatedEntity}`;
          if (field.isArray) code += '[]';
        } else {
          code += `@${field.type}`;
          if (field.decorators?.length > 0) {
            const decStr = field.decorators.map(d => d.value ? `${d.name}: ${d.value}` : d.name).join(', ');
            code += `(${decStr})`;
          }
          if (field.isArray) code += '[]';
          if (field.type === 'enum' && field.enumValues) code += `(${field.enumValues})`;
        }
        code += '\n';
      });
      code += `    }\n\n`;
    });
    
    if (endpoints.length > 0) {
      code += `    endpoints {\n`;
      endpoints.forEach(ep => {
        code += `        ${ep.method} ${ep.path} {\n`;
        if (ep.body) code += `            body: ${ep.body}\n`;
        code += `            returns: ${ep.returns}\n`;
        if (ep.errors?.length > 0) {
          code += `            errors: {\n`;
          ep.errors.forEach(err => code += `                ${err.code}: "${err.message}"\n`);
          code += `            }\n`;
        }
        ep.decorators?.forEach(dec => {
          code += `            @${dec.name}`;
          if (dec.value) code += `("${dec.value}")`;
          code += '\n';
        });
        code += `        }\n\n`;
      });
      code += `    }\n`;
    }
    
    code += `}`;
    return code;
  };

  const download = () => {
    const blob = new Blob([generateCode()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.aion';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AION Studio
            </h1>
            <p className="text-xs text-gray-500">Full-Featured Visual API Designer</p>
          </div>
          <div className="flex gap-2">
            <input
              value={apiName}
              onChange={(e) => setApiName(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
              placeholder="API Name"
            />
            <input
              value={apiVersion}
              onChange={(e) => setApiVersion(e.target.value)}
              className="w-24 px-3 py-1 border rounded text-sm"
              placeholder="1.0.0"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="flex border rounded overflow-hidden">
            <button
              onClick={() => setMode('entities')}
              className={`px-4 py-2 text-sm ${mode === 'entities' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              Entities ({entities.length})
            </button>
            <button
              onClick={() => setMode('endpoints')}
              className={`px-4 py-2 text-sm ${mode === 'endpoints' ? 'bg-green-500 text-white' : 'bg-white'}`}
            >
              Endpoints ({endpoints.length})
            </button>
          </div>
          <button onClick={addItem} className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2">
            <Plus size={16} />
            Add {mode === 'entities' ? 'Entity' : 'Endpoint'}
          </button>
          <button onClick={() => setShowCode(!showCode)} className="px-4 py-2 border rounded flex items-center gap-2">
            <Code size={16} />
            {showCode ? 'Hide' : 'Show'} Code
          </button>
          <button onClick={download} className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2">
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      <div
        className="flex-1 relative overflow-hidden bg-gray-50"
        style={{
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDragging(null)}
        onMouseLeave={() => setDragging(null)}
      >
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Move size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-500">Add {mode} to start designing</p>
            </div>
          </div>
        )}

        {mode === 'entities' && entities.map(entity => (
          <EntityCard
            key={entity.id}
            entity={entity}
            entities={entities}
            selected={selected?.type === 'entities' && selected?.id === entity.id}
            onMouseDown={(e) => handleMouseDown(e, entity)}
            onUpdate={(updates) => setEntities(entities.map(e => e.id === entity.id ? { ...e, ...updates } : e))}
            onDelete={() => setEntities(entities.filter(e => e.id !== entity.id))}
            onAddField={() => setEntities(entities.map(e => 
              e.id === entity.id 
                ? { ...e, fields: [...e.fields, { 
                    id: Date.now(), 
                    name: 'newField', 
                    type: 'string', 
                    decorators: [], 
                    relationType: 'none', 
                    isArray: false 
                  }] }
                : e
            ))}
            onUpdateField={(fieldId, updates) => setEntities(entities.map(e =>
              e.id === entity.id
                ? { ...e, fields: e.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f) }
                : e
            ))}
            onDeleteField={(fieldId) => setEntities(entities.map(e =>
              e.id === entity.id
                ? { ...e, fields: e.fields.filter(f => f.id !== fieldId) }
                : e
            ))}
          />
        ))}

        {mode === 'endpoints' && endpoints.map(endpoint => (
          <EndpointCard
            key={endpoint.id}
            endpoint={endpoint}
            selected={selected?.type === 'endpoints' && selected?.id === endpoint.id}
            onMouseDown={(e) => handleMouseDown(e, endpoint)}
            onUpdate={(updates) => setEndpoints(endpoints.map(ep => ep.id === endpoint.id ? { ...ep, ...updates } : ep))}
            onDelete={() => setEndpoints(endpoints.filter(ep => ep.id !== endpoint.id))}
          />
        ))}
      </div>

      {showCode && items.length > 0 && (
        <div className="bg-gray-900 text-green-400 p-4 font-mono text-xs overflow-auto max-h-64 border-t-2 border-green-500">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">// Generated AION Schema</span>
            <button
              onClick={() => navigator.clipboard.writeText(generateCode())}
              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Copy
            </button>
          </div>
          <pre>{generateCode()}</pre>
        </div>
      )}
    </div>
  );
}