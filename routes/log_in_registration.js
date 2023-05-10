import { Router } from "express";
const router = Router();
import xss from "xss"
import { login_reg_data, transactionData, budgetData } from "../data/index.js";
import budgetDataFunctions from "../data/budget.js";
import validation from '../validation.js'


router.
    route('/').get(async (req, res) => {
        try {
            return res.redirect('/login')
        }
        catch (e) {
            return res.status(500).render('error', { error_occured: e })
        }
    })

router
    .route('/about')
    .get(async (req, res) => {
        try {
            return res.render('about');
        }

        catch (e) {
            return res.status(500).render('error', { error_occured: e });
        }
    })

router
    .route('/registration')
    .get(async (req, res) => {
        try {
            return res.render('registration');
        }

        catch (e) {
            return res.status(500).render('error', { error_occured: e });
        }
    })
    .post(async (req, res) => {
        //console.log(req.body);
        let firstname = xss(req.body.firstname);
        let lastname = xss(req.body.lastname);
        let dob = xss(req.body.dob);
        let email = xss(req.body.email);
        let password = xss(req.body.password_confirm);
        let password_1 = xss(req.body.password_initial);
        let region = xss(req.body.region)
        // if (!firstname || !lastname || !dob || !email || !password || !password_1 || !region) {
        //     return res.status(400).render('registration', { error: 'All fields are required' })
        // }
        if (validation.validateDOB(dob) < 13) {
            return res.status(400).render('registration', { error: 'You must be 13 years or older to register !', firstname: firstname, lastname: lastname, dob: dob, email: email, region: region })
        }
        if (password !== password_1) {
            return res.status(400).render('registration', { error: 'Passwords do not match ! Please try again', firstname: firstname, lastname: lastname, dob: dob, email: email, region: region })
        }
        try {
            validation.validateEmail(email);
        }
        catch (e) {
            return res.status(400).render('registration', { error: e })
        }
        //checking if the user with the same email already exists
        let check = '';
        try {
            check = await login_reg_data.get_user_by_email(email);
        }
        catch (e) {
            return res.status(400).json({ error: e });
        }
        if (!check) {
            try {
                await login_reg_data.add_user(firstname, lastname, dob, email, password, region);
                return res.status(200).redirect('/login');
            }
            catch (e) {
                return res.status(400).render('registration', { error: 'Something went wrong , please try again !', firstname: firstname, lastname: lastname, dob: dob, email: email, region: region })
            }
        }
        else {
            return res.status(400).render('registration', { error: 'User already exists', firstname: firstname, lastname: lastname, dob: dob, email: email, region: region })
        }

    })


router
    .route('/dashboard')
    .get(async (req, res) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        let data = req.session.user;
        let trans_data = '';
        let active_budget = '';
        let amount_remaining = '';
        let notifications = '';
        let is_notification = false;
        //console.log(data);
        try {
            trans_data = await transactionData.getLatestTransactions(data.id);
        }
        catch (e) {
            console.log(e)
        }
        try {
            let check_budget = await budgetData.archiveExpiredBudgets() // checking for budget expiration and adding it into new collection
        }
        catch (e) {

        }
        try {
            active_budget = await budgetData.get_all_active_users(data.id);
        }
        catch (e) {

        }

        try {
            for (let i = 0; i < active_budget.length; i++) {
                await budgetDataFunctions.amount_remaining(data.id, active_budget[i].category);
            }

        }
        catch (e) {
            console.log(e);
        }

        try {
            notifications = await budgetDataFunctions.checkBudgetNotifications(data.id);
            if (notifications.length > 0) {
                is_notification = true;
            }
        }

        catch (e) {
            console.log(e);
        }

        if (data) {
            try {
                return res.status(200).render('dashboard', { data: data, transactions: trans_data, active_budget: active_budget, notification: is_notification });
            }

            catch (e) {
                return res.status(400).render('error', { error_occured: e });
            }
        }

        else {
            return res.redirect('/login');
        }

    })



router
    .route('/logout')
    .get(async (req, res) => {

        //code here for GET
        if (req.session.user) {
            req.session.destroy();
            res.clearCookie()
            return res.status(200).render('logout');
        } else {
            return res.status(403).redirect('/login')
        }
    });

router.
    route('/login')
    .get(async (req, res) => {
        try {
            return res.status(200).render('login');
        }
        catch (e) {
            return res.status(400).render('error', { error_occured: e });
        }
    })
    .post(async (req, res) => {

        let username = xss(req.body.username);
        username = username.toLowerCase()
        username = username.trim();
        const password = xss(req.body.password);
        let data = ''
        try {
            data = await login_reg_data.checkUser(username, password);
        }
        catch (e) {
            return res.status(400).render('error', { error_occured: e });
        }
        //storing user session data
        if (!data) {
            return res.status(400).render('login', { error: "Invalid credentials used to log in" })
        }
        else {


            let symbol = login_reg_data.check_currency_symbol(data.region)
            req.session.user = { id: data._id.toString(), firstname: data.firstname, lastname: data.lastname, email: data.email, dob: data.dob, created_at: new Date(data.created_at).toISOString().slice(0, 10), symbol: symbol }
            if (req.session.user) {
                return res.redirect('/dashboard');
            }
            else {
                return res.status(400).render('login', { error: "Invalid credentials used to log in" })
            }
        }
    });



export default router; 