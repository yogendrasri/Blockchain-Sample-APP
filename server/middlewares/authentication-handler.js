/**
 * Copyright 2019 IBM Corp. All Rights Reserved.
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

const log4js = require('log4js');
const config = require('config');
const JWT = require('jsonwebtoken');
const util = require('../helpers/util');
const axios = require('axios');

/**
 * Set up logging
 */
const logger = log4js.getLogger('authentication handler');
logger.setLevel(config.logLevel);

/**
 * auth Handler object
 */
const authHandler = {};


/**
 * auth handler function
 */
authHandler.authenticateUser = (req, res, next) => {
    logger.debug('authenticateUser handler...');
    let token;
    if(req.headers.authorization)
    {
        let restoken = req.headers.authorization.split(" ");
        token = restoken[1];
        console.log(token);
    }else{
         token = req.headers.auth;
    }
    if (!token) {
        jsonRes = {
            errors: [{
                code: 401,
                message: 'No token provided.',
                details: {}
            }],
            statusCode: 401
        };
        util.sendResponse(res, jsonRes);
    } else {
        JWT.verify(token, config.tokenSecret, function(err, decoded) {
            if (err) {
              jsonRes = {
                errors: [{
                  name: 'TokenExpiredError',
                  message: 'Token expired',
                  expiredAt: err.expiredAt
                }],
                statusCode: 401
            };
            util.sendResponse(res, jsonRes);
            }else{
                logger.info('Token Information ='+decoded);
                next();
            }
          });
        /*axios({
            method: 'get',
            url: `https://api.github.com/user`,
            headers: {
              accept: 'application/json',
              authorization: 'token '+token
            }
          }).then((response) => {
         console.log('***************************'+response.data['login'] +' authenticated');
         next();
          }) .catch(function (error) {
            console.log(error.response['statusText']);
            jsonRes = {
                errors: [{
                    code: 401,
                    message: error.response['statusText'],
                    details: {}
                }],
                statusCode: 401
            };
            util.sendResponse(res, jsonRes);
          })*/
    }

};

module.exports = authHandler;