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
  .post(async (req, res) => {
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

router.route('/seeAllBudgets').get(async (req, res) => {
  const result = await budgetDataFunctions.getAll(global.loggedInUserId)
  res.render('seeAllBudget', { budget: result })

})

// router.route('/remove/:id').post(async(req,res)=>{
// let budget_id=req.params.id.trim()
// const remove=await budgetDataFunctions.remove(budget_id);
// console.log(remove);
// res.redirect('/budget/seeAllBudgets'); 
// }) 
router.delete('/remove/:id', async (req, res) => {
  let budget_id=req.params.id.trim()
 
    const remove=await budgetDataFunctions.remove(budget_id);
    // if (!remove) {
    //   return res.status(404).send(`Budget with id ${budget_id} not found.`);
    // }
    res.redirect('/budget/seeAllBudgets');
 
});

export default router