const Monsieur = require('.');


const fn = async () => {

    const database = new Monsieur.Db('wave');

    await database.connect();
    database.table(['card']);

    database.card.changes(function (change) {

        console.log(JSON.stringify(change, null, 2));
    });

};

fn();