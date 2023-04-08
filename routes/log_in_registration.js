import { Router } from "express";
const router = Router();
import path from 'path';
import { dbConnection, closeConnection }
    from "../config/mongoConnection.js";

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

        const data = {
            "firstname": firstname,
            "lastname": lastname,
            "dob": dob,
            "email": email,
            "password": password,
            "created_at": new Date()
        }
        try {
            await db.collection('users').insertOne(data)
        }
        catch (e) {
            res.status(400).json({ error: e })
        }

        res.render('login');


    })



router.route('/').get(async (req, res) => {
    try {
        //console.log(__dirname);
        res.render('login');
    }
    catch (e) {
        res.status(400).json({ error: e })
    }
})

router.
    route('/login')
    .post(async (req, res) => {
        //console.log(req.body);
        const username = req.body.username;
        const password = req.body.password;

        //console.log(username);

        try {
            const data = await db.collection('users').findOne({ 'email': username });
            if (!data) {
                window.alert("Invalid user ID or user does not exist !")
            }

            if (password !== data.password) {
                console.log("Wrong password , please enter the correct password and try again");
            }
            console.log(data);
            res.render('dashboard', { data: data });

        }
        catch (e) {
            res.status(400).json({ error: e });
        }




    });

export default router; 