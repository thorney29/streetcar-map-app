
var mapApp = angular.module('directives', []);
mapApp.directive('areaBasedGoogleMap', function () {
    return {
        restrict: "A",
        template: "<div id='areaMap'></div>",
        scope: {           
            area: "=",
            zoom: "="
        },
        controller: function ($scope) {
            var mapOptions;
            var map;           
            var marker;

            var initialize = function () {                                
                mapOptions = {
                    zoom: $scope.zoom,
                    center: new google.maps.LatLng(40.0000, -98.0000),
                    mapTypeId: google.maps.MapTypeId.TERRAIN
                };
                map = new google.maps.Map
                      (document.getElementById('areaMap'), mapOptions);
            };
          
            var createMarker = function (area) {
                var position = new google.maps.LatLng
                                (area.Latitude, area.Longitude);
                map.setCenter(position);
                marker = new google.maps.Marker({
                    map: map,
                    position: position,
                    title: area.Name
                });               
            };

            $scope.$watch("area", function (area) {
                if (area != undefined) {
                    createMarker(area);
                }
            });

            initialize();
        },
    };
});