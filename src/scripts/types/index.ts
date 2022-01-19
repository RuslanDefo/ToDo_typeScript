export interface ITodoItem {
  id: number;
  text: string;
  checked: boolean;
}

export interface IActions {
  onInput: (value: string) => void;
  onSubmit: () => void;
  onChange: (id: number, text: string) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onDeleteCompleted: () => void;
  onFilters: (value: Filters) => void;
}

export interface IListener {
  eventName: string;
  callback: EventListenerOrEventListenerObject;
}

export enum KeyboardKeys {
  ENTER_KEY = 'Enter',
  ESCAPE_KEY = 'Escape'
}

export enum Filters {
  ALL = 'all',
  COMPLETED = 'completed',
  ACTIVE = 'active'
}
