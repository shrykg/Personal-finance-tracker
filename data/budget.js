// This data file should export all functions using the ES6 standard as shown in the lecture code
import {budget} from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb';
const create = async (user_id,category,budget_amount,start,end) => {
let newdata=
{
  user_id:user_id,
  category:category,
  budget_amount:budget_amount,
  start_date:start,
  end_date:end
}
const getbudget=await budget();
const found=await getbudget.findOne({user_id: user_id,category:category});
if(found){throw "Already Exist category"}
const Info= await getbudget.insertOne(newdata);
if(!Info.acknowledged || !Info.insertedId){throw "Could not add info"}
return "Data added!!"
};

const getAll = async (user_id) => {
  const getbudget=await budget();
  let alldata=await getbudget.find({user_id:user_id}).toArray();
   alldata=alldata.map((ele) => {
    ele.user_id = ele.user_id.toString();
    return ele;
  });
  return alldata;
};

const get = async (user_id) => {
    user_id=user_id.trim();
  const getbudget=await budget();
  let found=await getbudget.findOne({user_id: new ObjectId(user_id)});
  if(found===null){throw "This id is not present in database"}
  found.user_id=found.user_id.toString();
  return found
};

const remove = async (user_id) => {
  user_id=user_id.trim();
  const getbudget=await budget();
  let deldata=await getbudget.findOneAndDelete({ user_id: new ObjectId(user_id) });
  if(deldata.lastErrorObject.n===0) 
  {
    throw `"No data with id : ${user_id}"`;
  }
  return {"user_Id": deldata.value.user_id.toString(),"deleted": true}
};

const update = async (user_id,category,budget_amount,start,end) => {
  user_id=user_id.trim();
  category=category.trim()
  budget_amount=budget_amount.trim()
  start=start.trim()
  end=end.trim()
  const getbudget=await budget();
  const getdata = await get(user_id);
  let upd={
    
        user_id:user_id,
        category:category,
        budget_amount:budget_amount,
        start_date:start,
        end_date:end
      
    };
    const updatedata = await getbudget.findOneAndUpdate({user_id: new ObjectId(user_id)},{$set: upd},{returnDocument: 'after'});
    if(updatedata.lastErrorObject.n===0) {
      throw 'could not update data';
    }
    updatedata.value.user_id = updatedata.value.user_id.toString();
    return updatedata.value;
};
const budgetDataFunctions={create,getAll,get,remove,update}
export default budgetDataFunctions;