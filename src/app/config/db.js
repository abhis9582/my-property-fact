const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "rmw_my_property_fact",
    password: "G;_n}*QMy9XZ",
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