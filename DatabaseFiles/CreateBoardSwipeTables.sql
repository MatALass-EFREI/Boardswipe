CREATE TABLE User_(
   id_user INT AUTO_INCREMENT ,
   userName VARCHAR(255),
   userEmail VARCHAR(255),
   userPassword VARCHAR(255),
   userDescription VARCHAR(255),
   PRIMARY KEY(id_user)
);

CREATE TABLE Guild(
   id_guild INT,
   guildName VARCHAR(255) NOT NULL,
   PRIMARY KEY(id_guild)
);

CREATE TABLE Message(
   id_chat VARCHAR(50),
   message_text VARCHAR(50),
   message_date VARCHAR(50),
   id_guild INT NOT NULL,
   id_user INT NOT NULL,
   PRIMARY KEY(id_chat),
   FOREIGN KEY(id_guild) REFERENCES Guild(id_guild),
   FOREIGN KEY(id_user) REFERENCES User_(id_user)
);

CREATE TABLE Quiz(
   id_quiz VARCHAR(50),
   Quiz_title VARCHAR(50),
   PRIMARY KEY(id_quiz)
);

CREATE TABLE GameCategory (
   IdCategory VARCHAR(255),
   CategoryName VARCHAR(255),
   PRIMARY KEY(IdCategory)
);

CREATE TABLE GamePublisher(
   IdPublisher VARCHAR(255),
   PublisherName VARCHAR(255),
   PRIMARY KEY(IdPublisher)
);

CREATE TABLE Game(
   id_game INT,
   gameName VARCHAR(255),
   gameDescription Text,
   gameYearPublished BIGINT,
   gameMinPlayers INT,
   gameMaxPlayers INT,
   gamePlayingTime INT,
   gameMinAge INT,
   gamePublisher VARCHAR(255),
   gameUrl VARCHAR(255),
   rankRating INT,
   avgRating DECIMAL(15,2),
   nbUserRating INT,
   id_quiz VARCHAR(50) NOT NULL,
   PRIMARY KEY(id_game),
   FOREIGN KEY(id_quiz) REFERENCES Quiz(id_quiz)
);

CREATE TABLE Comment(
   id_comment INT,
   commentText VARCHAR(1275),
   commentDate DATE,
   commentRating INT,
   id_game INT NOT NULL,
   id_user INT NOT NULL,
   PRIMARY KEY(id_comment),
   FOREIGN KEY(id_game) REFERENCES Game(id_game),
   FOREIGN KEY(id_user) REFERENCES User_(id_user)
);

CREATE TABLE UserBelongsToGuild(
   id_user INT,
   id_guild INT,
   role VARCHAR(50),
   PRIMARY KEY(id_user, id_guild),
   FOREIGN KEY(id_user) REFERENCES User_(id_user),
   FOREIGN KEY(id_guild) REFERENCES Guild(id_guild)
);

CREATE TABLE FavoriteGame(
   id_game INT,
   id_user INT,
   PRIMARY KEY(id_game, id_user),
   FOREIGN KEY(id_game) REFERENCES Game(id_game),
   FOREIGN KEY(id_user) REFERENCES User_(id_user)
);

CREATE TABLE UserLeaderBoard(
   id_user INT,
   id_quiz VARCHAR(50),
   score VARCHAR(50),
   rank_ VARCHAR(50),
   PRIMARY KEY(id_user, id_quiz),
   FOREIGN KEY(id_user) REFERENCES User_(id_user),
   FOREIGN KEY(id_quiz) REFERENCES Quiz(id_quiz)
);

CREATE TABLE Swipe(
   id_game INT,
   id_user INT,
   PRIMARY KEY(id_game, id_user),
   FOREIGN KEY(id_game) REFERENCES Game(id_game),
   FOREIGN KEY(id_user) REFERENCES User_(id_user)
);

CREATE TABLE Category(
   id_game INT,
   IdCategory VARCHAR(50),
   PRIMARY KEY(id_game, IdCategory),
   FOREIGN KEY(id_game) REFERENCES Game(id_game),
   FOREIGN KEY(IdCategory) REFERENCES GameCategory(IdCategory)
);

CREATE TABLE Publisher(
   id_game INT,
   IdPublisher VARCHAR(50),
   PRIMARY KEY(id_game, IdPublisher),
   FOREIGN KEY(id_game) REFERENCES Game(id_game),
   FOREIGN KEY(IdPublisher) REFERENCES GamePublisher(IdPublisher)
);

CREATE TABLE login_logs (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    login_time DATETIME NOT NULL,
    FOREIGN KEY (id_user) REFERENCES user_(id_user) ON DELETE CASCADE
);

