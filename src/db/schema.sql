DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

\c employees_db;


CREATE TABLE departments (
    id SERIAL PRIMARY KEY, -- sets id as the primary key
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY, -- sets role id as the primary key
    title VARCHAR(30) UNIQUE NOT NULL,
    department_id INTEGER NOT NULL,
    salary DECIMAL NOT NULL,
    CONSTRAINT fk_department FOREIGN KEY (department_id)
    REFERENCES departments(id) -- department id is linked to the id in the department table
    ON DELETE CASCADE -- when department is deleted, the roles in the department are also deleted
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY, -- sets employee id as the primary key
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    CONSTRAINT fk_role
    FOREIGN KEY (role_id) 
    REFERENCES roles(id) -- role id is linked to the id in the role table
    ON DELETE CASCADE, -- when the role is deleted, the employees associated are also deleted
    manager_id INTEGER,
    CONSTRAINT fk_manager
    FOREIGN KEY (manager_id)
    REFERENCES employees(id) -- manager id is linked to the id in the employee table
    ON DELETE SET NULL -- when the manager is deleted, the manager id is set to null
);

