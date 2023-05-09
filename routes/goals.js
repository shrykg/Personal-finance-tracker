import { Router } from "express";
import xss from "xss";
const router = Router();
import goalDataFunctions from "../data/goals.js";
import validations from "../validation.js";

router
  .route('/viewgoals')
  .get(async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    return res.render('goals')
  })

  .post(async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    let user_id = req.session.user.id;
    let goal_purpose = xss(req.body.goal_select);
    let goal_name = xss(req.body.goal_name);
    let goal_amount = xss(req.body.goal_amount);
    let target_date = xss(req.body.goal_date);

    try {
        user_id = validations.checkId(user_id);
    } catch (e) {
      return res.status(400).render('goals', { error_server: e });
    }
    try
    {
      goal_amount = Number(goal_amount);
      validations.checkGoals(goal_purpose,goal_name,goal_amount,target_date)
    }
    catch(e)
    {
      return res.status(400).render('goals', { error_server: e });
    }
    try {
        const newGoal = await goalDataFunctions.create(user_id, goal_name, goal_amount, target_date, goal_purpose);
        if(newGoal.inserted===true)
        {
          return res.status(500).render('goals', {success:" Goal successfully added!"});
        }
    } catch (e) {
      return res.status(500).render('goals', { error_server: e });
    }
});

router.get('/viewall', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  let user_id = req.session.user.id;
  try 
  {
    const data = await goalDataFunctions.getAll(user_id);
    return res.render("allgoals", { data: data });
  } catch (e) {
    return res.status(500).render('allgoals', { error: e });
  }
});

router.get('/new', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  let user_id = req.session.user.id;
  try {
    const data = await goalDataFunctions.getAll(user_id);
    return res.render("goal_savings", { data: data });
  } catch (e) {
    return res.status(500).render('goal_savings', { error: e });
  }
})
  .post('/new', async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    let user_id = req.session.user.id;
    let goal_name = xss(req.body.goal_select);
    let savings = xss(req.body.amount);
    try {
      user_id = validations.checkId(user_id);
  }
  catch(e)
  {
    return res.status(400).render('goal_savings', { error_server: e });
  }
  try{
    savings=Number(savings)
    validations.checkSavings(goal_name,savings);
  }
  catch(e)
  {
    return res.status(400).render('goal_savings', { error_server: e });

  }
    try
    {
      const updated_data = await goalDataFunctions.update_savings(user_id, goal_name, savings);
      if(updated_data.updated===true){
        return res.status(200).render('goal_savings', {success:"Savings added successfully!"});
      }
    } catch (e) {
      return res.status(500).render('goal_savings', { error_server: e });
    }
  })

router.get('/remove/:goalId', async (req, res) => {
  // console.log('test delete goal');
  if (!req.session.user) {
    return res.redirect('/login');
  }

  let user_id = req.session.user.id;
  let goalId = xss(req.params.goalId);

  try {
    validations.checkId(goalId, 'Goal ID');

    let rslt = await goalDataFunctions.remove(goalId);
    return res.status(200).json(rslt);
     } catch (e) {
      console.log(e)
      let status = e[0];
      let message = e[1];
      return res.status(status).json({ error: message });
    }
  });


export default router;

