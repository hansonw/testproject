/* global io */

const constants = require('../common/constants');

const ACCEPTABLE_RANGE = 5;
const MIN_ITERATIONS = 20;
const MAX_ITERATIONS = 100;

function standardDeviation(n, sum, sumSq) {
  // stddev = sqrt(1/(n*(n-1))*(n*sumsq - sum*sum))
  return Math.sqrt(1 / n / (n - 1) * (n * sumSq - sum * sum));
}

class ConnectionManager {
  constructor() {
    this.socket = io();
    this.initialized = false;
    this.socket.on('connect', async () => {
      if (this.initialized) {
        return;
      }
      this.offset = await this.synchronizeTime();
      console.log('time offset: %f', this.offset);
      this.initialized = true;
    });
  }

  async synchronizeTime() {
    console.log('Synchronizing time with server..');
    // Calculate the running sample stddev and mean.
    let sum = 0;
    let sumSq = 0;
    let mean = 0;
    for (let n = 1; n <= MAX_ITERATIONS; n++) {
      this.socket.emit(constants.ClientActions.TIME_REQUEST);
      let beforeTime = Date.now();
      let {time} = await this.awaitEvent(constants.ServerActions.TIME_RESPONSE);
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

  async awaitEvent(event) {
    return new Promise((resolve, _reject) => {
      this.socket.on(event, (data) => {
        resolve(data);
      });
    });
  }
}

module.exports = ConnectionManager;
