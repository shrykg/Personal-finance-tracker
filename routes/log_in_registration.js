import { Router } from "express";
const router = Router();
import path from 'path';
import { dbConnection, closeConnection }
    from "../config/mongoConnection.js";
import bcrypt from "bcrypt"
import { login_reg_data } from "../data/index.js";

const db = await dbConnection();

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


        console.log(new_password);

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

router.
    route('/login')
    .post(async (req, res) => {

        const username = req.body.username.toLowerCase();

        const password = req.body.password;

        try {
            const data = await login_reg_data.get_user_by_email(username);
            if (!data) {
                res.render('error', { error_occured: "Invalid username or password, please try again" })
            }

            if (!(await bcrypt.compare(password, data.password))) {
                res.render('error', { error_occured: "Wrong username or password , please try again" });
            }
            // Only for initial testing
            global.loggedInUserId = data._id.toString()
            // Change it soon to store loggedin user information in session
            res.render('dashboard', { data: data });

        }
        catch (e) {
            res.status(400).render('error', { error_occured: e });
        }

    });

export default router; 