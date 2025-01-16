import inquirer from 'inquirer';
import logo from 'asciiart-logo';
import Db from './db/index.js';
const db = new Db();
init();
function init() {
    const logoText = logo({ name: 'Employee Manager' }).render();
    console.log(logoText);
    loadMainPrompts();
}
function loadMainPrompts() {
    inquirer
        .prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                { name: 'View All Departments', value: 'VIEW_DEPARTMENTS' },
                { name: 'Add a Department', value: 'ADD_DEPARTMENT' },
                { name: 'Delete a Department', value: 'DELETE_DEPARTMENT' }, // TO DO
                { name: 'View All Roles', value: 'VIEW_ROLES' },
                { name: 'Add a Role', value: 'ADD_ROLE' },
                { name: 'Remove a Role', value: 'DELETE_ROLE' }, // TO DO
                { name: 'View All Employees', value: 'VIEW_EMPLOYEES' },
                { name: 'Add an Employee', value: 'ADD_EMPLOYEE' },
                { name: 'Fire an Employee', value: 'DELETE_EMPLOYEE' }, // TO DO
                { name: 'Update Employee Role', value: 'UPDATE_EMPLOYEE_ROLE' },
                { name: 'Exit', value: 'EXIT' },
            ],
        },
    ]).then((res) => {
        const choice = res.choice;
        switch (choice) {
            case 'VIEW_DEPARTMENTS':
                viewAllDepartments();
                break;
            case 'ADD_DEPARTMENT':
                addDepartment();
                break;
            case 'DELETE_DEPARTMENT':
                deleteDepartment(); // TO DO
                break;
            case 'VIEW_ROLES':
                viewAllRoles();
                break;
            case 'ADD_ROLE':
                addRole();
                break;
            case 'DELETE_ROLE':
                deleteRole(); // TO DO
                break;
            case 'VIEW_EMPLOYEES':
                viewAllEmployees();
                break;
            case 'ADD_EMPLOYEE':
                addEmployee();
                break;
            case 'UPDATE_EMPLOYEE_ROLE':
                updateEmployeeRole();
                break;
            case 'DELETE_EMPLOYEE':
                deleteEmployee(); // TO DO
                break;
            case 'EXIT':
                console.log('Thank you for using the Employee Manager!');
                process.exit(0);
        }
    });
}
// department functions
function viewAllDepartments() {
    db.viewAllDepartments().then(({ rows }) => {
        const departments = rows;
        console.log('\n');
        console.table(departments);
    }).then(() => loadMainPrompts());
}
async function addDepartment() {
    inquirer
        .prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?',
        },
    ]).then((res) => {
        const department = res;
        db.handleAddDepartment().then(() => db.addDepartment(department).then(() => {
            console.log(`Added ${department.name} to the database.`);
        }).then(() => loadMainPrompts()));
    });
}
async function deleteDepartment() {
    const { rows } = await db.viewAllDepartments();
    const departments = rows.map(department => ({ name: department.name, value: department.id }));
    inquirer.prompt([
        {
            type: 'list',
            name: 'department_id',
            message: 'Which department would you like to delete?',
            choices: departments
        }
    ]).then((res) => {
        const departmentId = res.department_id;
        db.deleteDepartment(departmentId).then(() => {
            console.log(`Deleted department with ID ${departmentId} from the database.`);
        }).then(() => loadMainPrompts());
    });
}
// role functions
function viewAllRoles() {
    db.viewAllRoles().then(({ rows }) => {
        const roles = rows;
        console.log('\n');
        console.table(roles);
    }).then(() => loadMainPrompts());
}
async function addRole() {
    inquirer
        .prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?'
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'What is the department ID of the role?'
        },
    ]).then((res) => {
        const role = res;
        db.handleAddRole().then(() => db.addRole(role, role.department_id).then(() => {
            console.log(`Added ${role.title} to the database.`);
        }).then(() => loadMainPrompts()));
    });
}
async function deleteRole() {
    const { rows } = await db.viewAllRoles();
    const roles = rows.map(role => ({ title: role.title, value: role.id }));
    inquirer.prompt([
        {
            type: 'list',
            name: 'role_id',
            message: 'Which role would you like to delete?',
            choices: roles
        }
    ]).then((res) => {
        const roleId = res.role_id;
        db.deleteRole(roleId).then(() => {
            const deletedRole = roles.find(role => role.value === roleId);
            if (deletedRole) {
                console.log(`Deleted role ${deletedRole.title} from the database.`);
            }
            else {
                console.log(`Deleted role with ID ${roleId} from the database.`);
            }
        }).then(() => loadMainPrompts());
    });
}
// employee functions
function viewAllEmployees() {
    db.viewAllEmployees().then(({ rows }) => {
        const employees = rows;
        console.log('\n');
        console.table(employees);
    }).then(() => loadMainPrompts());
}
async function addEmployee() {
    inquirer
        .prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the employee?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of the employee?'
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'What is the role ID of the employee?'
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'What is the manager ID of the employee?'
        },
    ]).then((res) => {
        const employee = res;
        db.handleAddEmployee().then(() => db.addEmployee(employee).then(() => {
            console.log(`Added ${employee.first_name} ${employee.last_name} to the database.`);
        }).then(() => loadMainPrompts()));
    });
}
async function deleteEmployee() {
    const { rows } = await db.viewAllEmployees();
    const employees = rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Which employee would you like to delete?',
            choices: employees
        }
    ]).then((res) => {
        const employeeId = res.employee_id;
        db.deleteEmployee(employeeId).then(() => {
            const deletedEmployee = employees.find(employee => employee.value === employeeId);
            if (deletedEmployee) {
                console.log(`${deletedEmployee.name} has been fired.`);
            }
            else {
                console.log(`DEmployee with ID ${employeeId} has been fired.`);
            }
        }).then(() => loadMainPrompts());
    });
}
// update employee role
async function updateEmployeeRole() {
    inquirer
        .prompt([
        {
            type: 'input',
            name: 'employee_id',
            message: 'What is the employee ID of the employee?'
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'What is the new role ID of the employee?'
        },
    ]).then((res) => {
        const employee = res;
        db.handleAddEmployeeRole().then(() => db.updateEmployeeRole(employee.employee_id, employee.role_id).then(() => {
            console.log(`Updated ${employee.first_name} ${employee.last_name}'s role.`);
        }).then(() => loadMainPrompts()));
    });
}
// view employees by manager
// view employees by department
// view total utilized budget of a department
