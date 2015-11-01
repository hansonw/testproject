/* global io */

module.exports = class ConnectionManager {
  constructor() {
    this.socket = io();
  }
};
