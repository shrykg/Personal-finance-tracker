import { goals } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import moment from 'moment';
import validation from '../validation.js';

const create = async (user_id, goal_name, goal_amount, target_date, goal_purpose) => {
  try {
    user_id = validation.checkId(user_id, 'User ID');
    goal_name = validation.checkString(goal_name, 'Goal Name').toLowerCase();
    goal_amount = validation.checkNumber(goal_amount, 'Goal Amount');
    target_date = validation.checkDate1(target_date, 'Target Date');
    goal_purpose = validation.checkString(goal_purpose, 'Goal Purpose').toLowerCase();
    

    // console.log(target_date);

    const today = moment().startOf('day');
    const targetDate = moment(target_date, 'YYYY-MM-DD');
    if (targetDate.isBefore(today)) throw 'Error: Target date must be in the future.';

    // console.log(target_date);

    const getGoals = await goals();
    if (!getGoals) throw 'Error: Failed to retrieve goals from database.';

    // console.log(user_id.trim(), goal_name.trim(), today.toDate());

    const foundGoal = await getGoals.findOne({ user_id: user_id.trim(), goal_name: goal_name.trim(), goal_purpose: goal_purpose.trim() ,target_date: { $gt: today.format('YYYY-MM-DD')}});

    // console.log(foundGoal);

    if (foundGoal) {
      throw 'Error: A goal with this name already exists for this user with a target date in the future.';
    }

    const numberOfMonths = Math.ceil(targetDate.diff(today, 'months', true));
    const monthlySavings = Math.ceil(goal_amount / numberOfMonths);

    const today2 = moment().format('YYYY-MM-DD');

    // console.log('CUrrent date : ',today2);


    const newGoal = {
      user_id: user_id.trim(),
      created_date: today2,
      goal_purpose: goal_purpose,
      goal_name: goal_name.trim(),
      goal_amount: goal_amount,
      target_date: target_date,
      monthlySavings: monthlySavings,
      savings: 0
    };

    const insertedGoal = await getGoals.insertOne(newGoal);
    if (!insertedGoal.acknowledged || !insertedGoal.insertedId) throw 'Error: Could not add goal.';

    return { inserted: true };
  } catch (err) {
    throw err;
  }
};



// const getAll = async (user_id) => {
//   user_id = validation.checkId(user_id, 'User ID');
//   const getGoals = await goals();
//   let allGoals = await getGoals.find({ user_id: user_id.trim() }).toArray();
//   allGoals = allGoals.map((goal) => {
//     goal.user_id = goal.user_id.toString();
//     return goal;
//   });
//   return allGoals;
// };

const getAll = async (user_id) => {
  try {
    user_id = validation.checkId(user_id, 'User ID');
    const getGoals = await goals();
    if (!getGoals) throw 'Error: Failed to retrieve goals from database.';
    let allGoals = await getGoals.find({ user_id: user_id.trim() }).toArray();
    if (!allGoals || allGoals.length === 0) throw 'Error: No goals found for this user ID.';
    allGoals = allGoals.map((goal) => {
      goal.user_id = goal.user_id.toString();
      return goal;
    });
    return allGoals;
  } catch (err) {
    throw err;
  }
};


const get = async (goal_id) => {
  try {
    goal_id = validation.checkId(goal_id, 'Goal ID');
    goal_id = goal_id.trim();
    const getGoals = await goals();
    if (!getGoals) throw 'Error: Failed to retrieve goals from database.';
    const found = await getGoals.findOne({ _id: new ObjectId(goal_id.trim()) });
    if (!found) throw 'Error: Goal with this ID not found in the database.';
    found._id = found._id.toString();
    return found;
  } catch (err) {
    throw err;
  }
};

const remove = async (goal_id) => {
  try {
    goal_id = validation.checkId(goal_id, 'Goal ID');
    goal_id = goal_id.trim();
    const getGoals = await goals();
    if (!getGoals) throw 'Error: Failed to retrieve goals from database.';
    const deletedGoal = await getGoals.findOneAndDelete({ _id: new ObjectId(goal_id.trim()) });
    if (!deletedGoal || !deletedGoal.value) throw `Error: Goal with this ID not found in the database.`;
    return { deletedGoal: true };
  } catch (err) {
    throw err;
  }
};


