// This data file should export all functions using the ES6 standard as shown in the lecture code
import { budget, expired } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb';
import { transactionData } from '../data/index.js';
import { transactions } from '../config/mongoCollections.js';
import validation from '../validation.js';
import moment from 'moment';

const checkExist= async (user_id,category,start,value)=> {
  /* checking that user already have done transaction on that perticular category
   and if yes then it will compare total of that amount with budget amount and allow only if amount<budget */
  const get_data = await transactions();
  let today = moment().format("YYYY-MM-DD");
 if (today.trim()===start.trim()){
  const result = await get_data.find({user_id:new ObjectId(user_id),
    transaction_date: { $eq: today },category: category}).toArray();
    let amounts = result.map(obj => {
      const amountString = obj.amount.slice(1); // Remove the ₹ symbol
      return Number(amountString);
    });
    let total = 0;
for (let i = 0; i < amounts.length; i++) {
  total += amounts[i];
}
if(total>=value){throw "You have already spent more amount than budget in this category today , start budget from next day please"}
}
}
//  creating new budget
const create = async (user_id, category, amount, start, end) => {
  if(!amount){throw "Please Provide amount"}
  const symbol = amount.slice(0, 1);
  let value = Number(amount.slice(1));
  validation.checkBudget(category,value,start,end);
  value = symbol + value.toString();
  let newdata =
  {
    user_id: user_id.trim(),
    category: category.trim(),
    budget_amount: amount.trim(),
    start_date: start.trim(),
    end_date: end.trim()
  }
  const getbudget = await budget();
  const found = await getbudget.findOne({ user_id: user_id, category: category });
  if (found) { throw "Already Exist category" }
  const Info = await getbudget.insertOne(newdata);
  if (!Info.acknowledged || !Info.insertedId) { throw "Could not add info" }
  return { inserted: true }
};

// get all active budget

const get_all_active_users = async (user_id) => {
  const get_data = await budget();
  let today = moment().format("YYYY-MM-DD");

  const result = await get_data.find({
    user_id: user_id,
    end_date: { $gte: today }
  }).toArray()
  return result;
};

//remove active budget

const removeActive = async (budget_id) => {
  budget_id = budget_id.trim();
  const getbudget = await budget();
  let deldata = await getbudget.findOneAndDelete({ _id: new ObjectId(budget_id.trim()) });
  if (deldata.lastErrorObject.n === 0) {
    throw `"No data with id : ${budget_id}"`;
  }
  return { deltedBudget: true }
};

// auto delete budget_end_date < today when hit the dashboard and add it to expired collection

const archiveExpiredBudgets = async () => {
  let today = moment().format("YYYY-MM-DD");

  const current = await budget();
  const expiredBud = await current.find({ end_date: { $lt: today } }).toArray();

  const expire = await expired();
  const insertManyResult = await expire.insertMany(expiredBud);

  const deleteExpiredResult = await current.deleteMany({ end_date: { $lt: today } });

  return { allok: true };
}

// get all expired budget

const getAll = async (user_id) => {
  const getBudget = await expired();
  let alldata = await getBudget.find({ user_id: user_id.trim() }).toArray();
  alldata = alldata.map((ele) => {
    ele.user_id = ele.user_id.toString();
    return ele;
  });
  return alldata;
};

//get all expired budget, sort by start_date 

const getAllsort = async (user_id) => {
  const allBud = await expired();
  let alldata = await allBud.find({ user_id: user_id.trim() }).sort({ start_date: 1 }).toArray();
  alldata = alldata.map((ele) => {
    ele.user_id = ele.user_id.toString();
    return ele;
  });
  return alldata;
}

//remove expired budget

const removeExpired = async (budget_id) => {
  budget_id = budget_id.trim();
  const getbudget = await expired();
  let deldata = await getbudget.findOneAndDelete({ _id: new ObjectId(budget_id.trim()) });
  if (deldata.lastErrorObject.n === 0) {
    throw `"No data with id : ${budget_id}"`;
  }
  return { deltedBudget: true }
};


const amount_aggregate = async (user_id) => {
  //const data = await get_all_active_users(user_id);

  // const result = await get_data.aggregate([
  //   { $group: { _id: "$category", totalAmount: { $sum: "$budget_amount" } } }
  // ]).toArray();
  const data = await transactionData.getAllTransactions(user_id);
  // console.log(data);
  const result = data.reduce((acc, obj) => {
    const key = obj.category;
    const value = obj.amount;
    if (!acc[key]) {
      acc[key] = { category: key, aggregate: 0 };
    }
    acc[key].aggregate += value;
    return acc;
  }, {});
  return Object.values(result);
};

const amount_remaining = async (user_id) => {
  let category = ["groceries", "shopping", "eating_out", "bills", "transportation", "entertainment", "travel", "healthcare", "education", "miscellaneous"]
  //let budget_array = []
  const transaction_collection = await transactions();
  let budget_data = await get_all_active_users(user_id);
  // for(let i = 0 ; i  <budget_data.length ; i ++){
  //   budget_data.amount = 
  // }
  // console.log(budget_data[0].category);
  // console.log(budget_data.lengh)
  let categories = [];
  for (let i = 0; i < budget_data.length; i++) {
    categories.push({ category: budget_data[i].category, start_date: budget_data[i].start_date, end_date: budget_data[i].end_date, amount: budget_data[i].budget_amount });
  }
  //console.log(categories);
  //array will look like this [{category: bills , start_date : something , end_date: something} , {category : shopping}]
  let transaction_array = [];
  //console.log('before transactions')
  for (let i = 0; i < categories.length; i++) {
    //console.log('Entered loop')
    //let x = await transaction_collection.find({ user_id: user_id }, { category: categories[i].category }, { transaction_date: { $gte: new Date(categories[i].start_date), $lt: new Date(categories[i].end_date) } }).toArray()
    let x = await transaction_collection.aggregate([
      {
        $match: {
          user_id: new ObjectId(user_id),
          category: categories[i].category,
          transaction_date: {
            $gte: new Date(categories[i].start_date),
            $lte: new Date(categories[i].end_date)
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          total: {
            $sum: '$amount'
          }
        }
      }
    ]).toArray();

    // console.log(x);
    // console.log('added transaction' + " " + i)
    transaction_array.push({ category: categories[i].category, transaction_sum: x });
  }
  //console.log(transaction_array[1].transaction_sum[0]);
  let final_array = [];
  //return transaction_array

  for (let i = 0; i < transaction_array.length; i++) {
    if (transaction_array[i].transaction_sum[0]) {

      // console.log(typeof budget_data[i].amount)
      // console.log(budget_data[i].amount)
      // console.log(typeof transaction_array[i].transaction_sum[0].total)
      final_array.push({ category: transaction_array[i].category, amount_remaining: categories[i].amount - transaction_array[i].transaction_sum[0].total })
    }
    // console.log(transaction_array[i].transaction_sum[0].total)
    // final_array.push({ category: transaction_array[i].category, amount_remaining: budget_data[i].amount - transaction_array[i].transaction_sum[0].total })
  }

  return final_array;
};

const budgetDataFunctions = { create, getAll, getAllsort, archiveExpiredBudgets, get_all_active_users, removeActive, removeExpired, amount_aggregate, amount_remaining,checkExist }
export default budgetDataFunctions;