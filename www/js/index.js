/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        start();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    }
};
/******************************main entry point*******************************/
function start(){
    console.log("start");

    /*取得當前host*/    
    current_Url = 'peaches-fire-system.herokuapp.com';
    console.log(current_Url);

/******************************** 登入使用者名稱  login *******************************************/
    $("#login_submit").on('click',onLoginSubmit);
/******************************   查詢使用者  query user*********************************/
    $("#query_user").on('click',onQueryUserClick);
/******************************    地址 address  *********************************/
    $("#map").hide();

    $("#locate_submit").on('click',onLocateClick);

/******************************    頁面轉換 clear資料  *********************************/
    $("a").click(function(e) {
        console.log("a click , start clear something");
        clear();
    });
/****************************** 拍攝照片 photo *****************************/
    $("#file_upload_submit").on('click',onFileUploadClick);
    $("button[name=fileUpload]").on('click',onFileSelectClick);
/****************************** 查詢上傳照片 query photo *****************************/
    $("#query_image").on('click',onQueryImageClick);
}


/******************************* global variable ************************************************************/
/****login 資料*****/
var storeLogin = {
    name : '',
    phone : '',
    date : ''
}
/******************************    clear  *********************************/
function clear () {
    $("input[name='name']").val("");
    $("input[name='phone']").val("");
    $("input[name='fire_position']").val("");

    $("#listview_result-user li").remove();
    
    $("#map").hide();
}

/******************************** 登入使用者名稱  login *******************************************/
function onLoginSubmit () {
    console.log("login submit");

    var name = $("input[name='name']").val();
    var phone = $("input[name='phone']").val();
    var date = new Date();
    var formatDate = js_yyyy_mm_dd(date);
    

    /****將login 資料 儲存成global variable*****/
    storeLogin.name=name;
    storeLogin.phone=phone;
    storeLogin.date=formatDate;

    var loginArray = [];
    loginArray.push({
        name:name,
        phone:phone,
        date:formatDate
    });
    if(name===""){
        alert("請輸入姓名 謝謝");
    }else{
        ajax_loginSubmit(loginArray);
    }
}
function ajax_loginSubmit (loginArray){

    var loginJson = JSON.stringify(loginArray);
    console.log(loginJson);
    $.ajax({
        url: 'http://'+current_Url+'/saveLogin',
        type: 'POST',
        contentType: 'application/json; charset=UTF-8',
        data: loginJson,
        success: function(result){
            console.log("success : login submit");
            alert(result);
            $.mobile.changePage( "#address", { 
                transition: "slideup", 
                changeHash: false 
            });
        },
        error: function(xhr,status){
            alert("error : login submit");
        }
    });
} 
/******************************  查詢使用者  query user *********************************/
function onQueryUserClick(){
    console.log("query user click");

    var username = $("#username").val();

    
    ajax_findLoginUser(username);

}
function ajax_findLoginUser(username){
    console.log(current_Url+'/findLoginUser');
    $.ajax({
        url: 'http://'+current_Url+'/findLoginUser',
        type: 'GET',
        data:{
            username:username
        },
        success: function(result){
            //alert("success : findLoginUser");
            //alert(result.length);
            addLoginUser_listview(result);
        },
        error: function(xhr,status){
            alert("error : findLoginUser");
        }
    });
}

function addLoginUser_listview(result){
    $("#listview_result-user li").remove();

    var output='';
    $.each(result,function(index,value){
        output += '<li><a>'+value.name+'</a></li>'
    });
    $('#listview_result-user').append(output).listview('refresh');
}
/*************************javascript YYYY/MM/DD HH24:MM:SS**********************/
function js_yyyy_mm_dd (examTime) {
      var now = new Date(examTime);
      var year = "" + now.getFullYear();
      var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
      var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
      var formatTime = [year,month,day].join('/');
      return formatTime;
}

