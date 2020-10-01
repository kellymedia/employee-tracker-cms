USE employee_trackerDB;
-- Department Seeds --
INSERT INTO department (id, name)
VALUES (1, 'Leadership');
INSERT INTO department (id, name)
VALUES (2, 'Engineering');
INSERT INTO department (id, name)
VALUES (3, 'Talent Aquisition');
INSERT INTO department (id, name)
VALUES (4, 'Research');
INSERT INTO department (id, name)
VALUES (5, 'Sales');
-- Role Seeds --
INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 850000, 1),
    ("Lead Engineer", 325000, 2),
    ("Engineer", 250000, 2),
    ("Talent Aquisition Lead", 300000, 3),
    ("Recruiter", 110000, 3),
    ("Research Lead", 120000, 4),
    ("Researcher", 85000, 4),
    ("Sales Lead", 150000, 5),
    ("Salesperson", 110000, 5);
-- Employee Seeds --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Stewart', 'Butterfield', 1, null),
    ('Matt', 'Gallivan', 3, 2),
    ('Martin', 'Franco', 4, 1),
    ('Denise', 'Cook', 5, 4),
    ('Sean', 'Davidson', 6, 1),
    ('Stacy', 'Lane', 7, 6),
    ('Tim', 'Aston', 8, 1),
    ('Pat', 'Gatsby', 9, 8);