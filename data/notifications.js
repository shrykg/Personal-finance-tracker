import budgetDataFunctions from "./budget.js";

class Queue {
    constructor() {
        this.items = [];
        this.limit = 10;
    }

    enqueue(element) {
        if (this.items.length < this.limit) {
            this.items.push(element);
            return true;
        } else {
            this.dequeue();
            this.items.push(element);
            return true;
        }
    }

    dequeue() {
        if (this.items.length === 0) {
            console.log("Queue Underflow");
            return null;
        } else {
            return this.items.shift();
        }
    }

    front() {
        return this.items[0];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
}

const getAll = async (user_id) => {
    let notifications = new Queue();

    let all_budgets = budgetDataFunctions.getAll(user_id);

    for (let i = 0; i < all_budgets.length; i++) {
        //if(all_budgets[i].)
    }


};