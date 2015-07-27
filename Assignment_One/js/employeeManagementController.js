app.controller('employeeManagementController', function($scope) {
	$scope.empList = [];	
	$scope.id = 1;
	$scope.maxDate = new Date();
	$scope.empObj = "";	
	$scope.saveDetails = function(empObj){
	//	if (empObj != undefined  || empObj != "") {
		//	$scope.output = "defined " +empObj;
		if (empObj.firstName && empObj.lastName && empObj.mobileNo && empObj.gender && empObj.dob) {
			empObj['id'] = $scope.id;
			$scope.empList.push(empObj);	
			$scope.id = $scope.id + 1;
			$scope.clearForm();
			$scope.isTouched(false);
		}
		else {
			//$scope.output = "undefined";
			if (!$scope.myform.firstName.$touched) {$scope.myform.firstName.$touched=true;};
			if (!$scope.myform.lastName.$touched) {$scope.myform.lastName.$touched=true;};
			if (!$scope.myform.mobileNo.$touched) {$scope.myform.mobileNo.$touched=true;};
			if (!$scope.myform.gender.$touched) {$scope.myform.gender.$touched=true;};
			if (!$scope.myform.dob.$touched) {$scope.myform.dob.$touched=true;};
		};
	};

	$scope.isTouched = function(val){
		$scope.myform.firstName.$touched=val;
		$scope.myform.lastName.$touched=val;
		$scope.myform.mobileNo.$touched=val;
		$scope.myform.gender.$touched=val;	
		$scope.myform.dob.$touched=val;
	};

	$scope.clearForm = function(){
		$scope.empObj = "";
	};
});