import { Router } from "express";
const router = Router();
import xss from "xss"
import { login_reg_data, transactionData, budgetData } from "../data/index.js";
import budgetDataFunctions from "../data/budget.js";
import validation from '../validation.js'

router
    .route('/about')
    .get(async (req, res) => {
        try {
            res.render('about');
        }

        catch (e) {
            res.status(500).json({ error: e });
        }
    })

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
        //console.log(req.body);
        let firstname = xss(req.body.firstname);
        let lastname = xss(req.body.lastname);
        let dob = xss(req.body.dob);
        let email = xss(req.body.email);
        let password = xss(req.body.password_confirm);
        let password_1 = xss(req.body.password_initial);
        let region = xss(req.body.region)
        if (!firstname || !lastname || !dob || !email || !password || !password_1 || !region) {
            res.status(400).render('registration', { error: 'All fields are required' })
        }
        if (validation.validateDOB(dob) < 13) {
            res.status(400).render('registration', { error: 'You must be 13 years or older to register !', firstname: firstname, lastname: lastname, dob: dob, email: email, region: region })
        }
        if (password !== password_1) {
            res.status(400).render('registration', { error: 'Passwords do not match ! Please try again', firstname: firstname, lastname: lastname, dob: dob, email: email, region: region })
        }
        try {
            validation.validateEmail(email);
        }
        catch (e) {
            res.status(400).render('registration', { error: e })
        }
        //checking if the user with the same email already exists
        let check = '';
        try {
            check = await login_reg_data.get_user_by_email(email);
        }
        catch (e) {
            res.status(400).json({ error: e });
        }
        if (!check) {
            try {
                await login_reg_data.add_user(firstname, lastname, dob, email, password, region);
                res.status(200).redirect('/login');
            }
            catch (e) {
                res.status(400).render('registration', { error: 'Something went wrong , please try again !', firstname: firstname, lastname: lastname, dob: dob, email: email, region: region })
            }
        }
        else {
            res.status(400).render('registration', { error: 'User already exists', firstname: firstname, lastname: lastname, dob: dob, email: email, region: region })
        }

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
router.route('/logout').get(async (req, res) => {
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

        let username = xss(req.body.username);
        username = username.toLowerCase()
        username = username.trim();
        const password = xss(req.body.password);
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
            let symbol = login_reg_data.check_currency_symbol(data.region)
            req.session.user = { id: data._id.toString(), firstname: data.firstname, lastname: data.lastname, email: data.email, dob: data.dob, created_at: new Date(data.created_at).toISOString().slice(0, 10), symbol: symbol }
            if (req.session.user) {
                res.redirect('/dashboard');
            }
            else {
                res.status(400).render('login', { error: "Invalid credentials used to log in" })
            }
        }
    });


export default router; 