$(document).ready(function(){
	var $fromName = $('#fromName');
	var $fromContactNo = $('#fromContactNo');
	var $fromAddress = $('#fromAddress');
	var $toName = $('#toName');
	var $toContactNo = $('#toContactNo');
	var $toAddress = $('#toAddress');
	var $itemDesc = $('#itemDesc');
//	var $itemAmount = $('#itemAmount');
	var $addOrder = $('#add-order');
	var $postedTime = new Date();
	var $formatTime = formatTime($postedTime);
	var $formatDate = formatDate($postedTime);

	$addOrder.on('click', function(){

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
		  url: 'https://lady-delivery.firebaseio.com/days.json',
		  contentType: "application/json; charset=utf-8",
		  data: JSON.stringify(newOrder),
		  success: function(data) {
		    console.log("Friend added!", data); //the new item is returned with an ID
		  }
		});
	});
});