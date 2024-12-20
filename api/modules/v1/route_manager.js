const express = require('express');

const router = express.Router();

//user Routes
const userAuthRoutes           = require('./routes/auth_route');

//user routes
router.use('/auth/', userAuthRoutes);



module.exports = router;
