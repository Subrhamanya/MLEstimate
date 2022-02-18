//variables to access tables
var table;
var table_client;
var table_name;

//function to load data when window opens
function initialise() {
    var tabledata = [
        {id: 1, name: "Oli Bob", age: "12", col: "red", dob: ""},
        {id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982"},
        {id: 3, name: "Christine Lobowski", age: "42", col: "green", dob: "22/05/1982"},
        {id: 4, name: "Brendon Philips", age: "125", col: "orange", dob: "01/08/1980"},
        {id: 5, name: "Margret Marmajuke", age: "16", col: "yellow", dob: "31/01/1999"},
    ];

//load sample data into the table

    table = new Tabulator("#query_tabulator", {
        placehonder:'Loading Data... <span class="fa-3x"><i class="fas fa-spinner fa-pulse"></i></i></span>',
         // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        //assign data to table
        layout: "fitColumns", //fit columns to width of table (optional)
        autoColumns:true
    });


    let query_table=document.getElementById("query_table_structure");

     var url = "http://127.0.0.1:5000/admin/get_db_schema";

    $.post(url, {},function (data,status){
        if(data){
            response=data.schema
            if(typeof response=="undefined")
            {
                query_table.innerHTML="No schema to show."
            }else {
                let data='';
                for (var i in response){
                    data=data+'<a class="nav-link collapsed text-black" href="#" data-bs-toggle="collapse" data-bs-target="#'+response[i].TABLE_NAME+'" aria-expanded="false" aria-controls="'+response[i].TABLE_NAME+'"><div class="sb-nav-link-icon"><i class="fas fa-columns"></i> '+response[i].TABLE_NAME+'<i class="fas fa-angle-down"></i></div></a><div class="collapse" id="'+response[i].TABLE_NAME+'" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion"><ol style="list-style: square">';
                    columns=response[i].COLUMN_NAME.split(',');
                    for(var j in columns){
                    data=data+'<li class="text-black" >'+columns[j]+'</li>';
                    }
                    data=data+'</ol></div>';
                }
                query_table.innerHTML=data;
            }
        }
    });




}

window.onload=initialise();

//filter for admin query

var input = document.getElementById("query_filter");

    input.addEventListener("keyup", function(){
        var filters = [];
        var columns = table.getColumns();
        var search = input.value;
        columns.forEach(function(column){
            filters.push({
                field:column.getField(),
                type:"like",
                value:search,
            });
        });

        table.setFilter([filters]);
    });

//filter for table view
var input2 = document.getElementById("admin_view_table_filter");

    input2.addEventListener("keyup", function(){
        var filters = [];
        var columns = table_client.getColumns();
        var search = input2.value;
        columns.forEach(function(column){
            filters.push({
                field:column.getField(),
                type:"like",
                value:search,
            });
        });

        table_client.setFilter([filters]);
    });

//download options for table

$('#admin_table_view_download_csv').click(function (){
    table_client.download("csv", "MLEstimate.csv");
});

$('#admin_table_view_download_pdf').click(function (){
    table_client.download("pdf", "MLEstimate.pdf", {
        orientation:"portrait", //set page orientation to portrait
        title:"MLEstimate Data", //add title to report
    });
});

$('#admin_table_view_download_xlsx').click(function (){
    table_client.download("xlsx", "MLEstimate.xlsx", {sheetName:"MLEstimate Data"});
});

$('#admin_table_view_download_json').click(function (){
    table_client.download("json", "MLEstimate.json");
});


$('#admin_table_view_delete').click(function (){
    var data=table_client.getSelectedRows();
    var url = "http://127.0.0.1:5000/admin/delete_table_data";
    for(var i in data){
        var id=data[i].getIndex();
        data[i].delete()
        $.post(url,{table_name:table_name,id:id},function (datas,response){
        });
    }
});



//download option for query table
$('#admin_table_query_download_csv').click(function (){
    table.download("csv", "MLEstimate.csv");
});

$('#admin_table_query_download_pdf').click(function (){
    table.download("pdf", "MLEstimate.pdf", {
        orientation:"portrait", //set page orientation to portrait
        title:"MLEstimate Data", //add title to report
    });
});

$('#admin_table_query_download_xlsx').click(function (){
    table.download("xlsx", "MLEstimate.xlsx", {sheetName:"MLEstimate Data"});
});

$('#admin_table_query_download_json').click(function (){
    table.download("json", "MLEstimate.json");
});

//run query for query table
$("#run_query").click(function (){
    var query=document.getElementById('query_textarea').value;
    var url = "http://127.0.0.1:5000/admin/get_query_data";

    $.post(url, {query:query},function (data,status){
        if(data){
            response=data.data
            if(typeof response=="undefined")
            {
                table.clearData();
                document.getElementById("query_error").innerHTML = data.exception;
            }else {
                document.getElementById("query_error").innerHTML = "";
                table.setData(response);
            }
        }
    });

});

//show client data

$("#clients").click(function(){
    document.getElementById("admin_table_view_head").innerText="Clients Data";
    table_name="client";

    let url="http://127.0.0.1:5000/admin/get_client_data";

    $.post(url, {},function (data,status){
        if(data){
            response=data.data
            if(typeof response=="undefined")
            {
                document.getElementById("query_error").innerHTML = data.exception;
            }else {

    table_client = new Tabulator("#admin_table_view_table", {
        index:"id",
        pagination:"local",
        tooltips:true,
        paginationSize:15,
        movableColumns:true,
        resizableRows:true,
        placehonder:'Loading Data... <span class="fa-3x"><i class="fas fa-spinner fa-pulse"></i></i></span>',
         // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        data: response, //assign data to table
        layout: "fitColumns", //fit columns to width of table (optional)
        columns:[
            {formatter:"rowSelection", titleFormatter:"rowSelection", align:"center", headerSort:false},
            {title:"Id",field:"id"},
            {title:"Name",field:"name",editor:"input",validator:["required","string"]},
            {title:"Email",field:"email",editor:"input",validator:["required","unique","regex:.*\\b@.*\\b.com\\b"]},
            {title:"Mobile No",field:"mobile_number",editor:"input",validator:["required","unique","minLength:10", "maxLength:10", "integer"]},
            {title:"Address",field:"address",editor:"input",validator:"required"},
            {title:"Password",field:"password",editor:"input",validator:"required"}
        ],
        cellEdited:function(cell){
            let request=cell.getData();
            let destination="http://127.0.0.1:5000/admin/update_client_data";
            $.post(destination,{data:JSON.stringify(request)},function (datas,response){
                if(data){
                    if(data.status=="fail"){
                        alert("Something Went Wrong");
                    }
                }
            });
    },
    });
            }
        }
    });

});

//show feedback data
$("#feedback").click(function(){
    document.getElementById("admin_table_view_head").innerText="Feedback Data";

    let url="http://127.0.0.1:5000/admin/get_feedback_data";

    table_name="feedback";

    $.post(url, {},function (data,status){
        if(data){
            response=data.data
            if(typeof response=="undefined")
            {
                document.getElementById("query_error").innerHTML = data.exception;
            }else {

    table_client = new Tabulator("#admin_table_view_table", {
        index:"id",
        pagination:"local",
        tooltips:true,
        paginationSize:15,
        movableColumns:true,
        resizableRows:true,
        placehonder:'Loading Data... <span class="fa-3x"><i class="fas fa-spinner fa-pulse"></i></i></span>',
         // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        data: response, //assign data to table
        layout: "fitColumns", //fit columns to width of table (optional)
        columns:[
            {formatter:"rowSelection", titleFormatter:"rowSelection", align:"center", headerSort:false},,
            {title:"Id",field:"id"},
            {title:"Name",field:"name"},
            {title:"Email",field:"email"},
            {title:"Subject",field:"subject"},
            {title:"Message",field:"message",cellClick:function(e, cell){
                alert(cell.getValue());
    },},
            {title:"Message Type",field:"message_type"},
            {title:"Confidence",field: "confidence"}
        ],
    });
            }
        }
    });

});

//show history data

$("#history").click(function(){
    document.getElementById("admin_table_view_head").innerText="History Data";

    let url="http://127.0.0.1:5000/admin/get_history_data";

    table_name="history";

    $.post(url, {},function (data,status){
        if(data){
            response=data.data
            if(typeof response=="undefined")
            {
                document.getElementById("query_error").innerHTML = data.exception;
            }else {

    table_client = new Tabulator("#admin_table_view_table", {
        index:"id",
        pagination:"local",
        tooltips:true,
        paginationSize:15,
        movableColumns:true,
        resizableRows:true,
        placehonder:'Loading Data... <span class="fa-3x"><i class="fas fa-spinner fa-pulse"></i></i></span>',
         // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        data: response, //assign data to table
        layout: "fitColumns", //fit columns to width of table (optional)
        columns:[
            {formatter:"rowSelection", titleFormatter:"rowSelection", align:"center", headerSort:false},
            {title:"Id",field:"id"},
            {title:"Client Id",field:"c_id"},
            {title:"Location",field:"location"},
            {title:"Bathrooms",field:"bath",headerFilter:function(cell, onR, success, cancel, eP) {
    let el = document.createElement('div');
    el.innerHTML = "<select id='table_bath_type' style='width: 50px'>" +
        "<option value='='>=</option>" +
        "<option value='<'><</option>" +
        "<option value='<='><=</option>" +
        "<option value='>'>></option>" +
        "<option value='>='>>=</option>" +
        "</select>&nbsp;&nbsp;<input type='text' name='bath' oninput='filter(this)' style='width:70px'>";
    return el;
}},
            {title:"BHK Size",field:"bhk",headerFilter:function(cell, onR, success, cancel, eP) {
    let el = document.createElement('div');
    el.innerHTML = "<select id='table_bhk_type' style='width: 50px'>" +
        "<option value='='>=</option>" +
        "<option value='<'><</option>" +
        "<option value='<='><=</option>" +
        "<option value='>'>></option>" +
        "<option value='>='>>=</option>" +
        "</select>&nbsp;&nbsp;<input type='text' name='bhk' oninput='filter(this)' style='width:70px'>";
    return el;
}},
            {title:"Area Size(Square Foot)",field: "sqft",headerFilter:function(cell, onR, success, cancel, eP) {
    let el = document.createElement('div');
    el.innerHTML = "<select id='table_sqft_type' style='width: 50px'>" +
        "<option value='='>=</option>" +
        "<option value='<'><</option>" +
        "<option value='<='><=</option>" +
        "<option value='>'>></option>" +
        "<option value='>='>>=</option>" +
        "</select>&nbsp;&nbsp;<input type='text' name='sqft' oninput='filter(this)' style='width:70px'>";
    return el;
}}
        ],
    });
            }
        }
    });

});

function filter(args){
    if (args.value.trim()==""){
        let filters=table_client.getFilters();
        for(var i in filters){
            if(filters[i]['field']==args.name){
                table_client.removeFilter(filters[i]['field'],filters[i]['type'],filters[i]['value']);
            }
        }
    }
    else {
        table_client.setFilter(args.name, document.getElementById(`table_${args.name}_type`).value, parseFloat(args.value));
    }
}


//show datas data

$("#datas").click(function(){
    document.getElementById("admin_table_view_head").innerText="Datas Collected";

    let url="http://127.0.0.1:5000/admin/get_datas_data";

    table_name="datas";

    $.post(url, {},function (data,status){
        if(data){
            response=data.data
            if(typeof response=="undefined")
            {
                document.getElementById("query_error").innerHTML = data.exception;
            }else {

    table_client = new Tabulator("#admin_table_view_table", {
        index:"id",
        pagination:"local",
        tooltips:true,
        paginationSize:15,
        movableColumns:true,
        resizableRows:true,
        placehonder:'Loading Data... <span class="fa-3x"><i class="fas fa-spinner fa-pulse"></i></i></span>',
         // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        data: response, //assign data to table
        layout: "fitColumns", //fit columns to width of table (optional)
        columns:[
            {formatter:"rowSelection", titleFormatter:"rowSelection", align:"center", headerSort:false},
            {title:"Id",field:"id"},
            {title:"Location",field:"location"},
            {title:"Bathrooms",field:"bath",headerFilter:function(cell, onR, success, cancel, eP) {
    let el = document.createElement('div');
    el.innerHTML = "<select id='table_bath_type' style='width: 50px'>" +
        "<option value='='>=</option>" +
        "<option value='<'><</option>" +
        "<option value='<='><=</option>" +
        "<option value='>'>></option>" +
        "<option value='>='>>=</option>" +
        "</select>&nbsp;&nbsp;<input type='text' name='bath' oninput='filter(this)' style='width:70px'>";
    return el;
}},
            {title:"BHK Size",field:"bhk",headerFilter:function(cell, onR, success, cancel, eP) {
    let el = document.createElement('div');
    el.innerHTML = "<select id='table_bhk_type' style='width: 50px'>" +
        "<option value='='>=</option>" +
        "<option value='<'><</option>" +
        "<option value='<='><=</option>" +
        "<option value='>'>></option>" +
        "<option value='>='>>=</option>" +
        "</select>&nbsp;&nbsp;<input type='text' name='bhk' oninput='filter(this)' style='width:70px'>";
    return el;
}},
            {title:"Area Size(Square Foot)",field: "area_size",headerFilter:function(cell, onR, success, cancel, eP) {
    let el = document.createElement('div');
    el.innerHTML = "<select id='table_area_size_type' style='width: 50px'>" +
        "<option value='='>=</option>" +
        "<option value='<'><</option>" +
        "<option value='<='><=</option>" +
        "<option value='>'>></option>" +
        "<option value='>='>>=</option>" +
        "</select>&nbsp;&nbsp;<input type='text' name='area_size' oninput='filter(this)' style='width:70px'>";
    return el;
}},
            {title:"price",field:"price",headerFilter:function(cell, onR, success, cancel, eP) {
    let el = document.createElement('div');
    el.innerHTML = "<select id='table_price_type' style='width: 50px'>" +
        "<option value='='>=</option>" +
        "<option value='<'><</option>" +
        "<option value='<='><=</option>" +
        "<option value='>'>></option>" +
        "<option value='>='>>=</option>" +
        "</select>&nbsp;&nbsp;<input type='text' name='price' oninput='filter(this)' style='width:70px'>";
    return el;
}}
        ],
    });
            }
        }
    });

});


