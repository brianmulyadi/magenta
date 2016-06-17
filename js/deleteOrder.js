$(document).ready(function(){

    var auth = app.auth();

    var accessTokenGot;

    getAccessToken = function() {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                user.getToken().then(function(accessToken) {
                    console.log('Access Token: ' + accessToken);
                    accessTokenGot = accessToken;
                });
            } else {
                console.log('User is not signed in');
            }
            }, function(error) {
                console.log(error);
        });
    };

    getAccessToken();

    $('form').on('submit', function(e) {  

    var order_id = $('#order_id').val();
    console.log('order ID is: ' + order_id);
    var x;

    if (order_id == '') {
        alert('Cannot leave it blank!');
    } else {
        var databaseRef = database.ref().child(uid).child('order');
        databaseRef.once("value", function(snapshot) {
            var x = snapshot.child(order_id).exists();
            console.log('x is: ' + x);
            if (x == true) {
            if (confirm('Are you sure you want to delete the order?')) {
            $.ajax({
                type: 'DELETE',
                url: 'https://lady-delivery.firebaseio.com/'+uid+'/order/'+order_id+'.json?auth='+accessTokenGot,
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    console.log("Order deleted!", data);
                    $("#delete-status > p").text("Order deleted.");

                },
                error: function (jqXHR) {
                    if (jqXHR.status == 401) {
                        alert("401: Authentication Error!");
                    } else if (jqXHR.status == 400) {
                        alert("400: Invalid data format in input");
                    };
                }
            });

            $.ajax({
                type: 'POST',
                url: 'https://hooks.zapier.com/hooks/catch/1402225/upcokh/',
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    console.log("Order deleted!", data);
                },
            });

            $('#order_id').val("");
            }
        } else {
            $("#delete-status > p").text("Order not found.");
        }
        });
    }
});
});