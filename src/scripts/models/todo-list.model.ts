import { adress, ITodoItem } from '../types';

export default class TodoListModel {
  currentInputValue = '';

  todoList: ITodoItem[] = JSON.parse(localStorage.getItem('todoList')) || [];

  async request(method = 'GET', adressLink: string = adress.ref, key: any = null, value: string | boolean) {
    if (method == 'GET') {
      const response = await fetch(adressLink);
      const data = await response.json();
      this.todoList = [...data];
      return localStorage.setItem('todoList', JSON.stringify(this.todoList));
    }
    // eslint-disable-next-line no-constant-condition
    if (method === 'POST' || 'PUT' || 'DELETE') {
      const response = await fetch(adressLink, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [key]: value })
      });
      const data = await response.json();
      this.todoList = [...data];
      return localStorage.setItem('todoList', JSON.stringify(this.todoList));
    }
  }

  init() {
    // @ts-ignore
    this.request();
  }
}
