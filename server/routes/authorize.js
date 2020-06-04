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

const express = require('express');
const log4js = require('log4js');
const config = require('config');
const router = express.Router();
const path = require('path');
const axios = require('axios')
/**
 * Set up logging
 */
const logger = log4js.getLogger('routes - authorize');
logger.setLevel(config.logLevel);

logger.debug('setting up /authorize route');


/**
 * Add routes
 */
router.get('/', function(req,res){
  res.sendFile(path.resolve('public','authorize.html')); 
});

router.get('/oauth/redirect', (req, res) => {
    const requestToken = req.query.code
    console.log(config.ClientID+"===="+requestToken+"==="+config.ClientSecret);
    axios({
      method: 'post',
      url: `https://github.com/login/oauth/access_token?client_id=${config.ClientID}&client_secret=${config.ClientSecret}&code=${requestToken}`,
      headers: {
        accept: 'application/json'
  
      }
    }).then((response) => {
      const accessToken = response.data.access_token
      res.redirect(`/token.html?access_token=${accessToken}`)
    })
});
module.exports = router;