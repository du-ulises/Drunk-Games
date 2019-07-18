CREATE DATABASE drunk;

USE drunk;

CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(45),
    nombre VARCHAR(100),
    pass VARCHAR(60),
    estado TINYINT(1)
);

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(45),

    nombre VARCHAR(45),
    paterno VARCHAR(45),
    materno VARCHAR(45),

    email VARCHAR(45) UNIQUE,
    telefono VARCHAR(45),
    pass VARCHAR(60),
    
	calle VARCHAR(85),
	colonia VARCHAR(85),
	numero VARCHAR(10),
	codigoPostal INT(5),

    fechaNac DATE,
    estatura FLOAT(10,2),
    peso FLOAT(10,2),
    tipoSangre VARCHAR(15),
    aceptoTerminos TINYINT(1),
    estado TINYINT(1) DEFAULT 1
);

CREATE TABLE eventos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(45),
    fecha DATE,
    lugar VARCHAR(45),
    descripcion VARCHAR(200),
    precio float(16,2),
    numeroAsistentes INT(16) DEFAULT 0.00,
    numeroConcursantes INT(16) DEFAULT 0.00,
    estado TINYINT(1) DEFAULT 1,
    img VARCHAR(100),
    lat VARCHAR(45),
    lng VARCHAR(45)
);

CREATE TABLE usuarios_eventos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_user INT,
    fk_evento INT,
    tipoAsistencia VARCHAR(255),
    transaccion VARCHAR(255),
    FOREIGN KEY (fk_user) REFERENCES users (id),
    FOREIGN KEY (fk_evento) REFERENCES eventos (id)
);