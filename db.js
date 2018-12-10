'use strict';

// Load Modules

const MongoClient = require('mongodb').MongoClient;

const Table = require('./table');

exports = module.exports = class {

    constructor(name, options) {

        this.name = name;
        this.options = options;
        this.client = null;
        this.url = 'mongodb://localhost:27017';

        this.tables = {};

        this._connected = false;
    }

    async connect() {

        this._client = await MongoClient.connect(this.url, { useNewUrlParser: true });
        this._db = this._client.db(this.name);
        this._connected = true;
    }

    async close() {

        await this._client.close();
    }

    table(tables, options) {

        if (!typeof tables === 'string' &&
            !Array.isArray(tables)) {
            tables = Object.keys(tables);
        }

        tables = [].concat(tables);

        tables.forEach((name) => {

            const table = new Table(name, this);
            this[name] = table;
            this.tables[name] = table;
        });
    }

    async establish() {

        if (!this._connected) {
            await this.connect();
        }

        return;
    }
}
