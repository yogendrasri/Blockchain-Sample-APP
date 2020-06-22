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
let connectionProfilePath =path.join(__dirname,'/../config/Connection.json');
const util = require('../helpers/util');
const logger = log4js.getLogger('controllers - Fabcar');
const fabricClientHelper =  require('../helpers/fabric-network-client');
logger.setLevel(config.logLevel);     

/**
 * Controller object
 */
const fabcar = {};

fabcar.queryAllCars = async (req, res) => {
 
  let jsonRes;
  try{
  logger.debug('inside  queryAllCars()...'+ req.params['userId']);   
   await fabricClientHelper.evaluateTransaction(req.params['userId'],"channel1","fabcar",connectionProfilePath,"queryAllCars","")
   .then((data)=>{
     logger.debug("data -"+data);
     jsonRes = data;    
   }).catch(console.error());
  } catch(err) {
    jsonRes= `FAILED: ${err}`;  
 }
 console.log(jsonRes); 
 res.send(JSON.parse(jsonRes)); 
};

fabcar.createCar = async (req, res) => {
  let response;
  try{
    logger.debug('inside  createCar()...');
    await fabricClientHelper.submitTransaction(req.params['userId'],"channel1","fabcar",connectionProfilePath,"createCar",req.body)
    .then((data)=>{
      response = {
        statusCode: 200,
        success: true,
        message: 'Car Creared Sucessfully!',
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
module.exports = fabcar;
