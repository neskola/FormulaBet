CREATE TABLE RESULTS
(
	r_id int NOT NULL,
	r_type int NOT NULL,
	r_pos int NOT NULL,
	r_driver_id int NOT NULL,
	r_gp_id int NOT NULL,
	UNIQUE(r_id),
	CONSTRAINT r_id PRIMARY KEY (r_id),
	FOREIGN KEY (r_gp_id) REFERENCES CIRCUITS(gp_id),
	FOREIGN KEY (r_driver_id) REFERENCES DRIVERS(d_id)
)

CREATE TABLE BETS
(
	b_id int NOT NULL,
	b_type int NOT NULL,
	b_pos int NOT NULL,
	b_driver_id int NOT NULL,
	b_gp_id int NOT NULL,
	b_user_id int NOT NULL,
	UNIQUE(b_id),
	CONSTRAINT b_id PRIMARY KEY (b_id),
	FOREIGN KEY (b_gp_id) REFERENCES CIRCUITS(gp_id),
	FOREIGN KEY (b_driver_id) REFERENCES DRIVERS(d_id),
	FOREIGN KEY (b_user_id) REFERENCES USERS(u_id)
)