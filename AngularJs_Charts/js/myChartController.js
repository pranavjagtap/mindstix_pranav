app.controller("myChartController", function ($scope) {

    //Data for Line, Bar and Radar charts
    $scope.mLabels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.mSeries = ['Series A', 'Series B'];
    $scope.mData = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
    ];

    //Data for Pie, Doughnut and Polar-Area charts
    $scope.sLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
    $scope.sData = [300, 500, 100, 40, 120];

    //log the data along with event for all charts on click event.
    $scope.onClick = function (points, evt) {
    console.log(points, evt);
    };

});
