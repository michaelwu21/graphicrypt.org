var too_small = false;
$(function() {
	firebase.auth().onAuthStateChanged(function(user) {
		refresh();
	});
	refresh_cache()
	$("html").click(function () {
		if($("#searchCoin").is(":focus")) {
			$("#sign_in_button").hide();
			$("#sign_out_button").hide();
			$("#searchCoin").addClass("expand");
			setTimeout(function() {
				$("#forum_button").hide();
				$("#api").hide();
				$("#api2").hide();
				$("#refresh_button").hide();
			}, 250);
			$("#searchCoin").select();
		} else {
			$("#searchCoin").removeClass("expand");
			setTimeout(function(){
				if (too_small) {
					$("#api").hide();
					$("#api").hide();
				} else {
					$("#api").show();
					$("#api2").show();
				}
				$("#refresh_button").show();
				if(auth()) {
					$("#sign_out_button").show();
					$("#forum_button").show();
				} else {
					$("#sign_in_button").show();
				}
			}, 300);
		}
	});
	var data = JSON.parse(localStorage['jsoncache']);
	var availablecoins = [];
	for (var i = 0; i < data.length - 1; i++) {
		availablecoins.push(data[i].id);
	}
	$( "#searchCoin" ).autocomplete({
    	source: availablecoins,
    	minLength: 2,
    });
    $("#refresh_button").click(function() {
    	refresh_cache();
    	$("#refresh_button").blur();
    })
    $("#forum_button").click(function() {
    	$("#mainpage").hide();
    	get_posts();
    	$("#forum").show();
    });
    $('#navbar').on('submit',function(e){
    	e.preventDefault();
    	var save = false;
    	if (auth()) {	
    		save = true;
    	}
    	add_coin($("#searchCoin").val().toLowerCase(), undefined, true, save, true);
    	$("#searchCoin").val("");
    	$("#searchCoin").blur();
    });
	$("#sign_in_button").click(function() {
		$("#mainpage").hide();
		$("#sign_in").fadeIn(500);
	});
	$(".close_sign").click(function() {
		$("#sign_in").hide();
		$("#sign_up").hide();
		$("#forum").hide();
		$("#mainpage").fadeIn(500);
	});
	$("#switch_sign_in").click(function() {
		$("#sign_up").hide();
		$("#sign_in").fadeIn(500);
	});
	$("#switch_sign_up").click(function() {
		$("#sign_in").hide();
		$("#sign_up").fadeIn(500);
	});
	$("#api").click(function() {
		window.location.href = "https://api.coinmarketcap.com/v1/ticker/";
	});
	$("#api2").click(function() {
		window.location.href = "https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=29&aggregate=3&e=CCCAGG";
	});
	$("#sign_out_button").mouseenter(function() {
		var width = $(this).width();
		$(this).text("Sign Out");
		$(this).width(width);

	});
	$("#sign_out_button").mouseleave(function() {
		$(this).text(short_auth());
	})
	$("#sign_out_button").click(function() {
		sign_out();
	});
	$("#post_forum").on("submit", function(e) {
		e.preventDefault();
		firebase.database().ref("posts").push().set($("#forum_text").val());
	});
	$("#pricing").on('click', "ul li b.remove", function() {
		var coiname = $(this).closest(".theplan").attr("id");
		firebase.database().ref(short_auth().toLowerCase()+"/"+coiname).remove();			
		$(this).closest(".theplan").remove();
	});
	$("#pricing").on('click', "ul li a.pricebutton", function(e) {
		e.preventDefault();
		var token = ""
		var coin = $(this).closest(".theplan").attr("id");
		var data = JSON.parse(localStorage['jsoncache']);
		for(var i=0;i<data.length - 1; i++) {
			if (data[i].id == coin) {
				token = data[i].symbol;
				break;
			}
		}
		var link = "https://min-api.cryptocompare.com/data/histoday?fsym="+ token + "&tsym=USD&limit=29&aggregate=3&e=CCCAGG"
		$("#pricePrediction").show();
		predict(link);


	});
	$(".closeModal").click(function() {
		$("#pricePrediction").fadeOut(400, function() {
			$("#guess").text("Caluculating...")
		});
	});
	$(window).on('resize', function(){
      if ($(window).width() <= 1190) {
      	too_small = true;
      	$("#api").hide();
      	$("#api2").hide();
      } else {
      	too_small = false;	
      	if (!$("#searchCoin").hasClass("expand")) {
      		$("#api").show();
      		$("#api2").show();
      	}
      }
  });
});
jQuery.fn.sortUl = function sortDivs() {
    $("> ul", this[0]).sort(dec_sort).appendTo(this[0]);
    function dec_sort(a, b){ return ($(b).data("sort")) < ($(a).data("sort")) ? 1 : -1; }
}
function load() {
	if ($(window).width() <= 1190) {
	  	too_small = true;
	  	$("#api").hide();
	  	$("#api2").hide();
  } else {
  		too_small = false;	
		$("#api").show();
		$("#api2").show();
  	}
}
function refresh_cache() {
	$.get("https://api.coinmarketcap.com/v1/ticker/", function(data, status) {
		localStorage['jsoncache'] = JSON.stringify(data);
	});
	refresh();
}
function add_coin(coin, pos, highlight=false, save=false, scroll=false, error=false) {
	var found = false;
	if($("#" + coin).length == 0) {
		data = JSON.parse(localStorage['jsoncache']);
	  for (var i = 0; i < data.length - 1; i++) {
	    if (data[i].id == coin) {
	    	if(auth() && save) {
	    		console.log("Saving Coin to Account")
	    		var next_pos = 0;
	    		firebase.database().ref(short_auth().toLowerCase()).once('value', function(snapshot) {
					firebase.database().ref(short_auth().toLowerCase() + "/" + coin).set(snapshot.numChildren());
			 	});
	    	}
	    	coinid = "#" + coin;
	    	var price = data[i].price_usd;
	    	var changehr = data[i].percent_change_1h;
	    	var changeday = data[i].percent_change_24h;
	    	var changeweek = data[i].percent_change_7d;
	    	var cap = data[i].market_cap_usd;
	    	var volume = data[i]["24h_volume_usd"];
	    	var color1 = "";
	    	var color24 = "";
	    	var color7 = "";
	    	if (changehr > 0) {
	    		color1 = "green"
	    	} else if (changehr < 0) {
	    		color1 = "red"
	    	}
	    	if (changeday > 0) {
	    		color24 = "green"
	    	} else if (changeday < 0) {
	    		color24 = "red"
	    	}
	    	if (changeweek > 0) {
	    		color7 = "green"
	    	} else if (changeweek < 0) {
	    		color7 = "red"
	    	}
	        $(".pricing").append("<ul class='theplan' id='" + coin + "' data-sort='" + pos + "'><li class='title'><b>" + coin + "</b></li><li><b>Current Price:&nbsp;</b>$" + price + "</li><li><b>Change 1 Hour:&nbsp;</b>" + changehr + "<b class=" + color1 + ">%</b></li><li><b>Change 1 Day:&nbsp</b>" + changeday + "<b class=" + color24 + ">%</b></li><li><b>Change 1 Week:&nbsp;</b>" + changeweek + "<b class=" + color7 +">%</b></li><li><b>Volume(USD):&nbsp</b>$" + volume + "</li><li><b>Market Cap:&nbsp;</b>$" + cap + "</li><li><b class='red remove'>Remove&nbsp;<i class='fa fa-trash' aria-hidden='true'></i></b></li><li><a class='pricebutton	raise' href=''><span class='icon-tag'></span>Price Predictions</a></li></ul>")
	    	if (scroll) {
	    		$('html, body').animate({
        			scrollTop: $(coinid).offset().top
    			}, 600);
	    	}
	    	if (highlight) {
		    	$(coinid).addClass("border_highlight");
		    	setTimeout(function() {
		    		$(coinid).removeClass("border_highlight")
		    	}, 1000);
	    	}
	    	found = true
	    	$("#pricing").sortUl();
	    	break;
	    }
	  }
	if(!found && error) {
		console.log("error");
	}
	} else {
		console.log("Already Added");
	}

}

