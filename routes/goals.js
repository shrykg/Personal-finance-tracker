import { Router } from "express";
const router = Router();
import goalDataFunctions from "../data/goals.js"

router
  .route('/viewgoals')
  .get(async (req, res) => {
    res.render('goals')
  })

  .post(async (req, res) => {
    let user_id = req.session.user.id;
    let goal_purpose = req.body.goal_select;
    let goal_name = req.body.goal_name;
    let goal_amount = parseFloat(req.body.goal_amount);
    let target_date = req.body.goal_date;
    let savings_monthly = parseFloat(req.body.goal_saving_monthly);

    try {
      const newGoal = await goalDataFunctions.create(user_id, goal_name, goal_amount, target_date, savings_monthly, goal_purpose);
      res.status(200).json(newGoal);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.toString() });
    }
  });

router.get('/viewall', async (req, res) => {
  // res.render('allgoals');
  let user_id = req.session.user.id;
  try {
    const data = await goalDataFunctions.getAll(user_id);
    console.log(data);
    res.render("allgoals", { data: data });
  } catch (e) {
    console.log(e);
  }

});

export default router;
