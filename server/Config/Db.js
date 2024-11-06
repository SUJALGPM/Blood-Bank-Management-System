const { bgGreen } = require('colors');
const mysql = require('mysql');

//Establish connection with mysql database..
const connectDb = async () => {
    try {
        const db = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DBNAME
        });

        //Connect the database..
        db.connect((err) => {
            if (err) {
                console.log(err);
                
                console.log(`Failed to connect to mysql database..!!!`.bgRed.white);
                return;
            } else {
                console.log(`Blood-Bank-System successfully connected to MYSQL server`.bgGreen.white);
            }
        });

        // Store the database connection for further use
        return db;

        // //Close the connection after work done..
        // db.end();

    } catch (err) {
        console.log(err);
    }
}

module.exports = connectDb;