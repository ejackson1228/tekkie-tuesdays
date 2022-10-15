const router = require('express').Router();
const { User, Post, Comment, Like } = require('../../models');

// get all users
router.get('/', (req, res) => { 
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//find user by id
router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'article_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title', 'id']
                }
            },
            {
                model: Post,
                attributes: ['title', 'id'],
                through: Like,
                as: 'liked_posts'
            }
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with that ID.'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Create new User
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => { //start a session with new user credentials 
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData);
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//create login session from existing user 
//router.post('/login', (req, res) => {

//});

// change user info
router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true, //bcrypt requirement to hash password if user info is changed
        where: { 
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with that ID.'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;