import {Router} from 'express';
const router = Router();
import budgetDataFunctions from '../data/budget.js';
router.route('/new').get(async (req, res) => {
    // Render add new transcation HTML form
    res.render('addbudget')
  })
.post(async (req,res)=>{
  const budget= req.body;
  console.log(budget);
  budget['amount'] = Number(budget.amount)
  let errors = [];
  try
  {
  const result=await budgetDataFunctions.create(global.loggedInUserId,budget.category,budget.amount,budget.start_Date,budget.end_Date)
  console.log(result);
  }
  catch(e)
  {
    res.status(500).json({error: e});

  }
})
router.route('/seeAllBudgets').get(async (req,res)=>{
const result = await budgetDataFunctions.getAll(global.loggedInUserId)
console.log(result);
res.render('seeAllBudget',{budget:result})

})

export default router