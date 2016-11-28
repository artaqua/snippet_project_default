;'use strict';

// DOM Ready
$(function(){

  // Do magic this
  $('button').on('tap', function(event) {
    event.preventDefault();
    $(this).toggleClass('active');
  });
  

  // Event scroll
  $(window).scroll(function(event) {
    //
  });
  
  // Event resize
  $(window).resize(function(event) {
    //
  });

});

// Event load
$(window).load(function() {
  // Display loading...
  $('.page-loading').addClass('active');
});

// Functions
var viewportHeight = (function(elem) {
  $(elem).css({
    'min-height': $(window).height()
  });
});
var animateShowing = (function(element) {
  var $element = $(element);
  $element.each(function(i) {
    setTimeout(function() {
      $element.eq(i).addClass('is-showing');
    }, (600 * (Math.exp(i * 0.15))) - 600 ); // Каждая итерация увеличивает время анимации
  });
});




