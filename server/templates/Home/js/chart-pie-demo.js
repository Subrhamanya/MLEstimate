// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Pie Chart Example
var url = "http://127.0.0.1:5000/admin/admin_history_analysis";
$.ajax({
   type:"get",
   url:url,
    dataType: "json",
   success:function (data) {
       var labels = data.data.map(function(e) {
   return e.location;
});
       var chart_data = data.data.map(function(e) {
   return e.count;
});
       var colors=[];
       for(var i=0;i<chart_data.length;i++){
           r = Math.floor(Math.random() * 200);
           g = Math.floor(Math.random() * 200);
           b = Math.floor(Math.random() * 200);
           color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
           colors.push(color);
       }
       var ctx = document.getElementById("myPieChart");
       var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: labels,
    datasets: [{
      data: chart_data,
      backgroundColor: colors,
    }],
  },
});
   } ,
    error:function (jqXHR,exception){
       alert('error');
    }
});


