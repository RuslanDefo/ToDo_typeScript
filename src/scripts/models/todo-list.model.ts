import { adress, ITodoItem } from '../types';

export default class TodoListModel {
  currentInputValue = '';

  todoList: ITodoItem[] = JSON.parse(localStorage.getItem('todoList')) || [];

  async getAll() {
    const response = await fetch(adress.ref, {
      method: 'GET'
    });
    const data = await response.json();
    this.todoList = [...data];
    return localStorage.setItem('todoList', JSON.stringify(this.todoList));
  }

  async createTask(key: string = null, value: string | boolean) {
    const response = await fetch(adress.ref, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({ [key]: value })
    });
    const data = await response.json();
    this.todoList = [...data];
    return localStorage.setItem('todoList', JSON.stringify(this.todoList));
  }

  async editTask(id: number, key: string = null, value: string | boolean) {
    const response = await fetch(adress.ref + `${id.toString()}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({ [key]: value })
    });
    const data = await response.json();
    this.todoList = [...data];
    return localStorage.setItem('todoList', JSON.stringify(this.todoList));
  }

  async deleteTask(id: number) {
    const response = await fetch(adress.ref + `${id.toString()}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
    const data = await response.json();
    this.todoList = [...data];
    return localStorage.setItem('todoList', JSON.stringify(this.todoList));
  }

  async deleteCompleted(checker: string) {
    const response = await fetch(adress.ref + checker, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
    const data = await response.json();
    this.todoList = [...data];
    return localStorage.setItem('todoList', JSON.stringify(this.todoList));
  }
}
