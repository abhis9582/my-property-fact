const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Abhi9582@",
    database: "mypropertyfact"
})

db.connect(err =>{
    if(err){
        console.log("Error connectiong to MYSQL database.");
    }else{
        console.log("Connection successfully...");        
    }
});

module.exports = db;