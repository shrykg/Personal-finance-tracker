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
    let goal_amount = parseFloat(xss(req.body.goal_amount));
    let target_date = xss(req.body.goal_date);

    try {
        user_id = validations.checkId(user_id);
    } catch (e) {
      return res.status(400).render('goals', { error: e });
    }
    try {
        goal_purpose = validations.checkString(goal_purpose, 'Goal Purpose');
    } catch (e) {
      return res.status(400).render('goals', { error: e });
    }
    try {
        goal_name = validations.checkString(goal_name, 'Goal Name');
    } catch (e) {
      return res.status(400).render('goals', { error: e });
    }
    try {
        goal_amount = validations.checkNumber(goal_amount, 'Goal Amount');
    } catch (e) {
      return res.status(400).render('goals', { error: e });
    }
    try {
        target_date = validations.checkDate1(target_date, 'Target Date');
    } catch (e) {
      return res.status(400).render('goals', { error: e });
    }

    try {
        const newGoal = await goalDataFunctions.create(user_id, goal_name, goal_amount, target_date, goal_purpose);
        return res.redirect('/goals/viewall')
    } catch (e) {
      return res.status(500).render('goals', { error: e });
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

    savings = Number(savings);

    try {
      validations.checkString(goal_name, 'Goal Name');
    } catch (e) {
      return res.status(400).render('goal_savings', { error: e });
    }
    try {
      validations.checkNumber(savings, 'Savings Amount');
    } catch (e) {
      return res.status(400).render('goal_savings', { error: e });
    }
    try
    {
      const updated_data = await goalDataFunctions.update_savings(user_id, goal_name, savings);
      return res.redirect('/goals/viewall');
    } catch (e) {
      return res.status(500).render('goal_savings', { error: e });
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
    // if (rslt.deletedGoal === true) {
    //   return res.status(200).redirect('/goals/viewall');
    // }
  } catch (e) {
    // return res.status(500).render('allgoals', { error: e });
      console.log(e)
      let status = e[0];
      let message = e[1];
      return res.status(status).json({ error: message });
    }
  });

router.get('/edit/:goalId', async (req, res) => {
  // console.log('test edit/goal id route');
  if (!req.session.user) {
    return res.redirect('/login');
  }

  let user_id = req.session.user.id;
  let goalId = xss(req.params.goalId);

  try {
    validations.checkId(goalId, 'Goal ID');
  } catch (err) {
    return res.status(400).render('edit_goal', { error: err });
  }

  try {
    const goal = await goalDataFunctions.get(goalId);
    return res.render('edit_goal', { goal: goal });
  } catch (err) {
    return res.status(500).render('edit_goal', { error: err });
  }

    
  // try {
  //   const data = await goalDataFunctions.getAll(user_id);
  //   return res.status(500).render('allgoals', {data: data });
  // } catch (err) {
  //   console.log(err);
  // }
})
  .post('/edit/:goalId', async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    let user_id = req.session.user.id;
    let goalId = xss(req.params.goalId);
    let goal_name = xss(req.body.goal_name);
    let goal_amount = parseFloat(xss(req.body.goal_amount));
    let target_date = xss(req.body.goal_date);
    let goal_purpose = xss(req.body.goal_select);
    
    try {
      validations.checkId(goalId, 'Goal ID');
    } catch (err) {
      return res.status(400).render('edit_goal', { error: err });
    }
    try {
      validations.checkString(goal_name, 'Goal Name');
    } catch (err) {
      return res.status(400).render('edit_goal', { error: err });
    }
    try {
      validations.checkNumber(goal_amount, 'Goal Amount');
    } catch(err) {
      return res.status(400).render('edit_goal', { error: err });
    }
    try {
      validations.checkDate1(target_date, 'Target Date');
    } catch (err) {
      return res.status(400).render('edit_goal', { error: err });
    }
    try {
      validations.checkString(goal_purpose, 'Goal Purpose');
    } catch (err) {
      return res.status(400).render('edit_goal', { error: err });
    }


    try {
      // console.log('routes test');
      await goalDataFunctions.update(goalId, goal_name, goal_amount, target_date);
      return res.redirect('/goals/viewall');
    } catch (e) {
      // console.log(e)
      return res.status(500).render('edit_goal', { error: e, goal: { _id: goalId, goal_name, goal_amount, target_date, goal_purpose } });
    }
  });

export default router;

