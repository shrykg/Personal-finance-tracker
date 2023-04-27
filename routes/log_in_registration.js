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
        let password_1 = req.body.password_initial;


        //console.log(new_password);

        //checking if the user with the same email already exists
        let check = '';
        check = await login_reg_data.get_user_by_email(email);
        if (!check) {
            try {
                await login_reg_data.add_user(firstname, lastname, dob, email, password);
                res.status(200).redirect('/login');
            }
            catch (e) {
                res.status(400).render('registration', { error: 'Something went wrong , please try again !', firstname: firstname, lastname: lastname, dob: dob, email: email })
            }
        }
        else {
            res.status(400).render('registration', { error: 'User already exists', firstname: firstname, lastname: lastname, dob: dob, email: email })
        }

        //res.status(400).render('register', { error: 'Unable to register please try again !', firstname: firstname, lastname: lastname, dob: dob, email: email })
    })



router.
    route('/').get(async (req, res) => {
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
        let trans_data = '';
        let active_budget = '';
        let amount_remaining = '';
        console.log(data);
        try {
            trans_data = await transactionData.getLatestTransactions(data.id);
        }
        catch (e) {

        }
        try {
            active_budget = await budgetData.get_all_active_users(data.id);
        }
        catch (e) {

        }

        // console.log(trans_data);


        // try {
        //     let amount_remaining = await budgetData.amount_remaining(data.id);
        //     console.log(amount_remaining)
        // }

        // catch (e) {

        // }
        //console.log(active_budget);
        //needs work
        try {
            amount_remaining = await budgetData.amount_remaining(data.id);
            for (let j = 0; j < active_budget.length; j++) {
                active_budget[j].amount_remaining = active_budget[j].budget_amount
            }

            for (let i = 0; i < amount_remaining.length; i++) {
                for (let j = 0; j < active_budget.length; j++) {
                    if (amount_remaining[i].category === active_budget[j].category) {
                        active_budget[j].amount_remaining = amount_remaining[i].amount_remaining
                    }
                }
            }
        }

        catch (e) { }

        if (data) {
            try {
                res.status(200).render('dashboard', { data: data, transactions: trans_data, active_budget: active_budget });
            }

            catch (e) {
                res.status(500).json({ error: e });
            }
        }

        else {
            res.redirect('/login');
        }

    })
router
    .route('/logout').get(async (req, res) => {
        //code here for GET
        if (req.session.user) {
            req.session.destroy();
            res.redirect('/login')
        } else {
            res.status(403).render('login');
        }
    });
router.
    route('/login')
    .get(async (req, res) => {
        try {
            res.status(200).render('login');
        }
        catch (e) {
            res.status.json({ error: e })
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