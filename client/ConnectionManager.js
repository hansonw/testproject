/* global io */

const constants = require('../common/constants');

const ACCEPTABLE_RANGE = 5;
const MIN_ITERATIONS = 50;
const MAX_ITERATIONS = 100;

function standardDeviation(n, sum, sumSq) {
  // stddev = sqrt(1/(n*(n-1))*(n*sumsq - sum*sum))
  return Math.sqrt(1 / n / (n - 1) * (n * sumSq - sum * sum));
}

class ConnectionManager {
  constructor() {
    this.socket = io();
    this.initialized = false;
    this.ready = false;
    this.socket.on('connect', async () => {
      if (this.initialized) {
        return;
      }
      this.offset = Math.round(await this._synchronizeTime());
      console.log('time offset: %d', this.offset);
      this.initialized = true;
      if (this.ready) {
        this.signalReady();
      }
    });
  }

  signalReady() {
    if (this.initialized) {
      this.socket.emit(constants.ClientActions.CLIENT_READY);
    } else {
      this.ready = true;
    }
  }

  onPlay(callback) {
    this.socket.on(constants.ServerActions.PLAY_SONG, (data) => {
      callback({
        startTime: data.startTime - this.offset,
      });
    });
  }

  async _synchronizeTime() {
    console.log('Synchronizing time with server..');
    // Calculate the running sample stddev and mean.
    let sum = 0;
    let sumSq = 0;
    let mean = 0;
    for (let n = 1; n <= MAX_ITERATIONS; n++) {
      this.socket.emit(constants.ClientActions.TIME_REQUEST);
      let beforeTime = Date.now();
      let {time} = await this._awaitEvent(constants.ServerActions.TIME_RESPONSE);
      let afterTime = Date.now();
      let latency = afterTime - beforeTime;
      let offset = time - beforeTime - (latency / 2);
      sum += offset;
      sumSq += offset * offset;
      if (n >= MIN_ITERATIONS) {
        let stddev = standardDeviation(n, sum, sumSq);
        mean = sum / n;
        if (stddev <= ACCEPTABLE_RANGE) {
          return mean;
        }
      }
    }
    return mean;
  }

  async _awaitEvent(event) {
    return new Promise((resolve, _reject) => {
      this.socket.on(event, (data) => {
        resolve(data);
      });
    });
  }
}

module.exports = ConnectionManager;
