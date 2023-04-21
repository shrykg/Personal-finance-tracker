import log_in_routes from './log_in_registration.js';


import budgetRoutes from './budget.js'

import transactionRoutes from './transactions.js';
import chartRoutes from './charts.js';

import path from 'path';

const constructorMethod = (app) => {
    app.use('/', log_in_routes);
    app.use('/login', log_in_routes)
    app.use('/registration', log_in_routes)
    app.use('error', log_in_routes)
    app.use('/transactions', transactionRoutes)

    app.use('/budget',budgetRoutes)

    app.use('/', chartRoutes)


    app.use('*', (req, res) => {
        res.status(404).render("error", { error_occured: "The URL Passed is invalid" });
    });
};

export default constructorMethod;
