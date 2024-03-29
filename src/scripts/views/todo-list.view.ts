import { Filters, IActions, IListener, ITodoItem, KeyboardKeys } from '../types';

export default class TodoListView {
  handlers = {
    onInput: (value: string) => console.log('input', value),
    onSubmit: () => console.log('submit'),
    onChange: (id: number, text: string) => console.log('change', id, text),
    onToggle: (id: number) => console.log('toggle', id),
    onDelete: (id: number) => console.log('delete', id),
    onDeleteCompleted: () => console.log('delete completed'),
    onFilters: (value: Filters) => console.log('filters', value)
  };

  constructor(private readonly _rootElement: HTMLElement) {}

  private static _createContainer(): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('container');
    return div;
  }

  private static _createHeader(): HTMLElement {
    const header = document.createElement('header');
    header.classList.add('header');

    const container = TodoListView._createContainer();

    const h1 = document.createElement('h1');
    h1.classList.add('app-title');
    h1.insertAdjacentText('afterbegin', 'ToDoList');

    container.appendChild(h1);
    header.appendChild(container);

    return header;
  }

  private static _createSection(className: string): HTMLElement {
    const section = document.createElement('section');
    section.classList.add(className);

    return section;
  }

  private static _createButton(
    btnContent = 'button',
    btnClasses: string[] = [],
    listeners?: IListener[],
    type = 'button'
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.setAttribute('type', type);
    button.insertAdjacentText('afterbegin', btnContent);
    button.classList.add(...btnClasses);
    listeners?.forEach((listener) => {
      button.addEventListener(listener.eventName, listener.callback);
    });
    return button;
  }

  render(todos: ITodoItem[], filter = Filters.ALL): void {
    this._clearApp();
    const header = TodoListView._createHeader();
    let filteredArray: ITodoItem[];
    if (filter === Filters.ALL) {
      filteredArray = [...todos];
    } else if (filter === Filters.ACTIVE) {
      filteredArray = todos.filter((todo) => !todo.checked);
    } else if (filter === Filters.COMPLETED) {
      filteredArray = todos.filter((todo) => todo.checked);
    }

    const main = this._createMain(todos, filteredArray, filter);

    this._rootElement.appendChild(header);
    this._rootElement.appendChild(main);
  }

  init(actions: IActions): void {
    this.handlers.onInput = actions.onInput;
    this.handlers.onSubmit = actions.onSubmit;
    this.handlers.onChange = actions.onChange;
    this.handlers.onDelete = actions.onDelete;
    this.handlers.onToggle = actions.onToggle;
    this.handlers.onDeleteCompleted = actions.onDeleteCompleted;
    this.handlers.onFilters = actions.onFilters;
  }

  private _createEditModal(text: string): Promise<string | boolean> {
    const modal = document.getElementById('modal');

    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');

    const inputField = document.createElement('div');
    inputField.classList.add('input-field');

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('autocomplete', 'off');
    input.value = text;

    inputField.appendChild(input);
    backdrop.appendChild(inputField);

    modal.appendChild(backdrop);
    input.focus();

    return new Promise((resolve) => {
      const clearModal = (event: KeyboardEvent) => {
        if (event.code === KeyboardKeys.ENTER_KEY) {
          modal.replaceChildren();
          document.removeEventListener('keydown', clearModal);
          const newInputValue = (<HTMLInputElement>event.target).value.trim();
          resolve(newInputValue);
        }
        if (event.code === KeyboardKeys.ESCAPE_KEY) {
          modal.replaceChildren();
          document.removeEventListener('keydown', clearModal);
          resolve(false);
        }
      };
      document.addEventListener('keydown', clearModal);
      input.addEventListener('keydown', clearModal);
    });
  }

  private _createDeleteModal(message: string, id?: number): Promise<number | string | boolean> {
    const modal = document.getElementById('modal');

    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');

    const textField = document.createElement('div');
    textField.classList.add('text-field');

    const h1 = document.createElement('h1');
    h1.insertAdjacentText('afterbegin', message);

    textField.appendChild(h1);
    textField.focus();
    backdrop.appendChild(textField);

    modal.appendChild(backdrop);

    return new Promise((resolve) => {
      const clearModal = (e: KeyboardEvent) => {
        if (e.code === KeyboardKeys.ENTER_KEY) {
          modal.replaceChildren();
          document.removeEventListener('keydown', clearModal);
          if (id) {
            resolve(id);
          } else {
            resolve(Infinity);
          }
        }

        if (e.code === KeyboardKeys.ESCAPE_KEY) {
          modal.replaceChildren();
          document.removeEventListener('keydown', clearModal);
          resolve(false);
        }
      };

      document.addEventListener('keydown', clearModal);
    });
  }

  private _createListElment(todo: ITodoItem): HTMLLIElement {
    const li = document.createElement('li');
    li.classList.add('todos-list-item');

    const label = document.createElement('label');

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.checked = todo.checked;
    input.addEventListener('click', () => {
      this.handlers.onToggle(todo.id);
    });

    const spanCheckMark = document.createElement('span');
    spanCheckMark.classList.add('checkmark');

    const spanContent = document.createElement('span');
    spanContent.classList.add('content');
    spanContent.insertAdjacentText('afterbegin', todo.text);

    label.appendChild(input);
    label.appendChild(spanCheckMark);
    label.appendChild(spanContent);

    const div = document.createElement('div');
    div.classList.add('buttons');

    const btnEdit = TodoListView._createButton(
      '∴',
      ['edit'],
      [
        {
          eventName: 'click',
          callback: () => {
            this._createEditModal(todo.text).then((data) => {
              if (data) {
                this.handlers.onChange(todo.id, <string>data);
              }
            });
          }
        }
      ]
    );

    const btnDelete = TodoListView._createButton(
      '✗',
      ['delete'],
      [
        {
          eventName: 'click',
          callback: () => {
            this._createDeleteModal('Delete this task?', todo.id).then((todoId) => {
              if (todoId) {
                this.handlers.onDelete(<number>todoId);
              }
            });
          }
        }
      ]
    );

    div.appendChild(btnEdit);
    div.appendChild(btnDelete);

    li.appendChild(label);
    li.appendChild(div);

    return li;
  }

  private _clearApp(): void {
    this._rootElement.replaceChildren();
  }

  private _createInputSection(): HTMLElement {
    const section = TodoListView._createSection('input');

    const input = document.createElement('input');
    input.addEventListener('input', (e) => {
      this.handlers.onInput((<HTMLInputElement>e.target).value);
    });
    input.addEventListener('keydown', (e) => {
      if (e.code === KeyboardKeys.ENTER_KEY) {
        this.handlers.onSubmit();
      }
    });
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'new todo...');
    input.setAttribute('autocomplete', 'off');

    const btnAdd = TodoListView._createButton(
      'Add',
      ['add-btn'],
      [
        {
          eventName: 'click',
          callback: () => {
            this.handlers.onSubmit();
          }
        }
      ]
    );

    section.appendChild(input);
    section.appendChild(btnAdd);
    return section;
  }

  private _createTodoListSection(todos: ITodoItem[]): HTMLElement {
    const section = TodoListView._createSection('todos');
    const ul = document.createElement('ul');
    ul.classList.add('todos-list');

    todos.forEach((todo) => {
      const listElement = this._createListElment(todo);
      ul.appendChild(listElement);
    });

    section.appendChild(ul);

    return section;
  }

  private _createControlsSection(todos: ITodoItem[], filtersStatus: Filters) {
    const section = TodoListView._createSection('controls');

    const span = document.createElement('span');
    span.classList.add('counter');
    const unCompletedArray: ITodoItem[] = todos.filter((todo) => !todo.checked);
    const completedArray: ITodoItem[] = todos.filter((todo) => todo.checked);
    span.insertAdjacentText('afterbegin', String(unCompletedArray.length) + ' tasks in list');

    const div = document.createElement('div');
    div.classList.add('filters');

    const allBtn = TodoListView._createButton(
      'All',
      [filtersStatus === Filters.ALL ? 'active' : 'unset'],
      [
        {
          eventName: 'click',
          callback: () => {
            this.handlers.onFilters(Filters.ALL);
          }
        }
      ]
    );

    const activeBtn = TodoListView._createButton(
      'Active',
      [filtersStatus === Filters.ACTIVE ? 'active' : 'unset'],
      [
        {
          eventName: 'click',
          callback: () => {
            this.handlers.onFilters(Filters.ACTIVE);
          }
        }
      ]
    );
    const completedBtn = TodoListView._createButton(
      'Completed',
      [filtersStatus === Filters.COMPLETED ? 'active' : 'unset'],
      [
        {
          eventName: 'click',
          callback: () => {
            this.handlers.onFilters(Filters.COMPLETED);
          }
        }
      ]
    );

    div.appendChild(allBtn);
    div.appendChild(activeBtn);
    div.appendChild(completedBtn);

    const clearCompleteBtn = TodoListView._createButton(
      'Clear completed',
      ['clear-btn'],
      [
        {
          eventName: 'click',
          callback: () => {
            this._createDeleteModal('Delete all completed?').then((data) => {
              if (data === Infinity) {
                this.handlers.onDeleteCompleted();
              } else {
                console.log('Error');
              }
            });
          }
        }
      ]
    );

    section.appendChild(span);
    section.appendChild(div);
    section.appendChild(clearCompleteBtn);

    return section;
  }

  private _createMain(todos: ITodoItem[], filteredTodos: ITodoItem[], filter: Filters): HTMLElement {
    const main = document.createElement('main');
    main.classList.add('main');

    const container = TodoListView._createContainer();

    const inputSection = this._createInputSection();
    const todoListSection = this._createTodoListSection(filteredTodos);
    const controlsSection = this._createControlsSection(todos, filter);

    container.appendChild(inputSection);
    container.appendChild(todoListSection);
    container.appendChild(controlsSection);

    main.appendChild(container);
    return main;
  }
}
