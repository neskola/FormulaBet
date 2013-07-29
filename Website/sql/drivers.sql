CREATE TABLE DRIVERS 
(
	d_id int NOT NULL,
	d_name varchar(64),
	UNIQUE(d_id)
	CONSTRAINT d_id PRIMARY KEY (d_id)
)