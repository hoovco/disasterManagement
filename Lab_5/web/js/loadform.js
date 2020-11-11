function onSelectReportType(ele){
    var form = $(ele).parent().parent();
    var label = $(form).find(".additional_msg");
    var select = $(form).find(".additional_msg_select");

    switch (ele.value) {
        case "donation":
        case "request":
            label.text("Resource Type:");
            select.find('option').remove();
            select.append($("<option></option>")
                .attr("value","")
                .text("Choose the resource type"));
            selectValues = ['water', 'food', 'money', 'medicine', 'cloth',
                'rescue/volunteer'];
            $.each(selectValues, function(index,value) {
                select.append($("<option></option>")
                    .attr("value",value)
                    .text(value));
            });
            break;
        case "damage":
            label.text("Damage Type:");
            select.find('option').remove();
            select.append($("<option></option>")
                .attr("value","")
                .text("Choose the damage type"));
            selectValues = ['polution', 'building damage', 'road damage', 'casualty',
                'other'];
            $.each(selectValues, function(index,value) {
                select.append($("<option></option>")
                    .attr("value",value)
                    .text(value));
            });
            break;
        default:
            $(form).find(".additional_msg_div").css("visibility", "hidden");
            return;
    }
    $(form).find(".additional_msg_div").css("visibility", "visible");
}

function queryReport(event) {
    console.log("go_1");
    event.preventDefault(); // stop form from submitting normally

    var a = $("#query_report_form").serializeArray();
    a.push({ name: "tab_id", value: "1" });
    console.log("go");
    console.log(a);
    a = a.filter(function(item){return item.value != '';});
    $.ajax({
        url: 'HttpServlet',
        type: 'POST',
        data: a,
        success:
            function(reports) {
            console.log("(Loadform) calling mapinit for query");
            mapInitialization(reports);
            console.log("mapinit works here at line 60");
        },
        error: function(xhr, status, error) {
            alert("Status: " + status + "\nError: " + error);
        }
    });
}

$("#query_report_form").on("submit",queryReport);

function createReport(event) {
    console.log('create report started');
    event.preventDefault();
    var place = autocomplete.getPlace()
    var latitude = place.geometry.location.lat()
    var longitude = place.geometry.location.lng()
    console.log("latitude: " + latitude + "longitude: " + longitude)
    var a = $("#create_report_form").serializeArray();
    a.push({name: "tab_id", value: "0"});
    a.push({name: "latitude", value: latitude});
    a.push({name: "longitude", value: longitude});
    a = a.filter(function(item){return item.value != '';});
    $.ajax({
        url: 'HttpServlet',
        type: 'POST',
        data: a,
        success: function(reports) {
            console.log("(Loadform) calling mapinit");
            showAllReports(); //show all reports makes the page function as neded
            //mapInitialization(reports); I HAVE NO IDEA WHY THIS IS NOT WORKING ARGHHH
            console.log("(Loadform): showAllReports/ mapinit called");
            alert("The report is successfully submitted!");
            console.log('no error in createreportform gtg');
            $("#create_report_form")[0].reset();
            console.log(place); //place data still stored after form reset.
            onPlaceChanged();
            console.log('onPlaceChanged called');
        },
        error: function(xhr, status, error) {
            console.log('error in createreportform');
            alert("REPORT SUBMISSION ERROR: " + status + "\nError: " + error);
        }
    });
}

$("#create_report_form").on("submit",createReport);