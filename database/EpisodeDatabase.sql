PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

CREATE TABLE time(
time_id INT PRIMARY KEY NOT NULL,
start_date DATETIME,
end_date DATETIME
);

INSERT INTO time VALUES(1,'2003-11-02','2019-04-15');
INSERT INTO time VALUES(2,'1989-07-05','1998-05-14');
INSERT INTO time VALUES(3,'2017-07-28','2020-10-09');
INSERT INTO time VALUES(4,'2019-03-15','pašreiz');
INSERT INTO time VALUES(5,'2014-02-05','2024-06-12');
INSERT INTO time VALUES(6,'2013-02-28','2017-11-09');

CREATE TABLE genre(
genre_id INT PRIMARY KEY NOT NULL,
genre1 VARCHAR(45),
genre2 VARCHAR(45),
genre3 VARCHAR(45)
);

INSERT INTO genre VALUES(1,'Komēdija',NULL,NULL);
INSERT INTO genre VALUES(2,'Komēdija',NULL,NULL);
INSERT INTO genre VALUES(3,'Komēdija','Drāma','Šausmas');
INSERT INTO genre VALUES(4,'Drāma','Ass sižets','Komēdija');
INSERT INTO genre VALUES(5,'Komēdija','Šausmas',NULL);
INSERT INTO genre VALUES(6,'Komēdija','Realitātes',NULL);

CREATE TABLE story(
story_id INT PRIMARY KEY NOT NULL,
element1 VARCHAR(45),
element2 VARCHAR(45),
element3 VARCHAR(45)
);

INSERT INTO story VALUES(2,'Valis','Golfs','Elektroniskais organizētājs');
INSERT INTO story VALUES(1,'Balle','Krāpšana','Pirāti');
INSERT INTO story VALUES(3,'Marihuāna','Reibonis','Policija');
INSERT INTO story VALUES(4,'Elle','Darījums ar velnu','Nožēlošana');
INSERT INTO story VALUES(5,'Roboti','Kaķi','Postapokalipse');
INSERT INTO story VALUES(6,'Cīņas','Atriebība','Distopija');
INSERT INTO story VALUES(7,'Liecinieks','Bēgšana','Cilpa');
INSERT INTO story VALUES(8,'Briesmonis','Iztēle','Noslēpums');
INSERT INTO story VALUES(9,'Citplanētieši','Mehāniskie tērpi','Zemes aizsardzība');
INSERT INTO story VALUES(10,'Kaķi','Vampīri','Algotņi');
INSERT INTO story VALUES(11,'Jogurts','Eksperimenti','Pārņemšana');
INSERT INTO story VALUES(12,'Kosmoss','Piecelšanās pākstā','Kļūda');
INSERT INTO story VALUES(13,'Dators','90-tie','Tehniskais atbalsts');
INSERT INTO story VALUES(14,'Videospēle','Bērnības draugi','Sadarbošanās');
INSERT INTO story VALUES(15,'Muzikants','Atzīšanās','Mazs koncerts');
INSERT INTO story VALUES(16,'90-tie','Neparedzētas sekas','Paslēpts');
INSERT INTO story VALUES(17,'Spēle','Skapis','Noslēpumi');
INSERT INTO story VALUES(18,'Kakas garšas jogurts','Darba intervija','Bezmaksa picas');

CREATE TABLE theme(
theme_id INT PRIMARY KEY NOT NULL,
theme1 VARCHAR(45),
theme2 VARCHAR(45),
theme3 VARCHAR(45)
);

INSERT INTO theme VALUES(1,'Disfunkcionāla ģimene','Melošana','Bagātības zaudēšana');
INSERT INTO theme VALUES(2,'Ikdienas novērojumi','Attiecības','Narcisms');
INSERT INTO theme VALUES(3,'Trauma','Fantāzija','Pudeles epizodes');
INSERT INTO theme VALUES(4,'Mīlestība','Nāve','Roboti');
INSERT INTO theme VALUES(5,'Sižeta pavērsieni','Pudeles epizodes','Ikdienišķums');
INSERT INTO theme VALUES(6,'Komercdarbība','Muļķīgi plāni','Parodija');

