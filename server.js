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

  const displayIntro = async () => {
    await figlet.text('Employee Manager', {
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
    let introScreen = await displayIntro();
    //console.log(introScreen);
    let timeToExit = false;
    try {
    while (timeToExit === false) {
      let action = await getAction();
      switch (action.action) {
        case "View all employees":
          viewAllEmployees("name");
          break;

        case "View all employees by department":
          viewAllEmployees("department");          
          break;

        case "Add New Employee":
          let newEmployee = await addEmployeePrompt();   
          console.log('\n', newEmployee, '\n');        
          break;

          case "View all departments":
            viewAllDepartments();
           
          break;

          case "View all roles":
            let roles = await viewAllRoles();
            console.log('\n');
           
          break;

        case "Update Employee":
          
          break;
          
        case "Add New Department":
          let newDepartment = await addDepartmentPrompt();
          console.log('\n', newDepartment, '\n');        
          break;
          
        case "Add New Role":
          let newRole = await addRolePrompt();
          console.log('\n', newRole, '\n');        
          break;
          
        case "Remove Employee":
          let employeeRemove = await removeEmployee();
          console.log('\n', employeeRemove + " was removed.", '\n');        
          break;
          
        case "Exit":
          timeToExit = true;
          console.log("Be Well");
          connection.end();
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
      "View all departments",
      "View all roles",
      "Add New Employee",
      "Add New Department",
      "Add New Role",
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
          break;
          
          default:
            break;
          }
  } 
  catch (err) {
    console.log(err);
  }
};
        
const viewAllDepartments = async () => {
  try {
    const departments = await connection.query("SELECT * FROM department", function(err, response) {
      if (err) throw err;
      console.log('\n');
      console.table(response);
      console.log('\n');
    });
    return departments;
  }catch (err) {
    console.log(err);
  }
};

const viewAllRoles = async () => {
    try {
    const roles = await connection.query("SELECT * FROM role", function(err, response) {
      if (err) throw err;
      console.log('\n');
      console.table(response);
      console.log('\n');
      connection.end()
    });
  }catch (err) {
    console.log(err);
  }
}   
        
const getRoles = () => {
  let roles = [];
  connection.query("SELECT title, id FROM role", (err, res) => {
    if (err) throw err;
    //console.log(res);
    for (i in res) {
      //console.log(res[i]);
    }
    roles = res.filter((el) => (el));    
  })
  console.log(roles);
};

const addEmployeePrompt = async () => {
  connection.query("SELECT title, id FROM role", (err, result1) => {
    if (err) throw err;
    console.log(result1);
    let roles = result1.map((el) => ` ${el.title} : ${el.id}`);
    console.log(roles);
    connection.query("SELECT first_name, last_name, id FROM employee", async (err, result2) => {
      if (err) throw err;
      let managers = result2.map((el) => `${el.first_name} ${el.last_name}`)
      try{
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
        choices: roles
      },
      {
        name: "manager",
        type: "rawlist",
        message: "Please select the employee's manager",
        choices: managers
      }
    ])
    .then ( (answers) => {
        console.log(answers)
    })
      //let dbResponse = saveEmployee(employeeData);
      
      //return dbResponse;
    } catch (err){
      console.log(err);
    }
  })
  })
};

const saveEmployee = ({first, last, role, manager}) => {
  let roleInt = parseInt(role);
  let managerInt = parseInt(manager);
  connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [first, last, roleInt, managerInt], function(err, response){
    if (err) throw err;
  });
  return (`Employee ${first} ${last} saved`);
};


const addDepartmentPrompt = async () => {
  try{
    const departmentData = await
    inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Please enter the new department name"
      }
    ]
  )
  let dbResponse = await saveDepartment(departmentData);

  return dbResponse;
} catch (err){
  console.log(err);
}
};

const saveDepartment = ({name}) => {
  connection.query("INSERT INTO department (name) VALUES (?)", [name], function(err, response){
    if (err) throw err;
  });
  return (`Department ${name} saved`);
};


const addRolePrompt = async () => {
  try{
    connection.query("SELECT * from department", async (err, results) => {
      if (err) throw err;
      let departments = results.map((department) => department.name );
      const newRolePrompt = async () => {
       await inquirer
        .prompt([
        {
          name: "name",
          type: "input",
          message: "Please enter the new role name"
        },
        {
          name: "salary",
          type: "input",
          message: "Please enter the salary for this role"
          //validate: checkIfNum()
        },
        {
          name: "department",
          type: "rawlist",
          message: "Please select the department to which this role belongs",
          choices: departments
        }
      ]
      ).then((newRole) => {
          return newRole;
     })    
      //return dbResponse;
    }
      let newRole = await newRolePrompt();
      console.log(newRole);

    })
    } catch (err){
      console.log(err);
    }
  };

const saveRole = ({name, salary, department}) => {
  let salaryInt = parseInt(salary);
  let departmentInt = parseInt(department);
  connection.query("INSERT INTO role (name, salary, department_id) VALUES (?, ?, ?)", [name, salaryInt, departmentInt], function(err, response){
    if (err) throw err;
  });
  return (`Department ${name} saved`);
};

const removeEmployee = () => {
  connection.query("SELECT first_name, last_name, id FROM employee", (err, results) => {
    if (err) throw err;
    let employees = results.map((employee) => (employee.first_name + " " + employee.last_name));
    inquirer.prompt([
      {
        type: "rawlist",
        name: "employeeToRemove",
        choices: employees
      }])
      .then(answer => {
      console.log(answer);
      let empId;
      for (i in results) {
        if ((results[i].first_name + " " + results[i].last_name) === employeeToRemove) {
          empId = results[i].id;
          console.log(empId);
        }
      }
      connection.query("DELETE FROM employee WHERE id = ?", [empId], (err, response) => {
        if (err) throw err;
        console.log(response);
      })
    }).catch(error => {
      console.log(error);
    })
  });
};