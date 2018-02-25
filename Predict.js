function predict(link) {
	var percentGrowth = 0; 
	var predictedPrice = 0; 
	var predictedHigh = 0;
	var predictedLow = 0; 
	var predictedAverage = 0; 
	var predictedPrice = 0;
	prices = [];
    graphCoor = [];
    days = [];
	$.getJSON(link, function(data) {
		for(var i = 0; i < data.Data.length; i++) {
			prices[i] = data.Data[i];
            graphCoor[i] = data.Data[i].close;
            days[i] = (30-i)*3;
		}
		console.log(prices)
		//to get info of certain day, do prices[day].option
    //option can be: time, close, high, low, open, volumefrom, volumeto
    	
    	//calculate percent growth over time
    	for(var i = 1; i < prices.length -1; i ++)
    	{
            if(prices[i-1].close != 0) {
    		  percentGrowth  += (prices[i].close - prices[i - 1].close) / prices[i -1].close;
    	    } else {
                percentGrowth += 0;
            }
        }
    	//calculate average high 
    	for(var i = 0; i < prices.length -1; i++)
    	{
    		predictedHigh += prices[i].high;
    	}
    	//calculate average low
    	for(var i = 0; i < prices.length-1; i++)
    	{
    		predictedLow += prices[i].low;
    	}


    //calculate 

    percentGrowth = percentGrowth / (prices.length - 1); 
    predictedHigh = predictedHigh / prices.length;
    predictedLow = predictedLow / prices.length;
    predictedAverage = (predictedHigh + predictedLow) / 2; 

    predictedPrice = data.Data[prices.length - 1].close * (1+percentGrowth);
    predictedPrice = (predictedPrice + predictedAverage) / 2;
    $("#guess").text(predictedPrice);  
    var ctx = document.getElementById('graph').getContext('2d');
    console.log(graphCoor, days);
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: "Price",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: graphCoor,
            }]
        },
        //options: options
    });


    });
}