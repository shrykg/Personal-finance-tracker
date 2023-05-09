import dotenv from "dotenv";
import { PlaidApi, Configuration, PlaidEnvironments } from "plaid";
import moment from 'moment'
import {plaidData} from '../data/index.js'

dotenv.config();
import { Router } from "express";
const router = Router();

const config = new Configuration({
  basePath: PlaidEnvironments.development,
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
    // return res.json({
    //   Balance: balanceResponse.data,
    // });
    return res.render('viewBalance', {accounts: balanceResponse.data.accounts})
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

  router.
    route('/investments')
    .get(async (req,res) => {
      // Pull Holdings for an Item
    console.log('inside investments get')
  let access_token  
  try {
    console.log(req.session.user.id)
    let plaidCredentials = await plaidData.getPlaidCredentials(req.session.user.id)
    console.log(plaidCredentials)
    access_token = plaidCredentials.accessToken;
  } catch (error) {
    console.log(error)
    return res.status(500).send('Error getting investments');
  }
  const request = {
    access_token: access_token,
  };
  try {
    // const response = await client.investmentsHoldingsGet(request);
    const response = {
      "accounts": [
        {
          "account_id": "5Bvpj4QknlhVWk7GygpwfVKdd133GoCxB814g",
          "balances": {
            "available": 43200,
            "current": 43200,
            "iso_currency_code": "USD",
            "limit": null,
            "unofficial_currency_code": null
          },
          "mask": "4444",
          "name": "Plaid Money Market",
          "official_name": "Plaid Platinum Standard 1.85% Interest Money Market",
          "subtype": "money market",
          "type": "depository"
        },
        {
          "account_id": "JqMLm4rJwpF6gMPJwBqdh9ZjjPvvpDcb7kDK1",
          "balances": {
            "available": null,
            "current": 320.76,
            "iso_currency_code": "USD",
            "limit": null,
            "unofficial_currency_code": null
          },
          "mask": "5555",
          "name": "Plaid IRA",
          "official_name": null,
          "subtype": "ira",
          "type": "investment"
        },
        {
          "account_id": "k67E4xKvMlhmleEa4pg9hlwGGNnnEeixPolGm",
          "balances": {
            "available": null,
            "current": 23631.9805,
            "iso_currency_code": "USD",
            "limit": null,
            "unofficial_currency_code": null
          },
          "mask": "6666",
          "name": "Plaid 401k",
          "official_name": null,
          "subtype": "401k",
          "type": "investment"
        },
        {
          "account_id": "ax0xgOBYRAIqOOjeLZr0iZBb8r6K88HZXpvmq",
          "balances": {
            "available": 48200.03,
            "current": 48200.03,
            "iso_currency_code": "USD",
            "limit": null,
            "unofficial_currency_code": null
          },
          "mask": "4092",
          "name": "Plaid Crypto Exchange Account",
          "official_name": null,
          "subtype": "crypto exchange",
          "type": "investment"
        }
      ],
      "holdings": [
        {
          "account_id": "JqMLm4rJwpF6gMPJwBqdh9ZjjPvvpDcb7kDK1",
          "cost_basis": 1,
          "institution_price": 1,
          "institution_price_as_of": "2021-04-13",
          "institution_price_datetime": null,
          "institution_value": 0.01,
          "iso_currency_code": "USD",
          "quantity": 0.01,
          "security_id": "d6ePmbPxgWCWmMVv66q9iPV94n91vMtov5Are",
          "unofficial_currency_code": null
        },
        {
          "account_id": "k67E4xKvMlhmleEa4pg9hlwGGNnnEeixPolGm",
          "cost_basis": 1.5,
          "institution_price": 2.11,
          "institution_price_as_of": "2021-04-13",
          "institution_price_datetime": null,
          "institution_value": 2.11,
          "iso_currency_code": "USD",
          "quantity": 1,
          "security_id": "KDwjlXj1Rqt58dVvmzRguxJybmyQL8FgeWWAy",
          "unofficial_currency_code": null
        },
        {
          "account_id": "k67E4xKvMlhmleEa4pg9hlwGGNnnEeixPolGm",
          "cost_basis": 10,
          "institution_price": 10.42,
          "institution_price_as_of": "2021-04-13",
          "institution_price_datetime": null,
          "institution_value": 20.84,
          "iso_currency_code": "USD",
          "quantity": 2,
          "security_id": "NDVQrXQoqzt5v3bAe8qRt4A7mK7wvZCLEBBJk",
          "unofficial_currency_code": null
        },
        {
          "account_id": "JqMLm4rJwpF6gMPJwBqdh9ZjjPvvpDcb7kDK1",
          "cost_basis": 0.01,
          "institution_price": 0.011,
          "institution_price_as_of": "2021-04-13",
          "institution_price_datetime": null,
          "institution_value": 110,
          "iso_currency_code": "USD",
          "quantity": 10000,
          "security_id": "8E4L9XLl6MudjEpwPAAgivmdZRdBPJuvMPlPb",
          "unofficial_currency_code": null
        },
        {
          "account_id": "k67E4xKvMlhmleEa4pg9hlwGGNnnEeixPolGm",
          "cost_basis": 23,
          "institution_price": 27,
          "institution_price_as_of": "2021-04-13",
          "institution_price_datetime": null,
          "institution_value": 636.309,
          "iso_currency_code": "USD",
          "quantity": 23.567,
          "security_id": "JDdP7XPMklt5vwPmDN45t3KAoWAPmjtpaW7DP",
          "unofficial_currency_code": null
        },
        {
          "account_id": "k67E4xKvMlhmleEa4pg9hlwGGNnnEeixPolGm",
          "cost_basis": 15,
          "institution_price": 13.73,
          "institution_price_as_of": "2021-04-13",
          "institution_price_datetime": null,
          "institution_value": 1373.6865,
          "iso_currency_code": "USD",
          "quantity": 100.05,
          "security_id": "nnmo8doZ4lfKNEDe3mPJipLGkaGw3jfPrpxoN",
          "unofficial_currency_code": null
        },
        {
          "account_id": "k67E4xKvMlhmleEa4pg9hlwGGNnnEeixPolGm",
          "cost_basis": 1,
          "institution_price": 1,
          "institution_price_as_of": "2021-04-13",
          "institution_price_datetime": null,
          "institution_value": 12345.67,
          "iso_currency_code": "USD",
          "quantity": 12345.67,
          "security_id": "d6ePmbPxgWCWmMVv66q9iPV94n91vMtov5Are",
          "unofficial_currency_code": null
        },
        {
          "account_id": "ax0xgOBYRAIqOOjeLZr0iZBb8r6K88HZXpvmq",
          "cost_basis": 92.47,
          "institution_price": 0.177494362,
          "institution_price_as_of": "2022-01-14",
          "institution_price_datetime": "2022-06-07T23:01:00Z",
          "institution_value": 4437.35905,
          "iso_currency_code": "USD",
          "quantity": 25000,
          "security_id": "vLRMV3MvY1FYNP91on35CJD5QN5rw9Fpa9qOL",
          "unofficial_currency_code": null
        }
      ],
      "item": {
        "available_products": [
          "balance",
          "identity",
          "liabilities",
          "transactions"
        ],
        "billed_products": [
          "assets",
          "auth",
          "investments"
        ],
        "consent_expiration_time": null,
        "error": null,
        "institution_id": "ins_3",
        "item_id": "4z9LPae1nRHWy8pvg9jrsgbRP4ZNQvIdbLq7g",
        "update_type": "background",
        "webhook": "https://www.genericwebhookurl.com/webhook"
      },
      "request_id": "l68wb8zpS0hqmsJ",
      "securities": [
        {
          "close_price": 0.011,
          "close_price_as_of": "2021-04-13",
          "cusip": null,
          "institution_id": null,
          "institution_security_id": null,
          "is_cash_equivalent": false,
          "isin": null,
          "iso_currency_code": "USD",
          "name": "Nflx Feb 01'18 $355 Call",
          "proxy_security_id": null,
          "security_id": "8E4L9XLl6MudjEpwPAAgivmdZRdBPJuvMPlPb",
          "sedol": null,
          "ticker_symbol": "NFLX180201C00355000",
          "type": "derivative",
          "unofficial_currency_code": null,
          "update_datetime": null
        },
        {
          "close_price": 27,
          "close_price_as_of": null,
          "cusip": "577130834",
          "institution_id": null,
          "institution_security_id": null,
          "is_cash_equivalent": false,
          "isin": "US5771308344",
          "iso_currency_code": "USD",
          "name": "Matthews Pacific Tiger Fund Insti Class",
          "proxy_security_id": null,
          "security_id": "JDdP7XPMklt5vwPmDN45t3KAoWAPmjtpaW7DP",
          "sedol": null,
          "ticker_symbol": "MIPTX",
          "type": "mutual fund",
          "unofficial_currency_code": null,
          "update_datetime": null
        },
        {
          "close_price": 2.11,
          "close_price_as_of": null,
          "cusip": "00448Q201",
          "institution_id": null,
          "institution_security_id": null,
          "is_cash_equivalent": false,
          "isin": "US00448Q2012",
          "iso_currency_code": "USD",
          "name": "Achillion Pharmaceuticals Inc.",
          "proxy_security_id": null,
          "security_id": "KDwjlXj1Rqt58dVvmzRguxJybmyQL8FgeWWAy",
          "sedol": null,
          "ticker_symbol": "ACHN",
          "type": "equity",
          "unofficial_currency_code": null,
          "update_datetime": null
        },
        {
          "close_price": 10.42,
          "close_price_as_of": null,
          "cusip": "258620103",
          "institution_id": null,
          "institution_security_id": null,
          "is_cash_equivalent": false,
          "isin": "US2586201038",
          "iso_currency_code": "USD",
          "name": "DoubleLine Total Return Bond Fund",
          "proxy_security_id": null,
          "security_id": "NDVQrXQoqzt5v3bAe8qRt4A7mK7wvZCLEBBJk",
          "sedol": null,
          "ticker_symbol": "DBLTX",
          "type": "mutual fund",
          "unofficial_currency_code": null,
          "update_datetime": null
        },
        {
          "close_price": 1,
          "close_price_as_of": null,
          "cusip": null,
          "institution_id": null,
          "institution_security_id": null,
          "is_cash_equivalent": true,
          "isin": null,
          "iso_currency_code": "USD",
          "name": "U S Dollar",
          "proxy_security_id": null,
          "security_id": "d6ePmbPxgWCWmMVv66q9iPV94n91vMtov5Are",
          "sedol": null,
          "ticker_symbol": "USD",
          "type": "cash",
          "unofficial_currency_code": null,
          "update_datetime": null
        },
        {
          "close_price": 13.73,
          "close_price_as_of": null,
          "cusip": null,
          "institution_id": "ins_3",
          "institution_security_id": "NHX105509",
          "is_cash_equivalent": false,
          "isin": null,
          "iso_currency_code": "USD",
          "name": "NH PORTFOLIO 1055 (FIDELITY INDEX)",
          "proxy_security_id": null,
          "security_id": "nnmo8doZ4lfKNEDe3mPJipLGkaGw3jfPrpxoN",
          "sedol": null,
          "ticker_symbol": "NHX105509",
          "type": "etf",
          "unofficial_currency_code": null,
          "update_datetime": null
        },
        {
          "close_price": 0.140034616,
          "close_price_as_of": "2022-01-24",
          "cusip": null,
          "institution_id": "ins_3",
          "institution_security_id": null,
          "is_cash_equivalent": true,
          "isin": null,
          "iso_currency_code": "USD",
          "name": "Dogecoin",
          "proxy_security_id": null,
          "security_id": "vLRMV3MvY1FYNP91on35CJD5QN5rw9Fpa9qOL",
          "sedol": null,
          "ticker_symbol": "DOGE",
          "type": "cryptocurrency",
          "unofficial_currency_code": null,
          "update_datetime": "2022-06-07T23:01:00Z"
        }
      ]
    }
    const holdings = response.holdings;
    const securities = response.securities;
    for (let i = 0; i < response.accounts.length; i++) {
      const account = response.accounts[i];
      
      // Filter the holdings array for this account_id
      const holdings = response.holdings.filter(h => h.account_id === account.account_id);
      
      // Add the holdings array as a new key to this account object
      account.holdings = holdings;
    }
    return res.render('bankInvestments', {
       accounts: response.accounts
    })
  } catch (error) {
    // handle error
    console.log("------")
    console.log(error)
  }
    })



export default router