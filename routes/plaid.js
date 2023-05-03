import dotenv from "dotenv";
import { PlaidApi, Configuration, PlaidEnvironments } from "plaid";
import moment from 'moment'

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
      user: { client_user_id: req.sessionID },
      client_name: "Plaid's Tiny Quickstart",
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

    // FOR DEMO PURPOSES ONLY
    // Store access_token in DB instead of session storage
    req.session.access_token = exchangeResponse.data.access_token;
    res.json(true);
  });

router.route("/data")
  .get(async (req, res, next) => {
    const access_token = req.session.access_token;
    const balanceResponse = await client.accountsBalanceGet({ access_token });
    res.json({
      Balance: balanceResponse.data,
    });
  });

router.route("/is_account_connected")
  .get(async (req, res, next) => {
    return (req.session.access_token ? res.json({ status: true }) : res.json({ status: false }));
  });

// Fetches transaction data using the Node client library for Plaid
router.route("/transactions")
  .get(async (req, res, next) => {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1); 
  const access_token = req.session.access_token;
  const request = {
    access_token,
    start_date: moment().subtract(1, "year").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
  };
  try {
    const response = await client.transactionsGet(request);
    let transactions = response.data.transactions;
    console.log(transactions)
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
    console.log(transactions)
    console.log('will render bank transactions')
    res.render('bankTransactions', { transactions: transactions });
    // res.json({transactions})
    
  } catch (err) {
    // handle error
    console.error(err);
    res.status(500).send('Error fetching transactions');
  }
});


  export default router