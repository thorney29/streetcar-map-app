var myItemsApp = angular.module('myItemsApp', []);

myItemsApp.factory('itemsFactory', ['$http', function($http){
  var itemsFactory ={
    itemDetails: function() {
      return $http(
      {
        url: "https://spreadsheets.google.com/feeds/list/0AnAPtHOSNeZvdHBpcU1NemZ5UFJaOXZDMXlBUVdnMWc/od6/public/values?alt=json",
        method: "GET",
      })
      .then(function (response) {
        return response.data;
        });
      }
    };
    return itemsFactory;
  
}]);


myItemsApp.controller('ItemsController', ['$scope', 'itemsFactory', function($scope, itemsFactory){
  var promise = itemsFactory.itemDetails();

    promise.then(function (data) {
        $scope.itemDetails = data.feed.entry;
      for (var i = 0; i < data.feed.entry.length; i++) {
        /* get the values from the data file and assign them */
            $scope.itemDetails[i].name= $scope.itemDetails[i].gsx$name.$t;
            $scope.itemDetails[i].image= $scope.itemDetails[i].gsx$image.$t;     
            $scope.itemDetails[i].lat= $scope.itemDetails[i].gsx$lat.$t;
            $scope.itemDetails[i].address= $scope.itemDetails[i].gsx$address.$t;
            $scope.itemDetails[i].lng= $scope.itemDetails[i].gsx$lng.$t;
            $scope.itemDetails[i].url= $scope.itemDetails[i].gsx$url.$t; 
            $scope.itemDetails[i].contentString = $scope.itemDetails[i].contentString = "<img src='" + data.feed.entry[i].gsx$image.$t + "'/><a href='" + data.feed.entry[i].gsx$url.$t + "'><div class='contentString'><h3>" + data.feed.entry[i].gsx$name.$t + "</h3></a><br><p>" + data.feed.entry[i].gsx$address.$t 
              + "<br>" + data.feed.entry[i].gsx$city.$t + ", "
              + data.feed.entry[i].gsx$state.$t + "</p></div>" + "<input type='button' onClick=getDir( $scope.itemDetails.lat, $scope.itemDetails.lng) value='Get direction here'>";          
         
      } 
      console.log($scope.itemDetails[1].name);        

    });
    $scope.select = function(item) {
      $scope.selected = item;
    };
    $scope.selected = {};
}]);


myItemsApp.directive("myMaps", function($timeout) {
    return {
                restrict: 'E',
                template: '<div></div>',
                replace: true,
                link: function (scope, element, attrs) {
                  scope.$watchCollection('selected', function() {
                    var lat = scope.selected.lat || 45.522535;
                    var lng = scope.selected.lng || -122.659492;
                    var contentString = scope.selected.contentString;
                    var myLatLng = new google.maps.LatLng(lat, lon);
                    var mapOptions = {
                          center: myLatLng,
                          zoom: 15,
                          myTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById("map-canvas"),
                          mapOptions);
                    var markers = [];
                    var marker = new google.maps.Marker(
                          {
                              position: myLatLng,
                              map: map,
                              title: "Take me to a streetcar bar"
                          }
                    );
                    google.maps.event.addListener(marker, "click", function() {
                      if (infowindow) {
                        infowindow.close();
                      } 
                    var infowindow = new google.maps.InfoWindow({content: contentString});
                      infowindow.open(map, marker);
                    });
                    markers.push(marker); 
                    marker.setMap(map);
                  });
                }
            };
});

