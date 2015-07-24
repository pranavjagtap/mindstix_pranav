app.controller('employeeManagementController', function($scope) {
	$scope.empList = [];	
	$scope.id = 1;
	$scope.maxDate = new Date();	
	$scope.saveDetails = function(empObj){
		empObj['id'] = $scope.id;
		if (empObj.firstName && empObj.lastName && empObj.mobileNo && empObj.gender && empObj.dob ) {
			$scope.empList.push(empObj);	
			$scope.id = $scope.id + 1;
			$scope.clearForm();
		};
	};

	$scope.clearForm = function(){
		$scope.empObj = "";
	};
});