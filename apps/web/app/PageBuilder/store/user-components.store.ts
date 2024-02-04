import { makeAutoObservable } from "mobx";

class UserComponentStore {
  onDragUserComponent = false;

  constructor() {
    makeAutoObservable(this);
  }

  onDrag(): void {
    this.onDragUserComponent = true;
  }

  onDrop(): void {
    this.onDragUserComponent = false;
  }
}

export const userComponentStore = new UserComponentStore();
