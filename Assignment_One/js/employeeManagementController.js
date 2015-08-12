app.controller('employeeManagementController', function($scope, $timeout, $http) {
	
	/*
		Initially keep update button invisible and save button visible.
		Define an array to store json data.
		Define an variable which will be used as id for each record.
		Gets todays date as max date, used to assign max date to dob textbox in html.
		Define an object, used to preserve current html form data untill page is refresherd.
	*/
	$scope.btnupdate = false;
	$scope.btnsave = true;
	$scope.empList = [];
	$scope.id = 1;
	$scope.maxDate = new Date();
	$scope.empObj = {};

	/*
		Accept 'configFileUrl' from html page using ng-init directive.
		Fetch data from JSON file using $http service and store reponse in an array. 
		In case of any issues display error message as provided in the json file.
		config.url is used to fetch required field 'url' form config.js file.
	*/
	$scope.getDataFromJSON = function(){

		//your config file url.
		var configFileUrl = 'js/resources.json';

		//Call the getDataFromJSON function after every 1 minute.
		$timeout(function(){$scope.getDataFromJSON()}, 60000);

		try {
			/*
				get the function Name and json file url from resources.json file
				Required to get employee records stored in json file.
			*/
			$http.get(configFileUrl).success(function(response){
				var funcName = response.config[0].funcName;
				var data_url = response.config[0].dataUrl;
			
				//Check whether the string-funcName in json file is a valid function name.
				if (angular.isFunction(eval(funcName))) {
					//console.log("its a valid function name");
					$http.get(data_url).success(eval(funcName)).error(function(){logError(data_url);});
				}
				else{
					console.log("its not a valid function name");
				};
			}).error(function(){logError("resources.json");});
		}	catch(e){
			console.log(e);
		};
	};

	/*
		Display log to console .
	*/
	function logError(fileName){
		console.log("error in loading " + fileName + " file");
	}

	/*
		Assign reponse object to employeeList.
	*/
	function getResult(response){
		if (response.status == "success") {
			$scope.empList = response.object.employees;
		} else {
			$scope.crudAlertMessage = response.message;
			$timeout(function(){$scope.crudAlertMessage = ""},4000);
		};
	};

	/*
		Update 'emp' object from the table with new values from 'empObj' object
	*/
	function update(emp,empObj){
		if (empObj.firstName && empObj.lastName && empObj.mobileNo && empObj.gender && empObj.dob) {
			emp.firstName = empObj.firstName;
			emp.lastName = empObj.lastName;
			emp.mobileNo = empObj.mobileNo;
			emp.gender = empObj.gender;
			emp.dob = new Date(empObj.dob).toISOString().substring(0, 10);
			$scope.clearForm();
			$scope.isTouched(false);
			$scope.crudAlertMessage ="Record updated successfully";
			$timeout(function(){$scope.crudAlertMessage = "";},2000);
		   $scope.btnupdate = false;
			$scope.btnsave = true;
		} 	else	{
				if (!$scope.myform.firstName.$touched) {$scope.myform.firstName.$touched=true;};
				if (!$scope.myform.lastName.$touched) {$scope.myform.lastName.$touched=true;};
				if (!$scope.myform.mobileNo.$touched) {$scope.myform.mobileNo.$touched=true;};
				if (!$scope.myform.gender.$touched) {$scope.myform.gender.$touched=true;};
				if (!$scope.myform.dob.$touched) {$scope.myform.dob.$touched=true;};
			};
	};

	/*
		Insert new row with values from empObj into the table
	*/
	function save(empObj){
		if ($scope.empList.length > 0) {
			$scope.id = parseInt($scope.empList[$scope.empList.length -1].id) + 1;
		};
		if (empObj.firstName && empObj.lastName && empObj.mobileNo && empObj.gender && empObj.dob) {
			empObj['id'] = $scope.id;
			empObj.dob = new Date(empObj.dob).toISOString().substring(0, 10);   
			$scope.empList.push(empObj);	
			$scope.clearForm();
			$scope.isTouched(false);
			$scope.crudAlertMessage ="Record saved successfully";
			$timeout(function(){$scope.crudAlertMessage = "";},2000);
		} else {
			if (!$scope.myform.firstName.$touched) {$scope.myform.firstName.$touched=true;};
			if (!$scope.myform.lastName.$touched) {$scope.myform.lastName.$touched=true;};
			if (!$scope.myform.mobileNo.$touched) {$scope.myform.mobileNo.$touched=true;};
			if (!$scope.myform.gender.$touched) {$scope.myform.gender.$touched=true;};
			if (!$scope.myform.dob.$touched) {$scope.myform.dob.$touched=true;};
		};
	};

	/*
		Delete the employee record of at specified index - 'row number', in the table.
	*/
	function deleteSingleRecord(emp,index){
      $scope.empList.splice(index, 1);
		$scope.crudAlertMessage ="Record deleted successfully";
		$timeout(function(){$scope.crudAlertMessage = "";},2000);					
	};

	/*
		Check whether the operation to be performed is update or save.
		Accordingly call respective functions.
	*/
	$scope.saveDetails = function(empObj){
		if ($scope.btnupdate == true) {
			angular.forEach($scope.empList, function(emp){
				if (emp.id == empObj.id) {
					update(emp,empObj);
				};
			});
		} else {
			save(empObj);
		};
	};

	/*
		Display record of selected id from table(array) to html form, 
		so that it can be edited for updation.
	*/
	$scope.editDetails = function(emp){
		$scope.empObj.id = emp.id;
		$scope.empObj.firstName = emp.firstName;
		$scope.empObj.lastName = emp.lastName;
		$scope.empObj.mobileNo = emp.mobileNo;
		$scope.empObj.gender = emp.gender;
		$scope.empObj.dob = new Date(emp.dob);
		$scope.btnupdate = true;
		$scope.btnsave = false;
	};


	/*
		Delete record of specified id from array.
	*/
	$scope.deleteDetails = function(id){
		angular.forEach($scope.empList, function(emp,index){
			if (emp.id == id) {
				deleteSingleRecord(emp,index);
			};
		});
      $scope.clearForm();
		$scope.isTouched(false);
	};

	/*
		Implement touched property of form controls as per the input parameter.  
	*/
	$scope.isTouched = function(val){
		$scope.myform.firstName.$touched=val;
		$scope.myform.lastName.$touched=val;
		$scope.myform.mobileNo.$touched=val;
		$scope.myform.gender.$touched=val;	
		$scope.myform.dob.$touched=val;
	};

	/*
	 	Remove touched property of form controls.
	 	Clear the values of tags from html form control.
		It will not clear contents of the table.
	*/
	$scope.clearForm = function(){
		$scope.isTouched(false);
		$scope.empObj = {};
		$scope.btnupdate = false;
		$scope.btnsave = true;
	};
});
