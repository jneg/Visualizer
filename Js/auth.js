$(document).ready(function () {
  const gotoAuth = function () {window.location.replace('/auth/' + $('#code').val())};

  $('#code').focus();
  $('#access').click(gotoAuth);
  $(document).keypress(function (e) {if (e.which === 13) gotoAuth()});
});
