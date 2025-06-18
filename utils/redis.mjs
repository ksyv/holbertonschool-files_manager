import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.connected = false;
    this.client.on('connect', () => {
      this.connected = true;
      console.log('Connected to Redis');
    });
    this.client.on('error', (err) => {
      console.error(`Redis error: ${err.message}`);
      this.connected = false;
    });
    this.client.on('end', () => {
      console.log('Redis connection closed');
      this.connected = false;
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          console.error(`Error getting key ${key}: ${err.message}`);
          return reject(err);
        }
        return resolve(value);
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (err, reply) => {
        if (err) {
          console.error(`Error setting key ${key}: ${err.message}`);
          return reject(err);
        }
        return resolve(reply);
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          console.error(`Error deleting key ${key}: ${err.message}`);
          return reject(err);
        }
        return resolve(reply);
      });
    });
  }
}

const redisClient = new RedisClient();
export default redisClient;
