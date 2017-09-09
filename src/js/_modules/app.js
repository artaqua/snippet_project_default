;'use strict';

// Require
var $ = require('jquery');
window.jQuery = window.jquery = $;
require('tapjs');
require('jquery-validation');
require('perfect-scrollbar/dist/js/perfect-scrollbar.jquery.js');
require('slick-carousel');
require('../_plagins/jquery.fancybox.js');
require('ion-rangeslider');
require('select2');
var fitvids = require('fitvids');
var anime = require('animejs');

// APP
// Event DOM Ready
$(document).ready(function() {

  // Animations
  (function() {
    anime({
      targets: '.svg-animate path',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 4000,
      delay: function(el, i) { 
        return i * 2000 
      },
      direction: 'alternate',
      loop: true
    });

    anime({
      targets: '.animate-elem',
      translateX: [
        { value: '50%', duration: 2000 },
        { value: 0, duration: 1000 }
      ],
      translateY: [
        { value: '-50%', duration: 1000, delay: 3000 },
      ],
      rotate: '1turn',
      duration: 5000,
      loop: true,
      direction: 'alternate'
    });
  })();

  // Menu
  (function() {
    $('body').on('tap', 'aside.sidebar-menu .btn-menu', function(event) {
      //
      hideScroll();
    });
    $('body').on('tap', 'nav.nav-menu .close', function(event) {
      event.preventDefault();
      //
      showScroll();
    });
    $(document).on('keydown', function(event) {
      if (event.keyCode == 27) {
        event.preventDefault();
        //
      }
      showScroll();
    });
  })();

  // Popups
  (function() {
    // order-call
    $('body').on('tap', '.btn-order-call', function(event) {
      event.preventDefault();
      $('.order-call-popup').toggleClass('active');
      hideScroll();
    });
    // feedback
    $('body').on('tap', '.subscribe', function(event) {
      event.preventDefault();
      $('.feedback-popup').toggleClass('active');
      hideScroll();
    });
    // more
    $('body').on('tap', '.popup-shares .btn.more', function(event) {
      event.preventDefault();
      $('.more-popup').toggleClass('active');
      hideScroll();
    });
    // time-work
    $('body').on('tap', '.time-work', function(event) {
      event.preventDefault();
      $('.time-work-popup').toggleClass('active');
      hideScroll();
    });
    // shares
    $('body').on('tap', 'nav.nav-menu .shares, aside.sidebar-menu .shares', function(event) {
      event.preventDefault();
      $('.popup-shares').toggleClass('active');
      hideScroll();
    });
    // Close popup
    $('body').on('tap', '.popup .close', function(event) {
      event.preventDefault();
      $('.popup').removeClass('active');
      showScroll();
    });
    // Close when click out block
    $(document).on('tap', function(event) {
      if( $(event.target).hasClass('popup') ) {
        $('.popup').removeClass('active');
        showScroll();
      }        
    })
    // keydown ESC
    $(document).on('keydown', function(event) {
      if (event.keyCode == 27) {
        $('.popup').removeClass('active');
        showScroll();
      }
    });
  })();

  // Sliders
  (function() {
    $('section.slider-features .slider').slick({
      dots: false,
      arrows: true,
      speed: 700,
      fade: true,
      prevArrow: $('section.slider-features .prev'),
      nextArrow: $('section.slider-features .next'),
      slidesToShow: 1,
      slidesToScroll: 1,
    });

    $('section.section-gallery-main .slider-gallery').slick({
      dots: false,
      arrows: true,
      speed: 700,
      prevArrow: $('section.section-gallery-main .prev'),
      nextArrow: $('section.section-gallery-main .next'),
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 700,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        }
      ]
    });
  })();

  // Validation
  (function() {
    $('#form-order-call').validate({
      rules: {
        clientName: {
          required: true,
          minlength: 3,
        },
        clientPhone: {
          required: true,
        },
        clientEmail: {
          email: true,
          required: true,
        }
      },
      errorPlacement: function(error, element) {},
    });
    $('#form-contact').validate({
      rules: {
        clientName: {
          required: true,
          minlength: 3,
        },
        clientPhone: {
          required: true,
        },
        clientEmail: {
          email: true,
          required: true,
        },
        clientMessage: {
          required: true,
        }
      },
      errorPlacement: function(error, element) {},
    });
    $('#form-feedback').validate({
      rules: {
        feedbackEmail: {
          required: true,
          email: true
        }
      },
      errorPlacement: function(error, element) {},
    });
    $('#form-more').validate({
      rules: {
        morePhone: {
          required: true
        }
      },
      errorPlacement: function(error, element) {},
    });
  })();

  // Ranges
  (function() {
    $("#range-floor").ionRangeSlider({
      type: "double",
      min: 1,
      max: 12,
      from: 1,
      to: 12,
      hide_min_max: true,
      grid: false
    });
    $("#range-meters").ionRangeSlider({
      type: "double",
      min: 25,
      max: 120,
      from: 25,
      to: 80,
      hide_min_max: true,
      grid: false
    });
  })();

  // Tab on apartment
  (function () {
    // on init
    var filterValue = $('section.apartments .tab .tab-nav a.active').attr('data-tab');
    $('section.apartments .tab .tab-item').hide();
    $(filterValue).show();

    // on click
    $('section.apartments .tab .tab-nav a').on('tap', function(e) {
      e.preventDefault();
      // Active class
      $('section.apartments .tab .tab-nav a').removeClass('active')
      var indexElem = $(e.target).closest('li').index();
      $('section.apartments .tab .tab-nav').each(function(index, el) {
        $(this).find('li').eq(indexElem).find('a').addClass('active');
      });

      var filterValue = $(this).attr('data-tab');
      $('section.apartments .tab .tab-item').hide();
      $(filterValue).show();
      $('.container-scroll').perfectScrollbar('update');
    });

    // on click select
    $('section.apartments .tab select.btn-opts').on('change', function(e) {
      e.preventDefault();
      var filterTab = $(this).find("option:selected").attr('data-tab');
      
      $('section.apartments .tab .tab-item').hide();
      $(filterTab).show();
      $('.container-scroll').perfectScrollbar('update');
    });
  })();

  // Tooltip
  tooltipOnHover('section.section-apartment-home .wrapper-section');
  tooltipOnHover('section.section-apartment-pick-floor .wrapper-section');
  tooltipOnHover('section.section-apartment-floor');

  // Gallery
  $('.fancybox').fancybox({
    animationEffect: false,
    speed: 600,
    fullScreen: false,
    thumbs: false,
    slideShow: false,
  });

  // FitVids
  fitvids('.container-player');

  // Select2
  $('select').select2({
    width: '100%',
    minimumResultsForSearch: -1
  });

  // Btn ripple
  $(".btn").click(function (e) {
    // Remove any old one
    $(".ripple").remove();

    // Setup
    var posX = $(this).offset().left,
        posY = $(this).offset().top,
        buttonWidth = $(this).width(),
        buttonHeight =  $(this).height();
    
    // Add the element
    $(this).prepend("<span class='ripple'></span>");
    
   // Make it round!
    if(buttonWidth >= buttonHeight) {
      buttonHeight = buttonWidth;
    } else {
      buttonWidth = buttonHeight; 
    }
    
    // Get the center of the element
    var x = e.pageX - posX - buttonWidth / 2;
    var y = e.pageY - posY - buttonHeight / 2;
   
    // Add the ripples CSS and start the animation
    $(".ripple").css({
      width: buttonWidth,
      height: buttonHeight,
      top: y + 'px',
      left: x + 'px'
    }).addClass("rippleEffect");
  });

  // Event scroll
  // $('.container-scroll').scroll(function(event) {
  //   // Аnimation on scroll
  //   var wScroll = $(this).scrollTop();

  //   $('.section-about-descr .anim').each(function() {
  //     var once = true;
  //     if ( wScroll > $(this).offset().top - ( $(window).height() - 200) ) {
  //       //
  //     }
  //   });
  // });

  // Event resize
  $(window).resize(function(event) {
    waitForFinalEvent(function(){
      // Height
      viewportHeight('main');

      // Contents scroll
      contentScrollHeight();

      // Squeeze svg
      squeezeInWindow(1840,1080,'section.section-plan-turn .wrapper-plan');
    }, 300, "ex032x");
  });

});

