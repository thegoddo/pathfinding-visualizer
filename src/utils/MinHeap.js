/* export default class MinHeap {
    constructor() {
        this.heap = [];
    }


    isEmpty() {
        return this.heap.length === 0;
    }

    push(node) {
        this.heap.push(node);
        this.heapifyUp();
    }

    pop() {
        if (this.heap.length === 1) {
            return this.heap.pop();
        }

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();

        this.heapifyDown();

        return min;
    }


    heapifyUp() {  // After adding a new node to the end of the heap, 
    // this method ensures that the heap property is maintained by comparing the newly added node with its parent
    //  and swapping them if the new node has a lower priority. 
    // This process continues up the tree until the correct position for the new node is found, 
    // ensuring that the minimum element is always at the root of the heap.
        let index = this.heap.length - 1;

        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);

            if (this.heap[parentIndex].priority <= this.heap[index].priority) {
                break;
            }

            [this.heap[parentIndex], this.heap[index]] = [
                this.heap[index],
                this.heap[parentIndex],
            ];


            index = parentIndex;
        }
    }

    heapifyDown() {// After removing the minimum element (the root of the heap), 
    // this method ensures that the heap property is maintained by comparing the new root node with its children and 
    // swapping it with the child that has the lower priority if necessary. 
    // This process continues down the tree until the correct position for the new root node is found,
    //  ensuring that the minimum element is always at the root of the heap.
        let index = 0;

        while (true) {
            let smallest = index;

            let left = 2 * index + 1;
            let right = 2 * index + 2;

            if (
                left < this.heap.length &&
                this.heap[left].priority <
                this.heap[smallest].priority
            ) {
                smallest = left;
            }
            if (
                right < this.heap.length &&
                this.heap[right].priority <
                this.heap[smallest].priority
            ) {
                smallest = right;
            }

            if (smallest === index) break;

            [this.heap[index], this.heap[smallest]] = [
                this.heap[smallest],
                this.heap[index],
            ];

            index = smallest;
        }
    }
}
 */




export default class MinHeap {
  constructor() {
    this.heap = [];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  push(item) {
    this.heap.push(item);
    this.heapifyUp();
  }

  pop() {
    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const min = this.heap[0];

    this.heap[0] = this.heap.pop();

    this.heapifyDown();

    return min;
  }

  heapifyUp() {
    let index = this.heap.length - 1;

    while (index > 0) {
      let parent = Math.floor((index - 1) / 2);

      if (
        this.heap[parent].priority <=
        this.heap[index].priority
      ) {
        break;
      }

      [this.heap[parent], this.heap[index]] = [
        this.heap[index],
        this.heap[parent],
      ];

      index = parent;
    }
  }

  heapifyDown() {
    let index = 0;

    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;

      let smallest = index;

      if (
        left < this.heap.length &&
        this.heap[left].priority <
          this.heap[smallest].priority
      ) {
        smallest = left;
      }

      if (
        right < this.heap.length &&
        this.heap[right].priority <
          this.heap[smallest].priority
      ) {
        smallest = right;
      }

      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];

      index = smallest;
    }
  }
}