const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Like, Comment } = require('../../models');

// get all posts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [ //include like count in sequelize literal 
            'id', 
            'title', 
            'description', 
            'article_url',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM like WHERE post.id = like.post_id)'), 'like_count']
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
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

//get post by id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id', 
            'title', 
            'description', 
            'article_url',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM like WHERE post.id = like.post_id)'), 'like_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No Post found with that ID.'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

//create new post
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        description: req.body.description,
        article_url: req.body.article_url,
        user_id: req.session.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

module.exports = router;