var audio = document.getElementById("myAudio");
$(document).ready(function() {
  $("#start").click(function() {
    audio.play();
    $("#start").html("<i class='fa fa-refresh fa-spin'></i> Loading...");
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
    var i = $(this).find("i");
    if (i.hasClass("up")) {//controlla se ha quella classe
      $("body").css("background-color", "red");
      i.removeClass("up").addClass("down");
    } else {
      $("body").css("background-color", "black");
      i.removeClass("down").addClass("up");
    }
  });
});
