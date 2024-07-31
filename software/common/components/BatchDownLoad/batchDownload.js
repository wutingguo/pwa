export default class BatchDownload {
  static nullFunc = () => {};
  constructor({
    url,
    name = '',
    allowBatch = false,
    sliceThreshold = 10 * 1024 * 1024,
    sliceSize = 8 * 1024 * 1024,
    threads = 4,
    callback = () => {},
    onProgress = BatchDownload.nullFunc,
    onSuccess = BatchDownload.nullFunc
  }) {
    this.downurl = url;
    this.allowBatch = allowBatch;
    this.name =
      name ||
      url
        .split('/')
        .splice(-1)[0]
        .replace(/\?.+$/g, '');
    this.sliceSize = sliceSize;
    this.sliceThreshold = sliceThreshold;
    this.threads = threads;
    this.allTasks = [];
    this.rangeTasks = [];
    this.pendingTasks = [];
    this.successTasks = [];
    this.failedTasks = [];
    this.blobs = [];
    this.onProgress = onProgress;
    this.onSuccess = onSuccess;
    this.startTime = Date.now();
    this.totalCount = 0;
    this.headers = {};
    this.callback = callback;
    this.start();
  }

  getHeaders() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this.downurl, true);
      xhr.onreadystatechange = () => {
        const headersStr = xhr.getAllResponseHeaders();
        xhr.abort();
        const headers = {};
        headersStr
          .split(/(\r\n|\n)+/)
          .filter(item => !/^\s*$/.test(item))
          .forEach(str => {
            const arr = str.split(/:\s*/);
            const key = arr[0];
            let val = arr[1];
            if (/^\d+$/.test(val)) {
              val = Number(val);
            }
            headers[key] = val;
          });
        this.headers = headers;
        resolve();
      };
      xhr.send();
    });
  }

  doStart() {
    const length = this.headers['content-length'];
    const count = Math.ceil(length / this.sliceSize);
    let lastEnd = -1;
    this.callback(t('PREPARING'), length);
    for (let i = 0; i < count; i++) {
      const start = lastEnd + 1;
      lastEnd = start + this.sliceSize;
      if (i === count - 1) {
        lastEnd = '';
      }
      this.rangeTasks.push({ start, end: lastEnd });
    }
    this.allTasks = this.rangeTasks.slice(0);
    this.totalCount = this.allTasks.length;
    this.blobs = new Array(count || 0).fill('');
  }

  async start() {
    this.onProgress({ percent: 0 });

    try {
      await this.getHeaders();
    } catch (e) {
      this.onProgress({ percent: 100 });
      this.callback();
      return this.doDownload(this.downurl);
    }

    const length = this.headers['content-length'];
    const isAllowRange = !!this.headers['accept-ranges'];
    if (!this.allowBatch && (!isAllowRange || length <= this.sliceThreshold)) {
      this.onProgress({ percent: 100 });
      this.callback();
      return this.doDownload(this.downurl);
    }

    this.doStart();

    this.excuate();
  }

  download() {
    const task = this.rangeTasks.shift();

    if (task) {
      this.pendingTasks.push(task);
      const { start, end } = task;
      fetch(this.downurl, {
        headers: {
          Range: `bytes=${start}-${end}`
        }
      })
        .then(res => res.blob())
        .then(blob => {
          const index = this.allTasks.findIndex(tk => tk.start === task.start);
          this.blobs[index] = blob;
          this.successTasks.push(task);
          this.pendingTasks = this.pendingTasks.filter(tk => tk.start !== task.start);
          const successCount = this.successTasks.length;
          const cost = (Date.now() - this.startTime) / 60000;
          const percent = parseFloat(((successCount / this.totalCount) * 100).toFixed(2));
          const estimate = parseFloat(((cost / percent) * 100).toFixed(2));
          this.onProgress({ percent: Math.floor(percent), estimate });
          this.checkDone();
        })
        .catch(err => {
          console.log(err);
          this.callback(t('DOWNLAOD_FAILURE'));
          this.failedTasks.push(task);
          this.pendingTasks = this.pendingTasks.filter(tk => tk.start !== task.start);
          this.checkDone();
        });
    }
  }

  doDownload(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = this.name;
    a.click();
  }

  excuate() {
    const idle_threads = this.threads - this.pendingTasks.length;
    for (let i = 0; i < idle_threads; i++) {
      this.download();
    }
  }

  checkDone() {
    if (!this.pendingTasks.length) {
      const failedLength = this.failedTasks.length;
      if (failedLength) {
        this.rangeTasks = this.failedTasks.splice(0, failedLength);
        this.excuate();
      } else {
        const file = new Blob(this.blobs, { name: this.name, type: this.blobs[0].type });
        this.onSuccess(file);

        const url = URL.createObjectURL(file);
        this.doDownload(url);
        URL.revokeObjectURL(url);
      }
    } else {
      this.excuate();
    }
  }
}
