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

// connection.connect(function (err) {
//     if (err) throw err;
//     bamazon();
// });



// function bamazon() {
//     connection.query("SELECT * FROM products", function (err, res) {
//         if (err) throw err;
//         console.log(res);

//         inquirer
//             .prompt({
//                 name: "action",
//                 type: "list",
//                 message: "What would you like to do?",
//                 choices: [
//                     "Purchase a product!",
//                     "Leave your store"
//                 ]
//             })
//             .then(function (answer) {
//                 switch (answer.action) {
//                     case "Purchase a product!":
//                         productBuy();
//                         break;

//                     case "Leave your store":
//                         connection.end();
//                         break;
//                 }
//             });
//     })

// product buy selection
function productBuy() {

    inquirer.prompt([
        {
            name: "item_id",
            type: "input",
            message: "Please select the id of the product you would like?",
           
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many do you need?',
            
        }
    ]).then(function (input) {

        var query = "SELECT * From products WHERE ?";
        connection.query(query, { item_id: input.item_id }, function (err, res) {
            if (err) throw err;


            if (res.length === 0) {
                console.log("\n");
                console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
                console.log("\n");
                bamazon();
            }
            else {
                var productRes = res[0];

                if (input.quantity <= productRes.stock_quantity) {
                    console.log("\n");
                    console.log('Congratulations, the product you requested is in stock! Placing order!');

                    // Construct the updating query string
                    var updateQuery = 'UPDATE products SET stock_quantity = ' + (productRes.stock_quantity - input.quantity) + ' WHERE item_id = ' + input.item_id;

                    // Update the inventory
                    connection.query(updateQuery, function (err, res) {
                        if (err) throw err;
                        console.log("\n");
                        console.log('Your oder has been placed! Your total is $' + productRes.price * input.quantity);
                        console.log('Thank you for shopping with us!');
                        console.log("\n---------------------------------------------------------------------\n");

                        // End the database connection
                        connection.end();
                    })
                } else {
                    console.log("\n");
                    console.log('Insufficient quantity! There is not enough product in stock, your order can not be placed as is.');
                    console.log('Please modify your order.');
                    console.log("\n---------------------------------------------------------------------\n");

                    bamazon();
                }
            }
        })
    })
}
// function to display inventory from database and output to console
function displayBamazon() {

    queryStr = "Select * FROM products";
    connection.query(queryStr, function (err, res) {
        if (err) throw err;
        console.log("Inventory: ");
        console.log("...................\n");

        var list = '';
        for (var i = 0; i < res.length; i++) {
            list = '';
            list += 'Item ID: ' + res[i].item_id + '  ||  ';
            list += 'Product Name: ' + res[i].product_name + '  ||  ';
            list += 'Department: ' + res[i].department_name + '  ||  ';
            list += 'Price: $' + res[i].price + '\n';

            console.log(list);
        }

        console.log("---------------------------------------------------------------------\n");
        productBuy();
    })
}

function bamazon() {
    displayBamazon();
}

bamazon();