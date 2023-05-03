import { Router } from 'express';
const router = Router();
import { transactionData } from '../data/index.js';

router.route('/getCharts').get(async (req, res) => {
    let session_data = req.session.user;
    let symbol = session_data.symbol;
    console.log(symbol);
    const userId = req.session.user.id;
    const startDate = req.query.startDate || '1970-01-01';
    const endDate = req.query.endDate || new Date().toISOString().split('T')[0];

    if (!userId) {
      throw 'You must provide a User ID route parameter';
    }
  
    console.log("Pre transaction");
    try 
    {
    const transactions1 = await transactionData.getTransactionsByDateRange(userId, startDate, endDate, symbol);
    // console.log(transactions1);
    res.render('charts', { transactions1, startDate, endDate });
    } catch (e)
    {
      res.status(400).render('error', { error_occured: e });
    }
});

export default router;