CREATE TABLE episode(
episode_id INT PRIMARY KEY NOT NULL,
name VARCHAR(90),
date DATETIME,
season TINYINT,
episode TINYINT,
genre VARCHAR(30),
id_show INT,
id_story INT,
favourite INT
);

INSERT INTO episode VALUES(1,'Pilot','2003-11-02',1,1,'Komēdija',1,1,0);
INSERT INTO episode VALUES(2,'The Marine Biologist','1994-02-10',5,14,'Komēdija',2,2,0);
INSERT INTO episode VALUES(3,'Pier Pressure','2004-01-11',1,10,'Komēdija',1,3,0);
INSERT INTO episode VALUES(4,'Crossroads','2019-11-22',3,11,'Komēdija-drāma',3,4,0);
INSERT INTO episode VALUES(5,'Three Robots','2019-03-15',1,2,'Komēdija',4,5,0);
INSERT INTO episode VALUES(6,'Sonnie''s Edge','2019-03-15',1,1,'Ass sižets',4,6,0);
INSERT INTO episode VALUES(7,'The Witness','2019-03-15',1,3,'Ass sižets',4,7,0);
INSERT INTO episode VALUES(8,'Ralphie','2017-07-28',1,1,'Šausmas',3,8,0);
INSERT INTO episode VALUES(9,'Suits','2019-03-15',1,4,'Ass sižets',4,9,0);
INSERT INTO episode VALUES(10,'Sucker of Souls','2019-03-15',1,5,'Ass sižets',4,10,0);
INSERT INTO episode VALUES(11,'When The Yogurt Took Over','2019-03-15',1,6,'Komēdija',4,11,0);
INSERT INTO episode VALUES(12,'Beyond the Aquila Rift','2019-03-15',1,7,'Drāma',4,12,0);
INSERT INTO episode VALUES(13,'The Internet','2017-08-25',1,5,'Drāma',3,13,0);
INSERT INTO episode VALUES(14,'The Night Babby Died','2020-09-25',4,10,'Drāma',3,14,0);
INSERT INTO episode VALUES(15,'The Murderer','2020-07-24',4,1,'Drāma',3,15,0);
INSERT INTO episode VALUES(16,'Foam Party','2020-09-04',4,7,'Šausmas',3,16,0);
INSERT INTO episode VALUES(17,'Sardines','2014-02-05',1,1,'Komēdija',5,17,0);
INSERT INTO episode VALUES(18,'Yogurt Shop / Pizzeria','2013-02-28',1,1,'Realitātes-komēdija',6,18,0);

CREATE TABLE show (
	show_id	INT PRIMARY KEY NOT NULL,
	name	VARCHAR(90) NOT NULL,
	id_time	INT,
	logo	TINYTEXT,
	id_genre INT,
	id_theme INT,
	favourite INT
);

INSERT INTO show VALUES(1,'Arrested Development',1,'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Arrested_Development.svg/2560px-Arrested_Development.svg.png',1,1,0);
INSERT INTO show VALUES(2,'Seinfeld',2,'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Seinfeld_logo.svg/2560px-Seinfeld_logo.svg.png',2,2,0);
INSERT INTO show VALUES(3,'Room 104',3,'https://upload.wikimedia.org/wikipedia/en/d/d5/Room_104_teaser.png',3,3,0);
INSERT INTO show VALUES(4,'Love, Death and Robots',4,'https://upload.wikimedia.org/wikipedia/en/c/cb/Love%2C_Death_%26_Robots_Logo.png',4,4,0);
INSERT INTO show VALUES(5,'Inside No. 9',5,'https://upload.wikimedia.org/wikipedia/en/c/ce/Inside_No._9_series_one_DVD_cover.jpg',5,5,0);
INSERT INTO show VALUES(6,'Nathan For You',6,'https://upload.wikimedia.org/wikipedia/en/d/db/Nathan_For_You_title.png',6,6,0);
COMMIT;