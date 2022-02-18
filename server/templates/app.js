
function onClickedEstimatePrice(){
    var sqft = document.getElementById("uiSqft");
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations");
    var estPrice = document.getElementById("price_data");
    var id=document.getElementById("uid");
    var url = "http://127.0.0.1:5000/predict_home_price";

    $.post(url, {
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location.value,
        id:id.value
    },function (data,status){
        estPrice.innerHTML="<h2>"+data.estimated_price.toString()+"Lakh</h2>";
        $('#prediction').modal('toggle');
        document.getElementById('pprice').click();
    });
}


function addData(){
    var sqft = document.getElementById("size").value;
    var bhk = document.getElementById("bhk").value
    var bathrooms = document.getElementById("bath").value
    var location = document.getElementById("uiLocations2").value;
    var price = document.getElementById("worth").value;



    var url = "http://127.0.0.1:5000/addData";

    $.post(url, {
        total_sqft: parseFloat(sqft),
        bhk: bhk,
        bath: bathrooms,
        location: location,
        price:parseFloat(price)
    },function (data,status){
        if (data=="True"){
            document.getElementById('success_data').innerHTML="Thank you for providing Data ";
            $('#data').modal('toggle');
            document.getElementById('success_click').click();
        }else{
            document.getElementById('error_data').innerHTML="Something Went Wrong.. Try Again Later ";
            $('#data').modal('toggle');
            document.getElementById('click').click();
        }
    });
}

function updateData() {
    var id = document.getElementById("edit_id").value;
    var name = document.getElementById("edit_name").value;
    var email = document.getElementById("edit_email").value;
    var mobile_number = document.getElementById("edit_mob").value;
    var address = document.getElementById("edit_address").value;
    var password = document.getElementById("edit_password").value;

    if (mobile_number.length == 10) {

    var url = "http://127.0.0.1:5000/updateData";

    $.post(url, {
        id: id,
        name: name,
        email: email,
        mobile_number: mobile_number,
        address: address,
        password: password
    }, function (data, status) {
        if (data == "True") {
            document.getElementById('success_data').innerHTML = "Updated Successfully ";
            $('#settings').modal('toggle');
            document.getElementById('success_click').click();
        } else {
            document.getElementById('error_data').innerHTML = "Something Went Wrong.. Try Again Later ";
            $('#settings').modal('toggle');
            document.getElementById('click').click();
        }
    });
}
    else{
        document.getElementById('error_data').innerHTML = "Enter Valid Mobile Number ";
            $('#settings').modal('toggle');
            document.getElementById('click').click();
    }
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var i in uiBHK) {
        if(uiBHK[i].checked){
            return parseInt(i) + 1;
        }
    }
    return -1;
}

function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i in uiBathrooms) {
        if(uiBathrooms[i].checked){
            return parseInt(i)+1;
        }
    }
    return -1;
}



function onPageLoad(){
    var url = "http://127.0.0.1:5000/get_location_names";

    $.get(url,function (data,status){
        if (data) {
            var locations = data.locations;
            var uilocation = document.getElementById("uiLocations");
            var uilocation2 = document.getElementById("uiLocations2");
            $("#uiLocations").empty();
            $("#uiLocations2").empty();
            for (var i in locations) {
                var opt=new Option(locations[i]);
                var opt2=new Option(locations[i]);
                $('#uiLocations').append(opt);
                $('#uiLocations2').append(opt2);
            }
        }
    });
}

window.onload=onPageLoad();
