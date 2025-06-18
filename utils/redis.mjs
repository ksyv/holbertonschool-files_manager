import { createClient } from 'redis';

class RedisClient {
    constructor() {
        this.client = createClient();
        this.connected = false;
        this.client.on("connect", () => {
            this.connected = true;
            console.log("Connected to Redis");
        });
        this.client.on("error", (err) => {
            console.error(`Redis error: ${err.message}`);
            this.connected = false;
        });
        this.client.on("end", () => {
            console.log("Redis connection closed");
            this.connected = false;
        });
        this.client.connect().catch((err) => {
            console.error(`Failed to connect to Redis: ${err.message}`);
        });
    }

    isAlive() {
        return this.connected;
    }

    async get(key) {
        if (!this.connected) {
            throw new Error("Redis client is not connected");
        }
        try {
            const value = await this.client.get(key);
            return value;
        } catch (err) {
            console.error(`Error getting key ${key}: ${err.message}`);
            throw err;
        }
    }

    async set(key, value) {
        if (!this.connected) {
            throw new Error("Redis client is not connected");
        }
        try {
            await this.client.set(key, value);
        } catch (err) {
            console.error(`Error setting key ${key}: ${err.message}`);
            throw err;
        }
    }

    async del(key) {
        if (!this.connected) {
            throw new Error("Redis client is not connected");
        }
        try {
            await this.client.del(key);
        } catch (err) {
            console.error(`Error deleting key ${key}: ${err.message}`);
            throw err;
        }
    }
}

const redisClient = new RedisClient();
export default redisClient;