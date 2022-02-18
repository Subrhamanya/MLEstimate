// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Bar Chart Example


var url = "http://127.0.0.1:5000/admin/admin_feedback_analysis";
$.ajax({
   type:"get",
   url:url,
    dataType: "json",
   success:function (data) {
       var labels = data.data.map(function(e) {
   return e.message_type;
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

       var ctx = document.getElementById("myBarChart");
var myLineChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [{
      label: "Message_Type",
      backgroundColor: colors,
      borderColor: "rgba(2,117,216,1)",
      data: chart_data,
    }],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'Month'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 6
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          maxTicksLimit: 5
        },
        gridLines: {
          display: true
        }
      }],
    },
    legend: {
      display: false
    }
  }
});

   } ,
    error:function (jqXHR,exception){
       alert('error');
    }
});



