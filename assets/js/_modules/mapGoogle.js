var $ = require('jquery');
window.jQuery = window.jquery = $;

// Map
module.exports.init = function () {
  function initialize() {

    // Map props
    var mapProp = {
      center: {
        lat: 57.5736,
        lng: 39.8843
      },
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,

      // Controls
      panControl: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false,
      rotateControl: false,

    };

    // Call Maps
    var callMaps = (function(){

      if ( $('#map-contacts').length ) {

        // Map-contacts
        var map = new google.maps.Map(document.getElementById('map-contacts'), mapProp);

        // Markers
        var markOffice = new google.maps.Marker({
          position: mapProp.center,
          map: map,
          icon: {
            url: 'images/markers/mark-complex.png'
          }
        });

      }  else if ( $('#map-road').length ) {

        // Map-road
        var map = new google.maps.Map(document.getElementById('map-road'), mapProp);

        // Markers
        var markOffice = new google.maps.Marker({
          position: mapProp.center,
          map: map,
          icon: {
            url: 'images/markers/mark-complex.png'
          }
        });

      } else if ( $('#map-infrastructure').length ) {

        // Map infrastructure
        var map2 = new google.maps.Map(document.getElementById('map-infrastructure'), mapProp);

        (function addMarkerInfrastructure() {

          var dataMarkers = [
            [
              '<div class="infobox-wrapper"><p class="title">Магазин одежды</p></div>',
              'images/markers/mark-sport.png',
              57.5706,
              39.8700
            ],
            [
              '<div class="infobox-wrapper"><p class="title">Магазин</p></div>',
              'images/markers/mark-gov.png',
              57.5706,
              39.8400
            ],
            [
              '<div class="infobox-wrapper"><p class="title">Магазин</p></div>',
              'images/markers/mark-bank.png',
              57.5706,
              39.8300
            ],
            [
              '<div class="infobox-wrapper"><p class="title">Магазин</p></div>',
              'images/markers/mark-sport.png',
              57.5606,
              39.8100
            ],
            [
              '<div class="infobox-wrapper"><p class="title">Магазин</p></div>',
              'images/markers/mark-gov.png',
              57.5606,
              39.8600
            ],
            [
              '<div class="infobox-wrapper"><p class="title">Магазин</p></div>',
              'images/markers/mark-bank.png',
              57.5606,
              39.8800
            ]
          ];

          // Marker logo
          var markLogo = new google.maps.Marker({
            position: mapProp.center,
            map: map2,
            icon: {
              url: 'images/markers/mark-complex.png'
            }
          });

          var infoBox = new InfoBox({
            alignBottom: true,
            pixelOffset: new google.maps.Size(-100, -70)
          });

          var marker;

          for (var i = 0; i < dataMarkers.length; i++) {  
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(dataMarkers[i][2], dataMarkers[i][3]),
              map: map2,
              icon: dataMarkers[i][1]
            });

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
              return function() {
                infoBox.setContent(dataMarkers[i][0]);
                infoBox.open(map2, marker);
              }
            })(marker, i));
            
          } // end for

        })();

      }

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