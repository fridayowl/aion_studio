// src/types/index.ts

export interface Decorator {
  name: string;
  value: string | null;
}

export interface Field {
  id: number;
  name: string;
  type: string;
  decorators: Decorator[];
  relationType: 'none' | 'belongsTo' | 'hasMany';
  relatedEntity?: string;
  isArray: boolean;
  enumValues?: string;
}

export interface Entity {
  id: number;
  name: string;
  x: number;
  y: number;
  fields: Field[];
}

export interface ErrorDefinition {
  code: string;
  message: string;
}

export interface Endpoint {
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

export interface DraggingState {
  id: number;
  startX: number;
  startY: number;
}

export interface SelectedState {
  type: 'entities' | 'endpoints';
  id: number;
}

export type Mode = 'entities' | 'endpoints';