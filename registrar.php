<?php
// resiviendo los datos
// isset(var) si existe
    $dependencia = $_POST['dependence'];
    $cedula = $_POST['dni'];
    $nombre = $_POST['name'];
    $cargo = $_POST['charge'];
    date_default_timezone_set('America/Caracas');
    $date = date('Y-m-d');


    require("conexion.php");
    try {

    
    
         if (isset($_POST)) {
    
    $consulta = $pdo->prepare("SELECT * FROM historial WHERE cedula ='" . $cedula . "' AND fecha ='" . $date . "' ");
    $consulta->execute();
    $resultado = $consulta->fetchAll(PDO::FETCH_ASSOC);
    $num_rows = count($resultado);
    
    if ( $num_rows > 0) {
       echo "ya el usurio se Carnetizo Hoy";
    }

    else{

        $query = $pdo->prepare('INSERT INTO public.historial ("cedula", "Nombre", "Dependencia","Cargo","fecha") VALUES (:ci, :nom, :dep, :car, :dat)');
 
    $query->bindParam(':ci',  $cedula);
    $query->bindParam(':nom', $nombre);
    $query->bindParam(':dep', $dependencia);
    $query->bindParam(':car', $cargo);
    $query->bindParam(':dat', $date);
    $query->execute();
    $pdo = null;
    echo "ok";
    }

   
    
}
  
    } catch (Exception $e) {
        echo "conexion fallida" . $e->getMessage();
    }


