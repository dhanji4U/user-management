require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./logger');

const GLOBALS = require('./config/constants');
const PORT = process.env.PORT

const app = express();
app.use(cors())

const routes = require('./modules/v1/route_manager');
// body
app.use(express.text());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));


//Routes
app.use('/api/v1', routes);


try {

	module.exports = app.listen(PORT, () => {
		logger.info(`${GLOBALS.APP_NAME} - Project Running on PORT :- ${PORT}`);
	});

} catch (err) {
	console.log("Failed to connect");
}