function sign_in(username, password) {
	firebase.auth().signInWithEmailAndPassword(username, password).then(function(result) {
		console.log("Signed in succesfully");
		$(".close_sign").trigger("click");
	}, function(error) {
		$("#incorrect").show();
	});
}
function sign_up(username, password) {
	console.log(username, password);
	firebase.auth().createUserWithEmailAndPassword(username, password).then(function(result) {
		console.log("Account Creation Succesful")
		firebase.database().ref(short_auth().toLowerCase()).set({
			bitcoin: 1,
			ethereum: 2,
			litecoin: 3,
			dash: 4,
		});
		refresh();
		$("#pricing").empty();
		$(".close_sign").trigger("click");
	}, function(error) {
		$("#errorOccured").show()
	});
}
function sign_out() {
	firebase.auth().signOut()
}
function auth() {
	var user = firebase.auth().currentUser;
	if (user) {
	  return(true);
	} else {
	  return(false);
	}
}
function get_auth() {
	return firebase.auth().currentUser.email;
}
function short_auth() {
	var user = ""
	try {
		user = firebase.auth().currentUser.email;
	} catch(err) {}
	var index = user.indexOf("@");
	return(user.slice(0, index))
}
function refresh() {
	$("#pricing").empty();
	if (auth()) {
		$("#sign_in_button").hide();
		$("#sign_out_button").text(short_auth());
		$("#sign_out_button").show();
		$("#forum_button").show();
		get_coins();
	} else {
		$("#sign_out_button").hide();
		$("#forum_button").hide();
		$("#sign_in_button").show();
		add_coin('bitcoin', 1);
		add_coin('ethereum', 2);
		add_coin('litecoin', 3);
		add_coin('ripple', 4);
		add_coin('dash', 5);
	}
}
function get_coins(){
	firebase.database().ref(short_auth()).once('value', function(snapshot) {
  	snapshot.forEach(function(childSnapshot) {
    	add_coin(childSnapshot.key, childSnapshot.val());
  });
});
}
function get_posts() {
	$("#posts").empty();
	firebase.database().ref("posts").once("value", function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			$("#posts").append("<br>"+childSnapshot.val()+"<br>");
		})
	})
}