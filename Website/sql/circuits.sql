CREATE TABLE CIRCUITS 
(
	gp_id int NOT NULL,
	gp_name varchar(64),
	gp_year int NOT NULL,
	gp_number int NOT NULL,
	gp_date TIMESTAMP NOT NULL,
	gp_qual_date TIMESTAMP NOT NULL,	
	gp_info varchar(512),
	UNIQUE (gp_id),
	CONSTRAINT gp_id PRIMARY KEY (gp_id)
)