// Event load
$(window).on('load', function() {
  loadPage();
});

var loadPage = (function () {
  // Display loading...
  $(".page-loading").addClass('load').delay(800).queue(function() { 
    $(this).addClass('anim-stop');
    $('html').addClass('show-scroll');
  });

  // Height
  viewportHeight('main');

  // Contents scroll
  contentScrollHeight();

  // Squeeze svg
  squeezeInWindow(1840,1080,'section.section-plan-turn .wrapper-plan');

  scrollHorizontalOnLoad('.wrapper-frame');
});

// Functions
var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

function hideScroll() {
  $('html').addClass('hide-scroll');
  if ( $('#fullpage').length ) {
    $.fn.fullpage.setMouseWheelScrolling(false);
    $.fn.fullpage.setAllowScrolling(false);
  }
}
function showScroll() {
  $('html').removeClass('hide-scroll');
  if ( $('#fullpage').length ) {
    $.fn.fullpage.setMouseWheelScrolling(true);
    $.fn.fullpage.setAllowScrolling(true);
  }
}

var viewportHeight = (function(elem) {
  $(elem).css({
    'min-height': $(window).height() - ( $('body').innerHeight() - $('body').height() )
  });
});

var contentScrollHeight = (function() {
  // Init scroll
  $('.container-scroll').perfectScrollbar();
  
  if ( $('.content-scroll .container-scroll').length ) {
    if (window.matchMedia("(max-width: 1100px)").matches) {
      $('.content-scroll .container-scroll').perfectScrollbar('destroy');
    } else {
      // Calc height scroll
      var paddingMainContent = ( $('.content-scroll').innerHeight() - $('.content-scroll').height() ) / 2;
      var calcHeight = $('body').height() - $('.content-scroll .container-scroll').position().top - paddingMainContent;
      $('.content-scroll .container-scroll').css({
        height: calcHeight
      });
      // Update scroll
      $('.content-scroll .container-scroll').perfectScrollbar('update');
    }
  }
});

