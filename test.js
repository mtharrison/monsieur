const Monsieur = require('.');


const fn = async () => {

    const database = new Monsieur.Db('test');

    await database.connect();
    database.table(['example']);

    database.example.changes(function (change) {

        console.log(JSON.stringify(change, null, 2));
    });

};

fn();