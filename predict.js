function predict(link) {
	/*$.get("https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=10", function(data, status) {
		for (var i = 0; i < data.length - 1; i++) {
			console.log(data[i]);
	  }
	})*/
	prices = [];
	$.getJSON(link, function(data) {
		for(var i = 0; i < data.Data.length; i++) {
			prices[i] = data.Data[i];
		}
		//to get info of certain day, do prices[day].option
    //option can be: time, close, high, low, open, volumefrom, volumeto

    });
}