var squeezeInWindow = (function(widthImg,heightImg,squeezeElement){
  $(document).ready(function() {
    var mainBox       = $(squeezeElement),
        mainBoxWidth  = $("body").width(),
        mainBoxHeight = (heightImg*mainBoxWidth)/widthImg,
        windowWidth   = $(window).width(),
        windowHeight  = $(window).height();

    function funcResize(){
      mainBoxWidth    = $('body').width();
      mainBoxHeight   = (heightImg*mainBoxWidth)/widthImg;
      windowWidth     = $(window).width();
      windowHeight    = $(window).height();

      mainBox.css({
        "height": (heightImg*mainBoxWidth)/widthImg,
        "width": mainBoxWidth 
      });

      if(mainBoxHeight<windowHeight){
        mainBox.css({
          "height": windowHeight,
          "width": (windowHeight*widthImg)/heightImg
        });
      }
    }
    funcResize();
  });
});

// section.section-apartment-home .wrapper-section
var tooltipOnHover = (function(containerTooltip){
  var tooltip = $(containerTooltip).find(".tooltip"),
      linkHover = $(containerTooltip).find('a[data-tooltip]');

  // Position tooltip
  $(containerTooltip).mousemove(function(e) {
    var y = e.pageY - $(containerTooltip).offset().top - ( tooltip.outerHeight() / 2 );
    var x = e.pageX - $(containerTooltip).offset().left - tooltip.outerWidth() - 40;

    tooltip.css({
      "top": y,
      "left": x
    });
  });

  // On hover
  linkHover.hover(function() {
    var dataTooltip = $(this).attr('data-tooltip');

    // очистить
    tooltip.empty();
    // добавим контент
    $(containerTooltip).find(dataTooltip).clone().appendTo(containerTooltip + ' .tooltip');

    tooltip.addClass('active');
  }, function() {
    tooltip.removeClass('active');
  });
});

var scrollHorizontalOnLoad = (function(elem) {
  var $elem = $(elem),
      scrollBlock = $elem.prop('scrollWidth'),
      blockWidth = $elem.width();

  $elem.scrollLeft( (scrollBlock / 2) - (blockWidth / 2) );
});


