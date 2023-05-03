import { Router } from 'express';
const router = Router();
import xss from "xss"
import budgetDataFunctions from '../data/budget.js';
import validation from '../validation.js';


router.route('/new').get(async (req, res) => {
  // Render add new transcation HTML form
  if (!req.session.user) {
    res.redirect('/login');
  }
  res.render('addbudget')
})
  .post(async (req, res) => { // adding new budget 
    const budget = req.body;
    if (!budget || Object.keys(budget).length === 0) {
      return res
        .status(400).render('error',{error_occured:"No data in body part"})
    }

    let category=xss(req.body.category).trim()
    let amount=xss(req.body.amount).trim();
    let start_Date=xss(req.body.start_Date).trim()
    let end_Date=xss(req.body.end_Date).trim()

    try
    {
        amount= Number(amount);
        validation.checkBudget(category,amount,start_Date,end_Date);
    }
    catch(e){res.render('error',{error_occured:e})}
    try {
      await budgetDataFunctions.create(global.loggedInUserId,category, amount, start_Date, end_Date)
      res.redirect('/dashboard')
    }
    catch (e) {
      res.render('error',{error_occured:e})
    }
  })


router.get('/seeAllBudgets/active', async (req, res) => { // to see all active budgets 
  try {
    const active_budgets = await budgetDataFunctions.get_all_active_users(global.loggedInUserId);
    res.render('seeActiveBudgets', { active_budgets:active_budgets });
  } catch (e) {
    res.render('error', { error_occured: e });
  }
});
router.delete('/ActiveRemove/:id', async (req, res) => { // to delete active budget
  let budget_id=req.params.id.trim()
    const remove=await budgetDataFunctions.removeActive(budget_id);
    res.redirect('/budget/seeAllBudgets/active');
 
});
router.route('/expiredBudgets').get(async (req, res) => { // to see expired budget
  const result = await budgetDataFunctions.getAll(global.loggedInUserId)
  res.render('expiredBudgets', { budget: result })

})
router.route('/expiredBudgets/sort').get(async (req, res) => { //to see expired budget, sort by start_date
  const result = await budgetDataFunctions.getAllsort(global.loggedInUserId)
  res.render('expiredBudgets', { budget: result })

})

router.delete('/remove/:id', async (req, res) => { // to remove expired budget 
  let budget_id=req.params.id.trim()
    const remove1=await budgetDataFunctions.removeExpired(budget_id);
    res.redirect('/budget/expiredBudgets');
 
});


export default router