// This data file should export all functions using the ES6 standard as shown in the lecture code
import { budget, expired } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb';
import { transactionData } from '../data/index.js';
import { transactions } from '../config/mongoCollections.js';
import validation from '../validation.js';
import moment from 'moment';

const checkExist= async (user_id,category,start,value)=> 
{
  /* checking that user already have done transaction on that perticular category
   and if yes then it will compare total of that amount with budget amount and allow only if amount<budget */
  const get_data = await transactions();
  let today = moment().format("YYYY-MM-DD");
  if (today.trim()===start.trim())
  {
  const result = await get_data.find({user_id:new ObjectId(user_id),
    transaction_date: { $eq: today },category: category}).toArray();
    let total = 0;

    for (let i = 0; i < result.length; i++) 
    {
      total += result[i].amount;
    }

    if (total >= value) 
    {
      throw "You have already spent more amount than budget in this category today, start budget from next day please";
    }
  }
}
//  creating new budget
const create = async (user_id, category, amount, start, end) => {
  validation.checkBudget(category,amount,start,end);
  let newdata =
  {
    user_id: user_id.trim(),
    category: category.trim(),
    budget_amount: amount,
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


const amount_aggregate = async (user_id, start, end, category) => {
  const transactions_data = await transactions();
  const data = await get_all_active_users(user_id);
  const transactions_1 = await transactions_data.find({
    user_id: new ObjectId(user_id),
    transaction_date: { $gte: new Date(start), $lte: new Date(end) },
    category: category
  }).toArray();

  const result = data.reduce((acc, obj) => {
    const key = obj.category;
    const value = obj.value;
    const filteredTransactions = transactions_1.filter(t => t.category === key);
    const sum = filteredTransactions.reduce((total, t) => {
      const amountString = t.amount.slice(1); // Remove the currency symbol
      const amount = Number(amountString);
      return total + amount;
    }, 0);

    if (!acc[key]) {
      acc[key] = { category: key, aggregate: 0 };
    }
    acc[key].aggregate += sum;
    return acc;
  }, {});

  // Update amount_remaining in budget collection
  const budgets_data = await budget();
  for (const key in result) {
    const budget = await budgets_data.findOne({ user_id: user_id, category: key });
    console.log(budget)
    const amountString = budget.budget_amount.slice(1); // Remove the currency symbol
    const budget_amount = Number(amountString);
    const remainingAmount = budget_amount - result[key].aggregate;
    await budgets_data.updateOne({ _id: budget._id }, { $set: { amount_remaining: remainingAmount } });
  }

  return Object.values(result).filter(obj => obj.category === category);
};


const budgetDataFunctions = { create, getAll, getAllsort, archiveExpiredBudgets, get_all_active_users, removeActive, removeExpired, amount_aggregate,checkExist }

export default budgetDataFunctions;