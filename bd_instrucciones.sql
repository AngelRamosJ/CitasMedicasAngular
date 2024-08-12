-- -----------------------------------------------------
-- USUARIO, PRIVILEGIOS Y ROLES
-- -----------------------------------------------------

create role FARMACIAMANAGER;
grant create session, create table, create any sequence to FARMACIAMANAGER;

create user angel_farmacia identified by 123 default tablespace users;

grant FARMACIAMANAGER to angel_farmacia;

alter user angel_farmacia quota unlimited on users;

-- -----------------------------------------------------
-- TABLA LOCALIDAD
-- -----------------------------------------------------

CREATE TABLE localidad (
    id NUMBER(7),
    pais VARCHAR2(50) NOT NULL,
    estado VARCHAR2(50) NOT NULL,
    codigo_postal VARCHAR2(5) NOT NULL,
    ciudad VARCHAR2(50) NOT NULL,
    calle VARCHAR2(50),
    exterior VARCHAR2(4) NOT NULL,
    interior VARCHAR2(4),
    CONSTRAINT LOCALIDAD_PK PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- TABLA SUCURSAL
-- -----------------------------------------------------

CREATE TABLE sucursal (
    id NUMBER(3),
    nombre VARCHAR2(50) NOT NULL,
    telefono VARCHAR2(20) NOT NULL,
    localidad_id NUMBER(7) UNIQUE,
    CONSTRAINT SUCURSAL_PK PRIMARY KEY (id),
    CONSTRAINT SUCURSAL_LOCALIDAD_FK FOREIGN KEY (localidad_id) REFERENCES localidad (id)
);

-- -----------------------------------------------------
-- TABLA CONSULTORIO
-- -----------------------------------------------------

CREATE TABLE consultorio (
    id NUMBER(3),
    descripcion VARCHAR2(50) NOT NULL,
    numero_identificacion NUMBER(4) NOT NULL,
    estado VARCHAR2(1) NOT NULL,
    fecha_creacion DATE NOT NULL,
    sucursal_id NUMBER(7),
    CONSTRAINT CONSULTORIO_PK PRIMARY KEY (id),
    CONSTRAINT CONSULTORIO_SUCURSAL_FK FOREIGN KEY (sucursal_id) REFERENCES sucursal (id)
);


-- -----------------------------------------------------
-- TABLA DOCTOR
-- -----------------------------------------------------

CREATE TABLE doctor (
    id NUMBER(4),
    nombre VARCHAR2(50) NOT NULL,
    paterno VARCHAR2(50) NOT NULL,
    materno VARCHAR2(50) NOT NULL,
    cedula VARCHAR2(11) NOT NULL,
    profesion VARCHAR(50) NOT NULL,
    especialidad VARCHAR2(80),
    telefono VARCHAR2(20) NOT NULL,
    salario NUMBER(8,2) NOT NULL,
    localidad_id NUMBER(7),
    CONSTRAINT DOCTOR_PK PRIMARY KEY (id),
    CONSTRAINT DOCTOR_LOCALIDAD_FK FOREIGN KEY (localidad_id) REFERENCES localidad (id)
);

-- -----------------------------------------------------
-- TABLA PACIENTE
-- -----------------------------------------------------

CREATE TABLE paciente (
    id NUMBER(7),
    nombre VARCHAR2(50) NOT NULL,
    paterno VARCHAR2(50) NOT NULL,
    materno VARCHAR2(50) NOT NULL,
    curp VARCHAR2(18) NOT NULL,
    correo VARCHAR2(100) NOT NULL,
    telefono VARCHAR2(20),
    fecha_nacimiento DATE NOT NULL,
    sexo VARCHAR(1) NOT NULL,
    localidad_id NUMBER(7),
    CONSTRAINT PACIENTE_PK PRIMARY KEY (id),
    CONSTRAINT PACIENTE_LOCALIDAD_FK FOREIGN KEY (localidad_id) REFERENCES localidad (id)
);

-- -----------------------------------------------------
-- TABLA CITA
-- -----------------------------------------------------

CREATE TABLE cita (
    doctor_id NUMBER(4),
    paciente_id NUMBER(7),
    fecha_encuentro DATE,
    hora_encuentro VARCHAR2(5) NOT NULL,
    clave_identificacion VARCHAR2(10) NOT NULL,
    estado VARCHAR2(1) NOT NULL,
    CONSTRAINT CITA_PK PRIMARY KEY (doctor_id,paciente_id,fecha_encuentro),
    CONSTRAINT CITA_DOCTOR_FK FOREIGN KEY (doctor_id) REFERENCES doctor (id),
    CONSTRAINT CITA_PACIENTE_FK FOREIGN KEY (paciente_id) REFERENCES paciente (id)
);

-- -----------------------------------------------------
-- TABLA TURNO
-- -----------------------------------------------------

CREATE TABLE turno (
    doctor_id NUMBER(4),
    consultorio_id NUMBER(3),
    dia NUMBER(1),
    tipo VARCHAR2(1) NOT NULL,
    CONSTRAINT TURNO_PK PRIMARY KEY (doctor_id,consultorio_id,dia),
    CONSTRAINT TURNO_DOCTOR_FK FOREIGN KEY (doctor_id) REFERENCES doctor (id),
    CONSTRAINT TURNO_CONSULTORIO_FK FOREIGN KEY (consultorio_id) REFERENCES consultorio (id)
);

-- -----------------------------------------------------
-- SECUENCIAS
-- -----------------------------------------------------

CREATE SEQUENCE auto_increment_doctor INCREMENT BY 1 NOCYCLE;
CREATE SEQUENCE auto_increment_consultorio INCREMENT BY 1 NOCYCLE;
CREATE SEQUENCE auto_increment_localidad INCREMENT BY 1 NOCYCLE;
CREATE SEQUENCE auto_increment_paciente INCREMENT BY 1 NOCYCLE;
CREATE SEQUENCE auto_increment_sucursal INCREMENT BY 1 NOCYCLE;

-- -----------------------------------------------------
-- INSERT
-- -----------------------------------------------------
--SUCURSAL 1
INSERT INTO localidad(id,pais,estado,codigo_postal,ciudad,calle,exterior,interior) VALUES(auto_increment_localidad.nextval,'Mexico','Estado de Mexico','61507','Toluca','Gobernadores','150','4');
--SUCURSAL 2
INSERT INTO localidad(id,pais,estado,codigo_postal,ciudad,calle,exterior,interior) VALUES(auto_increment_localidad.nextval,'Mexico','Estado de Mexico','61507','Toluca','Morelos','350','6');
--DOCTOR 1
INSERT INTO localidad(id,pais,estado,codigo_postal,ciudad,calle,exterior,interior) VALUES(auto_increment_localidad.nextval,'Mexico','Estado de Mexico','61507','Toluca','Seminario','630','12');
--DOCTOR 2
INSERT INTO localidad(id,pais,estado,codigo_postal,ciudad,calle,exterior,interior) VALUES(auto_increment_localidad.nextval,'Mexico','Estado de Mexico','61507','Toluca','Adolfo Lopez Mateo','89','8');
--PACIENTE 1
INSERT INTO localidad(id,pais,estado,codigo_postal,ciudad,calle,exterior,interior) VALUES(auto_increment_localidad.nextval,'Mexico','Estado de Mexico','61507','Toluca','Seminario','107','3');
--PACIENTE 2
INSERT INTO localidad(id,pais,estado,codigo_postal,ciudad,calle,exterior,interior) VALUES(auto_increment_localidad.nextval,'Mexico','Estado de Mexico','61507','Toluca','Adolfo Lopez Mateo','55','1');

INSERT INTO sucursal(id,nombre,telefono,localidad_id) VALUES(auto_increment_sucursal,'Sucursal 1','7221548588',1);
INSERT INTO sucursal(id,nombre,telefono,localidad_id) VALUES(auto_increment_sucursal,'Sucursal 2','7221548587',2);
INSERT INTO consultorio(id,descripcion,numero_identificacion,estado,fecha_creacion,sucursal_id) VALUES(auto_increment_consultorio,'Consultorio 1','785C','A',TO_DATE('05-05-2021','DD-MM-YYYY'),1);
INSERT INTO consultorio(id,descripcion,numero_identificacion,estado,fecha_creacion,sucursal_id) VALUES(auto_increment_consultorio,'Consultorio 2','885C','A',TO_DATE('05-06-2021','DD-MM-YYYY'),2);
INSERT INTO doctor(id,nombre,paterno,materno,cedula,profesion,especialidad,telefono,salario,localidad_id) VALUES(auto_increment_doctor,'Ana Laura','Chavez','Hernandez','AESSA-26451','Medico Cirujano','PEDIATRA','7225648879',45000,3);
INSERT INTO doctor(id,nombre,paterno,materno,cedula,profesion,especialidad,telefono,salario,localidad_id) VALUES(auto_increment_doctor,'Chan','Diaz','Gregorio','2752761','Medico Cirujano','PSIQUIATRA','7225648878',50000,4);
INSERT INTO paciente(id,nombre,paterno,materno,curp,correo,telefono,fecha_nacimiento,sexo,localidad_id) VALUES(auto_increment_paciente,'Maria Guadalupe','Fragoso','Perez','MAFR000229MMDMCNP0','maria@gmail.com','5512344585',TO_DATE('29-02-2000','DD-MM-YYYY'),'F',3);
INSERT INTO cita(doctor_id,paciente_id,fecha_encuentro,hora_encuentro,clave_identificacion,estado) VALUES(1,1,TO_DATE('05-05-2022','DD-MM-YYYY'),'12:45','CT-1234567','A');
INSERT INTO turno(doctor_id,consultorio_id,dia,tipo) VALUES(1,1,1,'D');
INSERT INTO turno(doctor_id,consultorio_id,dia,tipo) VALUES(1,1,2,'V');
INSERT INTO turno(doctor_id,consultorio_id,dia,tipo) VALUES(1,1,3,'M');
INSERT INTO turno(doctor_id,consultorio_id,dia,tipo) VALUES(1,1,4,'D');
INSERT INTO turno(doctor_id,consultorio_id,dia,tipo) VALUES(1,1,5,'M');
INSERT INTO turno(doctor_id,consultorio_id,dia,tipo) VALUES(2,1,1,'D');
INSERT INTO turno(doctor_id,consultorio_id,dia,tipo) VALUES(2,1,2,'D');
INSERT INTO turno(doctor_id,consultorio_id,dia,tipo) VALUES(2,2,3,'D');
INSERT INTO turno(doctor_id,consultorio_id,dia,tipo) VALUES(2,2,4,'D');
INSERT INTO turno(doctor_id,consultorio_id,dia,tipo) VALUES(2,1,5,'D');


INSERT INTO localidad() VALUES();


