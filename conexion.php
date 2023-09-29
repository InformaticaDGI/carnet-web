<?php
// conetando con la base de datos
$servidor = "pgsql:host=localhost;port=5440;dbname=carnets";
$user = "postgres";
$pass = "vP28!2#z";

try {
	$pdo = new PDO($servidor, $user, $pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
} catch (PDOException $e) {
	echo "conexion fallida" . $e->getMessage();
}

 
 ;