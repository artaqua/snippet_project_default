;(function() {

  $('#changeStyles').on('click', function(event) {
    var body = $('body');
    event.preventDefault();
    if ( !body.hasClass('dark') ) {
      body.addClass('dark');
    } else {
      body.removeClass('dark');
    }
  });

})();


