<?php 
$date = file_get_contents("php://input");

require "conexion.php";
	$consulta = $pdo->prepare("SELECT * FROM historial WHERE cedula ='" . $date . "' ORDER BY id DESC");
	$consulta->execute();
	$resultado = $consulta->fetchAll(PDO::FETCH_ASSOC);
	foreach ($resultado as $data) {
		// code...
		echo "<tr >
 		<td>" . $data['cedula'] . "</td>
 		<td>" . $data['Nombre'] . "</td>
 		<td>" . $data['Dependencia'] . "</td>
 		<td>" . $data['Cargo'] . "</td>
 		<td>" . $data['fecha'] . "</td>
 	</tr> ";
	}
 ?>

