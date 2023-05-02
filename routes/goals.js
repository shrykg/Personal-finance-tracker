import { Router } from "express";
const router = Router();

router.
    route('/viewgoals')
    .get(async (req, res) => {
        res.render('goals')
    })

export default router; 