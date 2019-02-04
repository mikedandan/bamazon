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

//start Manager admin
bamazonManager();

//admin choice selection 
function bamazonManager() {

    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "EXIT"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    displayBamazon();
                    break;
                case "View Low Inventory":
                    inventory();
                    break;
                case "Add to Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    addProduct();
                    break;
                case "EXIT":
                    connection.end();
                    break;
            }
        });
    // })
}

//display inventory function
function displayBamazon() {

    queryStr = "Select * FROM products";
    connection.query(queryStr, function (err, res) {
        if (err) throw err;
        console.log("\n");
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
        bamazonManager();
    })
}

//display inventory with low quantity (2 or less)
function inventory() {
    queryStr = "Select * FROM products WHERE stock_quantity <= 5";
    connection.query(queryStr, function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.log("Inventory: ");
        console.log("...................\n")

        var list = '';
        for (var i = 0; i < res.length; i++) {
            list = '';
            list += 'Item ID: ' + res[i].item_id + '  ||  ';
            list += 'Product Name: ' + res[i].product_name + '  ||  ';
            list += 'Department: ' + res[i].department_name + '  ||  ';
            list += 'Price: $' + res[i].price + '  ||  ';
            list += 'Quanity: ' + res[i].stock_quantity + '\n';

            console.log(list);
        }

        console.log("---------------------------------------------------------------------\n");
        bamazonManager();
    })
}

function addInventory() {
    inquirer.prompt([
        {
            name: "item_id",
            type: "input",
            message: "Please select the id of the product you would like to update?",

        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to add to the quantity?',

        }
    ]).then(function (input) {

        queryStr = "Select * FROM products WHERE ?";
        connection.query(queryStr, { item_id: input.item_id }, function (err, res) {
            if (err) throw err;

            if (res.length === 0) {
                console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
                addInventory();

            } else {
                var productRes = res[0];
                console.log("\n");
                console.log('Updating Inventory...');

                var updateQuery = "UPDATE products SET stock_quantity = " + (parseFloat(productRes.stock_quantity) + parseFloat(input.quantity)) + " WHERE item_id = " + input.item_id;
                connection.query(updateQuery, function (err, res) {
                    if (err) throw err;
                    console.log("\n");
                    console.log('Stock count for Item ID ' + input.item_id + ' has been updated to ' + (parseFloat(productRes.stock_quantity) + parseFloat(input.quantity)) + '.');
                    console.log("\n---------------------------------------------------------------------\n");

                    // End the database connection
                    connection.end();
                })

            }

        })
    })
}

// addProduct will help the user in adding a new product to the inventory
function addProduct() {
	
	// Prompt the user to enter info about the new product
	inquirer.prompt([
		{
			type: 'input',
			name: 'product_name',
			message: 'Please enter the new product name.',
		},
		{
			type: 'input',
			name: 'department_name',
			message: 'Which department does the new product belong to?',
		},
		{
			type: 'input',
			name: 'price',
			message: 'What is the price?',
			
		},
		{
			type: 'input',
			name: 'stock_quantity',
			message: 'How many items are in stock?',
			
		}
	]).then(function(input) {
		// console.log('input: ' + JSON.stringify(input));
        console.log("\n");
		console.log('Adding New Item: \n    product_name = ' + input.product_name + '\n' +  
									   '    department_name = ' + input.department_name + '\n' +  
									   '    price = ' + input.price + '\n' +  
									   '    stock_quantity = ' + input.stock_quantity);

		// Create the insertion query string
		var queryStr = 'INSERT INTO products SET ?';

		// Add new product to the database
		connection.query(queryStr, input, function (error, res) {
			if (error) throw error;
            console.log("\n");
			console.log('New product has been added to the inventory under Item ID ' + res.insertId + '.');
			console.log("\n---------------------------------------------------------------------\n");

			// End the database connection
			connection.end();
		});
	})
}
