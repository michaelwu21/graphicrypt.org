$(function() {
	$.get("https://api.coinmarketcap.com/v1/ticker/", function(data, status) {
	  for (var i = 0; i < data.length - 1; i++) {
	    if (data[i].id == "litecoin") {
	      $("#price").html(data[i].price_usd);
	    }
	  }
	});
	$("body").click(function () {
		if($("#searchCoin").is(":focus")) {
			$("#sign_in_button").hide();
			$("#searchCoin").addClass("expand");
		} else {
			$("#searchCoin").removeClass("expand");
			$("#sign_in_button").show();
		}
	})
	$("#sign_in_button").click(function() {
		$("#mainpage").hide();
		$("#sign_in").fadeIn(500);
	})
	$(".close_sign").click(function() {
		$("#sign_in").hide();
		$("#sign_up").hide();
		$("#mainpage").fadeIn(500);
	})
});

