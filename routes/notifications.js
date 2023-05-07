import { Router } from "express";
const router = Router();
import { login_reg_data, transactionData, budgetData } from "../data/index.js";
router
    .route('/view')
    .get(async (req, res) => {

        if (!req.session.user) {
            return res.redirect('/login');
          }

        let session = req.session.user;
        let user_id = session.id;
        let notification_data = '';
        try {
            notification_data = await budgetData.checkBudgetNotifications(user_id);
        }
        catch (e) {
            return res.status(400).render('notifications', { notifications:e })
        }
        //console.log(notification_data);
        return res.render('notifications', { notifications: notification_data })
    })

export default router; 