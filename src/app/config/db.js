const mysql = require("mysql");

const db = mysql.createConnection({
    host: "122.161.51.184",
    user: "rmw_my_property_fact",
    password: "G;_n}*QMy9XZ",
    database: "my-property-fact"
})

db.connect(err =>{
    if(err){
        console.log("Error connectiong to MYSQL database.");
    }else{
        console.log("Connection successfully...");        
    }
});

module.exports = db;
