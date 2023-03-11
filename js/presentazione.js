$(document).ready(function() {
    $("#start").click(function() {
        $("#start").html("Caricamento in corso...");
        $("#start").css("border-radius", "10px");

        $(".pacman").animate({"left": "+=150%"}, 4000);
        $(".rettangolo").animate({"width": "+=150%"}, 4000);

        $(".pacmanD").animate({"left": "-=150%"}, 4000);
        $(".rettangoloD").animate({"width": "+=150%"}, 4000);

      setTimeout(function() {
        window.location.href = 'pacman.html';
      }, 4000);
    });
  });


