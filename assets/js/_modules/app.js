var $ = require('jquery');
window.jQuery = window.jquery = $;
require('tapjs');
// require('jquery-mousewheel');
// require('jquery-validation');
// require('slick-carousel');
// require('ion-rangeslider');
// require('perfect-scrollbar/dist/js/perfect-scrollbar.jquery.js');
// require('isotope-layout/dist/isotope.pkgd.js');

// APP
// Event DOM Ready
$(function(){
  // Menu
  $('body').on('tap', 'header .gumburger', function(event) {
    event.preventDefault();
    $('.nav-menu-mobile').toggleClass('active');
    animateShowing('.nav-menu-mobile .animate', 0.08);
  });
  $('body').on('tap', '.nav-menu-mobile .close', function(event) {
    event.preventDefault();
    $('.nav-menu-mobile').removeClass('active');
    removeShowing('.nav-menu-mobile');
  });
  $(document).on('keydown', function(event) {
    if (event.keyCode == 27) {
      event.preventDefault();
      $('.nav-menu-mobile').removeClass('active');
      removeShowing('.nav-menu-mobile');
    }
  });

  // Popups
  (function() {
    // Docs scroll
    $('.docs-popup .wrapper-scroll').perfectScrollbar();
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
    $('body').on('tap', 'section.section-room .order, section.section-room .order-mobile', function(event) {
      event.preventDefault();
      $('.order-service-popup').toggleClass('active');
    });
    $('body').on('tap', '.footer-page .btn-docs, .nav-menu-mobile .btn-docs', function(event) {
      event.preventDefault();
      $('.docs-popup').toggleClass('active');
    });
    // Close popup
    $('body').on('tap', '.popup .close', function(event) {
      event.preventDefault();
      $('.popup').removeClass('active');
    });
    // Close when click out block
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
    $('.slider').slick({
      dots: false,
      arrows: true,
      speed: 600,
      fade: true,
      prevArrow: $('section.section-home .prev, section.section-slider .prev'),
      nextArrow: $('section.section-home .next, section.section-slider .next'),
      slidesToShow: 1,
      slidesToScroll: 1
    });

    var sliderInfrastructure = $('.slider-infrastucture');
    if ( window.matchMedia('(max-width: 700px)') ) {
      sliderInfrastructure.slick({
        dots: false,
        arrows: true,
        prevArrow: 'section.section-infrastructure .prev',
        nextArrow: 'section.section-infrastructure .next',
        slidesToShow: 6,
        slidesToScroll: 6,
        responsive: [
          {
            breakpoint: 500,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4
            }
          },
          {
            breakpoint: 360,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3
            }
          },
        ]
      });
    }
  })();

  // Ranges
  (function() {
    // Select corps
    // $('section.section-catalog-room .select-corps').selectize({
    //   sortField: 'text',
    //   onChange: function(value) {
    //     var text = $('.selectize-dropdown .option.selected').siblings('.optgroup-header').text();
    //     $('section.section-catalog-room .select-corps').siblings('.title-select-corps').text(text);
    //   }
    // });

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
  $('.link-gallery').swipebox({
    hideBarsDelay: 0,
  });

  // filter room
  $('section.section-catalog-room .table-title .sort').on('tap', function(event) {
    event.preventDefault();
    $(this).toggleClass('active');
  });

  // corps hover info
  (function(){
    var corpusInfo = $("section.section-sections .corpus-info"),
        linkSvg = $('section.section-sections .svg-apartment .corpus');

    $(document).mousemove(function(e) {
      corpusInfo.css({
        "top": e.pageY - (corpusInfo.outerHeight() + 15),
        "left": e.pageX - (corpusInfo.outerWidth() / 2)
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
      // Container-page
      viewportHeight('.container-page');
      viewportHeight('section.section-home .slider .item');
      viewportHeight('section.section-slider .slider .item');
      
      contentHeighScroll();

      squeezeInWindow(1920,1080,'section.section-apartment .wrapper-apatment');
      squeezeInWindow(1920,1180,'section.section-sections .wrapper-sections');
      squeezeInWindow(1920,1084,'section.section-plan .wrapper-plan');

    }, 300, "ex032x");
  });

});

// if not full load
setTimeout(function () {
  loadPage();
},5000);
// Event load
$(window).on('load', function() {
  loadPage();
});

var loadPage = (function () {
  // Display loading...
  $(".page-loading").addClass('load');
  // Anim on load
  $('.header-page').addClass('active');
  $('.footer-page').addClass('active');
  $('#svg-home-nav').addClass('load');
  $('section.section-contacts .info-contacts').addClass('load');
  $('section.section-road .info-contacts').addClass('load');
  $('section.section-infrastructure .wrapper-slider').addClass('load');
  // Anim items
  animateShowing('section.section-gallery .animate', 0.30);
  animateShowing('section.section-conditions .animate', 0.30);
  animateShowing('section.section-plan .taggd__wrapper', 0.30);
  animateShowing('section.section-catalog-news .animate', 0.20);
  animateShowing('section.section-news-page .animate', 0.24);
  animateShowing('section.section-floor .animate', 0.30);
  animateShowing('section.section-catalog-room .animate', 0.30);
  animateShowing('section.section-catalog-shares .animate', 0.20);
  animateShowing('section.section-room .animate', 0.20);
  animateShowing('section.section-apartment .animate', 0.08);
  animateShowing('section.section-sections .animate', 0.08);
  animateShowing('section.section-404 .animate', 0.30);
  // Container-page
  viewportHeight('.container-page');
  viewportHeight('section.section-home .slider .item');
  viewportHeight('section.section-slider .slider .item');
  
  contentHeighScroll();

  squeezeInWindow(1920,1080,'section.section-apartment .wrapper-apatment');
  squeezeInWindow(1920,1180,'section.section-sections .wrapper-sections');
  squeezeInWindow(1920,1084,'section.section-plan .wrapper-plan');

});

// Functions
var viewportHeight = (function(elem) {
  $(elem).css({
    'min-height': $(window).height()
  });
});

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

var getScrollBarWidth = (function() {
  var inner = document.createElement('p');
  inner.style.width = "100%";
  inner.style.height = "200px";

  var outer = document.createElement('div');
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild (inner);

  document.body.appendChild (outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var w2 = inner.offsetWidth;
  if (w1 == w2) w2 = outer.clientWidth;

  document.body.removeChild (outer);

  return (w1 - w2);
});

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

function contentHeighScroll() {
  // Scrollbar
  $('.container-scroll').perfectScrollbar();
  if ( $('.container-scroll').length ) {
    var height = $(window).height() - $('.container-scroll').offset().top - $('.footer-page').outerHeight() - 40;
    $('.container-scroll').css({
      'height': height
    });
    $('.container-scroll').perfectScrollbar('update');
  }
}

var squeezeInWindow = (function(widthImg,heightImg,squeezeElement){
  $(document).ready(function() {

    var mainBox       = $(squeezeElement),
        mainBoxWidth  = $("body").width(),
        mainBoxHeight = (heightImg*mainBoxWidth)/widthImg,
        windowWidth   = $(window).width(),
        windowHeight  = $(window).height();

    funcResize = function(){
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


