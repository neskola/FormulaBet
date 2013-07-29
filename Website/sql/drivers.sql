CREATE TABLE DRIVERS 
(
	d_id int NOT NULL,
	d_name varchar(64),
	d_team varchar(64),
	d_imgsrc varchar(255),
	UNIQUE(d_id)
	CONSTRAINT d_id PRIMARY KEY (d_id)
)