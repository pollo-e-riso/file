$(document).ready(function() {
    $("#start").click(function() {
      $("#start").removeClass("btn btn-warning active");
      $("#start").addClass("btn btn-warning disabled");
        $("#start").html("Caricamento in corso...");

        $("#pacman").animate({"left": "+=210%"}, 4000);
        $(".rettangolo").animate({"width": "+=210%"}, 4000);
      setTimeout(function() {
        window.location.href = 'pacman.html';
      }, 4000);
    });
  });


