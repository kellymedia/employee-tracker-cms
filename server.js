const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "helloworld",
  database: "employee_trackerDB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  runQuery();
});

const runQuery = () =>
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "What would you like to do? (Use Arrow Keys)",
        choices: [
          "View All Employees",
          "View All Departments",
          "View All Roles",
          "Add Employee",
          "Add Department",
          "Add Role",
          "Update Employee Role",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Departments":
          viewAllDepartments();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRole();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });

const viewAllEmployees = () => {
  connection.query(
    `
    SELECT 
        employee.id, 
        employee.first_name AS 'First Name',
        employee.last_name AS 'Last Name',
        role.title AS 'Title',
        department.name AS 'Department',
        role.salary AS 'Salary',
        CONCAT(e.first_name , ' ' , e.last_name) AS 'Manager'
    FROM employee 
    INNER JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee e ON employee.manager_id = e.id
    ORDER BY employee.id;
    `,
    (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table(res);
      runQuery();
    }
  );
};

const viewAllDepartments = () =>
  connection.query(
    "SELECT id, name AS department FROM department",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      runQuery();
    }
  );

const viewAllRoles = () => {
  connection.query(
    `
    SELECT 
        role.id,
        role.title AS 'Title',
        role.salary AS 'Salary',
        department.name AS 'Department'
    FROM role
    LEFT JOIN department ON role.department_id = department.id;
    `,
    (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table(res);
      runQuery();
    }
  );
};

const addEmployee = () =>
  inquirer
    .prompt([
      {
        message: "Enter first name of new employee:",
        type: "input",
        name: "employeeFirstName",
      },
      {
        message: "Enter last name of new employee:",
        type: "input",
        name: "employeeLastName",
      },
      {
        message: "Enter Role ID of new employee:",
        type: "input",
        name: "employeeRole",
      },
      {
        message: "Enter Manager ID of new employee:",
        type: "input",
        name: "employeeManagerId",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.employeeFirstName,
          last_name: answer.employeeLastName,
          role_id: answer.employeeRole,
          manager_id: answer.employeeManagerId,
        },
        function (err, res) {
          if (err) throw err;
          console.log(
            `You have entered ${answer.employeeFirstName} ${answer.employeeLastName} in the employee database.`
          );
          runQuery();
        }
      );
    });

const addDepartment = () =>
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "What department would you like to add?",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        answer.deptName,
        function (err, res) {
          if (err) throw err;
          console.log(
            `You have entered ${answer.deptName} into your department database.`
          );
          runQuery();
        }
      );
    });

const addRole = () =>
  inquirer
    .prompt([
      {
        type: "input",
        name: "addRole",
        message: "What role would you like to add?",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary for this role?",
      },
      {
        type: "input",
        name: "departmentID",
        message: "What is this role's department id?",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.addRole,
          salary: answer.roleSalary,
          department_id: answer.departmentID,
        },
        function (err, res) {
          if (err) throw err;
          console.log(
            `You have entered ${answer.addRole} into your role database.`
          );
          runQuery();
        }
      );
    });

const updateEmployeeRole = () => {
  const employeeArray = [];
  const roleArray = [];
  connection.query(
    `SELECT CONCAT (employee.first_name, ' ', employee.last_name) as employee FROM employee_trackerDB.employee`,
    (err, res) => {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        employeeArray.push(res[i].employee);
      }
      connection.query(
        `SELECT title FROM employee_trackerDB.role`,
        (err, res) => {
          if (err) throw err;
          for (let i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
          }

          inquirer
            .prompt([
              {
                name: "name",
                type: "list",
                message: `Who's role would you like to change?`,
                choices: employeeArray,
              },
              {
                name: "role",
                type: "list",
                message: "What would you like to change their role to?",
                choices: roleArray,
              },
            ])
            .then((answers) => {
              let currentRole;
              const name = answers.name.split(" ");
              connection.query(
                `SELECT id FROM employee_trackerDB.role WHERE title = '${answers.role}'`,
                (err, res) => {
                  if (err) throw err;
                  for (let i = 0; i < res.length; i++) {
                    currentRole = res[i].id;
                  }
                  connection.query(
                    `UPDATE employee_trackerDB.employee SET role_id = ${currentRole} WHERE first_name= '${name[0]}' AND last_name= '${name[1]}';`,
                    (err, res) => {
                      if (err) throw err;
                      console.log(`You have successfully upated the role.`);
                      runQuery();
                    }
                  );
                }
              );
            });
        }
      );
    }
  );
};
