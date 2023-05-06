import { Router } from 'express';
import { ObjectId } from 'mongodb';
const router = Router();
import { transactionData } from '../data/index.js';
import validation from '../validation.js';

import moment from 'moment';

import { exportToExcel } from '../data/excel.js';


router.route('/new').get(async (req, res) => {
  // Render add new transcation HTML form
  if (!req.session.user) {
    return res.redirect('/login')
  }
  res.render('addtransaction')
})
  .post(async (req, res) => {

    if (!req.session.user) {
      return res.redirect('/login')
    }

    let session_data = req.session.user;
    const transactionPostData = req.body;
    if (!transactionData || Object.keys(transactionPostData).length === 0) {
      return res
        .status(400).render('error', { error_occured: "No data in body part" })
    }
    transactionPostData['user_id'] = session_data.id
    transactionPostData['amount'] = Number(transactionPostData.amount)
    


    let errors = [];

    // To do: validate for date
    try {
      transactionPostData.transaction_date = validation.checkDate(transactionPostData.transaction_date, 'Transaction Date')
    } catch (e) {
      errors.push(e)
    }

    try {
      transactionPostData.paymentType = validation.checkString(transactionPostData.paymentType, 'Payment Type');
    } catch (e) {
      errors.push(e);
    }

    try {
      transactionPostData.description = validation.checkString(transactionPostData.description, 'Description');
    } catch (e) {
      errors.push(e);
    }

    try {
      transactionPostData.amount = validation.checkNumber(transactionPostData.amount, 'Amount');
    } catch (e) {
      errors.push(e);
    }

    try {
      transactionPostData.category = validation.checkString(transactionPostData.category, 'Category');
    } catch (e) {
      errors.push(e);
    }

    try {
      transactionPostData.user_id = validation.checkId(transactionPostData.user_id, 'User ID');
    } catch (e) {
      errors.push(e);
    }


    if (errors.length > 0) {
      //   const users = await userData.getAllUsers();
      //   res.render('posts/new', {
      //     errors: errors,
      //     hasErrors: true,
      //     post: blogPostData,
      //     users: users
      //   });
      res.render('addtransaction', { transaction, errors })
      return;
    }

    try {
      

      const { user_id, paymentType, amount, description, category, transaction_date } = transactionPostData;

      const newTransaction = await transactionData.addTransaction(user_id, paymentType, amount, description, category, transaction_date)

      const latestTransactions = await transactionData.getLatestTransactions(session_data.id)
      
      res.redirect('/dashboard')
    } catch (e) {
      res.status(500).json({ error: e });
    }
  })


// route for indivisual transactions to view, edit, delete

router
  .route('/seeAllTransaction')
  .get(async (req, res) => {

    if (!req.session.user) {
      return res.redirect('/login')
    }
    let userId = req.session.user.id
    try {
      let result = await transactionData.getAllTransactions(userId)
      return res.render('seeAllTransaction', {
        transactions: result.reverse()
      })
    } catch (e) {
      res.status(404).json({ error: e });
    }
  })

router
  .route('/seeAllTransaction/filters')
  .get(async (req, res) => {

    if (!req.session.user) {
      return res.redirect('/login')
    }

    let errors = []
    try {

      let { start_date, end_date, category } = req.query;
      let userId = req.session.user.id

      if (!start_date) {
        start_date = moment('2021-01-01', 'YYYY-MM-DD').format('YYYY-MM-DD');
      }
      if (!end_date) {
        end_date = moment().format('YYYY-MM-DD')
      }


      // validate start and end dates
      
        let start = new Date(start_date);
        let end = new Date(end_date);
        if (start > end) {
          throw 'Start date must be before end date';
        }
      
    } catch (error) {
      errors.push(error)
    }

    try {
      if (errors.length > 0) {
        //   const users = await userData.getAllUsers();
        //   res.render('posts/new', {
        //     errors: errors,
        //     hasErrors: true,
        //     post: blogPostData,
        //     users: users
        //   });
        const transactions = await transactionData.getTransactionsByDateRangeAndCategoryWithoutDateFormat(userId, start_date, end_date, category)
        res.render('seeAllTransaction', { transactions, start: start_date, end: end_date, cat: category,errors })
        return;
      }
    }catch(e) {
      res.status(400).json({ error: e });
    }
    try {
      
      // get transactions with given category and date range
      const transactions = await transactionData.getTransactionsByDateRangeAndCategoryWithoutDateFormat(userId, start_date, end_date, category)

      res.render('seeAllTransaction', { transactions, start: start_date, end: end_date, cat: category });
    } catch (e) {
      res.status(400).json({ error: e });
    }
  })




