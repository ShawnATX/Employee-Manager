/*

Build a command-line application that at a minimum allows the user to:

  * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles
*/

const mysql = require("mysql");
const inquirer = require("inquirer");
//cosmike
const figlet = require('figlet');
require("dotenv").config();

const Queries = require("./lib/database/queries");  
const queries = new Queries();



var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MY_PASS,
    database: "human_resources_data"
  });

  
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    promptUser();
  });

  const displayIntro = () => {
    figlet.text('Employee Manager', {
      font: '3-d',
      horizontalLayout: 'default',
      verticalLayout: 'default'
  }, function(err, data) {
      if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          return;
      }
      console.log("");
      console.log(data);
      return (data);
    }) 
  };
  

//this function will run the starting user prompt (what would you like to do) and execute the relevant function based on input
  async function promptUser() {
    const intro = await displayIntro();
    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all employees by department",
        "Add Employee",
        "Remove Employee",
        "Update Employee"
      ]
    })
    .then( (answer) => {
      switch (answer.action) {
        case "View all employees":
          viewAllEmployees("name");
          break;
        case "View all employees by department":
          
          break;
        case "Add Employee":
          
          break;
        case "Remove Employee":
          
          break;
        case "Update Employee":
          
          break;
      
        default:
          break;
      }
  })
};

  function viewAllEmployees(sort) {
    switch (sort) {
      case "name":
        queries.getAllEmployees();
        connection.query("SELECT e.id, e.first_name as First, e.last_name as Last, r.title as Title, r.salary as Salary, d.name as Department, e.manager_id FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id", (err, res) => {
          if (err) throw err;
          console.table(res)
        });
        break;
    
      default:
        break;
    }
  };


  function viewAllDepartments() {
    inquirer
    .prompt({
      name: "artist",
      type: "input",
      message: "What artist would you like to search for?"
    })
    .then(function(answer) {
      var query = "SELECT position, song, year FROM top5000 WHERE ?";
      connection.query(query, { artist: answer.artist }, function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
        }
        runSearch();
      });
    });
      
  }
  function viewAllRoles() {
      
  };
