<?php

function GET($conn,$statement){

    if (!$statement){
        echo json_encode(['error' => "Error executing query: " . $conn->error]);
    } else {
        while ($row = $statement->fetch_assoc()){
            $results[] = $row;
        }
        echo json_encode($results); 
    }
}


function POST($conn, $table, $data, $idColumnName = 'id') {
    $columns = array_keys($data);
    $values = array_values($data);
    $placeholders = str_repeat('?,', count($columns) - 1) . '?';
        
    // Build the query
    $query = "INSERT INTO `$table` (`" . implode('`, `', $columns) . "`) VALUES ($placeholders)";
        
    // Prepare statement
    $stmt = $conn->prepare($query);
        
    if ($stmt) {
    // Determine types for bind_param
    $types = '';
        foreach ($values as $value) {
            if (is_int($value)) {
                $types .= 'i'; 
            } elseif (is_float($value)) {
                $types .= 'd'; 
            } elseif (is_string($value)) {
                $types .= 's'; 
            } else {
                $types .= 'b';
            }
    }
            
    // Dynamically bind parameters
    $bindParams = array($types);
    for ($i = 0; $i < count($values); $i++) {
        $bindParams[] = &$values[$i];
    }
    call_user_func_array(array($stmt, 'bind_param'), $bindParams);
            
    // Execute and prepare response
    if ($stmt->execute()) {
        $insertedId = $conn->insert_id;
            $response = [
                'status' => 'success',
                'message' => "Record inserted successfully into $table",
                $idColumnName => $insertedId
            ];
    } else {
            $response = [
                'status' => 'error', 
                'message' => "Failed to insert record into $table: " . $stmt->error
            ];
        }
            
        $stmt->close();
    } else {
        $response = [
            'status' => 'error', 
            'message' => "Failed to prepare the SQL query: " . $conn->error
        ];
    }
        
    return $response;
}
    

?>