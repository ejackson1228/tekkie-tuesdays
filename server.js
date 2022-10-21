const express = require('express');
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const routes = require('./controllers');
// const helpers = require('./utils/helpers');
const hbs = exphbs.create({});

const sequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'silly super secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new sequelizeStore({
        db: sequelize,
        checkExpirationInterval: 15*60*1000, //check sessions interval every 15 minutes
        expiration: 1000*60*60 //session timout at 1 hour
    })
};

const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));

//turn on routes
app.use(routes);

//turn on connection to db server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});