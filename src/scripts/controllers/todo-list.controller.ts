import TodoListModel from '../models/todo-list.model';
import { Filters } from '../types';
import TodoListView from '../views/todo-list.view';

export default class TodoListController {
  private currentFilterValue: Filters = <Filters>localStorage.getItem('filtersStatus') || Filters.ALL;

  constructor(private readonly _todoListModel: TodoListModel, private readonly _todoListView: TodoListView) {
    _todoListView.init({
      onInput: this.actionInput.bind(this),
      onSubmit: this.actionAdd.bind(this),
      onChange: this.actionChange.bind(this),
      onToggle: this.actionToggle.bind(this),
      onDelete: this.actionDelete.bind(this),
      onDeleteCompleted: this.actionDeleteCompleted.bind(this),
      onFilters: this.actionChangeFilter.bind(this)
    });
  }

  init(): void {
    this._todoListView.render(this._todoListModel.todoList, this.currentFilterValue);
  }

  actionInput(value: string): void {
    this._todoListModel.currentInputValue = value;
  }

  actionAdd(): void {
    const text = this._todoListModel.currentInputValue.trim();

    if (text) {
      this._todoListModel.create(text);
      this._todoListView.render(this._todoListModel.todoList, this.currentFilterValue);
    }
  }

  actionChange(id: number, text: string): void {
    this._todoListModel.changeText(id, text);

    this._todoListView.render(this._todoListModel.todoList, this.currentFilterValue);
  }

  actionToggle(id: number): void {
    this._todoListModel.toggle(id);

    this._todoListView.render(this._todoListModel.todoList, this.currentFilterValue);
  }

  actionDelete(id: number): void {
    this._todoListModel.delete(id);

    this._todoListView.render(this._todoListModel.todoList, this.currentFilterValue);
  }

  actionDeleteCompleted(): void {
    this._todoListModel.deleteCompleted();
    this._todoListView.render(this._todoListModel.todoList, this.currentFilterValue);
  }

  actionChangeFilter(value: Filters) {
    this.currentFilterValue = value;
    localStorage.setItem('filtersStatus', value);
    this._todoListView.render(this._todoListModel.todoList, this.currentFilterValue);
  }
}
