var audio = document.getElementById("myAudio");
$(document).ready(function() {
    $("#start").click(function() {
      audio.play();
        $("#start").html("<i class = 'fa fa-refresh fa-spin'></i> Loading...");
        $("#start").css("border-radius", "10px");

        $(".pacman").animate({"left": "+=150%"}, 4200);
        $(".rettangolo").animate({"width": "+=150%"}, 4200);

        $(".pacmanD").animate({"left": "-=150%"}, 4200);
        $(".rettangoloD").animate({"width": "+=150%"}, 4200);

      setTimeout(function() {
        window.location.href = 'pacman.html';
      }, 4200);
    });
    $("#freccia").on("click", function() {
      $(this).find("i").toggleClass("up down");
    });
  });


