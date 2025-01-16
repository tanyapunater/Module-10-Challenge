import { pool } from './connection.js';

// this is the class of all the functions of queries that will access the database
// remember to import this into the index.ts file in the src folder
export default class Db {
    constructor() {}

        async query(sql: string, args: any[] = []) {
            const client = await pool.connect();
            try {
                const result = await client.query(sql, args);
                return result;
            } finally { 
                client.release();
            }
        }

        // async functions 
        // (to be called in the index.ts src file in the inquirer prompts)

        async viewAllDepartments() {
            return this.query(`SELECT * FROM departments;`);
        }

        async viewAllRoles() {
            return this.query(
                `SELECT roles.id, roles.title, departments.name AS department, roles.salary
                FROM roles
                LEFT JOIN departments ON roles.department_id = departments.id;`
            );
        }

        async viewAllEmployees() {
            return this.query(
                `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, 
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                FROM employees 
                LEFT JOIN roles ON employees.role_id = roles.id 
                LEFT JOIN departments ON roles.department_id = departments.id 
                LEFT JOIN employees manager ON employees.manager_id = manager.id;`
            );
        }

        

        async addEmployee (employee: any) {
            const { first_name, last_name, role_id, manager_id } = employee;
            return this.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [first_name, last_name, role_id, manager_id]);
            
        }

        
        async addDepartment(department: any) {
            const { name } = department;
            return this.query(`INSERT INTO departments (name) VALUES ($1)`, [name]);

        }


        async addRole(role: any, departmentId: number) {
            const { title, salary } = role;
            return this.query(`INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)`, [title, salary, departmentId]);
        }

        async updateEmployeeRole(employeeId: number, roleId: number) {
            return this.query(`UPDATE employees SET role_id = $1 WHERE id = $2`, [roleId, employeeId]);
        }


        // extra functions
        async updateEmployeeManager(employeeId: number, managerId: number) {
            return this.query(`UPDATE employees SET manager_id = $1 WHERE id = $2`, [managerId, employeeId]);
        }

        async deleteEmployee(employeeId: number) {
            return this.query(`DELETE FROM employees WHERE id = $1`, [employeeId]);
        }

        async deleteRole(roleId: number) {
            return this.query(`DELETE FROM roles WHERE id = $1`, [roleId]);
        }

        async deleteDepartment(departmentId: number) {
            return this.query(`DELETE FROM departments WHERE id = $1`, [departmentId]);
        }

    


        // functions to handle insertions
        

        async handleAddDepartment() {
            return this.query('SELECT setval(\'departments_id_seq\', (SELECT MAX(id) FROM departments));');
        }

        async handleAddRole() {
            return this.query('SELECT setval(\'roles_id_seq\', (SELECT MAX(id) FROM roles));');
        }

        async handleAddEmployee() {
            return this.query('SELECT setval(\'employees_id_seq\', (SELECT MAX(id) FROM employees));');
        }

        async handleAddEmployeeRole() {
            return this.query('SELECT setval(\'employees_id_seq\', (SELECT MAX(id) FROM employees));');
        }



}