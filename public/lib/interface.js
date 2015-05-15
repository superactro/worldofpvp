$(function() {

  var hContainer = $('.homeContainer');
  var stats = $('.stats');
  var logo = $('.logo');
  var btnHover = $('#btnHover')[0];
  var mainMenu = $('.mainMenu');
  var statsSwitch = 1;
  var slow = 1000;
  var fast = 500;

  $('a').click( function() {
    btnHover.play();
  });

  logo.fadeOut(fast);
  $(window).click( function() {
    logo.fadeOut(fast);
  });

    stats.click( function() {
      if(!hContainer.is(':animated')) {
        if ( statsSwitch == 1 ) {
          hContainer.animate({top: '+=405',}, fast);
          statsSwitch = 2;
        } else {
          hContainer.animate({top: '-=405',}, fast);
          statsSwitch = 1;
        }
      }
    });

    mainMenu.fadeIn();
    hContainer.delay(fast).fadeIn(slow);

// Start game
$('#canvas').fadeIn(5000);
$('.up').fadeOut();


  /*$('#createBtn').click(function() {
    hContainer.fadeOut(2000);
    $( '#body' ).append( '<iframe class="editorFrame" src="weltmeister.html"></iframe>' );
    $('.editorFrame').css('display', 'block');
    $('.editorFrame').css('z-index', '2');
  });*/
});