// required dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

// MySQL connection parameters
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

