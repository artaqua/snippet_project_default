var $ = require('jquery');
window.jQuery = window.jquery = $;

// Map
module.exports.init = function () {

  function initialize() {

    // Map props
    var mapProp = {
      center: {
        lat: 50.3777,
        lng: 30.4224
      },
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,

      // Controls
      panControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false,
      rotateControl: false,
      fullscreenControl: false,
      // Style map
      styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]

    };

    // Call Maps
    var callMaps = (function(){

      if ( $('#map-contacts').length ) {

        // Map-contacts
        mapProp.center = {
          lat: 50.3703,
          lng: 30.3895
        };
        var map = new google.maps.Map(document.getElementById('map-contacts'), mapProp);

        (function setMarkers(argument) {
          var dataMarkers = [
            [50.4025,30.4137],
            [50.3703,30.3895]
          ];
          var imageLocataion = {
            url: 'img/markers/mark-location.png'
          };
          var imageLocataionActive = {
            url: 'img/markers/mark-location-active.png',
            size: new google.maps.Size(60, 85),
            anchor: new google.maps.Point(30, 58)
          };

          var marker;
          var markers = [];

          for (var i = 0; i < dataMarkers.length; i++) {  
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(dataMarkers[i][0], dataMarkers[i][1]),
              map: map,
              icon: {
                url: 'img/markers/mark-location.png'
              }
            });

            markers.push(marker);

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
              return function() {
                markersSetIconDefault();
                marker.setIcon(imageLocataionActive);
              }
            })(marker, i));

            function markersSetIconDefault() {
              for (var j = 0; j < markers.length; j++) {
                markers[j].setIcon(imageLocataion);
              }
            }
          } // end for

        })();
      } // end if

      if ( $('#map-road').length ) {

        // Map-road
        mapProp.zoom = 14;
        mapProp.center = {
          lat: 50.3743,
          lng: 30.3924
        };
        var map2 = new google.maps.Map(document.getElementById('map-road'), mapProp);

        // Mark logo
        var markLogo = new google.maps.Marker({
          position: {
            lat: 50.3743,
            lng: 30.3924
          },
          map: map2,
          icon: {
            url: 'img/markers/mark-logo.png'
          }
        });

        $('a[data-nav-page]').on('tap', function(event) {
          event.preventDefault();
          setTimeout(function() {
            google.maps.event.trigger(map2, 'resize');
            map2.setCenter(mapProp.center);
          },100);
        });

      } // end if

      if ( $('#map-infrastructure').length ) {

        // Map infrastructure
        mapProp.zoom = 14;
        mapProp.center = {
          lat: 50.3743,
          lng: 30.3924
        };
        var map3 = new google.maps.Map(document.getElementById('map-infrastructure'), mapProp);

        (function addMarkerInfrastructure() {

          var dataMarkers = [
            [
              '<div class="infobox-wrapper"><p class="title">Ресторан</p></div>',
              'img/markers/mark-food.png',
              50.3743,
              30.4024
            ],
            [
              '<div class="infobox-wrapper"><p class="title">Футбольное поле</p></div>',
              'img/markers/mark-footbol.png',
              50.3723,
              30.4000
            ],
            [
              '<div class="infobox-wrapper"><p class="title">Больница</p></div>',
              'img/markers/mark-med.png',
              50.3680,
              30.3924
            ],
            [
              '<div class="infobox-wrapper"><p class="title">Кинотеатр</p></div>',
              'img/markers/mark-movie.png',
              50.3800,
              30.3904
            ],
            [
              '<div class="infobox-wrapper"><p class="title">Школа</p></div>',
              'img/markers/mark-school.png',
              50.3755,
              30.3804
            ],
            [
              '<div class="infobox-wrapper"><p class="title">Торговый центр</p></div>',
              'img/markers/mark-shop.png',
              50.3710,
              30.3820
            ]
          ];

          // Mark logo
          var markLogo = new google.maps.Marker({
            position: {
              lat: 50.3743,
              lng: 30.3924
            },
            map: map3,
            icon: {
              url: 'img/markers/mark-logo.png'
            }
          });

          // Marks infrastructure
          var infoBox = new InfoBox({
            alignBottom: true,
            pixelOffset: new google.maps.Size(0, -5),
            pane: "mapPane"
          });
          var marker;

          for (var i = 0; i < dataMarkers.length; i++) {  
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(dataMarkers[i][2], dataMarkers[i][3]),
              map: map3,
              icon: dataMarkers[i][1]
            });

            google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
              return function() {
                infoBox.setContent(dataMarkers[i][0]);
                infoBox.open(map3, marker);
              }
            })(marker, i));

            google.maps.event.addListener(marker, 'mouseout', (function(marker, i) {
              return function() {
                infoBox.setContent(dataMarkers[i][0]);
                infoBox.close(map3, marker);
              }
            })(marker, i));
            
          } // end for

          $('a[data-nav-page]').on('tap', function(event) {
            event.preventDefault();
            setTimeout(function() {
              google.maps.event.trigger(map3, 'resize');
              map3.setCenter(mapProp.center);
            },100);
          });

        })();

        

      } // end if

    })();

    $('.overlay-map').on('click', function() {
      $(this).remove();
    }); 

  }

  // Init map
  if ( typeof google != 'undefined' ) {
    google.maps.event.addDomListener(window, 'load', initialize);
  }

};