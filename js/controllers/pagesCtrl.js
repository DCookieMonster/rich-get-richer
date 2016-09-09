/**
 * Created by dor on 28/07/2016.
 */

Mainapp.controller("songsCtrl", function($scope, $http) {
    window.scrollTo(0, 0);
    $scope.song_list = [1, 2, 3, 4, 5, 6];
    $scope.song_name = ["BROCCOLI feat. Lil Yachty (Prod By. J Gramm)", "X (feat. Future)", "YOUNG MA - OOOUUU (intro)", "The Pinkprint Freestyle",
        "Chris Travis - Kaiju (Prod. Mvteusz Mlynvrski & Wojdvs)", "Recognize (feat. Ashe)"
    ]
    $scope.index = 0;
    $scope.song = -1;
    $scope.log = {};
    $scope.true_songs = []
    $scope.userLog = {};

    $scope.shuffle = function(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    $scope.randString = function(x) {

        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < x; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;

    };

    $scope.init = function() {
        $scope.start = new Date();
        $scope.song_list = $scope.shuffle($scope.song_list);
        $scope.song = $scope.song_list[$scope.index]
        $scope.userLog['user_id'] = $scope.randString(10);
    }




    $scope.click = function(like) {
        $scope.userLog['song_'+$scope.song_list[$scope.index]] = like;
        if ($scope.index == $scope.song_list.length - 1) {
            $scope.song = 7
            $http({
                method: 'POST',
                // url: 'http://localhost:5000/json',
                url: 'http://192.168.88.156:5000/json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.userLog)
            }).then(function(response) {
                console.log("posted successfully");
                $scope.userCode = "Thank You!";
                $scope.userInfo = " Your user id: "+  $scope.userLog['user_id'];


            }, function(response) {
                console.error["error in posting"];
                console.error[response];
                $scope.userCode = "There was an error with the communication" +
                    ".\nError: " + response.status;


            })


            return;
        }
        $scope.userLog["duration_song_" + $scope.song_list[$scope.index]] = (new Date - $scope.start) / 1000;
        $scope.index += 1
        $scope.start = new Date();
        $scope.song = $scope.song_list[$scope.index]
    }


    $scope.init();


});
