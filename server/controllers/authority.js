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

const log4js = require('log4js');
const config = require('config');
const path = require('path');
const util = require('../helpers/util');
const logger = log4js.getLogger('controllers - authority');
const fabricClientHelper =  require('../helpers/fabric-network-client');
logger.setLevel(config.logLevel);     

/**
 * Controller object
 */
const authority = {};


authority.doCreateAuthority = async (req, res) => {
  let jsonRes;

  try{
    let connectionProfilePath =path.join(__dirname,'/../config/authority1channel_profile.json');
    await fabricClientHelper.submitTransaction(req.body['userId'],"authoritychannel","authoritycontract",connectionProfilePath,"createAuthority",req.body)
    .then((data)=>{
     jsonRes = {
            statusCode: 200,
            success: true,
            result: 'Authority created successfully'
        };
    }).catch(console.error()
    );
  } catch (err) {
    jsonRes = {
      statusCode: 500,
      success: false,
      message: `FAILED: ${err}`,
  };
}
util.sendResponse(res, jsonRes);
};
module.exports = authority;


