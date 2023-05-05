import { Router } from "express";
const router = Router();
import goalDataFunctions from "../data/goals.js"

router
    .route('/view')
    .get(async (req, res) => {
        res.render('notifications')
    })

    .post(async (req, res) => {
        let user_id = req.session.user.id;
        let goal_purpose = req.body.goal_select;
        let goal_name = req.body.goal_name;
        let goal_amount = parseFloat(req.body.goal_amount);
        let target_date = req.body.goal_date;

        try {
            const newGoal = await goalDataFunctions.create(user_id, goal_name, goal_amount, target_date, goal_purpose);
            //res.status(200).json(newGoal);
            res.redirect('/goals/viewall')
        } catch (e) {
            //console.log(e);
            res.status(500).render('goals', { error: e });
        }
    });

export default router; 