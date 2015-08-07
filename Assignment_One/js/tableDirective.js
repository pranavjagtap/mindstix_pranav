app.directive('myTable', function() {
	return {
		restrict: 'E',
	    scope: { 
	    	myList: '=objName',
	    	editMethod: '=editMethod',
	    	deleteMethod: '=deleteMethod'
		},
	    templateUrl: 'table.html'
	};
});
		