/******************************    地址 address  *********************************/
function onLocateClick (){
    console.log("locate");
    $("#map").show();
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
function onSuccess(position) {
    console.log("success located! ");
    console.log('Longitude:'+ position.coords.longitude +'  Latitude :'+position.coords.latitude);
    var longtitude = position.coords.longitude;
    var latitude = position.coords.latitude;
    tinyMap(longtitude,latitude);
}
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
function tinyMap(longtitude,latitude){

        $('#map').tinyMap({
                zoom:16,
                marker: [
                    {addr: [latitude, longtitude], text: 'leanDev'}
                ],
            });
        //再把地圖的中央換為某個位置
        var center = latitude+','+longtitude;
        $('#map').tinyMap(
            'panto', center
        );
        getAddress(latitude,longtitude);
}
//轉換經緯度
function getAddress(latitude,longtitude){
    $.ajax({
        url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longtitude,
        type: 'GET',
        success: function(result){
            console.log("success get address!");
            var address = result.results[0].formatted_address;
            //alert(address);
            $("#fire_position").val(address);
        },
        error: function(xhr,result){
            alert("error");
        }
    });
}


/****************************** 拍攝照片 photo *****************************/
/**************** 選擇照片並預覽 ***********/
function onFileSelectClick(){
    console.log("onFileSelectClick");

    var fileUploadName = $(this).attr("id");
    console.log(fileUploadName);
    //取得某fileUploadName的數字 ex file_upload1 取得最後一個字 1
    var fileNumber = fileUploadName.slice(-1)
    console.log(fileNumber);

    var options = {
        quality:50,
        destinationType:Camera.DestinationType.FILE_URI,
        //從相簿抓檔案
        sourceType:Camera.PictureSourceType.SAVEDPHOTOALBUM
    };
    navigator.camera.getPicture(function(imageData){
        //抓到照片imageData
        console.log("onGetPhotoSuccess");
        //預覽照片
        var imageShow = "#browseImage"+fileNumber;
        //console.log(imageShow);
        //console.log(imageData);
        $(imageShow).attr("src",imageData);
        
        
    },
    onGetPhotoFail,options);
}
// function onGetPhotoSuccess(imageData,fileNumber){
//     console.log("onGetPhotoSuccess");
//     console.log("fileNumber");
//     $("#selectImage").attr("src",imageData);
// }

function onGetPhotoFail(message) {
    alert('onGetPhotoFail because: ' + message);
}
/**************** 上傳照片 ***********/
function onFileUploadClick(){
    console.log("onFileUploadClick");
    $("img[name='browseImage']").each(function(){
        console.log($(this).attr("id"));
        var imageURI = $(this).prop("src");
        console.log(imageURI);

        if(imageURI != null && imageURI != undefined && imageURI != ""){
            console.log(i);
            var serverUpload = 'http://'+'peaches-fire-system.herokuapp.com'+'/fileUpload/';
            //var serverUpload = 'http://'+'192.168.26.109:3000'+'/fileUpload/';
            var options = new FileUploadOptions();
            options.fileKey = '0';
            options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;

            var fileTranfer = new FileTransfer();

            fileTranfer.upload(imageURI,serverUpload,onSuccessUpload,onFailUpload,options);
        }
    });
}

function onSuccessUpload(r){
    $("#upload_status").html("上傳成功: "+r.bytesSent+" bytes");
}

function onFailUpload(error){
     $("#upload_status").html("上傳失敗: "+error.code);
}


/****************************** 查詢上傳照片 query photo *****************************/
function onQueryImageClick(){
    var username = $("input [name='img_username']").val();
    ajax_findImage(username);
}

function ajax_findImage(username){
    console.log(current_Url+'/findImage');
    $.ajax({
        url: 'http://'+current_Url+'/findImage',
        type: 'GET',
        data:{
            username:username
        },
        success: function(result){
            console.log("find Image success");
            //alert("success : findLoginUser");
            alert(result.length);
            addImage(result);
            //addLoginUser_listview(result);
        },
        error: function(xhr,status){
            alert("error : findImage");
        }
    });
}

function addImage(images){
    $("#div-result-image img").remove();
    var output='';
    $.each(images,function(index,value){
        output += '<img style="height:50%;width:100%;" src="data:'+value.contentType+';base64,'+
                  ''+value.bytes+'"/>';

        $("#div-result-image").append(output);
        //clear output
        output='';
    });
    
}



