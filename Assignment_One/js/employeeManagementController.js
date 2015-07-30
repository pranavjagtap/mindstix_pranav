app.controller('employeeManagementController', function($scope, $timeout) {
	$scope.btnupdate = false;
	$scope.btnsave = true;
	$scope.empList = [];	
	$scope.id = 1;
	$scope.maxDate = new Date();
	$scope.empObj = "";	
	$scope.saveDetails = function(empObj){
		if ($scope.btnupdate == true) {
			angular.forEach($scope.empList, function(emp){
				if (emp.id == empObj.id) {
					if (empObj.firstName && empObj.lastName && empObj.mobileNo && empObj.gender && empObj.dob) {
						emp.firstName = empObj.firstName;
						emp.lastName = empObj.lastName;
						emp.mobileNo = empObj.mobileNo;
						emp.gender = empObj.gender;
						emp.dob = empObj.dob;   
		              	$scope.clearForm();
						$scope.isTouched(false);
						$scope.crudAlertMessage ="Record updated successfully";
						$timeout(function(){$scope.crudAlertMessage = "";},2000);
					   	$scope.btnupdate = false;
						$scope.btnsave = true;
						} else {
							if (!$scope.myform.firstName.$touched) {$scope.myform.firstName.$touched=true;};
							if (!$scope.myform.lastName.$touched) {$scope.myform.lastName.$touched=true;};
							if (!$scope.myform.mobileNo.$touched) {$scope.myform.mobileNo.$touched=true;};
							if (!$scope.myform.gender.$touched) {$scope.myform.gender.$touched=true;};
							if (!$scope.myform.dob.$touched) {$scope.myform.dob.$touched=true;};
						};
					};
				});
		} else {
			if (empObj.firstName && empObj.lastName && empObj.mobileNo && empObj.gender && empObj.dob) {
				empObj['id'] = $scope.id;
				$scope.empList.push(empObj);	
				$scope.id = $scope.id + 1;
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
	};

	$scope.editDetails = function(emp){
		$scope.empObj = angular.copy(emp);
		$scope.btnupdate = true;
		$scope.btnsave = false;
	};

	$scope.deleteDetails = function(id){
		angular.forEach($scope.empList, function(emp,index){
			if (emp.id == id) {
                $scope.empList.splice(index, 1);
				$scope.crudAlertMessage ="Record deleted successfully";
				$timeout(function(){$scope.crudAlertMessage = "";},2000);					
			};
		});
       	$scope.clearForm();
		$scope.isTouched(false);
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