CREATE TABLE description_logs (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    description TEXT NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (id_user) REFERENCES user_(id_user) ON DELETE CASCADE
);

ALTER TABLE swipe
ADD COLUMN result INTEGER CHECK (result IN (0, 1, 2));

ALTER TABLE quiz
ADD COLUMN questions JSON;

ALTER TABLE Message DROP FOREIGN KEY Message_ibfk_1;
ALTER TABLE UserBelongsToGuild DROP FOREIGN KEY UserBelongsToGuild_ibfk_2;

ALTER TABLE Guild DROP PRIMARY KEY;

ALTER TABLE Guild MODIFY COLUMN id_guild INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE Message ADD CONSTRAINT Message_ibfk_1 FOREIGN KEY (id_guild) REFERENCES Guild(id_guild);
ALTER TABLE UserBelongsToGuild ADD CONSTRAINT UserBelongsToGuild_ibfk_2 FOREIGN KEY (id_guild) REFERENCES Guild(id_guild);


INSERT INTO quiz (id_quiz, Quiz_title, questions)
VALUES (
  1,
  'Quiz jeux de société - général',
  '[
    {
      "text": "Comment gagne-t-on à Uno?",
      "options": ["En accumulant le plus de cartes", "En se débarrassant de toutes ses cartes", "En obtenant 50 points", "En ayant une carte spéciale"],
      "answer": 1,
      "feedback": "Pour gagner à Uno, il faut être le premier à ne plus avoir de cartes."
    },
    {
      "text": "Quelle est la condition de victoire aux échecs?",
      "options": ["Capturer toutes les pièces de l\'adversaire", "Mettre le roi adverse en échec et mat", "Atteindre l\'autre côté de l\'échiquier", "Jouer 20 coups sans capture"],
      "answer": 1,
      "feedback": "L\'objectif aux échecs est de mettre le roi adverse en échec et mat."
    },
    {
      "text": "Combien de wagons faut-il pour jouer à Les Aventuriers du Rail ?",
      "options": ["20", "35", "45", "60"],
      "answer": 2,
      "feedback": "Chaque joueur commence avec 45 wagons dans Les Aventuriers du Rail."
    },
    {
      "text": "Dans le jeu Catan, que faut-il pour construire une ville ?",
      "options": ["2 blés, 3 pierres", "1 blé, 1 pierre, 2 moutons", "3 argiles, 2 bois", "4 moutons"],
      "answer": 0,
      "feedback": "Pour construire une ville dans Catan, vous avez besoin de 2 blés et 3 pierres."
    },
    {
      "text": "Comment déclenche-t-on la fin d’une partie de Monopoly ?",
      "options": ["Quand un joueur fait faillite", "Quand toutes les propriétés sont achetées", "Après 3 tours de plateau", "Quand une rue a un hôtel"],
      "answer": 0,
      "feedback": "Une partie de Monopoly se termine généralement lorsqu\'un joueur fait faillite."
    },
    {
      "text": "Dans 7 Wonders, combien d\'âges composent une partie ?",
      "options": ["1", "2", "3", "4"],
      "answer": 2,
      "feedback": "Une partie de 7 Wonders se joue en 3 âges."
    },
    {
      "text": "Quel est le but dans Terraforming Mars ?",
      "options": ["Explorer la planète", "Construire des villes", "Élever des animaux", "Augmenter les paramètres globaux comme température et oxygène"],
      "answer": 3,
      "feedback": "Le but est de terraformer Mars en augmentant température, oxygène et couverture océanique."
    },
    {
      "text": "Dans Carcassonne, comment gagne-t-on des points ?",
      "options": ["En construisant des routes, villes et champs", "En capturant des pièces", "En lançant des dés", "En bluffant les adversaires"],
      "answer": 0,
      "feedback": "Les points sont gagnés grâce aux routes, villes, monastères et champs contrôlés par les partisans."
    },
    {
      "text": "Quel type de jeu est Love Letter ?",
      "options": ["Un jeu de stratégie militaire", "Un jeu de deck-building", "Un jeu de déduction avec élimination", "Un jeu de rôle coopératif"],
      "answer": 2,
      "feedback": "Love Letter est un jeu de déduction où il faut survivre jusqu’à la fin avec la carte la plus forte."
    },
    {
      "text": "Dans Dixit, que fait le conteur ?",
      "options": ["Il lit une carte à haute voix", "Il donne un indice sur sa carte", "Il choisit une couleur", "Il tire un dé pour avancer"],
      "answer": 1,
      "feedback": "Le conteur choisit une de ses cartes et donne un indice pour que certains, mais pas tous, la reconnaissent."
    }
  ]'
);