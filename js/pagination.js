var page = 1;
var itemAmount = 10;
var orderLength = $("#wrap > div").length;
var orderLengthMinus = orderLength - itemAmount;
var testArea = document.getElementById('testArea');

$("#wrap > div").slice(itemAmount,orderLength).hide();

for (i=0;i < orderLengthMinus; i += itemAmount) {
	
  var j = i + itemAmount;
  var pageNumber = (i/10)+1;
  var num = pageNumber.toString();
  var pageClass = "page"+num;
  $("#wrap > div").slice(i,j).addClass(pageClass).css("background","yellow");
};
var x = orderLength / itemAmount; 
var y = Math.floor(x);
var z = y  * itemAmount;

var q = y + 1;
var num = q.toString();
var pageClass = "page"+num;

$("#wrap > div").slice(z,orderLength).addClass(pageClass).css("background","yellow").hide();

var maxPage = q;

$('.next').on('click',function(){
    if(page < maxPage) {
	    $("#wrap > div:visible").hide();
        $('.page' + ++page).show();
    }
})
$('.prev').on('click',function(){
    if(page > 1) {
	    $("#wrap > div:visible").hide();
        $('.page' + --page).show();
    }
})


