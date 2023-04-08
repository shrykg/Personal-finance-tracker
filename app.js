import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import exphbs from 'express-handlebars';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');


app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    // let the next middleware run:
    next();
};

app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
// app.post('/registration', (req, res) => {
//     let firstname = req.body.firstname;
//     let lastname = req.body.lastname;
//     let dob = req.body.dob;
//     let email = req.body.email;
//     let password = req.body.password_confirm;

//     const data = {
//         "firstname": firstname,
//         "lastname": lastname,
//         "dob": dob,
//         "email": email,
//         "password": password,
//         "created_at": new Date()
//     }

//     db.collection('users').insertOne(data, (err, collection) => {
//         if (err) {
//             throw err;
//         }

//         console.log("Record inserted successfully");
//     })

//     return res.redirect('index.html');
// })

// app.post('/login', async (req, res) => {
//     console.log(req.body);
//     const username = req.body.username;
//     const password = req.body.password;
//     console.log(username);

//     try {
//         const data = await db.collection('users').findOne({ 'email': username });
//         if (!data) {
//             window.alert("Invalid user ID or user does not exist !")
//         }

//         if (password !== data.password) {
//             console.log("Wrong password , please enter the correct password and try again");
//         }


//     }
//     catch (e) {
//         throw (e);
//     }


//     console.log(data);
//     return res.redirect('dashboard.html');
// });


// app.get('/', function (req, res) {
//     res.set({
//         'Access-control-Allow-Origin': '*'
//     });
//     return res.redirect('index.html');
// }).listen(3000)


