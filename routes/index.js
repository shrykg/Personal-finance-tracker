import log_in_routes from './log_in_registration.js';
<<<<<<< HEAD
import chart_routes from './charts.js';
=======
import transactionRoutes from './transactions.js'
>>>>>>> d3a708567c5fb844b21e1d775ee7e87bda074d28
import path from 'path';

const constructorMethod = (app) => {
    app.use('/', log_in_routes);
    app.use('/login', log_in_routes)
    app.use('/registration', log_in_routes)
    app.use('error', log_in_routes)
<<<<<<< HEAD
    app.use('/',chart_routes)
=======
    app.use('/transactions', transactionRoutes)
>>>>>>> d3a708567c5fb844b21e1d775ee7e87bda074d28

    app.use('*', (req, res) => {
        res.status(404).render("error", { error_occured: "The URL Passed is invalid" });
    });
};

export default constructorMethod;