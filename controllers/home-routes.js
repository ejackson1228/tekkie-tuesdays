const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Vote, Comment } = require('../models');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: [ //include vote count in sequelize literal 
            'id', 
            'title', 
            'description', 
            'article_url',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Comment, //include comments with user who created the comment
                attributes: ['id', 'text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes:  ['username']
                }
            },
            {
                model: User, //include author of post
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
})

module.exports = router;