router
  .route('/:id')
  .get(async (req, res) => {

    if (!req.session.user) {
      return res.redirect('/login')
    }

    //console.log('goingggg in getttttt')
    try {
      req.params.id = validation.checkId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      let transaction = await transactionData.getTransaction(req.params.id)
      transaction.transaction_date = new Date(transaction.transaction_date)
      res.render('updatetransaction', { transaction })
    } catch (e) {
      res.status(404).json({ error: e });
    }
  })
  .put(async (req, res) => {
   
    if (!req.session.user) {
      return res.redirect('/login')
    }

    const updatedData = req.body;

    updatedData['user_id'] = req.session.user.id
    updatedData['amount'] = Number(updatedData.amount)

    let errors = []
   try {
    req.params.id = validation.checkId(req.params.id, 'ID url param');
   } catch (error) {
    errors.push(error)
   }

   try {
    updatedData.description = validation.checkString(updatedData.description, 'Description');
   } catch (error) {
    errors.push(error)
   }

   try {
    updatedData.category = validation.checkString(updatedData.category, 'category');
   } catch (error) {
    errors.push(error)
   }

   try {
    updatedData.amount = validation.checkNumber(updatedData.amount, 'Amount')
   } catch (error) {
    errors.push(error)
   }

   try {
    updatedData.transaction_date = validation.checkDate(updatedData.transaction_date, 'Transaction Date')
   } catch (error) {
    errors.push(error)
   }

   try {
    updatedData.paymentType = validation.checkString(updatedData.paymentType, 'Payment Type')
   } catch (error) {
    errors.push(error)
   }

   try {
    updatedData.user_id = validation.checkId(
      updatedData.user_id,
      'User ID'
    );
   } catch (error) {
    errors.push(error)
   }
    
   try {
    if (errors.length > 0) {
      const transaction = await transactionData.updateTransaction(
        req.params.id,
        updatedData
      );
      res.render(res.render('updatetransaction', { transaction,errors }))
   }
   } catch (error) {
    return res.status(400).json({ error: error });
   }
   


    try {
      // console.log('now update')
      const updatedTransaction = await transactionData.updateTransaction(
        req.params.id,
        updatedData
      );


      return res.json({ "update": true })

    } catch (e) {
      console.log('eroorjknjknjkn')
      console.log(e)
      let status = e[0];
      let message = e[1];
      return res.status(status).json({ error: message });
    }
  })
  .delete(async (req, res) => {
    // console.log(req.params.id)

    if (!req.session.user) {
      return res.redirect('/login')
    }

    try {
      req.params.id = validation.checkId(req.params.id, 'Id URL Param');
    } catch (e) {
      // console.log(e)
      return res.status(400).json({ error: e });
    }
    try {
      let deletedTransaction = await transactionData.removeTransaction(req.params.id)
      // console.log(deletedTransaction)
      return res.status(200).json(deletedTransaction);
    } catch (e) {
      console.log(e)
      let status = e[0];
      let message = e[1];
      return res.status(status).json({ error: message });
    }
  });

router.route('/seeAllTransaction/export').get(async (req, res) => {


  //Render add new transcation HTML form
  if (!req.session.user) {
    return res.redirect('/login')
  }
  let session = req.session.user;
  //console.log()
  let user_id = session.id
  console.log(user_id);
  let result = '';
  try {
    result = exportToExcel(user_id)
    res.render('seeAllTransaction', { success: result });
  }
  catch (e) {
    console.log(e);
  }


})

export default router