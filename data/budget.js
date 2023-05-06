// This data file should export all functions using the ES6 standard as shown in the lecture code
import { budget, expired } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb';
import { transactionData } from '../data/index.js';
import { transactions } from '../config/mongoCollections.js';
import validation from '../validation.js';
import moment from 'moment';

const checkExist = async (user_id, category, start, value) => {
  /* checking that user already have done transaction on that perticular category
   and if yes then it will compare total of that amount with budget amount and allow only if amount<budget */
  const get_data = await transactions();
  let today = moment().format("YYYY-MM-DD");
  if (today.trim() === start.trim()) {
    const result = await get_data.find({
      user_id: new ObjectId(user_id),
      transaction_date: { $eq: today }, category: category
    }).toArray();
    let total = 0;

    for (let i = 0; i < result.length; i++) {
      total += result[i].amount;
    }

    if (total >= value) {
      throw "You have already spent more amount than budget in this category today, start budget from next day please";
    }
  }
}
//  creating new budget
const create = async (user_id, category, amount, start, end) => {
  validation.checkBudget(category, amount, start, end);
  let newdata =
  {
    user_id: user_id.trim(),
    category: category.trim(),
    budget_amount: amount,
    start_date: start.trim(),
    end_date: end.trim(),
    amount_remaining: amount,
    notifications: ''
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



async function amount_remaining(user_id, category) {
  // Find the budget for the given category
  const transactions_data = await transactions();
  const budget_data = await budget();
  const budget_req = await budget_data.findOne({ user_id, category });
  // console.log(budget_req)
  // If the budget does not exist, return early
  if (!budget_req) {
    throw ('Some problem occured')
  }


  // Find all transactions that match the user ID, category, and fall between the budget dates
  const transactions_req = await transactions_data.find({
    user_id: new ObjectId(user_id),
    category: category,
    transaction_date: { $gte: budget_req.start_date, $lte: budget_req.end_date }
  }).toArray();

  console.log(transactions_req);
  // Calculate the total amount spent
  const totalSpent = transactions_req.reduce((acc, curr) => acc + curr.amount, 0);
  // console.log(totalSpent);
  // Update the budget with the amount spent
  await budget_data.updateOne(
    { _id: new ObjectId(budget_req._id) },
    { $set: { amount_remaining: budget_req.budget_amount - totalSpent } }
  );
}

async function checkBudgetNotifications(user_id) {
  // Get all budgets for the user
  const budget_data = await budget();
  const budgets = await budget_data.find({ user_id }).toArray();
  console.log(budgets);
  let notifications = [];
  for (let i = 0; i < budgets.length; i++) {
    if (budgets[i].amount_remaining < 0.1 * budgets[i].budget_amount || budgets[i].amount_remaining < 0) {
      const notification = `Your budget remaining for ${budgets[i].category} is depleting, you have only ${budgets[i].amount_remaining}, please plan accordingly`;
      notifications.push(notification);
    }
  }

  return notifications;
}
// Iterate over all the budgets
// for (const budget of budgets) {
//   // Get the start and end dates of the budget

//   // If the remaining budget is less than 10% of the total budget, push a notification
//   if (budget.amount_remaining < 0.1 * budget.budget_amount || budget.amount_remaining < 0) {
//     const notification = `Your budget remaining for ${budget.category} is depleting, you have only ${budget.amount_remaining}, please plan accordingly`;

//     // Add the notification to the budget object and update the database

//     notifications = budget.notifications || [];
//     notifications.push(notification);

//     // Keep only the last 10 notifications
//     if (notifications.length > 10) {
//       notifications.shift();
//     }

//     await budget_data.updateOne(
//       { _id: budget._id },
//       { $set: { notifications: notifications } }
//     );
//   }

// }




const budgetDataFunctions = { create, getAll, getAllsort, archiveExpiredBudgets, get_all_active_users, removeActive, removeExpired, checkExist, amount_remaining, checkBudgetNotifications }

export default budgetDataFunctions;