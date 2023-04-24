import { Router } from "express";
const router = Router();

import bcrypt from "bcrypt"
import { login_reg_data, transactionData, budgetData } from "../data/index.js";


router
    .route('/registration')
    .get(async (req, res) => {
        try {
            res.render('registration');
        }

        catch (e) {
            res.status(500).json({ error: e });
        }
    })

    .post(async (req, res) => {
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let dob = req.body.dob;
        let email = req.body.email;
        let password = req.body.password_confirm;


        //console.log(new_password);

        //checking if the user with the same email already exists
        const check = await login_reg_data.get_user_by_email(email);

        if (!check || check === null) {

            try {

                await login_reg_data.add_user(firstname, lastname, dob, email, password);
            }
            catch (e) {
                res.status(400).render('error', { error_occured: e })
            }

            res.render('login');
        }

        else {
            res.status(500).render('error', { error_occured: "User already exists" })
        }

    })



router.route('/').get(async (req, res) => {
    try {
        res.render('login');
    }
    catch (e) {
        res.status(400).render('error', { error_occured: e })
    }
})

router
    .route('/dashboard')
    .get(async (req, res) => {
        let data = req.session.user;
        const trans_data = await transactionData.getAllTransactions(data.id);
        const active_budget = await budgetData.get_all_active_users(data.id);
        try {
            res.status(200).render('dashboard', { data: data, transactions: trans_data, active_budget: active_budget });
        }

        catch (e) {
            res.status(500).json({ error: e });
        }
    })
router
    .route('/logout').get(async (req, res) => {
        //code here for GET
        if (req.session.user) {
            req.session.destroy();
            res.redirect('/login')
        } else {
            res.status(403).render('logout');
        }
    });

router.
    route('/login')
    .post(async (req, res) => {

        const username = req.body.username.toLowerCase();

        const password = req.body.password;
        let data = ''
        try {
            data = await login_reg_data.checkUser(username, password);
        }
        catch (e) {
            res.status(400).render('error', { error_occured: e });
        }
        //storing user session data
        if (!data) {
            res.status(400).render('login', { error: "Invalid credentials used to log in" })
        }
        else {
            global.loggedInUserId = data._id.toString()
            req.session.user = { id: data._id.toString(), firstname: data.firstname, lastname: data.lastname, email: data.email }
            if (req.session.user) {
                res.redirect('/dashboard');
            }
            else {
                res.status(400).render('login', { error: "Invalid credentials used to log in" })
            }
        }
    });

export default router; 