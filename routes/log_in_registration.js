import { Router } from "express";
const router = Router();
import xss from "xss"
import bcrypt from "bcrypt"
import { login_reg_data, transactionData, budgetData } from "../data/index.js";
import { sendOTP, generateOTP } from "../data/forgot_password.js";
import nodemailer from 'nodemailer'
import budgetDataFunctions from "../data/budget.js";

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

        //console.log(new_password);

        //checking if the user with the same email already exists
        let check = '';
        check = await login_reg_data.get_user_by_email(email);
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
        console.log(active_budget);
        let x = ''
        try {
            //x = await budgetDataFunctions.getCategorySums(data.id, active_budget[0].category, active_budget[0].start_date, active_budget[0].end_date);
            x = await budgetDataFunctions.amount_aggregate(data.id, '2023-05-01', '2023-05-30', active_budget[0].category)
        }
        catch (e) {
            console.log(e)
        }
        console.log(x);
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

        let username = xss(req.body.username);
        username = username.toLowerCase()

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
            global.loggedInUserId = data._id.toString()
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

router
    .route('/forgot')
    .get(async (req, res) => {
        try {
            res.render('forgotpassword');
        }

        catch (e) {
            res.status(500).json({ error: e });
        }
    });
router
    .route('/forgot')
    .post(async (req, res) => {
        //let testAccount = await nodemailer.createTestAccount();
        let otp = generateOTP();
        console.log(otp);

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'moneyminder.yasd@gmail.com', // generated ethereal user
                pass: 'mwwcnbpjgmrfoczo' // generated ethereal password
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'moneyminder.yasd@gmail.com', // sender address
            to: req.body.email, // list of receivers
            subject: "OTP for forgot password", // Subject line
            text: "Hello ! Your OTP to restore your password is:" + " " + otp, // plain text body
        });

        console.log("Message sent: %s", info.messageId);
        // create reusable transporter object using the default SMTP transport
        res.render('enter_otp', otp);
    });

router
    .route('/otp_validation')
    .get(async (req, res) => {
        try {
            res.render('enter_otp');
        }

        catch (e) {
            res.status(500).json({ error: e });
        }
    });
router
    .route('/otp_validation')
    .post(async (req, res) => {
        if (req.body.otp === otp) {
            res.redirect('/set_password');
        }
        else {
            console.log('incorrect password entered');
        }
    });
export default router; 