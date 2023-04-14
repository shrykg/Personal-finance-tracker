import {Router} from 'express';
const router = Router();
import { transactionData } from '../data/index.js';
import validation from '../validation.js';

router.route('/new').get(async (req, res) => {
    // Render add new transcation HTML form
  });

  router
  .route('/')
  .get(async (req, res) => {
    try {
      const transactionList = await transactionData.getAllTransactions(global.loggedInUserId)
    //   res.render('posts/index', {posts: postList});
    // render the html for top 10 transactions for the user
    } catch (e) {
      res.status(500).json({error: e});
    }
  })
  .post(async (req, res) => {
    const transactionPostData = req.body;
    
    
    let errors = [];

   // To do: validate for date
   try {
      transactionPostData.transaction_date = validation.checkString(transactionPostData.transaction_date, 'Transaction Date')
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
        transactionPostData.user_id = validation.checkId(
            transactionPostData.user_id,
        'User ID'
      );
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
    // render error with prefilled data
      return;
    }

    try {
      const {user_id, paymentType, amount, description, category} = transactionPostData;
      
      const newTransaction = await transactionData.addTransaction(user_id,paymentType,amount,description,category)
    //   const newPost = await postData.addPost(title, body, posterId, tags);
    //   res.redirect(`/posts/${newPost._id}`);
    // redirect to home with lastest transactions
    } catch (e) {
      res.status(500).json({error: e});
    }
  })
  .put(async (req, res) => {
    res.send('ROUTED TO PUT ROUTE');
  }); 