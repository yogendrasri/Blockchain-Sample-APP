/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const bodyParser = require('body-parser');
const express = require('express');
const log4js = require('log4js');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const config = require('config');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const IBMCloudEnv = require('ibm-cloud-env');
const errorHandler = require('../server/errorhandlers/error-handler');
IBMCloudEnv.init();
const routes = require('./routes');
const walletHelper = require('./helpers/wallet');
const cloudantDbHelper=require('./helpers/cloudant-db-helper');
const app = express();
app.use(express.static(__dirname + '/public'))
app.use(cors());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });
/**
 * Set up logging
 */
const logger = log4js.getLogger('server');
logger.setLevel(config.logLevel);

logger.debug('setting up app: registering routes, middleware...');


/**
 * Load swagger document
 */

const swaggerDocument = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../public', 'open-api.yaml'), 'utf8'));

/**
 * Support json parsing
 */
app.use(bodyParser.urlencoded({
	extended: true,
}));
app.use(bodyParser.json({
	limit: '50mb'
}));


logger.debug('setting up app: registering routes, middleware...');



//app.use(cookieParser());
//app.enable("trust proxy");
//app.use(express.static('public'))
/**
 * GET home page
 */
app.get('/', (req, res) => {
	logger.debug('GET /');
	res.redirect('/api-docs');
});

var swaggerOptions = {
	defaultModelsExpandDepth: -1,
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, false, swaggerOptions));
/**
 * Register routes
 */

app.use('/api', routes);

/**
 * Error handler
 */

app.use(errorHandler.handleError);

/**
 * Start server
 */
const host = process.env.HOST || config.host;
const port = process.env.PORT || config.port;

//initialize wallet
cloudantDbHelper.init();
walletHelper.init();

app.listen(port, () => {
	logger.info(`app listening on http://${host}:${port}`);
	logger.info(`Swagger UI is available at http://${host}:${port}/api-docs`);
	// app.emit("listened", null);
});
module.exports = app;