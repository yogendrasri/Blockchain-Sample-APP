/**
 * Copyright 2018 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";

const log4js = require("log4js");
const config = require("config");
const Client = require("fabric-client");
const BaseWallet = require("fabric-network/lib/impl/wallet/basewallet");
const cloudantDbHelper = require("./cloudant-db-helper");
const logger = log4js.getLogger("helpers - postgreWallet");

logger.setLevel(config.logLevel);

/**
 * This class defines an implementation of an Identity wallet that persists
 * to a Postgre DB database
 *
 * @class
 * @extends {BaseWallet}
 */
class CloudantDBWallet extends BaseWallet {
  /**
   * Creates an instance of the PostgresDBWallet
   * @param {Object} options contains required property <code>url</code> and other Nano options
   * @param {WalletMixin} [mixin] optionally provide an alternative WalletMixin. Defaults to X509WalletMixin
   * @memberof PostgresDBWallet
   */

  constructor(mixin) {
    const method = "constructor";
    super(mixin);
  }

  /**
   * @inheritdoc
   */
  async exists(label) {
    const result = await cloudantDbHelper.getUser(label);
    return result;
  }

  /**
   * @inheritdoc
   */
  async export(label) {
    const result = await cloudantDbHelper.getUser(label);
    return result;
  }

  /**
   * @inheritdoc
   */
  async import(label, role, org, pw, certificate) {
    const method = "import";
    logger.debug("in %s, label = %s", method, label);
    const result = await cloudantDbHelper.insertUser(
      label,
      role,
      org,
      pw,
      certificate
    );
    return result;
  }
}

module.exports.CloudantDBWallet = CloudantDBWallet;
