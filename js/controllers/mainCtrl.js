/**
 * Created by dor on 17/07/2016.
 */


Mainapp.controller('mainCtrl', ['$scope','$http', function($scope,$http) {
    window.scrollTo(0, 0);
    $http.get("data/mainPage.json")
        .then(function(response) {
            $scope.aboutUs = response.data.aboutUs;

        });

}]);
