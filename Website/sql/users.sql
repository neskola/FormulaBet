CREATE TABLE USERS 
(
	u_id int NOT NULL,
	u_name varchar (8) NOT NULL,
	u_password varchar(48) NOT NULL,
	u_fullname varchar(32),
	u_email varchar(64),
	u_onetimepass boolean,
	UNIQUE (u_id),
	CONSTRAINT u_id PRIMARY KEY (u_id)
)