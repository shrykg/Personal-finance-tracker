import { Router } from 'express';
const router = Router();
import xss from "xss"
import budgetDataFunctions from '../data/budget.js';
import validation from '../validation.js';


router.route('/new').get(async (req, res) => {
  // Render add new transcation HTML form

  if (!req.session.user) {
    return res.redirect('/login');
  }
 return res.render('addbudget')
})
  .post(async (req, res) => { // adding new budget 
    if (!req.session.user) {
      return res.redirect('/login');
    }
    let session_data = req.session.user;
    //(session_data)
    const budget = req.body;
    if (!budget || Object.keys(budget).length === 0) {
      return res
        .status(400).render('error', { error_occured: "No data in body part" })
    }
    let user_id = req.session.user.id.trim();
    let category = xss(req.body.category).trim()
    let amount = xss(req.body.amount).trim();
    // (amount)
    let start_Date = xss(req.body.start_Date).trim()
    let end_Date = xss(req.body.end_Date).trim()
    let symbol = session_data.symbol
    // (symbol)
    // amount = symbol + amount;
    try {
      amount = Number(amount);
      validation.checkBudget(category, amount, start_Date, end_Date);
    }
    catch (e) { return res.render('error', { error_occured: e }) }
    try{let result=await budgetDataFunctions.checkExist(user_id,category,start_Date,amount)}
    catch(e){ return res.render('error', { error_occured: e }) }
    try {
      amount = symbol + amount;
      await budgetDataFunctions.create(user_id, category, amount, start_Date, end_Date)
      return res.redirect('/dashboard')
    }
    catch (e) {
      return res.render('error', { error_occured: e })
    }
  })


router.get('/seeAllBudgets/active', async (req, res) => { // to see all active budgets 
  if (!req.session.user) {
    return res.redirect('/login');
  }
  try {
    let user_id = req.session.user.id.trim();
    const active_budgets = await budgetDataFunctions.get_all_active_users(user_id);
    return res.render('seeActiveBudgets', { active_budgets: active_budgets });
  } catch (e) {
    return res.render('error', { error_occured: e });
  }
});
router.delete('/ActiveRemove/:id', async (req, res) => { // to delete active budget
  if (!req.session.user) {
    return res.redirect('/login');
  }
  let budget_id = req.params.id.trim()
  const remove = await budgetDataFunctions.removeActive(budget_id);
  return res.redirect('/budget/seeAllBudgets/active');

});
router.route('/expiredBudgets').get(async (req, res) => { // to see expired budget
  if (!req.session.user) {
    return res.redirect('/login');
  }
  try{
  let user_id = req.session.user.id.trim();
  const result = await budgetDataFunctions.getAll(user_id)
  return res.render('expiredBudgets', { budget: result })
  }catch(e){ return res.render('error', { error_occured: e });}
})
router.route('/expiredBudgets/sort').get(async (req, res) => { //to see expired budget, sort by start_date
  if (!req.session.user) {
    return res.redirect('/login');
  }try{
  let user_id = req.session.user.id.trim();
  const result = await budgetDataFunctions.getAllsort(user_id)
  return res.render('expiredBudgets', { budget: result })}
  catch(e){return res.render('error', { error_occured: e });}
})

router.delete('/remove/:id', async (req, res) => { // to remove expired budget 
  if (!req.session.user) {
    return res.redirect('/login');
  }
  try{
  let budget_id = req.params.id.trim()
  const remove1 = await budgetDataFunctions.removeExpired(budget_id);
  return res.redirect('/budget/expiredBudgets');}
  catch(e) {return res.render('error', { error_occured: e });}
});


export default router