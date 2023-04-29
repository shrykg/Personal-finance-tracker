import log_in_routes from './log_in_registration.js';


import budgetRoutes from './budget.js'
import transactionRoutes from './transactions.js';
import chartRoutes from './charts.js';
import path from 'path';

const constructorMethod = (app) => {
    app.use('/', log_in_routes);
    app.use('/login', log_in_routes)
    app.use('/registration', log_in_routes)
    app.use('/dashboard', log_in_routes)
    app.use('/transactions', transactionRoutes)
    app.use('/forgot', log_in_routes)
    app.use('/otp_validation', log_in_routes)
    app.use('/budget', budgetRoutes)
    app.use('/charts', chartRoutes)


    app.use('*', (req, res) => {
        res.status(404).render("error", { error_occured: "The URL Passed is invalid" });
    });
};

export default constructorMethod;
