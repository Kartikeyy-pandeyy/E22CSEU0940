class NumberQueue {
    constructor(maxSize) {
      this.queue = [];
      this.maxSize = maxSize;
    }
  
    add(number) {
      if (!this.queue.includes(number)) {
        if (this.queue.length >= this.maxSize) {
          this.queue.shift(); // Remove oldest number
        }
        this.queue.push(number);
      }
    }
  
    getNumbers() {
      return [...this.queue];
    }
  
    getAverage() {
      if (this.queue.length === 0) return 0;
      const sum = this.queue.reduce((acc, num) => acc + num, 0);
      return parseFloat((sum / this.queue.length).toFixed(2));
    }
  }
  
  module.exports = NumberQueue;