// const update = async (goal_id, goal_name, goal_amount, created_date, target_date) => {
//   goal_id = validation.checkId(goal_id, 'Goal ID');
//   goal_name = validation.checkString(goal_name, 'Goal Name');
//   goal_amount = validation.checkNumber(goal_amount, 'Goal Amount');
  

//   goal_id = goal_id.trim();
//   goal_name = goal_name.trim();
//   goal_amount = goal_amount.trim();
//   target_date = target_date.trim();

//   const getGoals = await goals();
//   const getGoal = await get(goal_id);
//   let updatedGoal = {
//     goal_name: goal_name,
//     goal_amount: goal_amount,
//     target_date: target_date,
//   };

//   const updatedGoalData = await getGoals.findOneAndUpdate({ _id: new ObjectId(goal_id) }, { $set: updatedGoal }, { returnDocument: 'after' });
//   if (updatedGoalData.lastErrorObject.n === 0) {
//     throw 'Could not update data';
//   }
//   updatedGoalData.value._id = updatedGoalData.value._id.toString();
//   return updatedGoalData.value;
// };

const update = async (goal_id, goal_name, goal_amount, target_date) => {
  try {
    // console.log('test update data');
    goal_id = validation.checkId(goal_id, 'Goal ID');
    goal_name = validation.checkString(goal_name, 'Goal Name');
    goal_amount = validation.checkNumber(goal_amount, 'Goal Amount');

    const getGoals = await goals();
    if (!getGoals) throw 'Error: Failed to retrieve goals from database.';

    const goal1 = await get(goal_id);
    let created_at = goal1.created_date;

    created_at = validation.checkDateCreatedAtGoals(created_at, 'Created Date');
    const createdAt = moment(created_at, 'YYYY-MM-DD');
    target_date = validation.checkTargetDateAfterCreatedDate(target_date, created_at, 'Target Date', 1);

    const today = moment().startOf('day');
    const targetDate = moment(target_date, 'YYYY-MM-DD');
    if (targetDate.isBefore(today)) throw 'Error: Target date must be in the future.';

    const goalToUpdate = await getGoals.findOne({ _id: new ObjectId(goal_id) });
    if (!goalToUpdate) throw 'Error: Goal not found.';

    goal_name = goal_name.trim();

    const foundGoal = await getGoals.findOne({
      _id: new ObjectId(goal_id) ,
      user_id: goalToUpdate.user_id,
      goal_name: goal_name,
      target_date: { $gt: today.toDate() }
    });

    if (foundGoal) {
      throw 'Error: A goal with this name already exists for this user with a target date in the future.';
    }

    const numberOfMonths = Math.ceil(targetDate.diff(createdAt, 'months', true));
    const monthlySavings = Math.ceil(goal_amount / numberOfMonths);

    goal_name = goal_name.trim();

    const updatedGoal = {
      goal_name: goal_name,
      goal_amount: goal_amount,
      target_date: target_date,
      monthlySavings: monthlySavings,
    };

    const updatedGoalData = await getGoals.findOneAndUpdate(
      { _id: new ObjectId(goal_id) },
      { $set: updatedGoal },
      { returnDocument: 'after' }
    );

    if (updatedGoalData.lastErrorObject.n === 0) {
      throw 'Error: Could not update data.';
    }

    updatedGoalData.value._id = updatedGoalData.value._id.toString();
    return updatedGoalData.value;
  } catch (err) {
    throw err;
  }
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
  try {
    user_id = validation.checkId(user_id, 'User ID');
    goal_name = validation.checkString(goal_name, 'Goal Name');
    savings = validation.checkNumber(savings, 'Savings');

    const getGoals = await goals();
    if (!getGoals) throw 'Error: Failed to retrieve goals from database.';

    user_id = user_id.trim();
    goal_name = goal_name.trim();
    savings = parseInt(savings);

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
