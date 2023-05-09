import {dbConnection, closeConnection} from './config/mongoConnection.js';
import { transactionData, login_reg_data } from './data/index.js';


const db = await dbConnection();
await db.dropDatabase();

let myUser = undefined

console.log('creating user')

try {
    myUser = await login_reg_data.add_user("Seed","User","1995-06-03","abc@example.com","Pass@1234","United States")
    console.log(myUser)
} catch (error) {
    console.log(error)
}

console.log("now add some transactions for this user")
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
    firstTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",100,"First transaction","Shopping","2023-05-01")
    console.log(firstTransaction)
} catch (error) {
    console.log(error)
}

console.log("Second Transaction")
try {
    secondTransaction = await transactionData.addTransaction(myUser._id.toString(),"Check",200,"Second transaction","Groceries","2023-04-01")
    console.log(secondTransaction)
} catch (error) {
    console.log(error)
}

console.log("Third Transaction")
try {
    thirdTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",300,"third transaction","Bills","2023-03-01")
    console.log(thirdTransaction)
} catch (error) {
    console.log(error)
}

console.log("Forth Transaction")
try {
    forthTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",400,"Forth transaction","Shopping","2023-02-01")
    console.log(forthTransaction)
} catch (error) {
    console.log(error)
}

console.log("Fifth Transaction")
try {
    fifthTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",500,"Fifth transaction","travel","2023-01-01")
    console.log(fifthTransaction)
} catch (error) {
    console.log(error)
}

console.log("Sixth Transaction")
try {
    sixthTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",600,"Sixth transaction","Shopping","2022-12-01")
    console.log(sixthTransaction)
} catch (error) {
    console.log(error)
}

console.log("seventh Transaction")
try {
    seventhTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",700,"Seventh transaction","Shopping","2022-11-01")
    console.log(seventhTransaction)
} catch (error) {
    console.log(error)
}

console.log("Eigth Transaction")
try {
    eigthTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",800,"Eighth transaction","Shopping","2022-10-01")
    console.log(eigthTransaction)
} catch (error) {
    console.log(error)
}

console.log("Ninth Transaction")
try {
    ninthTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",900,"Ninth transaction","Shopping","2022-09-01")
    console.log(ninthTransaction)
} catch (error) {
    console.log(error)
}

console.log("Tenth Transaction")
try {
    tenthTransaction = await transactionData.addTransaction(myUser._id.toString(),"Cash",1000,"Tenth transaction","Shopping","2022-08-01")
    console.log(tenthTransaction)
} catch (error) {
    console.log(error)
}



console.log('Done seeding database');

await closeConnection();