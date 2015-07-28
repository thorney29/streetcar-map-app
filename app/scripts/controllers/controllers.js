  'use strict';
/**
 * @ngdoc function
 * @name mapApp.controller:MapController
 * @description
 * # MapController
 * Controller of the mapApp
 */
 //Data
var markers = [];
var mapApp = angular.module('mapControllers', []);

function ListController($scope, $http, config){

    $http
        .get('scripts/bars.json')
        .then(function(response) {

            //this happens if everything works

            var directionsDisplay, rendererOptions,

                mapOptions = {
                    center: myLatlng100,
                    styles: config.googleMaps.styles,
                    zoom: 15,
                    draggable: false,
                    scrollwheel: false,
                    disableDoubleClickZoom: true,
                    zoomControl: false
                },

                map         = new google.maps.Map(document.getElementById('map'), mapOptions),
                bounds      = new google.maps.LatLngBounds(),
                myLatlng100 = new google.maps.LatLng(45.523007, -122.657890),
                infoWindow  = new google.maps.InfoWindow();

            // Create a renderer for directions and bind it to the map.
            rendererOptions     = { map: map };
            directionsDisplay   = new google.maps.DirectionsRenderer(rendererOptions);

            directionsDisplay.setMap(map);

            $scope.bars     = response.data;
            $scope.markers  = [];
            $scope.map      = map;

            $scope.openInfoWindow = function(e, selectedMarker){
                e.preventDefault();
                google.maps.event.trigger(selectedMarker, 'click');
            };

            $scope.setAllMap    = setAllMap;
            $scope.clearMarkers = clearMarkers;
            $scope.clearPanel   = clearPanel;

            setAllMap();

            console.log($scope.bars);

            /*=======================================================
            | Functions Declarations
             ======================================================= */

            function clearPanel(){
                document.getElementById("panel").innerHTML = " ";
                $('h3.map').show();
                $('#clearPanel').hide();
            }

            function createMarker(bar){

                var marker = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(bar.lat, bar.lng),
                    title: bar.name
                });

                marker.content =
                    '<div class="contentString"><img src="' +
                            bar.image +
                        '"><br/>'+
                            bar.address +
                        ' ' +
                        '<br /><button id="spinner" class="button" onclick="getDir('+bar.lat+', '+bar.lng+')">Get Directions</button>' +
                    '</div>';

                marker.image = bar.image;

                google.maps.event.addListener(bar, 'click', function(){
                    infoWindow.setContent('<a class="info-window" href="' + bar.url + '">' +'<h3 class="info-window" >' + bar.name + '</h3>' + '</a>' +  marker.content);
                    infoWindow.open(map, marker);
                });

                google.maps.event.addListener(marker, 'click', function(){
                    infoWindow.setContent('<a class="info-window" href="' + bar.url + '">' +'<h3 class="info-window" >' + bar.name + '</h3>' + '</a>' +  marker.content);
                    infoWindow.open(map, marker);
                });

                google.maps.event.addListener(marker, 'dragstart', function() {
                    disableMovement(true);
                });

                google.maps.event.addListener(marker, 'dragend', function() {
                    disableMovement(false);
                });

                $scope.markers.push(marker);

            }

            function setAllMap(){
                for (var i = 0; i < $scope.bars.length; i++){
                    createMarker($scope.bars[i]);
                }
            }

            function clearMarkers(){
                // null has not purpose here
                // as setAllMap doesn't ever us
                // any arguments
                setAllMap(null);
            }


        }).
        catch(function(error) {
            console.log("Error fetching bars: ", error);
        });
}

mapApp.controller('ListController', ListController);

function disableMovement(disable) {
    var mapOptions;
    if (disable) {
        mapOptions = {
            draggable: false,
            scrollwheel: false,
            disableDoubleClickZoom: true,
            zoomControl: false
        };
    } else {
        mapOptions = {
            draggable: true,
            scrollwheel: true,
            disableDoubleClickZoom: false,
            zoomControl: true
        };
    }
    map.setOptions(mapOptions);
}


function getDir(lat,lng,markers,map) {
    run_waitMe();
    document.getElementById("panel").innerHTML = " ";
    // If the browser supports the Geolocation API
        if (typeof navigator.geolocation == "undefined") {
          $("#error").text("Your browser doesn't support the Geolocation API");
          return;
        }
         // Save the positions' history
         var path = [];
         navigator.geolocation.getCurrentPosition(function (position) {  //This gets the
            // Create the map
             var myOptions = {
                styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}],
                zoom: 15,
                draggable: false,
                scrollwheel: false,
                disableDoubleClickZoom: false,
                zoomControl: true,
                center : path[0],
                mapTypeId : google.maps.MapTypeId.TRANSIT
              };
            var map = new google.maps.Map(document.getElementById("map"), myOptions);
 
            var latitude = position.coords.latitude;                       //users current
            var longitude = position.coords.longitude;                    
            var start = new google.maps.LatLng(latitude, longitude);     //Creates variable for map coordinates
               //location
               path.push(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                 // Creates the polyline object
               var polyline = new google.maps.Polyline({
                map: map,
                path: path,
                strokeColor: '#0000FF',
                strokeOpacity: 0.7,
                strokeWeight: 1
               });
               
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById('panel'));

            var request = {
              origin: start,
              destination: new google.maps.LatLng(lat, lng),
              travelMode: google.maps.DirectionsTravelMode.TRANSIT
            };
            // Removes the overlays from the map, but keeps them in the array
            function clearOverlays() {
              if (markersArray) {
                for (i in markersArray) {
                  markersArray[i].setMap(null);
                }
              }
            }             
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                   directionsDisplay.setDirections(response);
                    $('.waitMe').hide();
                    $('h3.map').hide();
                    $('#clearPanel').show();
                    }
            });
      });
}

// none, bounce, rotateplane, stretch, orbit, 
// roundBounce, win8, win8_linear or ios
var current_effect = 'bounce'; // 

function run_waitMe(effect){
    $('#spinHere').waitMe({
        //none, rotateplane, stretch, orbit, roundBounce, win8, 
        //win8_linear, ios, facebook, rotation, timer, pulse, 
        //progressBar, bouncePulse or img
        effect: 'bounce',

        //place text under the effect (string).
        text: 'Getting Directions',

        //background for container (string).
        bg: 'rgba(255,255,255,0.7)',

        //color for background animation and text (string).
        color: '#000',

        //change width for elem animation (string).
        sizeW: '',

        //change height for elem animation (string).
        sizeH: '',

        // url to image
        source: ''

        });
    }


 