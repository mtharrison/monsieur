'use strict';

// Load Modules

const MongoClient = require('mongodb').MongoClient;

const Table = require('./table');

exports = module.exports = class {

    constructor(name, options) {

        this.name = name;
        this.options = options;
        this.client = null;
        this.url = `mongodb://${options.host || 'localhost'}:${options.port || 27017}`;

        this.tables = {};
    }

    async connect() {

        this.client = await MongoClient.connect(this.url, { useNewUrlParser: true });
        this.db = this.client.db(this.name);
    }

    async close() {

        await this.client.close();
    }

    table(tables, options) {

        tables.forEach((name) => {
            
            const table = new Table(this.db, name);
            this[name] = table;
            this.tables[name] = table;
        });
    }

    async establish() {

        // Do nothing - mongo will lazily create collections

        return;
    }
}
