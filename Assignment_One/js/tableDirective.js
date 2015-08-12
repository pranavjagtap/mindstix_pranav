/*
Note: 	
	Bootstrap.min.css v3.3.5 needs to be added in your html page where you are supposed to use
	this directive. Without Bootstrap.min.css the control panel feature will not work.

Directive Explained:
	1. Created directive named myTable.
	2. This directive can be used as an Element only.
	3. The Element has three attributes.
		1.	myList: 
				Array of objects,(data to be displayed in the table).
		2. 	editMethod:
				The value of this attribute should be the name of function (only name no arguments) 
				written by you which is used to manipulate the row to be edited from the table.
				This edit method written by you should take an object as an input.
				This object will consist of the record(row) to be edited from the table.
		3.	deleteMethod: 
				The value of this attribute should be the name of function (only name no arguments) 
				written by you which is used to delete the row from the table.
				This delete method written by you should take an object.id as an input.
				This will be the id of the record(row) to be deleted from the table
		4.	deleteButton:
				if the value of delete-button attribute is true, then only the delete button will 
				be displayed in the table.
		5.	updateButton:
				if the value of edit-button attribute is true, then only the edit button will 
				be displayed in the table.
	5. Template consists of the html code which will be replace the directive element in 
	html page.
	6. Alternatively you can use templateUrl and the table.html file.
*/
app.directive('myTable', function() {
	return {
		restrict: 'E',
	    scope: { 
	    	myList: '=objName',
	    	editMethod: '=editMethod',
	    	deleteMethod: '=deleteMethod',
	    	deleteButton: '=deleteButton',
	    	editButton: "=editButton"
		},
//	    templateUrl: 'table.html',
	    template: 	'<div class="row">' + 
					'	<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">' + 
					'		<div class="form-group">' + 
					'			<!-- Iterate through the array of objects and display "key" part of first object as column name in the table -->' + 
					'			<table class="table table-striped table-bordered">' + 
					'				<tr ng-repeat="obj in myList | limitTo:1">' + 
					'					<th class="text-center" ng-repeat="(key , val) in obj"> {{key}}</th>' + 
					'					<th class="text-center" ng-show="(editButton == true) || (deleteButton == true)">control panel</th>' + 
					'				</tr>' + 
					'				<!-- Iterate through the array of objects and display "value" part of all objects as rows in the table -->' + 
					'				<tr ng-repeat="obj in myList">' + 
					'					<td class="text-center" ng-repeat="(key , val ) in obj">{{val}} </td>' + 
					'					<td class="text-center" ng-show="(editButton == true) || (deleteButton == true)">' + 
					'						<!-- Each row will consist of edit and delete button to manipulate the table rows -->' + 
					'						<a href="#" ng-click="editMethod(obj)" ng-show="editButton == true"> <span class="glyphicon glyphicon-pencil"></span> </a>' + 
					'						<a href="#" ng-click="deleteMethod(obj.id)" ng-show="deleteButton == true"><span class="glyphicon glyphicon-trash"></span></a>' + 
					'					</td>' + 
					'				</tr>' + 
					'			</table>' + 
					'		</div>' + 
					'	</div>' + 
					'</div>'
	};
});
