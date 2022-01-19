import { ITodoItem } from '../types';

export default class TodoListModel {
  currentInputValue = '';

  todoList: ITodoItem[] = JSON.parse(localStorage.getItem('todoList')) || [];

  create(text: string) {
    const todo: ITodoItem = {
      id: Math.floor(Math.random() * 100000),
      text,
      checked: false
    };
    this.todoList.push(todo);
    this.setLocalStorage();
  }

  changeText(id: number, text: string) {
    this.todoList = this.todoList.map((todo) => {
      if (todo.id === id) {
        return { id: todo.id, text: text, checked: todo.checked };
      } else {
        return todo;
      }
    });
    this.setLocalStorage();
  }

  toggle(id: number) {
    this.todoList = this.todoList.map((todo) => {
      if (todo.id === id) {
        return { id: todo.id, text: todo.text, checked: !todo.checked };
      } else {
        return todo;
      }
    });
    this.setLocalStorage();
  }

  delete(id: number) {
    this.todoList = this.todoList.filter((todo) => todo.id !== id);
    this.setLocalStorage();
  }

  deleteCompleted() {
    this.todoList = this.todoList.filter((todo) => !todo.checked);
    this.setLocalStorage();
  }

  setLocalStorage() {
    localStorage.setItem('todoList', JSON.stringify(this.todoList));
  }
}
