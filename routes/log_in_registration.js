import { Router } from "express";
const router = Router();
import path from 'path';
import { dbConnection, closeConnection }
    from "../config/mongoConnection.js";
import bcrypt from "bcrypt"

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

        const saltRounds = 10;

        let new_password = await bcrypt.hash(password, saltRounds);
        //console.log(new_password);

        //checking if the user with the same email already exists
        const check = await db.collection('users').findOne({ 'email': email });

        if (!check || check === null) {
            const data = {
                "firstname": firstname,
                "lastname": lastname,
                "dob": dob,
                "email": email,
                "password": new_password,
                "created_at": new Date()
            }
            try {
                await db.collection('users').insertOne(data)
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
        //console.log(__dirname);
        res.render('login');
    }
    catch (e) {
        res.status(400).render('error', { error_occured: e })
    }
})

router.
    route('/login')
    .post(async (req, res) => {
        console.log(req.body);
        const username = req.body.username;
        const password = req.body.password;

        // console.log(username);
        // console.log(password);

        try {
            const data = await db.collection('users').findOne({ 'email': username });
            console.log(data)
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