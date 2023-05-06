import log_in_routes from './log_in_registration.js';
import budgetRoutes from './budget.js'
import transactionRoutes from './transactions.js';
import chartRoutes from './charts.js';
import settingRoutes from './settings.js'
import goalRoutes from './goals.js'
import plaidRoutes from './plaid.js'
import notificationRoutes from './notifications.js'
const constructorMethod = (app) => {
    app.use('/', log_in_routes);
    // app.use('/about', log_in_routes);
    // app.use('/login', log_in_routes)
    // app.use('/registration', log_in_routes)
    // app.use('/dashboard', log_in_routes)
    app.use('/transactions', transactionRoutes)

    // app.use('/forgot', log_in_routes)
    // app.use('/otp_validation', log_in_routes)

    app.use('/budget', budgetRoutes)
    app.use('/charts', chartRoutes)
    app.use('/settings', settingRoutes)
    app.use('/goals', goalRoutes)
    app.use('/api', plaidRoutes)
    app.use('/notifications', notificationRoutes)

    app.use('*', (req, res) => {
        res.redirect("/login");
    });
};

export default constructorMethod;
