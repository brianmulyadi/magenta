var formatTime = function(time) {
	var hours = time.getHours();
	var minutes = time.getMinutes();

	if (hours < 10)
		hours = '0' + hours;

	if (minutes < 10)
		minutes = '0' + minutes;

	return hours + ":" + minutes;
}

var formatDate = function(time) {
	var day = time.getDate();
	var month = time.getMonth() + 1;

	if (day < 10)
		day = '0' + day;

	if (month < 10)
		month = '0' + month;

	return day + "/" + month;
}

$(document).ready(function(){
	var $postedTime = new Date();
	var $formatTime = formatTime($postedTime);
	var $formatDate = formatDate($postedTime);

	$('form').on('submit', function(e) {
    e.preventDefault();  

    var $fromName = $('#fromName');
    var $fromContactNo = $('#fromContactNo');
    var $fromAddress = $('#fromAddress');
    var $toName = $('#toName');
    var $toContactNo = $('#toContactNo');
    var $toAddress = $('#toAddress');
    var $itemDesc = $('#itemDesc');
    var $addOrder = $('#add-order');

    var newOrder = {
        "order_id": $.now(),
        "date": $formatDate,
        "from": {
            "name": $fromName.val(),
            "phone_no": $fromContactNo.val(),
            "address": $fromAddress.val(),
        },
        "to": {
            "name": $toName.val(),
            "phone_no": $toContactNo.val(),
            "address": $toAddress.val(),
        },
        "item": $itemDesc.val(),
        "status": {
            "posted": {
                "active": true,
                "time": $formatTime,
            },
            "picked": {
                "active": false,
                "time": "",
            },
            "delivered": {
                "active": false,
                "time": "",
            },
        },
    };

    $.ajax({
        type: 'POST',
        url: 'https://lady-delivery.firebaseio.com/order.json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(newOrder), // no need for JSON.stringify here
        success: function(data) {
            console.log("Order added!", data);
        }
    });
});
});