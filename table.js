'use strict';

// Load Modules

const MongoClient = require('mongodb').MongoClient;
const Hoek = require('hoek');

exports = module.exports = class {

    constructor(name, db) {

        this.name = name;
        this._db = db;
    }

    _collection() {

        return this._db._db.collection(this.name);
    }

    async insert(rows) {

        if (!rows.length) {
            return;
        }

        await this._collection().insertMany(rows, { checkKeys: false });
    }

    async count() {

        return await this._collection().countDocuments();
    }

    async all() {

        return await this._collection().find({}).toArray();
    }

    async empty() {

        return await this._collection().deleteMany({});
    }

    async update(id, changes) {

        changes = Hoek.clone(changes);

        // Fix any nesting

        for (const [key, value] of Object.entries(changes)) {
            if (typeof value === 'object' &&
                value !== null &&
                !Array.isArray(value)) {

                for (const [key1, value1] of Object.entries(value)){

                    changes[`${key}.${key1}`] = value1;
                
                }

                delete changes[key];
            
            }
        }

        return await this._collection().updateOne({ id }, { $set: changes });
    }

    changes(query, handler) {

        const changeStream = this._collection().watch({ fullDocument: 'updateLookup' });
        let next = changeStream.next();

        setImmediate(async () => {

            while (true) {
                const item = await next;

                const id = item.fullDocument.id;

                const notification = {
                    id,
                    type: 'update',
                    before: this._collection().findOne({ id }),
                    after: item.fullDocument
                }


                handler(null, notification);
                next = changeStream.next();
            }
        });
    }

    async query(query) {

        return await this._collection().find(query).toArray();
    }

    async get(id) {

        return await this._collection().findOne({ id });
    }

    async filter() {
        return [];
    }
}
