$(function() {
// Facebook connect 
var id = null;

// Login
window.fbAsyncInit = function() {
// get proper appId for the localhos or the server app
$.getJSON( 'fbAppId.json', function(data) {
  $.each( data, function( key, val ) {
    id = val;
  });

  FB.init({
    appId      : id,
    status     : true,
    cookie     : true,
    xfbml      : true,
    oauth      : true,
  });
});

};

(function(d) {
  var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = '//connect.facebook.net/en_US/all.js';
  d.getElementsByTagName('head')[0].appendChild(js);
}(document));


/* guest login */
function gLogin() {

  var name = 'guest ' + Math.floor(Math.random()*11);
  $('#playerName').html(name);
  //client(name);
  console.log('name');

// generate random room url
var startUrl = Math.random().toString(36).slice(6);
window.location.hash = startUrl;

// placeholder images

var loginLink = '<h2><a class="loginLink" src="">login</a></h2>';
$('#profileImg').html(loginLink);

}

// facebook login

/* exported login */
function login() {
  FB.login(function(response) {
    if (response.authResponse) {

// get first name
FB.api('/me', function(response) {
  var name = response.first_name;
  $('#playerName').html(name);
  //client(name);
  console.log('name');
// generate random room url
var startUrl = Math.random().toString(36).slice(6);
window.location.hash = startUrl;

});

FB.api(
{
  method: 'fql.query',
  query: 'SELECT uid,name,online_presence FROM user WHERE online_presence = "active" AND uid IN (SELECT uid2 FROM friend where uid1 = me()) ORDER BY rand() LIMIT 20',
},
function(response) {
  for(var i = 0; i <= 7; i++) {
    var friendImg = '<img class="playerImg" src="http://graph.facebook.com/' + response[i].uid + '/picture?width=90&height=90" alt="demo profile image">';
    var friendName = response[i].name.split(' ').slice(0, -1).join(' ');
    var frinedNumName = '.friendName' + i;
    var frinedNumImg = '.friendImgBox' + i;
    $(frinedNumName).html(friendName);
    $(frinedNumImg).html(friendImg);
  }
});


// get profile image
FB.api('/me/picture?width=90&height=90',  function(response) {
  var profileImg = '<img class="playerImg" src="' + response.data.url + '">';
  $('#profileImg').html(profileImg);
});

}
/*else {
  console.log('Login Failed!');
  document.location.href='request.php';

}*/
}, {scope: 'email, read_friendlists, friends_online_presence, user_status, user_online_presence'});
}
// End facebook connect

gLogin();

$('.loginLink').click( function() {
  login();
});
});