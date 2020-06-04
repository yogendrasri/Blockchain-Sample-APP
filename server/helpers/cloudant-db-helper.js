/**
 * Copyright 2019 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";

const log4js = require("log4js");
const config = require("config");
const Cloudant = require("@cloudant/cloudant");
const async = require("async");
const logger = log4js.getLogger("helpers - postgres DB helper");
logger.setLevel(config.logLevel);


const cloudantDBHelper = {};
var cloudant;
var dbname;

cloudantDBHelper.init = () => {
  cloudant = Cloudant({ url: config.CLOUDANT_URL });  
  dbname = cloudant.db.use("blockchain-db");  
};

cloudantDBHelper.getUser = async(userId) => {
  const isexist = await  dbname.get("Users:"+userId);
  return isexist;
};

cloudantDBHelper.getAllUsers = () => {
  return new Promise((Resolve, reject) => {
    logger.debug("in cloudantDBHelper.getAllUsers() ");

    /* pool.connect().then(client => {
            console.log('client connected');
            const queryText = "SELECT * FROM users";
            client.query(queryText).then((result) => {
                logger.debug('get all users call done');
                client.release();
                Resolve(result.rows);
            }).catch(err => {
                logger.error('error postgres query ' + err);
                client.release();
                reject('error postgres query ' + err);
            });
        });*/
  });
};

cloudantDBHelper.insertUser = async (userId, role, org, pw, certificate) => {
  logger.debug("userId"+userId);
  logger.debug("role"+role);
  logger.debug("org"+org);
  logger.debug("pw"+pw);
  logger.debug("certificate"+certificate);

  const queryResponse = await dbname.insert({
    _id: "Users:" + userId,
    password: pw,
    roleName: role,
    organizantion: org,
    identity: certificate
  });
  return queryResponse;
};
cloudantDBHelper.insertTransaction = async (userId, agreementHash,TransactionId) => {
  const queryResponse = await dbname.insert({
    _id: "agreementHash:" + agreementHash,
    transactionId: TransactionId,
    userName: userId,
    transactiontime:Date(Date.now())
  });
  return queryResponse;
};
cloudantDBHelper.getTransactionId = async(agreementHash) => {
  const transaction_result = await  dbname.get("agreementHash:"+agreementHash);
  return transaction_result;
};
module.exports = cloudantDBHelper;
