import { goals } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import validation from '../validation.js';

const create = async (user_id, goal_name, goal_amount, target_date, goal_purpose) => {
  //   validation.checkGoal(goal_name, goal_amount, target_date);
  let today = new Date();
  let numberOfMonths = Math.ceil((new Date(target_date) - today) / (1000 * 60 * 60 * 24 * 30));
  //console.log
  let monthlySavings = Math.ceil(goal_amount / numberOfMonths);
  let newGoal = {
    user_id: user_id.trim(),
    created_date: today.toISOString(today),
    goal_purpose: goal_purpose,
    goal_name: goal_name.trim(),
    goal_amount: goal_amount,
    target_date: target_date,
    monthlySavings: monthlySavings,
    savings: 0
  };
  console.log(goal_purpose)
  const getGoals = await goals();
  const found = await getGoals.findOne({ user_id: user_id, goal_purpose, goal_name: goal_name });
  console.log(found)
  if (found) { throw "Goal with this name already exists , please change the category or use another name" }

  const insertedGoal = await getGoals.insertOne(newGoal);
  if (!insertedGoal.acknowledged || !insertedGoal.insertedId) { throw "Could not add goal" }
  return { inserted: true }
};

const getAll = async (user_id) => {
  const getGoals = await goals();
  let allGoals = await getGoals.find({ user_id: user_id.trim() }).toArray();
  allGoals = allGoals.map((goal) => {
    goal.user_id = goal.user_id.toString();
    return goal;
  });
  return allGoals;
};

const get = async (goal_id) => {
  goal_id = goal_id.trim();
  const getGoals = await goals();
  let found = await getGoals.findOne({ _id: new ObjectId(goal_id.trim()) });
  if (found === null) { throw "This id is not present in the database" }
  found._id = found._id.toString();
  return found;
};

const remove = async (goal_id) => {
  goal_id = goal_id.trim();
  const getGoals = await goals();
  let deletedGoal = await getGoals.findOneAndDelete({ _id: new ObjectId(goal_id.trim()) });
  if (deletedGoal.lastErrorObject.n === 0) {
    throw `No data with id: ${goal_id}`;
  }
  return { deletedGoal: true }
};

const update = async (goal_id, goal_name, goal_amount, target_date) => {
  goal_id = goal_id.trim();
  goal_name = goal_name.trim();
  goal_amount = goal_amount.trim();
  target_date = target_date.trim();

  const getGoals = await goals();
  const getGoal = await get(goal_id);
  let updatedGoal = {
    goal_name: goal_name,
    goal_amount: goal_amount,
    target_date: target_date,
  };

  const updatedGoalData = await getGoals.findOneAndUpdate({ _id: new ObjectId(goal_id) }, { $set: updatedGoal }, { returnDocument: 'after' });
  if (updatedGoalData.lastErrorObject.n === 0) {
    throw 'Could not update data';
  }
  updatedGoalData.value._id = updatedGoalData.value._id.toString();
  return updatedGoalData.value;
};
// const update_savings = async (user_id, goal_name, savings) => {
//   user_id = user_id.trim();
//   goal_name = goal_name.trim();

//   const getGoals = await goals();
//   //const getGoal = await get(user_id);

//   const updatedGoalData = await getGoals.findOneAndUpdate({ user_id: user_id }, { goal_name: goal_name }, { $set: { savings: savings } }, { returnDocument: 'after' });
//   if (updatedGoalData.lastErrorObject.n === 0) {
//     throw 'Could not update data';
//   }
//   updatedGoalData.value._id = updatedGoalData.value._id.toString();
//   return updatedGoalData.value;
// };

const update_savings = async (user_id, goal_name, savings) => {
  user_id = user_id.trim();
  goal_name = goal_name.trim();
  savings = parseInt(savings);
  try {
    const getGoals = await goals();
    const updatedGoalData = await getGoals.findOneAndUpdate(
      { user_id: user_id, goal_name: goal_name },
      { $inc: { savings: savings } },
      { returnOriginal: false }
    );

    console.log(updatedGoalData);
    if (!updatedGoalData) {
      throw new Error('Could not update data');
    }

    // updatedGoalData._id = updatedGoalData._id.toString();
    // return updatedGoalData;
    console.log('Added !')
  } catch (error) {
    console.error(error);
    throw new Error('Could not update data');
  }
};

const goalDataFunctions = { create, getAll, get, remove, update, update_savings };
export default goalDataFunctions;
