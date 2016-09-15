;'use strict';
(function() {

  // Display loading...
  $(window).load(function() {
    $('.page-loading').addClass('active');
  });
  
  $(document).ready(function() {

    // Open popup
    $('.clickme').on('click', function(event) {
      event.preventDefault();
      $('.popup').addClass('active');
    });

    // Close popup
    $('.popup .close-popup').on('click', function(event) {
      event.preventDefault();
      $(this).closest('.popup').removeClass('active');
    });

  });

})();


