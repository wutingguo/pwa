class PromisePool {
  constructor({ threads = 5, executor, error, success, complete, tasks = [] }) {
    this.threads = threads;
    this.tasks = tasks;
    this.executor = executor;
    this.usingThreads = 0;
    this.complete = complete;
    this.success = success;
    this.error = error;
  }

  addTasks(tasks = []) {
    this.tasks = this.tasks.concat(tasks);
    this.execute();
  }

  addTask(task) {
    this.addTasks([task]);
  }

  execute() {
    let freeThreads = this.threads - this.usingThreads;

    if (!freeThreads) return;
    if (!this.usingThreads && !this.tasks.length) {
      return this.complete();
    }
    while (freeThreads--) {
      const task = this.tasks.shift();
      if (task) {
        this.usingThreads += 1;
        this.executor(task)
          .then(data => {
            this.usingThreads -= 1;
            this.success(data);
            this.execute();
          })
          .catch(e => {
            this.tasks.length = 0;
            this.error(e);
          });
      }
    }
  }
}

export default PromisePool;
