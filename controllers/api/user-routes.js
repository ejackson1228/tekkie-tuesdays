const { User, Post, Comment, Like } = require('../../models/User');
const router = require('express').Router();

router.get('/', (req, res) => {
    User.findAll({
        
    })
})