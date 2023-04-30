import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import exphbs from 'express-handlebars';
import moment from 'moment'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import session from 'express-session';

const staticDir = express.static(__dirname + '/public');

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
}));

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    next();
};

app.use(async (req, res, next) => {
    let date = new Date().toUTCString();
    let method = req.method;
    let url = req.originalUrl;
    let auth = ''
    if (req.session.user) {
        auth = '(User is Authenticated)'
    }

    else {
        auth = '(User is Not Authenticated)';
    }

    console.log(date + ":" + " " + method + " " + url + " " + auth);
    next();
})

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
      json: function (context) {
            return JSON.stringify(context);
        },
      ifEqual: function(a, b, options) {
        if (a === b) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      },
      moment: function(date, options) {
        return moment(date).format(options.hash.format);
      }
    }

  });
  

app.use(rewriteUnsupportedBrowserMethods);


app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(4000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:4000');
});
