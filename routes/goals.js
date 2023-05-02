import { Router } from "express";
const router = Router();
import goalDataFunctions from "../data/goals.js"

router.
    route('/viewgoals')
    .get(async (req, res) => {
        res.render('goals')
    })

    .post(async (req, res) => 
    {
        let user_id = req.session.user.id ; 
        let goal_purpose = req.body.goal_select ; 
        let goal_name = req.body.goal_name ;
        let goal_amount = req.body.goal_amount ;  
        let target_date = req.body.goal_date ;
        let savings_monthly = req.body.goal_saving_monthly ; 

        try{
            await goalDataFunctions.create(user_id,goal_purpose, goal_name, goal_amount,target_date,savings_monthly) ; 
        }
        catch(e){
            console.log(e) ; 
        }
    });

export default router; 