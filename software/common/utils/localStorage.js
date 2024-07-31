export class Authority {
  constructor(key = 'ids') {
    this.key = key;
  }

  getCode(id) {
    const ids = localStorage.getItem(this.key);
    if (!ids) return null;
    const idArr = JSON.parse(ids);
    const obj = idArr.find(item => item.id === id);
    return obj ? obj.value : null;
  }
  setCode(id, value) {
    let ids = localStorage.getItem(this.key);
    if (!ids) {
      ids = JSON.stringify([]);
    }
    const idArr = JSON.parse(ids);
    let data = { id, value };
    let hasExist = false;
    const newArr = idArr.map(item => {
      if (item.id === id) {
        hasExist = true;
        return data;
      }
      return item;
    });
    if (!hasExist) {
      newArr.push(data);
    }
    localStorage.setItem(this.key, JSON.stringify(newArr));
    return data;
  }

  hasCode(id) {
    const ids = localStorage.getItem(this.key);
    if (!ids) return false;
    const idArr = JSON.parse(ids);
    const obj = idArr.find(item => item.id === id);
    return obj ? true : false;
  }

  deleteCode(id) {
    const ids = localStorage.getItem(this.key);
    if (!ids) return true;
    const idArr = JSON.parse(ids);
    const newArr = idArr.filter(item => item.id !== id);
    localStorage.setItem(this.key, JSON.stringify(newArr));
    return true;
  }
}
