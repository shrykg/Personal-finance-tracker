import { goals } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import moment from 'moment';
import validation from '../validation.js';

const create = async (user_id, goal_name, goal_amount, target_date, goal_purpose) => {
  
  user_id= validation.checkId(user_id)
  validation.checkGoals(goal_purpose,goal_name,goal_amount,target_date)
  let today = moment().startOf('day');
  let targetDate = moment(target_date, 'YYYY-MM-DD');

    goal_name=goal_name.toLowerCase()
    const getGoals = await goals();
    const foundGoal = await getGoals.findOne({ user_id: user_id.trim(), goal_name: goal_name.trim(), goal_purpose: goal_purpose.trim() ,target_date: { $gt: today.format('YYYY-MM-DD')}});
    if (foundGoal) 
    {
      throw 'A goal with this name already exists for this user with a target date in the future.';
    }
    const numberOfMonths = Math.ceil(targetDate.diff(today, 'months', true));
    const monthlySavings = Math.ceil(goal_amount / numberOfMonths);

    const newGoal = {
      user_id: user_id.trim(),
      goal_purpose: goal_purpose.trim(),
      goal_name: goal_name.trim(),
      goal_amount: goal_amount,
      target_date: target_date.trim(),
      monthlySavings: monthlySavings,
      savings: 0
    };

    const insertedGoal = await getGoals.insertOne(newGoal);
    if (!insertedGoal.acknowledged || !insertedGoal.insertedId) throw 'Could not add goal.';

    return { inserted: true };
};

const getAll = async (user_id) => {
  try {
    user_id = validation.checkId(user_id, 'User ID');
    const getGoals = await goals();
    if (!getGoals) throw 'Failed to retrieve goals from database.';
    let allGoals = await getGoals.find({ user_id: user_id.trim() }).toArray();
    if (!allGoals || allGoals.length === 0) throw 'No goals found for this user ID.';
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
    if (!getGoals) throw 'Failed to retrieve goals from database.';
    const found = await getGoals.findOne({ _id: new ObjectId(goal_id.trim()) });
    if (!found) throw 'Goal with this ID not found in the database.';
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
    if (!getGoals) throw 'Failed to retrieve goals from database.';
    const deletedGoal = await getGoals.findOneAndDelete({ _id: new ObjectId(goal_id.trim()) });
    if (!deletedGoal || !deletedGoal.value) throw `Goal with this ID not found in the database.`;
    return { deletedGoal: true };
  } catch (err) {
    throw err;
  }
};

const update_savings = async (user_id, goal_name, savings) => {
    user_id=user_id.trim();
    user_id= validation.checkId(user_id)
    goal_name=goal_name.trim().toLowerCase();
    let getGoals = await goals();
    let temp=getGoals.findOne({user_id:user_id.trim(),goal_name:goal_name.trim()})
    if(!temp)
    {
      throw "This goal is not exist"
    }
    user_id = user_id.trim();
    goal_name = goal_name.trim();
    savings = Number(savings);

    let updatedGoalData = await getGoals.findOneAndUpdate(
      { user_id: user_id, goal_name: goal_name },
      { $inc: { savings: savings } },
      { returnOriginal: false }
    );
    if(updatedGoalData.lastErrorObject.n===0) {
      throw 'could not update data';
    }
  return{updated:true}
};

const goalDataFunctions = { create, getAll, get, remove,update_savings };
export default goalDataFunctions;
