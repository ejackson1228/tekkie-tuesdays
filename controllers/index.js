const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);


router.use((req, res) => { //for invalid requests 
    res.status(400).end();
});

module.exports = router;