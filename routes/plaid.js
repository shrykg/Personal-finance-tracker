import dotenv from "dotenv";
import { PlaidApi, Configuration, PlaidEnvironments } from "plaid";
import moment from 'moment'
import {plaidData} from '../data/index.js'

dotenv.config();
import { Router } from "express";
const router = Router();

const config = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(config);

router.route("/create_link_token")
  .get(async (req, res, next) => {
    const tokenResponse = await client.linkTokenCreate({
      user: { client_user_id: req.session.user.id },
      client_name: "Money Minder",
      language: "en",
      products: ["auth","transactions"],
      country_codes: ["US"],
      redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI
    });
    res.json(tokenResponse.data);
  });

router.route("/exchange_public_token")
  .post(async (req, res, next) => {
    const exchangeResponse = await client.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });

    
    // Store access_token in DB
    const accessToken = exchangeResponse.data.access_token;
    const itemID = exchangeResponse.data.item_id;
    const userId = req.session.user.id
    try {
      let storedData = await plaidData.storePlaidCredentials(accessToken,itemID,userId)
      console.log(storedData)
      res.json(true);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error in storing plaid credentials');
    }
    // req.session.access_token = exchangeResponse.data.access_token;
    // res.json(true);
  });

router.route("/data")
  .get(async (req, res, next) => {
    try {
    let plaidCredentials = await plaidData.getPlaidCredentials(req.session.user.id)
    const access_token = plaidCredentials.accessToken;
    const balanceResponse = await client.accountsBalanceGet({ access_token });
    return res.json({
      Balance: balanceResponse.data,
    });
    } catch (error) {
    console.error(error);
    return res.status(500).send('Error fetching plaid credentials');
    }
    
  });

router.route("/is_account_connected")
  .get(async (req, res, next) => {
    try {
      let plaidCredentials = await plaidData.getPlaidCredentials(req.session.user.id)
      const access_token = plaidCredentials.accessToken;
      return (access_token ? res.json({ status: true }) : res.json({ status: false }));
    } catch (e) {
      return res.json({ status: false })
    }
    
  });

// Fetches transaction data using the Node client library for Plaid
router.route("/transactions")
  .get(async (req, res, next) => {
  let access_token 
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  try{
    let plaidCredentials = await plaidData.getPlaidCredentials(req.session.user.id)
    access_token = plaidCredentials.accessToken;
  } catch (e) {
    return res.status(500).send('Error fetching bank credentials');
  }
  const request = {
    access_token,
    start_date: moment().subtract(1, "year").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
  };
  try {
    const response = await client.transactionsGet(request);
    let transactions = response.data.transactions;
    const total_transactions = response.data.total_transactions;
    // Manipulate the offset parameter to paginate
    // transactions and retrieve all available data
    while (transactions.length < total_transactions) {
      const paginatedRequest = {
        access_token,
        start_date: moment().subtract(1, "year").format("YYYY-MM-DD"),
        end_date: moment().format("YYYY-MM-DD"),
        options: {
          offset: transactions.length,
        },
      };
      const paginatedResponse = await client.transactionsGet(paginatedRequest);
      transactions = transactions.concat(
        paginatedResponse.data.transactions,
      );
    }
    // console.log(transactions)
    console.log('will render bank transactions')
    res.render('bankTransactions', { transactions: transactions });
    // res.json({transactions})
    
  } catch (err) {
    // handle error
    console.error(err);
    res.status(500).send('Error fetching transactions');
  }
});

router
  .route('/investments')
  .get(async (req,res) => {
    // Pull Holdings for an Item
  let access_token
  try {
    let plaidCredentials = await plaidData.getPlaidCredentials(req.session.user.id)
    access_token = plaidCredentials.accessToken;
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error getting bank account');
  }  
  const request = {
  access_token: access_token,
};
try {
  const response = await plaidClient.investmentsHoldingsGet(request);
  const holdings = response.data.holdings;
  const securities = response.data.securities;
  res.json
} catch (error) {
  // handle error
  return res.status(500).send('Error getting Investments');
}
  })

router.
  route('/removeBankAccount')
  .get( async (req, res, next) => {

  })
  .delete( async (req, res, next) => {
  let access_token  
  try {
    let plaidCredentials = await plaidData.getPlaidCredentials(req.session.user.id)
    access_token = plaidCredentials.accessToken;
  } catch (error) {
    return res.status(500).send('Error getting bank credentials');
  }
    const request = {
      access_token: access_token,
    };
    try {
      const response = await client.itemRemove(request);
      // The Item was removed, access_token is now invalid
      const removed = plaidData.removePlaidCredentials(req.session.user.id)
      res.json(removed)
    } catch (error) {
      // handle error
    console.error(error);
    res.status(500).send('Error removing bank account');
    }
  })


export default router