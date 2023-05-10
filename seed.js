import { dbConnection, closeConnection } from './config/mongoConnection.js';
import { transactionData, login_reg_data, budgetData, goalData } from './data/index.js';
import moment from 'moment'

const db = await dbConnection();
await db.dropDatabase();

let myUser = undefined
let today = moment().format("YYYY-MM-DD");
console.log('creating user')

try {
    myUser = await login_reg_data.add_user("Seed", "User", "1995-06-03", "abc@example.com", "Pass@1234", "United States")
    console.log(myUser)
} catch (error) {
    console.log(error)
}

console.log("now adding some transactions for this user")
let firstTransaction = undefined
let secondTransaction = undefined
let thirdTransaction = undefined
let forthTransaction = undefined
let fifthTransaction = undefined
let sixthTransaction = undefined
let seventhTransaction = undefined
let eigthTransaction = undefined
let ninthTransaction = undefined
let tenthTransaction = undefined


console.log("First Transaction")
try {
    firstTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",100,"First transaction","shopping","2023-05-01")
    console.log(firstTransaction)
} catch (error) {
    console.log(error)
}

console.log("Second Transaction")
try {
    secondTransaction = await transactionData.addTransaction(myUser._id.toString(),"Check",200,"Second transaction","groceries","2023-04-01")
    console.log(secondTransaction)
} catch (error) {
    console.log(error)
}

console.log("Third Transaction")
try {
    thirdTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",300,"third transaction","bills","2023-03-01")
    console.log(thirdTransaction)
} catch (error) {
    console.log(error)
}

console.log("Forth Transaction")
try {
    forthTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",400,"Forth transaction","shopping","2023-02-01")
    console.log(forthTransaction)
} catch (error) {
    console.log(error)
}

console.log("Fifth Transaction")
try {
    fifthTransaction = await transactionData.addTransaction(myUser._id.toString(), "Cash", 500, "Fifth transaction", "travel", "2023-01-01")
} catch (error) {
    console.log(error)
}

console.log("Sixth Transaction")
try {
    sixthTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",600,"Sixth transaction","shopping","2022-12-01")
    console.log(sixthTransaction)
} catch (error) {
    console.log(error)
}

console.log("seventh Transaction")
try {
    seventhTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",700,"Seventh transaction","shopping","2022-11-01")
    console.log(seventhTransaction)
} catch (error) {
    console.log(error)
}

console.log("Eigth Transaction")
try {
    eigthTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",800,"Eighth transaction","shopping","2022-10-01")
    console.log(eigthTransaction)
} catch (error) {
    console.log(error)
}

console.log("Ninth Transaction")
try {
    ninthTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",900,"Ninth transaction","shopping","2022-09-01")
    console.log(ninthTransaction)
} catch (error) {
    console.log(error)
}

console.log("Tenth Transaction")
try {
    tenthTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",1000,"Tenth transaction","shopping","2022-08-01")
    console.log(tenthTransaction)
} catch (error) {
    console.log(error)
}

let firstBudget = undefined
let secondBudget = undefined
let thirdBudget = undefined
let forthBudget = undefined
// let fifthBudget = undefined
// let sixthBudget = undefined
// let seventhBudget = undefined
// let eigthBudget = undefined
// let ninthBudget = undefined
// let tenthBudget = undefined

//Adding budgets

console.log('Adding first budget')
try {
    firstBudget = await budgetData.create(myUser._id.toString(), "groceries", 1500, today, '2023-06-30');
}
catch (e) {
    console.log(e);
}
console.log('Adding second budget')
try {
    secondBudget = await budgetData.create(myUser._id.toString(), "shopping", 20000, today, '2023-06-30');
}
catch (e) {
    console.log(e);
}
console.log('Adding third budget')
try {
    thirdBudget = await budgetData.create(myUser._id.toString(), "healthcare", 25000, today, '2023-10-01');
}
catch (e) {
    console.log(e);
}
console.log('Adding fourth budget')
try {
    forthBudget = await budgetData.create(myUser._id.toString(), "bills", 7500, today, '2023-06-30');
}
catch (e) {
    console.log(e);
}

// try {
//     fifthBudget = await budgetData.create(myUser._id.toString(), "Groceries", 1500, '2023-04-01', '2023-06-30');
// }
// catch (e) {
//     console.log(e);
// }

// try {
//     sixthBudget = await budgetData.create(myUser._id.toString(), "Groceries", 1500, '2023-04-01', '2023-06-30');
// }
// catch (e) {
//     console.log(e);
// }

// try {
//     seventhBudget = await budgetData.create(myUser._id.toString(), "Groceries", 1500, '2023-04-01', '2023-06-30');
// }
// catch (e) {
//     console.log(e);
// }

// try {
//     eigthBudget = await budgetData.create(myUser._id.toString(), "Groceries", 1500, '2023-04-01', '2023-06-30');
// }
// catch (e) {
//     console.log(e);
// }

// try {
//     ninthBudget = await budgetData.create(myUser._id.toString(), "Groceries", 1500, '2023-04-01', '2023-06-30');
// }
// catch (e) {
//     console.log(e);
// }

// try {
//     tenthBudget = await budgetData.create(myUser._id.toString(), "Groceries", 1500, '2023-04-01', '2023-06-30');
// }
// catch (e) {
//     console.log(e);
// }

let firstGoal = undefined
let secondGoal = undefined
let thirdGoal = undefined
let forthGoal = undefined
let fifthGoal = undefined

//["crush_credit_card_debt", "wipe_out_my_loans", "save_for_a_rainy_day", "prepare_for_retirement", "buy_a_home", "buy_a_car", "save_for_college", "take_a_trip", "improve_my_home", "something_else"];
console.log('Adding First goal');
try {
    firstGoal = await goalData.create(myUser._id.toString(), "Save for trip", 10000, '2024-01-01', 'crush_credit_card_debt');
}
catch (e) {
    console.log(e);
}
console.log('Adding Second goal');
try {
    secondGoal = await goalData.create(myUser._id.toString(), "Save for trip", 15000, '2024-03-01', 'take_a_trip');
}
catch (e) {
    console.log(e);
}
console.log('Adding third goal');
try {
    thirdGoal = await goalData.create(myUser._id.toString(), "Pay College Debt", 100000, '2025-01-01', 'wipe_out_my_loans');
}
catch (e) {
    console.log(e);
}
console.log('Adding fourth goal');
try {
    forthGoal = await goalData.create(myUser._id.toString(), "Save for a bad day", 7500, '2024-01-01', 'save_for_a_rainy_day');
}
catch (e) {
    console.log(e);
}
console.log('Adding fifth goal');
try {
    fifthGoal = await goalData.create(myUser._id.toString(), "Retirement Fund", 5000000, '2043-01-01', 'prepare_for_retirement');
}
catch (e) {
    console.log(e);
}

console.log('Done seeding database');

await closeConnection();