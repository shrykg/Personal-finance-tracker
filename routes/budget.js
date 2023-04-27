import { Router } from 'express';
const router = Router();
import budgetDataFunctions from '../data/budget.js';
import { transactionData } from '../data/index.js';
router.route('/new').get(async (req, res) => {
  // Render add new transcation HTML form
  if (!req.session.user) {
    res.redirect('/login');
  }
  res.render('addbudget')
})
  .post(async (req, res) => {
    const budget = req.body;
    //console.log(budget);
    budget['amount'] = Number(budget.amount)
    let errors = [];
    try {
      await budgetDataFunctions.create(global.loggedInUserId, budget.category, budget.amount, budget.start_Date, budget.end_Date)
      //let active_users = budgetDataFunctions.get_all_active_users(global.loggedInUserId);
      res.redirect('/dashboard')
      //console.log(result);
    }
    catch (e) {
      res.render('error',{error_occured:e})
    }

    // try {
    //   const active_budget = await budgetDataFunctions.get_all_active_users(global.loggedInUserId);
    //   //const data = await transactionData.getAllTransactions(global.loggedInUserId);
    //   const amount_aggregate = await budgetDataFunctions.amount_aggregate(global.loggedInUserId)
    //   console.log(amount_aggregate);
    //   //console.log(data)
    //   res.render('dashboard', { active_budget: active_budget })
    // }

    // catch (e) {
    //   res.status(500).json({ error: e });
    // }
  })
router.route('/seeAllBudgets').get(async (req, res) => {
  const result = await budgetDataFunctions.getAll(global.loggedInUserId)
  //console.log(result);
  res.render('seeAllBudget', { budget: result })

})
router.route('/seeAllBudgets').get(async (req, res) => {
  const result = await budgetDataFunctions.getAll(global.loggedInUserId)
  //console.log(result);
  res.render('seeAllBudget', { budget: result })

})

router.route('/remove/:id').post(async(req,res)=>{
let budget_id=req.params.id.trim()
const remove=await budgetDataFunctions.remove(budget_id);
console.log(remove);
res.redirect('/budget/seeAllBudgets'); 
}) 

export default router