<html>
<body>


	<?php 
	$rollNum = $pass = '';
	echo "Hello <br>";
	#phpinfo();
	$db_handle = pg_connect("host=localhost dbname=marks user=admin password=almight");
	if($db_handle){
		$query = "SELECT COUNT(*) FROM users";
		$users = pg_exec($db_handle, $query);
		if ($users) {
			$count = pg_result($users, 0, 'count');
			echo "Count in users database $count <br>";

					
		}
		$query = "SELECT COUNT(*) FROM marks";
		$marks = pg_exec($db_handle, $query);
		if ($marks) {
			$count = pg_result($marks, 0, 'count');
			echo "Count in marks database $count <br>";

					
		}
	}
		if ($_SERVER["REQUEST_METHOD"] == "POST") {
 		 if (empty($_POST["rollNum"])) {
    			echo "<br><br> Roll is required <br>";
  		} else {
    			$rollNum = input($_POST["rollNum"]);
    		}
  
 		 if (empty($_POST["pass"])) {
    			echo "<br><br> Password is required <br>";
  		} else {
    			$pass = input($_POST["pass"]);
    		}
  	}
  	
	function input($data) {
  		$data = trim($data);
  		return $data;
	}
	
	?>






	<h2>PHP Marks Portal</h2>
	<form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">  
  	Roll: <input type="text" name="rollNum" value="<?php echo $rollNum;?>">
  	<br><br>
  	Password: <input type="text" name="pass" value="<?php echo $pass;?>">
  	<br><br> 
  	<input type="submit" name="submit" value="Submit">  
	</form>

	<?php
	if ($_SERVER["REQUEST_METHOD"] == "POST") {

	echo "<h2>Output: </h2>";
	
	$uquery = "SELECT roll,email FROM users where roll='$rollNum'";
	$query = "SELECT roll,email FROM users where roll='$rollNum' and password='$pass'";
	
	$entry = pg_exec($db_handle, $uquery);
	$user = pg_exec($db_handle, $query);
	
	if($user && pg_num_rows($user)>0){
	
		echo "User Found <br>";
		$mquery = "select * from marks where roll='$rollNum'";
		$marks = pg_exec($db_handle,$mquery);
		
		if($marks && pg_num_rows($marks)>0){
			for ($x = 0; $x < pg_num_rows($marks); $x++) {
				echo "Lab marks: ";
				echo pg_result($marks,$x,"lab");
				echo "<br>";
				echo "Mid semester marks: ";
				echo pg_result($marks,$x,"midsem");
				echo "<br>";	
				echo "Project marks: ";
				echo pg_result($marks,$x,"project");
				echo "<br>";
				echo "End semester marks: ";
				echo pg_result($marks,$x,"endsem");
				echo "<br>";
			}
		}else{
			echo "marks not yet entered";
		}
		//echo pg_result($user,0,"email");
	}else if($entry && pg_num_rows($entry)>0){
		echo "password mismatch";
	}
	else{ 
		echo "non-existent roll number";
		//echo pg_last_error($db_handle);
	}
	}
	?>
</body>

</html>
