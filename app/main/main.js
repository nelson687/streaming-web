'use strict';

var main = angular.module('streamingWeb.main', []);

main.controller("MainController", function($scope, $http, $interval, $document){

    var audio = new Audio();

    function getTime(t) {
        var m=~~(t/60), s=~~(t % 60);
        return (m<10?"0"+m:m)+':'+(s<10?"0"+s:s);
    }

    angular.element(document).on("ready", function () {

    });


    //UPLOAD FILE TEST
    $scope.upload = function(files){
        var fd = new FormData();
        for(var i = 0; i<files.length; i++){
            fd.append("file", files[i]);
        }
        $http.post('http://localhost:3000/upload', fd, {
            withCredentials: false,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).success("seee").error("nooo");
    }

    //volume slider
    $document.ready(function () {

    });

    //var progress = angular.element('progressBar');
    $scope.playerIcon = "glyphicon-play"
    $scope.songs;
    $scope.searchSong = {
        filterText: ''
    };
    $scope.currentPlaying = false

    $scope.progressBarWidth = 0;
    $scope.bufferedBarWidth = 0;

    $scope.songTime = "00:00"

    audio.addEventListener('progress', function() {
        /*
        var bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        var duration = audio.duration;
        if (duration > 0) {
              $scope.bufferedBarWidth = ((bufferedEnd / duration) * 100) + "%";
        }
        */
        var a = "asd"
    });

    audio.addEventListener('timeupdate', function() {
        $scope.progressBarWidth = parseInt(((audio.currentTime / audio.duration) * 100), 10) + '%';
        $scope.songTime = getTime(audio.currentTime)
    });

    //weird workaround in order to have te progress bar updated
    $interval(
            function() {
            }, 250);

    $http.get('http://localhost:3000/getSongs')
        .success(function(data){
            $scope.songs = data;
    })
        .error(function(data, status, headers, config) {
            var tes = "sdf"
    });

    $scope.gridOptions = {
        data: 'songs',
        columnDefs: [
            {field:'title', displayName: 'Title'},
            {field:'artist', displayName: 'Artist'},
        ],
        multiSelect: false,
        selectedItems: [],
        filterOptions: $scope.searchSong,
        disableHorizontalScrollbar: true
    };

    $scope.play = function(song){
        audio.src = song.file;
        audio.play();
        $scope.playerIcon = "glyphicon-pause"
        $scope.currentPlaying = song
    }

    $scope.stop = function(){
        audio.pause();
        $scope.playerIcon = "glyphicon-play"
    }

    $scope.nextSong = function(){
        if($scope.currentPlaying){
            var nextSong;
            var currentSongIndex = $scope.songs.indexOf($scope.currentPlaying);
                if(currentSongIndex < $scope.songs.length - 1){
                    nextSong = $scope.songs[currentSongIndex + 1];
                    $scope.gridOptions.selectRow(currentSongIndex + 1, true);
                }else{
                    nextSong = $scope.songs[0];
                    $scope.gridOptions.selectRow(0, true);
                }
            $scope.play(nextSong)
        }
    }

    $scope.prevSong = function(){
        if($scope.currentPlaying){
            var prevSong;
            var currentSongIndex = $scope.songs.indexOf($scope.currentPlaying);
            if($scope.songs.length - currentSongIndex < $scope.songs.length - 1){
                prevSong = $scope.songs[currentSongIndex - 1];
                $scope.gridOptions.selectRow(currentSongIndex - 1, true);
            }else{
                prevSong = $scope.songs[0];
                $scope.gridOptions.selectRow(0, true);
            }
            audio.src = prevSong.file;
            audio.play();
            $scope.playerIcon = "glyphicon-pause"
            $scope.currentPlaying = prevSong
        }
    }

    $scope.control= function(){
        if(!$scope.currentPlaying){
            audio.src = $scope.songs[0].file
        }
        if($scope.playerIcon == "glyphicon-pause"){
            audio.pause();
            $scope.playerIcon = "glyphicon-play"
        }else{
            audio.play();

            $scope.playerIcon = "glyphicon-pause"
        }
    }

    $scope.volumeBar = function () {
        var element = document.getElementById("volume");
        audio.volume = 0.75;

        $(element).slider( {
            value : audio.volume*100,
            slide : function(ev, ui) {
                $(element).css({background:"hsla(335,"+ui.value+"%,50%,1)"});
                audio.volume = ui.value/100;
            }
        });
    };
    $scope.progressBar = function () {
        var result = document.getElementsByClassName("progress");
        var progress = angular.element(result)

        progress.bind('click', function(e) {

            // calculate the normalized position clicked
            var clickPosition = (e.pageX  - this.offsetLeft) / this.offsetWidth;
            var clickTime = clickPosition * audio.duration;

            // move the playhead to the correct position
            audio.currentTime = clickTime;
        });
    };
});

