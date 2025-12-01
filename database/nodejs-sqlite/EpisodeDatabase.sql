PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE time(
time_id INT PRIMARY KEY NOT NULL,
start_date DATETIME,
end_date DATETIME);
INSERT INTO time VALUES(1,'2003-11-02 12:00:00.0000','2019-04-15 12:00:00.0000');
INSERT INTO time VALUES(2,'1989-07-05 12:00:00.0000','1998-05-14 12:00:00.0000');
CREATE TABLE show(
show_id INT PRIMARY KEY NOT NULL,
name VARCHAR(90) NOT NULL,
id_time INT);
INSERT INTO show VALUES(1,'Arrested Development',1);
INSERT INTO show VALUES(2,'Seinfeld',2);
CREATE TABLE genre(
genre_id INT PRIMARY KEY NOT NULL,
genre1 VARCHAR(45),
genre2 VARCHAR(45),
genre3 VARCHAR(45));
INSERT INTO genre VALUES(1,'komēdija','satīra',NULL);
INSERT INTO genre VALUES(2,'komēdija','dzīves šķēle',NULL);
CREATE TABLE story(
story_id INT PRIMARY KEY NOT NULL,
element1 VARCHAR(45),
element2 VARCHAR(45),
element3 VARCHAR(45));
INSERT INTO story VALUES(2,'Zivis','Golfs','Elektroniskais organizētājs');
INSERT INTO story VALUES(1,'Balle','Krāpšana','Pirāti');
CREATE TABLE theme(
theme_id INT PRIMARY KEY NOT NULL,
theme1 VARCHAR(45),
theme2 VARCHAR(45),
theme3 VARCHAR(45));
INSERT INTO theme VALUES(1,'Ģimene','Melošana','Bagātība');
INSERT INTO theme VALUES(2,'Melošana','Attiecības',NULL);
CREATE TABLE episode(
episode_id INT PRIMARY KEY NOT NULL,
name VARCHAR(90),
date DATETIME,
season TINYINT,
episode TINYINT,
id_show INT);
INSERT INTO episode VALUES(1,'Pilot','2003-11-02 12:00:00.0000',1,1,1);
INSERT INTO episode VALUES(2,'The Marine Biologist','1994-02-10 12:00:00.0000',5,14,2);
COMMIT;