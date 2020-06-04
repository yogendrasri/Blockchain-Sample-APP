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
let connectionProfilePath =path.join(__dirname,'/../config/authority1channel_profile.json');
const util = require('../helpers/util');
const logger = log4js.getLogger('controllers - proof');
const fabricClientHelper =  require('../helpers/fabric-network-client');
logger.setLevel(config.logLevel);     

/**
 * Controller object
 */
const proof = {};

proof.getProofDetails = async (req, res) => {
 
  let jsonRes;
  try{
  logger.debug('inside  getProofDetails()...');
   await fabricClientHelper.evaluateTransaction(req.params['userId'],"authoritychannel","authoritycontract",connectionProfilePath,"getproofDetails",req.params['agreementHash'])
   .then((data)=>{
     
    jsonRes = {
      statusCode: 200,
      success: true,
      result: data
    };
   }).catch(console.error());
} catch(err) {
  jsonRes = {
    statusCode: 500,
    success: false,
    message: `FAILED: ${err}`,
  } 
  
 }
 console.log(jsonRes);
  util.sendResponse(res, jsonRes);
};

proof.doPublishProof = async (req, res) => {
  let response;
  try{
    await fabricClientHelper.submitTransaction(req.body['userId'],"authoritychannel","authoritycontract",connectionProfilePath,"publishProof",req.body)
    .then((data)=>{
      response = {
        statusCode: 200,
        success: true,
        message: 'Proof Published Sucessfully!',
        transactionId:data,
        status: 'UP',
      };
     }).catch(console.error());
  } catch (err) {
    response = {
        statusCode: 500,
        success: false,
        message: `FAILED: ${err}`,
    };
}
util.sendResponse(res, response);
};
module.exports = proof;
