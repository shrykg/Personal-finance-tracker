import { Router } from "express";
const router = Router();
import path from 'path';
import { dbConnection, closeConnection } from "../config/mongoConnection.js";



const data = [12, 19, 3, 5, 2, 3];
const labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

router.route('/charts').get(async (req, res) => {
    try{
    res.render('charts', {
        description: 'Monthly expenses chart',
        data: data,
        labels: labels
    });
    } catch (e) {
    res.status(400).render('error', { error_occured: e })
    };
}
);

export default router;