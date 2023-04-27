import { Router } from 'express';
const router = Router();
import { transactionData } from '../data/index.js';
import validation from '../validation.js';

router.route('/new').get(async (req, res) => {
  // Render add new transcation HTML form
  if (!req.session.user) {
    res.redirect('/login')
  }
  res.render('addtransaction')
})

router
  .route('/')
  .get(async (req, res) => {
    try {
      const budgetList = await transactionData.getAllTransactions(global.loggedInUserId)
      //   res.render('posts/index', {posts: postList});
      // render the html for top 10 transactions for the user
    } catch (e) {
      res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    const transactionPostData = req.body;
    transactionPostData['user_id'] = global.loggedInUserId
    transactionPostData['amount'] = Number(transactionPostData.amount)
    console.log(transactionPostData)


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
      // render error with prefilled data
      //console.log('errorssss')
      //console.log(errors)
      return;
    }

    try {
      //console.log('inside bitch')
      const { user_id, paymentType, amount, description, category, transaction_date } = transactionPostData;

      const newTransaction = await transactionData.addTransaction(user_id, paymentType, amount, description, category, transaction_date)
      
      const latestTransactions = await transactionData.getLatestTransactions(global.loggedInUserId)
      //console.log('_____________')

      console.log(latestTransactions)

      res.redirect('/dashboard')
    } catch (e) {
      res.status(500).json({ error: e });
    }
  })
//   .put(async (req, res) => {
//     res.send('ROUTED TO PUT ROUTE');
//   }); 

// route for indivisual transactions to view, edit, delete

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const post = await transactionData.getTransaction(req.params.id)
      //   res.render('posts/single', {post: post});
      //   render indivisual transaction
    } catch (e) {
      res.status(404).json({ error: e });
    }
  })
  .put(async (req, res) => {
    const updatedData = req.body;
    try {

      req.params.id = validation.checkId(req.params.id, 'ID url param');
      updatedData.description = validation.checkString(updatedData.description, 'Description');
      updatedData.category = validation.checkString(updatedData.category, 'category');
      updatedData.amount = validation.checkNumber(updatedData.amount, 'Amount')
      // change this to validate date
      updatedData.transaction_date = validation.checkString(updatedData.transaction_date, 'Transaction Date')
      updatedData.paymentType = validation.checkString(updatedData.paymentType, 'Payment Type')
      updatedData.user_id = validation.checkId(
        updatedData.user_id,
        'User ID'
      );

    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const updatedTransaction = await transactionData.updateTransaction(
        req.params.id,
        updatedData
      );
      res.json(updatedTransaction);
    } catch (e) {
      let status = e[0];
      let message = e[1];
      res.status(status).json({ error: message });
    }
  })
  //   .patch(async (req, res) => {
  //     const requestBody = req.body;
  //     try {
  //       req.params.id = validation.checkId(req.params.id, 'Post ID');
  //       if (requestBody.title)
  //         requestBody.title = validation.checkString(requestBody.title, 'Title');
  //       if (requestBody.body)
  //         requestBody.body = validation.checkString(requestBody.body, 'Body');
  //       if (requestBody.posterId)
  //         requestBody.posterId = validation.checkId(
  //           requestBody.posterId,
  //           'Poster ID'
  //         );
  //       if (requestBody.tags)
  //         requestBody.tags = validation.checkStringArray(
  //           requestBody.tags,
  //           'Tags'
  //         );
  //     } catch (e) {
  //       return res.status(400).json({error: e});
  //     }

  //     try {
  //       const updatedPost = await postData.updatePostPatch(
  //         req.params.id,
  //         requestBody
  //       );
  //       res.json(updatedPost);
  //     } catch (e) {
  //       let status = e[0];
  //       let message = e[1];
  //       res.status(status).json({error: message});
  //     }
  //   })
  .delete(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      let deletedTransaction = await transactionData.removeTransaction(req.params.id)
      res.status(200).json(deletedTransaction);
    } catch (e) {
      let status = e[0];
      let message = e[1];
      res.status(status).json({ error: message });
    }
  });

export default router