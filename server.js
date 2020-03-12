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
   const promptUser = async () =>{
    displayIntro();
    let timeToExit = false;
    try {
    while (timeToExit === false) {
      let action = await getAction();
      switch (action.action) {
        case "View all employees":
          let view = await viewAllEmployees("name");
          break;
        case "View all employees by department":
          viewAllEmployees("department");          
          break;
        case "Add Employee":
          let newEmployee = await addEmployeePrompt();            
          break;
        case "Remove Employee":
          
          break;
        case "Update Employee":
          
          break;
          
        case "Exit":
          timeToExit = true;
          console.log("Be Well");
          process.exit(0);
          break;
        default:
          break;
      }
    }

  } catch (err) {
    console.log(err);
  }
};


const getAction = async () => {
  const action = await inquirer
  .prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View all employees",
      "View all employees by department",
      "Add Employee",
      "Remove Employee",
      "Update Employee",
      "Exit"
    ]
  })
  return action;
};

const viewAllEmployees = async (sort) => {
  try{
    switch (sort) {
      case "name":
        console.log("View employees");
        //queries.getAllEmployees();
        connection.query("SELECT e.id, e.first_name as First, e.last_name as Last, r.title as Title, r.salary as Salary, d.name as Department, e.manager_id FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id", (err, res) => {
          if (err) throw err;
          console.log("");
          console.table(res);
        });
        break;
        case "department":
          //queries.getAllEmployees();
          connection.query("SELECT e.id, e.first_name as First, e.last_name as Last, r.title as Title, r.salary as Salary, d.name as Department, e.manager_id FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY d.name ASC", (err, res) => {
            if (err) throw err;
            console.log("");
            console.table(res);
          });
          return;
          break;
          
          default:
            break;
          }
  } 
  catch (err) {
    console.log(err);
  }
};
        
        
        
const getRoles = () => {
  connection.query("SELECT title, id FROM role", (err, res) => {
    if (err) throw err;
    //console.log(res);
    for (i in res) {
      console.log(res[i].id);
    }
    const roles = res.map((el) => { el.id });
    
    console.log(roles);
    return(res);
  })
};

const addEmployeePrompt = async () => {
  try{
    const employeeData = await
    inquirer
    .prompt([
      {
        name: "first",
        type: "input",
        message: "Please enter employee's first name"
      },
      {
        name: "last",
        type: "input",
        message: "Please enter employee's last name"
      },
      {
        name: "role",
        type: "rawlist",
        message: "Please select the employee's role",
        choices: ["1"]//getRoles()
      },
      {
        name: "manager",
        type: "rawlist",
        message: "Please select the employee's manager",
        choices: ["1", "2"] //getManagers()
      }
    ]
  )
  let dbResponse = await saveEmployee(employeeData);

  return dbResponse;
} catch (err){
  console.log(err);
}
};

const saveEmployee = ({first, last, role, manager}) => {
  let roleInt = parseInt(role);
  let managerInt = parseInt(manager);
  connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [first, last, roleInt, managerInt], function(err, response){
    if (err) throw err;
    console.log(response);

  });
  return (`Employee ${first} ${last} saved`);
};
