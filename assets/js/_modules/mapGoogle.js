var $ = require('jquery');
window.jQuery = window.jquery = $;

// Map
module.exports.init = function () {
  function initialize() {

    // Map props
    var mapProp = {
      center: {
        lat: 56.8724,
        lng: 60.5249
      },
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,

      // Controls
      panControl: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false,
      rotateControl: false,
      // Style map
      styles: [{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":57}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"lightness":24}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]}]

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
        var infoBoxOffice = new InfoBox({
          alignBottom: true,
          content: '<div class="infobox-wrapper"><p class="title">Офис продаж на стройплощадке</p></div>',
          pixelOffset: new google.maps.Size(0, -125)
        });
        google.maps.event.addListener(markOffice, 'mouseover', function() {
          infoBoxOffice.open(map, markOffice);
        });
        google.maps.event.addListener(markOffice, 'mouseout', function() {
          infoBoxOffice.close(map, markOffice);
        });

        var markOfficeBuy = new google.maps.Marker({
          position: {
            lat: 56.8547,
            lng: 60.6067
          },
          map: map,
          icon: {
            url: 'images/markers/mark-complex.png'
          }
        });
        var infoBoxOfficeBuy = new InfoBox({
          alignBottom: true,
          content: '<div class="infobox-wrapper"><p class="title">Офис продаж</p></div>',
          pixelOffset: new google.maps.Size(0, -125)
        });
        google.maps.event.addListener(markOfficeBuy, 'mouseover', function() {
          infoBoxOfficeBuy.open(map, markOfficeBuy);
        });
        google.maps.event.addListener(markOfficeBuy, 'mouseout', function() {
          infoBoxOfficeBuy.close(map, markOfficeBuy);
        });

      }  else if ( $('#map-road').length ) {

        // Map-road
        mapProp.zoom = 15;
        mapProp.center = {
          lat: 56.8724,
          lng: 60.5330
        };
        var map2 = new google.maps.Map(document.getElementById('map-road'), mapProp);

        // Markers
        var markOffice = new google.maps.Marker({
          position: {
            lat: 56.8724,
            lng: 60.5249
          },
          map: map2,
          icon: {
            url: 'images/markers/mark-complex.png'
          }
        });
        var infoBoxOffice = new InfoBox({
          alignBottom: true,
          content: '<div class="infobox-wrapper"><p class="title">Офис продаж на стройплощадке</p></div>',
          pixelOffset: new google.maps.Size(0, -125)
        });
        google.maps.event.addListener(markOffice, 'mouseover', function() {
          infoBoxOffice.open(map2, markOffice);
        });
        google.maps.event.addListener(markOffice, 'mouseout', function() {
          infoBoxOffice.close(map2, markOffice);
        });

      } else if ( $('#map-infrastructure').length ) {

        mapProp.zoom = 15;
        // Map infrastructure
        var map3 = new google.maps.Map(document.getElementById('map-infrastructure'), mapProp);

        (function addMarkerInfrastructure() {

          var dataMarkers = [
            [
              '<div class="infobox-wrapper"><p class="title">Тренажерный зал</p></div>',
              'images/markers/mark-sport.png',
              56.8739,
              60.5310
            ],
            [
              '<div class="infobox-wrapper"><p class="title">Госучреждение</p></div>',
              'images/markers/mark-gov.png',
              56.8735,
              60.5428
            ],
            [
              '<div class="infobox-wrapper"><p class="title">Банк</p></div>',
              'images/markers/mark-bank.png',
              56.8751,
              60.5333
            ],
            [
              '<div class="infobox-wrapper"><p class="title">Басейн</p></div>',
              'images/markers/mark-sport.png',
              56.8757,
              60.5436
            ],
            [
              '<div class="infobox-wrapper"><p class="title">Госучреждение</p></div>',
              'images/markers/mark-gov.png',
              56.8761,
              60.5259
            ],
            [
              '<div class="infobox-wrapper"><p class="title">Банк</p></div>',
              'images/markers/mark-bank.png',
              56.8716,
              60.5343
            ]
          ];

          // Mark complex
          var markComplex = new google.maps.Marker({
            position: mapProp.center,
            map: map3,
            icon: {
              url: 'images/markers/mark-complex.png'
            }
          });
          var infoBoxComplex = new InfoBox({
            alignBottom: true,
            content: '<div class="infobox-wrapper"><p class="title">Офис продаж на стройплощадке</p></div>',
            pixelOffset: new google.maps.Size(0, -125)
          });
          google.maps.event.addListener(markComplex, 'mouseover', function() {
            infoBoxComplex.open(map3, markComplex);
          });
          google.maps.event.addListener(markComplex, 'mouseout', function() {
            infoBoxComplex.close(map3, markComplex);
          });

          // Marks infrastructure
          var infoBox = new InfoBox({
            alignBottom: true,
            pixelOffset: new google.maps.Size(0, -70)
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