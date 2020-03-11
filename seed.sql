DROP DATABASE IF EXISTS human_resources_data; -- drop if exists, then create --
CREATE DATABASE human_resources_data;

USE human_resources_data;

CREATE TABLE IF NOT EXISTS department (
	id INT AUTO_INCREMENT NOT NULL
    , name VARCHAR(30)
    , PRIMARY KEY (id)
); 

CREATE TABLE IF NOT EXISTS role (
	id INT AUTO_INCREMENT NOT NULL
    , title VARCHAR(30)
    , salary DECIMAL
    , department_id INT NOT NULL
    , FOREIGN KEY (department_id) REFERENCES department(id) 
    , PRIMARY KEY (id)
); 

CREATE TABLE IF NOT EXISTS employee (
	id INT AUTO_INCREMENT NOT NULL
    , first_name VARCHAR(30)
	, last_name VARCHAR(30)
    , role_id INT NOT NULL
    , manager_id INT
    , FOREIGN KEY (role_id) REFERENCES role(id),
    , FOREIGN KEY (manager_id) REFERENCES employee(id) 
    , PRIMARY KEY (id)
); 

INSERT INTO department ( name ) VALUES ( "Executive Leadership"); 
INSERT INTO department ( name ) VALUES ( "Human Resources"); 
INSERT INTO department ( name ) VALUES ( "Engineering"); 
INSERT INTO department ( name ) VALUES ( "Accounting"); 
INSERT INTO department ( name ) VALUES ( "Sales"); 
INSERT INTO department ( name ) VALUES ( "Marketing"); 


INSERT INTO role (title, salary, department_id) VALUES ("CEO", 1, 1);
INSERT INTO role (title, salary, department_id) VALUES ("CTO", 1, 1);
INSERT INTO role (title, salary, department_id) VALUES ("VP, Human Resources", 2, 1);
INSERT INTO role (title, salary, department_id) VALUES ("VP, Product Engineering", 3, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Lead Engineer", 3, 1);
INSERT INTO role (title, salary, department_id) VALUES ("VP, Accounting", 4, 1);
INSERT INTO role (title, salary, department_id) VALUES ("VP, Sales", 5, 1);
INSERT INTO role (title, salary, department_id) VALUES ("VP, Marketing", 6, 1);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ( "Shawn", "Wright", 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ( "Jim", "Bob", 2, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ( "Toby", "Henderson", 3, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ( "Princess", "Peach", 4, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ( "Elon", "Musk", 5, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ( "Adam", "Upright", 6, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ( "Vince", "ShamWow", 7, 1);
