/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { Download, Plus, Trash2, Move, Code,BookOpen, Home, Lightbulb, Terminal, FileCode, X} from 'lucide-react';

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

type Mode = 'entities' | 'endpoints';

const FIELD_TYPES = ['string', 'int', 'float', 'boolean', 'uuid', 'email', 'url', 'timestamp', 'enum', 'json'];
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const DECORATORS = ['unique', 'indexed', 'optional', 'generated', 'auto', 'min', 'max', 'precision', 'pattern'];

// Documentation Component
const Documentation = ({ onClose }: { onClose: () => void }) => {
  const [activeSection, setActiveSection] = useState('intro');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen size={24} />
            <h2 className="text-2xl font-bold">AION Documentation</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 bg-gray-50 border-r overflow-y-auto p-4">
            <nav className="space-y-1">
              {[
                { id: 'intro', icon: Home, label: 'Introduction' },
                { id: 'quickstart', icon: Lightbulb, label: 'Quick Start' },
                { id: 'entities', icon: FileCode, label: 'Creating Entities' },
                { id: 'endpoints', icon: Terminal, label: 'Creating Endpoints' },
                { id: 'cli', icon: Terminal, label: 'Using AION CLI' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeSection === id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {activeSection === 'intro' && (
              <div className="prose max-w-none">
                <h1 className="text-3xl font-bold mb-4">What is AION?</h1>
                <p className="text-lg text-gray-700 mb-6">
                  AION is a <strong>zero-boilerplate API development platform</strong> that generates everything you need from a single schema file.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <p className="font-semibold text-blue-900 mb-2">Core Value Proposition</p>
                  <p className="text-blue-800">"Write your API once. Get everything else free."</p>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">What Gets Generated?</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { title: 'TypeScript Types', desc: 'Fully typed interfaces' },
                    { title: 'API Routes', desc: 'Express/Fastify handlers' },
                    { title: 'Client SDK', desc: 'Type-safe API client' },
                    { title: 'Validators', desc: 'Zod schemas' },
                    { title: 'Documentation', desc: 'Interactive API docs' },
                    { title: 'Mock Server', desc: 'Instant backend' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'quickstart' && (
              <div className="prose max-w-none">
                <h1 className="text-3xl font-bold mb-4">Quick Start Guide</h1>
                
                <h2 className="text-2xl font-bold mt-6 mb-3">Step 1: Design Your API</h2>
                <ol className="space-y-3 text-gray-700">
                  <li><strong>Add Entity</strong> - Click "Add Entity" button</li>
                  <li><strong>Add Fields</strong> - Click "+ Add Field" inside entity</li>
                  <li><strong>Add Endpoints</strong> - Switch to "Endpoints" tab</li>
                  <li><strong>Download</strong> - Click "Download" to get schema.aion file</li>
                </ol>

                <h2 className="text-2xl font-bold mt-8 mb-3">Step 2: Install AION CLI</h2>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
                  npm install -g aion-cli
                </div>

                <h2 className="text-2xl font-bold mt-6 mb-3">Step 3: Generate Code</h2>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
                  aion generate schema.aion -o ./generated
                </div>
              </div>
            )}

            {activeSection === 'entities' && (
              <div>
                <h1 className="text-3xl font-bold mb-4">Creating Entities</h1>
                <p className="text-gray-700 mb-6">
                  Entities represent your data models. Think of them as database tables.
                </p>
                <h2 className="text-2xl font-bold mb-3">Field Types Available</h2>
                <div className="grid grid-cols-3 gap-2">
                  {FIELD_TYPES.map(type => (
                    <div key={type} className="bg-gray-50 px-3 py-2 rounded border">
                      <code className="text-purple-600">@{type}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'endpoints' && (
              <div>
                <h1 className="text-3xl font-bold mb-4">Creating Endpoints</h1>
                <h2 className="text-2xl font-bold mb-3">HTTP Methods</h2>
                <div className="grid grid-cols-5 gap-2">
                  {HTTP_METHODS.map(method => (
                    <div key={method} className="bg-green-50 px-3 py-2 rounded border text-center font-mono font-bold">
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'cli' && (
              <div>
                <h1 className="text-3xl font-bold mb-4">Using AION CLI</h1>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">aion generate</h3>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm">
                      aion generate schema.aion -o ./generated
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">aion mock</h3>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm">
                      aion mock schema.aion --port 3000
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DecoratorBadge = ({ decorator, onRemove, onChange }: any) => (
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

const EntityCard = ({ entity, selected, onMouseDown, onUpdate, onDelete, onAddField, onUpdateField, onDeleteField }: any) => {
  const [showDecorators, setShowDecorators] = useState<Record<number, boolean>>({});

  const addDecorator = (fieldId: number, decoratorName: string) => {
    const field = entity.fields.find((f: Field) => f.id === fieldId);
    if (!field) return;
    const needsValue = ['min', 'max', 'precision', 'pattern'].includes(decoratorName);
    onUpdateField(fieldId, {
      decorators: [...field.decorators, { name: decoratorName, value: needsValue ? '' : null }]
    });
    setShowDecorators({ ...showDecorators, [fieldId]: false });
  };

  return (
    <div
      style={{ position: 'absolute', left: entity.x, top: entity.y, cursor: 'grab', minWidth: '350px' }}
      onMouseDown={onMouseDown}
      className={`bg-white rounded-lg shadow-lg border-2 transition-all ${selected ? 'border-blue-500 shadow-xl' : 'border-gray-200'}`}
    >
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

      <div className="p-4">
        {entity.fields.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-2">No fields yet</p>
        )}

        {entity.fields.map((field: Field) => (
          <div key={field.id} className="mb-3 p-2 bg-gray-50 rounded border border-gray-200">
            <div className="flex gap-2 items-center mb-2">
              <input
                type="text"
                value={field.name}
                onChange={(e) => onUpdateField(field.id, { name: e.target.value })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="field name"
                onClick={(e) => e.stopPropagation()}
              />
              <select
                value={field.type}
                onChange={(e) => onUpdateField(field.id, { type: e.target.value })}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {FIELD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteField(field.id); }}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {field.relationType === 'none' && (
              <div className="flex flex-wrap gap-1 mb-2">
                {field.decorators.map((dec, idx) => (
                  <DecoratorBadge
                    key={idx}
                    decorator={dec}
                    onRemove={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onUpdateField(field.id, {
                        decorators: field.decorators.filter((_, i) => i !== idx)
                      });
                    }}
                    onChange={(value: string) => {
                      const newDecs = [...field.decorators];
                      newDecs[idx].value = value;
                      onUpdateField(field.id, { decorators: newDecs });
                    }}
                  />
                ))}
              </div>
            )}

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

const EndpointCard = ({ endpoint, entities, selected, onMouseDown, onUpdate, onDelete }: any) => {
  const [showEntitySuggestions, setShowEntitySuggestions] = useState(false);

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
            onChange={(e) => onUpdate({ method: e.target.value })}
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
        <div className="relative">
          <label className="block text-xs text-gray-600 mb-1">Body</label>
          <input
            type="text"
            value={endpoint.body || ''}
            onChange={(e) => onUpdate({ body: e.target.value })}
            onFocus={() => setShowEntitySuggestions(true)}
            onBlur={() => setTimeout(() => setShowEntitySuggestions(false), 200)}
            placeholder="User(email, name, age?)"
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            onClick={(e) => e.stopPropagation()}
          />
          {showEntitySuggestions && entities.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto">
              {entities.map((entity: Entity) => (
                <button
                  key={entity.id}
                  onClick={() => {
                    onUpdate({ body: `${entity.name}()` });
                    setShowEntitySuggestions(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm"
                >
                  {entity.name}
                </button>
              ))}
            </div>
          )}
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
      </div>
    </div>
  );
};

export default function App() {
  const [apiName, setApiName] = useState('MyAPI');
  const [apiVersion, setApiVersion] = useState('1.0.0');
  const [entities, setEntities] = useState<Entity[]>([]);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [dragging, setDragging] = useState<DraggingState | null>(null);
  const [selected, setSelected] = useState<{ type: Mode; id: number } | null>(null);
  const [mode, setMode] = useState<Mode>('entities');
  const [showDocs, setShowDocs] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const addEntity = () => {
    const newEntity: Entity = {
      id: Date.now(),
      name: 'NewEntity',
      x: 100 + entities.length * 50,
      y: 100 + entities.length * 50,
      fields: []
    };
    setEntities([...entities, newEntity]);
    setSelected({ type: 'entities', id: newEntity.id });
    setMode('entities');
  };

  const addEndpoint = () => {
    const newEndpoint: Endpoint = {
      id: Date.now(),
      method: 'GET',
      path: '/endpoint',
      x: 100 + endpoints.length * 50,
      y: 100 + endpoints.length * 50,
      returns: 'void',
      errors: [],
      decorators: []
    };
    setEndpoints([...endpoints, newEndpoint]);
    setSelected({ type: 'endpoints', id: newEndpoint.id });
    setMode('endpoints');
  };

  const handleMouseDown = (e: React.MouseEvent, item: Entity | Endpoint) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'BUTTON') return;
    setDragging({ id: item.id, startX: e.clientX - item.x, startY: e.clientY - item.y });
    setSelected({ type: mode, id: item.id });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
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
        code += `        ${field.name}: @${field.type}`;
        if (field.decorators?.length > 0) {
          code += `(${field.decorators.map(d => d.value ? `${d.name}: ${d.value}` : d.name).join(', ')})`;
        }
        if (field.isArray) code += '[]';
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
        code += `        }\n\n`;
      });
      code += `    }\n`;
    }
    code += `}`;
    return code;
  };

  const items = mode === 'entities' ? entities : endpoints;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AION Studio
                </h1>
                <p className="text-sm text-gray-500">Visual API Designer</p>
              </div>
              <div className="flex gap-2">
                <input
                  value={apiName}
                  onChange={(e) => setApiName(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                  placeholder="API Name"
                />
                <input
                  value={apiVersion}
                  onChange={(e) => setApiVersion(e.target.value)}
                  className="w-24 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                  placeholder="1.0.0"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="flex border-2 border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setMode('entities')}
                  className={`px-4 py-2 text-sm font-medium ${mode === 'entities' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  Entities ({entities.length})
                </button>
                <button
                  onClick={() => setMode('endpoints')}
                  className={`px-4 py-2 text-sm font-medium ${mode === 'endpoints' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  Endpoints ({endpoints.length})
                </button>
              </div>
              <button
                onClick={mode === 'entities' ? addEntity : addEndpoint}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus size={18} />
                Add {mode === 'entities' ? 'Entity' : 'Endpoint'}
              </button>
              <button
                onClick={() => setShowDocs(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <BookOpen size={18} />
                Docs
              </button>
              <button
                onClick={() => setShowCode(!showCode)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
              >
                <Code size={18} />
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([generateCode()], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'schema.aion';
                  a.click();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download size={18} />
                Download
              </button>
            </div>
          </div>
        </div>
      </header>

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
            <div className="text-center max-w-md">
              <Move size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Add your first {mode === 'entities' ? 'entity' : 'endpoint'}
              </h2>
              <p className="text-gray-600 mb-4">
                Click the "Add {mode === 'entities' ? 'Entity' : 'Endpoint'}" button above to get started
              </p>
              <button
                onClick={() => setShowDocs(true)}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Read Documentation
              </button>
            </div>
          </div>
        )}

        {mode === 'entities' && entities.map(entity => (
          <EntityCard
            key={entity.id}
            entity={entity}
            entities={entities}
            selected={selected?.type === 'entities' && selected?.id === entity.id}
            onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, entity)}
            onUpdate={(updates: Partial<Entity>) => setEntities(entities.map(e => e.id === entity.id ? { ...e, ...updates } : e))}
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
            onUpdateField={(fieldId: number, updates: Partial<Field>) => setEntities(entities.map(e =>
              e.id === entity.id
                ? { ...e, fields: e.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f) }
                : e
            ))}
            onDeleteField={(fieldId: number) => setEntities(entities.map(e =>
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
            entities={entities}
            selected={selected?.type === 'endpoints' && selected?.id === endpoint.id}
            onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, endpoint)}
            onUpdate={(updates: Partial<Endpoint>) => setEndpoints(endpoints.map(ep => ep.id === endpoint.id ? { ...ep, ...updates } : ep))}
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

      {showDocs && <Documentation onClose={() => setShowDocs(false)} />}
    </div>
  );
}