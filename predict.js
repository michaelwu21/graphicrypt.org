function predict(link) {
	prices = [];
	$.getJSON(link, function(data) {
		for(var i = 0; i < data.Data.length; i++) {
			prices[i] = data.Data[i];
		}
		//to get info of certain day, do prices[day].option
    //option can be: time, close, high, low, open, volumefrom, volumeto

    });
}
