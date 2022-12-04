create database marks;

\c marks;

CREATE USER admin WITH SUPERUSER PASSWORD 'almight';

CREATE TABLE users (
	roll varchar(256) PRIMARY KEY,
	name  varchar(256) NOT NULL,
	email VARCHAR(256) NOT NULL,
	password varchar(256) NOT NULL
);

CREATE TABLE marks (
	roll varchar(256) REFERENCES users("roll"),
	lab  real,
	midsem real,
	project real,
	endsem real
);


INSERT INTO users values
	('22M0826','Abhishek','22M0826@email.com','22M0826'),
	('22M0827','Sameer','22M0827@email.com','22M0827'),
	('22M0828','Kratos','22M0828@email.com','22M0828');
	
INSERT INTO marks values 
	('22M0826',10,11,12,13),
	('22M0827',20,21,22,23),
	('22M0828',30,31,32,33);
	

