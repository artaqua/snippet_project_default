// Require
var $ = require('jquery');
window.jQuery = window.jquery = $;
require('tapjs');
// var Parallax = require('../_plagins/parallax.js');
require('jquery-validation');
require('perfect-scrollbar/dist/js/perfect-scrollbar.jquery.js');
require('slick-carousel');
require('../_plagins/jquery.fancybox.js');
require('ion-rangeslider');

// APP
// Event DOM Ready
$(function(){
  // Menu
  $('body').on('tap', 'header .humburger', function(event) {
    event.preventDefault();
    $(this).toggleClass('is-active');
    $('aside.sidebar-menu').toggleClass('active');
  });
  $('body').on('tap', '.sidebar-menu .close', function(event) {
    event.preventDefault();
    $('header .humburger').removeClass('is-active');
    $('aside.sidebar-menu').removeClass('active');
  });
  $(document).on('keydown', function(event) {
    if (event.keyCode == 27) {
      event.preventDefault();
      $('header .humburger').removeClass('is-active');
      $('aside.sidebar-menu').removeClass('active');
    }
  });

  // Popups
  (function() {
    // order-call
    $('body').on('tap', '.btn-order-call', function(event) {
      event.preventDefault();
      $('.order-call-popup').toggleClass('active');
    });
    // feedback
    $('body').on('tap', '.btn-feedback', function(event) {
      event.preventDefault();
      $('.feedback-popup').toggleClass('active');
    });
    // order-service
    $('body').on('tap', 'section.section-room .order', function(event) {
      event.preventDefault();
      $('.order-service-popup').toggleClass('active');
    });
    $('body').on('tap', 'aside.sidebar-menu .nav-menu .docs', function(event) {
      event.preventDefault();
      $('.docs-popup').toggleClass('active');
    });
    // Close popup
    $('body').on('tap', '.popup .close', function(event) {
      event.preventDefault();
      $('.popup').removeClass('active');
    });
    // Close when click out block
    $(document).on('tap', function(event) {
      if( $(event.target).hasClass('popup') ) {
        $('.popup').removeClass('active');
      }        
    })
    // keydown ESC
    $(document).on('keydown', function(event) {
      if (event.keyCode == 27) {
        $('.popup').removeClass('active');
      }
    });
  })();

  // Validation
  (function() {
    $('#form-order-service').validate({
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
    $('#form-feedback').validate({
      rules: {
        feedbackEmail: {
          required: true,
          email: true
        }
      },
      errorPlacement: function(error, element) {},
    });
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
  })();

  // Sliders
  (function() {

    var sliderOnPageSlider = $('.slider');
    sliderOnPageSlider.slick({
      dots: false,
      arrows: true,
      speed: 600,
      fade: true,
      prevArrow: $('section.section-slider .prev'),
      nextArrow: $('section.section-slider .next'),
      slidesToShow: 1,
      slidesToScroll: 1,
    });
    // Изменить на 700пкс
    if (window.matchMedia("(max-width: 700px)").matches) {
      calcInfo();
    } else {
      viewportHeight('section.section-slider .slider .item');
    }

    function calcInfo() {
      $(window).on('load', function(event) {
        var calcHeight = ( $('header.header-page').outerHeight() + $('footer.footer-page').outerHeight() );

        $('section.section-slider .slider .item').css({
          'min-height': $(window).height() - calcHeight
        });
      });
    }

    var sliderInfrastructure = $('.slider-infrastucture');
    sliderInfrastructure.slick({
      dots: false,
      arrows: true,
      prevArrow: 'section.section-infrastructure .prev',
      nextArrow: 'section.section-infrastructure .next',
      slidesToShow: 9,
      slidesToScroll: 9,
      responsive: [
        {
          breakpoint: 850,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 6
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4
          }
        },
        {
          breakpoint: 400,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
      ]
    });
  })();

  // Ranges
  (function() {
    $("#floor-range").ionRangeSlider({
      type: "double",
      min: 1,
      max: 16,
      from: 1,
      to: 16,
      hide_min_max: true,
      grid: false
    });
    $("#rooms-range").ionRangeSlider({
      type: "double",
      min: 1,
      max: 3,
      from: 1,
      to: 3,
      hide_min_max: true,
      grid: false
    });
    $("#area-range").ionRangeSlider({
      type: "double",
      min: 39,
      max: 87,
      from: 39,
      to: 87,
      hide_min_max: true,
      grid: false
    });
    $("#price-range").ionRangeSlider({
      type: "double",
      min: 3.1,
      max: 8.9,
      from: 3.1,
      to: 8.9,
      step: 0.1,
      hide_min_max: true,
      grid: false
    });
  })();

  // Gallery
  $('.fancybox').fancybox({
    speed : 500,
    fullScreen: false,
  });


  // filter room
  $('section.section-catalog-room .table-title .sort').on('tap', function(event) {
    event.preventDefault();
    $(this).toggleClass('active');
  });

  // corps hover info
  (function(){
    var corpusInfo = $("section.section-sections .corpus-info"),
        linkSvg = $('section.section-sections .svg-sections .corpus');

    $('section.section-sections .wrapper-sections').mousemove(function(e) {
      var y = e.pageY - $('section.section-sections .wrapper-sections').offset().top - corpusInfo.outerHeight() - 15;
      var x = e.pageX - $('section.section-sections .wrapper-sections').offset().left - ( corpusInfo.outerWidth() / 2);

      corpusInfo.css({
        "top": y,
        "left": x
      });
    });

    linkSvg.hover(function() {
      var dataInfoCorpus = $(this).attr('data-info-corpus');
      
      // очистить
      corpusInfo.empty()
      // добавим контент
      $(dataInfoCorpus).clone().appendTo("section.section-sections .corpus-info");

      corpusInfo.addClass('active');
    }, function() {
      corpusInfo.removeClass('active');
    });
  })();

  // Day/night
  (function() {
    // Init
    $('body').addClass( $('.header-page .change-page a.active').attr('data-change-page') );
    // Change
    $('.header-page .change-page a').on('tap', function(event) {
      event.preventDefault();
      var dataThis = $(this).attr('data-change-page');
      
      $('.header-page .change-page a').removeClass('active');
      $(this).addClass('active');

      $('.header-page .change-page a').each(function(index, el) {
        var dataAll = $(this).attr('data-change-page');
        $('body').removeClass(dataAll);
      });
      $('body').addClass(dataThis);
    });
  })();

  // Parallax on home
  // if ( $('#scene-parallax').length ) {
  //   var scene = $('#scene-parallax').get(0);
  //   var prllx = new Parallax(scene, {
  //     pointerEvents: true,
  //   });
  // }

  // Event scroll
  $(window).scroll(function(event) {
    // // Аnimation on scroll
    // var wScroll = $(this).scrollTop();

    // $('section.section-home .features').each(function() {
    //   if ( wScroll > $(this).offset().top - ( $(window).height() - 200) ) {
    //     animateShowing('section.section-home .features .animate', 0.22);
    //   }
    // });
  });

  // Event resize
  $(window).resize(function(event) {
    waitForFinalEvent(function(){
      // Height
      viewportHeight('main');
      viewportHeight('.container-full-page');
      viewportHeight('.container-section .wrapper-content');
      viewportHeight('section.section-home');
      viewportHeight('section.section-home .slider-home .item');
      viewportHeight('section.section-home .wrapper-svg');

      // Contents scroll
      contentHeighScroll();
      // Docs scroll
      $('.docs-popup .wrapper-scroll').perfectScrollbar();

      mapHeight('section.section-contacts .map-google');
      mapHeight('section.section-infrastructure .map-google');
      mapHeight('section.section-road .map-google');

    }, 300, "ex032x");
  });

});

// if not full load
var timerFullLoad = setTimeout(function () {
  loadPage();
},5000);
// Event load
$(window).on('load', function() {
  clearTimeout(timerFullLoad);
  loadPage();
});

var loadPage = (function () {
  // Display loading...
  $(".page-loading").addClass('load').delay(1000).queue(function() { 
    $(this).addClass('anim-stop');
  });
  $(".popup").addClass('load');
  // Anim items
  animateShowing('section.section-infrastructure .animate', 0.18);
  animateShowing('section.section-sections .animate', 0.30);
  animateShowing('section.section-apartment .animate', 0.06);
  animateShowing('section.section-floor .animate', 0.06);
  animateShowing('section.section-catalog-room .animate', 0.30);
  animateShowing('section.section-room .animate', 0.18);
  animateShowing('section.section-catalog-shares .animate', 0.14);
  animateShowing('section.section-conditions .animate', 0.30);
  animateShowing('section.section-catalog-news .animate', 0.14);
  animateShowing('section.section-contacts .animate', 0.24);
  animateShowing('section.section-gallery .animate', 0.20);
  animateShowing('section.section-slider .animate', 0.30);
  animateShowing('section.section-404 .animate', 0.30);
  // Height
  viewportHeight('main');
  viewportHeight('.container-full-page');
  viewportHeight('.container-section .wrapper-content');
  viewportHeight('section.section-home');
  viewportHeight('section.section-home .slider-home .item');
  viewportHeight('section.section-home .wrapper-svg');
  
  // Contents scroll
  contentHeighScroll();
  // Docs scroll
  $('.docs-popup .wrapper-scroll').perfectScrollbar();

  mapHeight('section.section-contacts .map-google');
  mapHeight('section.section-infrastructure .map-google');
  mapHeight('section.section-road .map-google');

  scrollOnLoad('section.section-sections .container-scroll');
  scrollOnLoad('section.section-apartment .container-scroll');
  scrollOnLoad('section.section-plan .container-scroll');

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

var animateShowing = (function(element, speedCount) {
  var speed = speedCount || 0.18
  var $element = $(element);
  $element.each(function(i) {
    setTimeout(function() {
      $element.eq(i).addClass('showing');
    }, (600 * (Math.exp(i * speed))) - 600 ); // Каждая итерация увеличивает время анимации
  });
});

var removeShowing = (function(element) {
  $(element).find('.showing').each(function(index, el) {
    $(this).removeClass('showing');
  });
});

var viewportHeight = (function(elem) {
  $(elem).css({
    'min-height': $(window).height() - ( $('body').innerHeight() - $('body').height() )
  });
});

var contentHeighScroll = (function() {
  // Scrollbar
  $('.container-scroll').perfectScrollbar();
  if ( $('.container-scroll').length ) {
    var paddingBody = ($('body').innerHeight() - $('body').height()) / 2;
    var calcHeight = $(window).height() - paddingBody - $('.container-scroll').offset().top - $('.footer-page').outerHeight();

    if (window.matchMedia("(max-width: 1200px)").matches) {
      $('.container-scroll').perfectScrollbar('destroy');
    } else {
      $('.container-scroll').css({
        'height': calcHeight
      });
      $('.container-scroll').perfectScrollbar('update');
    }
  }
});

var mapHeight = (function(elem) {
  if ( $(elem).length ) {
    var el = $(elem);
    var paddingBody = ($('body').innerHeight() - $('body').height()) / 2;
    var calcHeight = $(window).height() - ( el.offset().top + $('.footer-page').outerHeight() + paddingBody );

    el.css({
      'height': calcHeight
    });
  }
});

var scrollOnLoad = (function(elem) {
  var $elem = $(elem),
      calcScrollBlock = $elem.prop('scrollHeight'),
      blockHeight = $elem.outerHeight();

  $elem.scrollTop( (calcScrollBlock - blockHeight) / 2 );
});


