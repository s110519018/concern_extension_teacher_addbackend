//google Meet執行相關
var gstatic_script = document.createElement('script');
gstatic_script.setAttribute('src','https://www.gstatic.com/charts/loader.js');
document.head.appendChild(gstatic_script);

var axios = document.createElement('script');
axios.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js');
axios.setAttribute('crossorigin','anonymous');
document.head.appendChild(axios);


var jquery = document.createElement('script');
jquery.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js');
jquery.setAttribute('crossorigin','anonymous');
document.head.appendChild(jquery);


var body=document.getElementsByTagName('body')[0];
var insert_script = document.createElement("script");
insert_script.innerHTML = `var red_c=0; var green_c=0; var yellow_c=0;

var isClassing_meet="";
var classroomDataID_meet;
var setTimeout_test;
var video;
window.addEventListener("message",function(me) {  
      if(me.data.isClassing=="start"){
        isClassing_meet=me.data.isClassing;
        classroomDataID_meet=me.data.classroomDataID;
        console.log(classroomDataID_meet);
        setTimeout_test = setTimeout(StudentData, 1000);
        document.getElementById("resttime_div").style.display = "none";
      }
      else if(me.data.isClassing=="rest"){
        isClassing_meet=me.data.isClassing;
        console.log(isClassing_meet);
        document.getElementById("resttime_div").style.display = "block";
        document.querySelectorAll(".koV58").forEach(function(each_student){
          each_student.style.border = "8px solid transparent";
        });
      }
      else if(me.data.isClassing=="end"){
        isClassing_meet=me.data.isClassing;
        document.getElementById("resttime_div").style.display = "none";
        document.querySelectorAll(".koV58").forEach(function(each_student){
          each_student.style.border = "8px solid transparent";
        });
      }
      console.log("isClassing_meet"+isClassing_meet);
});

var StudentData = () => {
  clearTimeout(setTimeout_test);
  if(isClassing_meet=="start"){
    $.ajax({
      type: "POST",
      contentType: "application/json",
      dataType: "text",
      url: "https://concern-backend-202106.herokuapp.com/api/teacher/getAllNewData",
      data: JSON.stringify({
        "classroomDataID": classroomDataID_meet
      }),
      success: function (data) {
        if(isClassing_meet == "start"){
          calltest(data);
        }
        else{
          document.querySelectorAll(".koV58").forEach(function(each_student){
            each_student.style.border = "8px solid transparent";
          });
        }
        setTimeout_test = setTimeout(StudentData, 1000);
      },
      error: function (XMLHttpRequest) {
        console.log("error"+XMLHttpRequest.responseText);
        window.postMessage({status: XMLHttpRequest.status});
        setTimeout_test = setTimeout(StudentData, 1000);
      }
    });
  }
};



function calltest(data) {
  // console.log("calltest進入");
  // console.log("data"+data+typeof(data));

  red_c=0; green_c=0; yellow_c=0;

  var response = JSON.parse(data);
  // console.log("response"+response+typeof(response));


  response.forEach(function(r){
    // console.log(JSON.stringify(r));
    var student_everyone=document.querySelectorAll(".YBp7jf");
    student_everyone.forEach(function(student){

        if(student.innerHTML==r.studentGoogleName){
            //console.log(r.studentGoogleName);
            video = student.parentElement.nextElementSibling.nextElementSibling.firstElementChild;
            video.parentElement.parentElement.style.boxSizing = "border-box";
            console.log(r.studentGoogleName+video.getAttribute("data-uid")+"  "+r.newConcernDegree);
            if (r.newConcernDegree != "No Face"&&r.newConcernDegree != "") {
              if (r.newConcernDegree < 0.5 || r.newConcernDegree==0.5) {
                video.parentElement.parentElement.style.border = "12px solid #FE5F55";
                red_c+=1;
              }
              else if (r.newConcernDegree > 0.5 && r.newConcernDegree < 0.8) {
                video.parentElement.parentElement.style.border = "8px solid #ffff00";
                yellow_c+=1
              }
              else if (r.newConcernDegree > 0.8 || r.newConcernDegree==0.8) {
                video.parentElement.parentElement.style.border = "8px solid #00CC66";
                green_c+=1
              }
            }
            else {
              console.log("No Face");
              video.parentElement.parentElement.style.border = "12px solid #FE5F55";
              red_c+=1;
            }
          }
    });
  });
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawChart);
}

function drawChart() {
  var data = new google.visualization.arrayToDataTable([
    ["專注度", "人數", { role: "style" } ],
    ["不專心", red_c, "#FE5F55"],
    ["普通", yellow_c, "#ffff00"],
    ["專心", green_c, "#00CC66"]
 ]);
  var view = new google.visualization.DataView(data);
  view.setColumns([0, 1,
                   { calc: "stringify",
                     sourceColumn: 1,
                     type: "string",
                     role: "annotation" },
                   2]);
  var options = {
    title: "專注度統計",
    width: 400,
    height: 250,
    backgroundColor: "transparent",
    bar: {groupWidth: "95%"},
    legend: { position: "none" },
    titleTextStyle: {
      color: "white",
      fontSize: 23,
      bold: true,
    },
    hAxis: {
      textStyle: {
        color: "#FFFFFF",
        fontSize: 18,
        bold: true
      },
        gridlines: {
            color: "#fff"
        },
        baselineColor: "#fff"
    },
    vAxis: {
      textStyle: {
        color: "#FFFFFF",
        fontSize: 14,
        bold: true
     },
        gridlines: {
            color: "#fff"
        },
        baselineColor: "#fff"
    },
    annotations: {
        alwaysOutside: false,
        textStyle: {
            fontSize: 20,
            auraColor: "none"
        }
    }
  };
  var chart = new google.visualization.ColumnChart(document.getElementById("barchart_values"));
  chart.draw(view, options);
}

document.getElementById("show").addEventListener("click", show);
document.getElementById("hide").addEventListener("click", hide);
function show(){
  document.getElementById("barchart").classList.add("show");
  document.getElementById("barchart").classList.remove("hide");
}
function hide(){
  document.getElementById("barchart").classList.add("hide");
  document.getElementById("barchart").classList.remove("show");
}`;


//barchart
var barchart = document.createElement('div');
barchart.innerHTML=`
<div id="barchart" class="barchart">
  <div style="position: absolute;right: 20px;top: 20px;cursor: pointer;width: 50px;height: 50px;z-index:999999999;" id="hide">
    <svg width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 2.14275L12.857 0L7.5 5.35725L2.14275 0L0 2.14275L5.357 7.5L0 12.8573L2.14275 15L7.5 9.64275L12.857 15L15 12.8573L9.6425 7.5L15 2.14275Z" fill="#E5E5E5"/></svg>
  </div>
  <div id="barchart_values" style="display:flex;align-items: center;justify-content: center;width: auto; height: 300px;margin-bottom: -30px;"></div>
</div>
<div style="z-index:150;position: fixed;right: 20px;bottom: 60px;cursor: pointer;" id="show">
  <svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="37.5" cy="37.5" r="35" fill="#5C5A5B" stroke="#35373A" stroke-width="5"/><path d="M55.0072 55.5723V23.2681H43.2602V55.5723H37.3867V35.0151H25.6397V55.5723H21.2346V17.3946H18.2979V55.5723C18.2979 56.3512 18.6073 57.0981 19.158 57.6489C19.7088 58.1996 20.4557 58.509 21.2346 58.509H59.4123V55.5723H55.0072ZM34.45 55.5723H28.5765V37.9518H34.45V55.5723ZM52.0704 55.5723H46.1969V26.2048H52.0704V55.5723Z" fill="white"/></svg>
</div>
<div id="resttime_div">
    下課中
</div>
`;
//barchart的css
var barchart_css = document.createElement("style");
barchart_css.innerHTML =`
.barchart{  
  z-index:150; 
  position: fixed;  
  right: 100px;  
  bottom: 100px;  
  background-color: rgba(0, 0, 0, 0.5);  
  transform: scale(0);  
  opacity:0;  
  transform-origin: bottom right;
}
.show{  
  height: 300px;
  -webkit-transition: 1s;  
  -moz-transition: 1s;  
  -ms-transition: 1s;  
  -o-transition: 1s; 
  transition: 1s;  
  opacity:1;  
  transform: scale(1)  !important;
}
.hide{  
  -webkit-transition: 1s;  
  -moz-transition: 1s;
  -ms-transition: 1s;  
  -o-transition: 1s;  
  transition: 1s; 
  opacity:0;  
  transform: scale(0)  !important;
}

#resttime_div{ 
  display: none;
  z-index:150; 
  position: fixed; 
  top: 0;
  left: 0;
  width: 100px;
  background-color: rgba(255, 255, 255, 0.65);  
  transform-origin: center center;
  text-align: center;
  font-family: Noto Sans TC;
  font-weight: bold;
  color: #000000;
  font-size: 20px;
  line-height:60px;
}
`;


//課程實施相關
var classroomDataID;
var tooltipClassname;
var teacherName;
var teacherDataID;
var courseDataID;
var courses;
var autoadmin;
//後台登入資料
var teacher_name;
var teacher_id;
const onMessage = (message) => {
  switch (message.action) {
    case 'OPEN':
      open(message.name);
      break;
    case 'START':
      start();
      break;
    case 'REST_START':
      rest_start();
      break;
    case 'REST_END':
      rest_end();
      break;
    case 'END':
      end();
      break;
    case 'CLOSE':
      close();
      break;
    case 'SURE':
      sure(message.teacher_name,message.teacher_id);
      break;
    case 'LOGIN':
      login();
      break;
    case 'ADDNEWCOURSE':
      addnewCourse(message.newCourse);
      break;
    case 'SELECTCLASS':
      selectClass(message.courseDataID);
      break;
    case 'AUTOADMIN_START':
      autoadmin=setInterval(adminSystem, 1000);
      break;
    case 'AUTOADMIN_END':
      clearInterval(autoadmin);
      break;
    case 'OPENBACKENDWEB':
      openBackendweb();
      break;
    default:
      break;
  }
}
chrome.runtime.onMessage.addListener(onMessage);
function open(name) {
  if (name == '') {
    alert("請填入名字");
  }
  else {
    if(document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d')==null && document.querySelector('.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.tWDL4c.jh0Tpd.Gt6sbf.QQrMi.ftJPW')==null){
      //還沒進入會議
      alert("請進入會議後再啟動!");
    }
    else{
      chrome.runtime.sendMessage({isClassing:0});
      // console.log("開啟教室");
      teacherName=name;
      $.ajax({
        type:"POST",
        contentType: 'application/json',
        dataType: "json",
        url: "https://concern-backend-202106.herokuapp.com/api/teacher/openClassroom",
        data: JSON.stringify({
          "teacherName":  teacherName,
          "classroomMeetID": window.location.pathname.substr(1),
        }),
        success: function(data) {
          console.log("開啟教室成功"+data.classroomDataID);
          classroomDataID = data.classroomDataID;
          chrome.runtime.sendMessage({isClassing:2});
        },
        error: function(XMLHttpRequest){
          console.log(XMLHttpRequest.responseText);
          alert("開啟教室失敗");
          //回去開啟教室
          chrome.runtime.sendMessage({isClassing:1});  
        }
      });
    }

  }
}
function start(){
  chrome.runtime.sendMessage({isClassing:0});
  $.ajax({
    type:"POST",
    contentType: 'application/json',
    dataType: "text",
    url: "https://concern-backend-202106.herokuapp.com/api/teacher/startClass",
    data: JSON.stringify({
      "classroomDataID": classroomDataID
    }),
    success: function(data) {
        console.log(data);
        body.appendChild(barchart_css);
        body.appendChild(barchart);
        body.appendChild(insert_script);
        window.postMessage({isClassing:"start",classroomDataID:classroomDataID});
        chrome.runtime.sendMessage({isClassing:3});
        if(document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d')!=null){
          document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d').setAttribute('aria-disabled', true);
          document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d').setAttribute('data-tooltip', "請透過疫距數得結束課程");
          document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d').setAttribute('aria-label', "請透過疫距數得結束課程");
          document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d').style.background='#D0D0D0';
        }
        else if(document.querySelector('.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.tWDL4c.jh0Tpd.Gt6sbf.QQrMi.ftJPW')!=null){
          //新版介面
          document.querySelector('.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.tWDL4c.jh0Tpd.Gt6sbf.QQrMi.ftJPW').disabled=true;
          tooltipClassname=document.querySelector('[aria-label="退出通話"]').nextElementSibling.className;
          // console.log(tooltipClassname);
          if(document.querySelector('[aria-label="退出通話"]').nextElementSibling.classList.contains(tooltipClassname)){
            document.querySelector('[aria-label="退出通話"]').nextElementSibling.classList.remove(tooltipClassname);
          }
          document.querySelector('[aria-label="退出通話"]').nextElementSibling.innerHTML="請透過疫距數得結束課程";
        }
        
    },
    error: function(XMLHttpRequest){
      //無此教室資訊
      console.log(XMLHttpRequest.responseText);
      alert("無此教室資訊!");
      //回去開啟教室
      chrome.runtime.sendMessage({isClassing:1});  
    }
  });
}
function rest_start(){
  chrome.runtime.sendMessage({isClassing:0});
  $.ajax({
    type:"POST",
    contentType: 'application/json',
    dataType: "text",
    url: "https://concern-backend-202106.herokuapp.com/api/teacher/startRest",
    data: JSON.stringify({
      "classroomDataID": classroomDataID
    }),
    success: function(data) {
        console.log("下課成功"+data);
        window.postMessage({isClassing:"rest"});
        chrome.runtime.sendMessage({isClassing:4});     
    },
    error: function(XMLHttpRequest){
      console.log(XMLHttpRequest.responseText);
      if(XMLHttpRequest.status == 401){
        alert(XMLHttpRequest.responseText);
        //回去開始上課
        chrome.runtime.sendMessage({isClassing:3});  
      }
      else{
        //無此教室資訊
        alert("無此教室資訊!");
        //回去開啟教室
        chrome.runtime.sendMessage({isClassing:1});  
      }
    }
  });
}
function rest_end(){
  chrome.runtime.sendMessage({isClassing:0});
  $.ajax({
    type:"POST",
    contentType: 'application/json',
    dataType: "text",
    url: "https://concern-backend-202106.herokuapp.com/api/teacher/endRest",
    data: JSON.stringify({
      "classroomDataID": classroomDataID
    }),
    success: function(data) {
        console.log("繼續上課"+data);
        window.postMessage({isClassing:"start",classroomDataID:classroomDataID});
        chrome.runtime.sendMessage({isClassing:3});     
    },
    error: function(XMLHttpRequest){
      console.log(XMLHttpRequest.responseText);
      if(XMLHttpRequest.status == 401){
        //非下課時間
        alert(XMLHttpRequest.responseText);
        chrome.runtime.sendMessage({isClassing:3});  
      }
      else if(XMLHttpRequest.status == 403){
        //回去開始上課
        alert(XMLHttpRequest.responseText);
        chrome.runtime.sendMessage({isClassing:3});  
      }
      else{
        //無此教室資訊
        console.log(XMLHttpRequest.responseText);
        alert("無此教室資訊!");
        //回去開啟教室
        chrome.runtime.sendMessage({isClassing:1});
      } 
    }
  });
}
function end(){
  chrome.runtime.sendMessage({isClassing:0});
  $.ajax({
    type:"POST",
    contentType: 'application/json',
    dataType: "text",
    url: "https://concern-backend-202106.herokuapp.com/api/teacher/endClass",
    data: JSON.stringify({ 
      "classroomDataID":classroomDataID
    }),
    success: function (data) {
        chrome.runtime.sendMessage({isClassing:6});
        console.log(data);
        window.postMessage({isClassing:"end"});
        if(autoadmin!=null){
          clearInterval(autoadmin);
        }
        barchart.remove();
        barchart_css.remove();
        chrome.runtime.sendMessage({isClassing:5});
    },
    error: function(XMLHttpRequest){
      //無此教室資訊
      console.log(XMLHttpRequest.responseText);
      alert("無此教室資訊!");
      chrome.runtime.sendMessage({isClassing:1});
    }
  });
}

function close(){
  chrome.runtime.sendMessage({isClassing:0});
  chrome.runtime.sendMessage({isClassing:6});
  $.ajax({
    type:"POST",
    contentType: 'application/json',
    dataType: "text",
    url: "https://concern-backend-202106.herokuapp.com/api/teacher/closeClassroom",
    data: JSON.stringify({
      "classroomDataID": classroomDataID
    }),
    success: function(data) {
      console.log(data);
      if(document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d')!=null){
        //舊版介面
        document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d').setAttribute('aria-disabled', false);
        document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d').click();
      }
      else if (document.querySelector('.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.tWDL4c.jh0Tpd.Gt6sbf.QQrMi.ftJPW')!=null){
        //新版介面
        document.querySelector('.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.tWDL4c.jh0Tpd.Gt6sbf.QQrMi.ftJPW').disabled=false;
        document.querySelector('[aria-label="退出通話"]').nextElementSibling.className+=tooltipClassname;
        document.querySelector('.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.tWDL4c.jh0Tpd.Gt6sbf.QQrMi.ftJPW').click();
      }
      chrome.runtime.sendMessage({
        msg: 'createWindow',
        data:{
          teacherName: teacherName,
          classroomDataID: classroomDataID,
          rankCount: 3,
          timeSpacing: 60
        }
      });
      chrome.runtime.sendMessage({isClassing:1});

    },
    error: function(XMLHttpRequest){
      //無此教室資訊
      console.log(XMLHttpRequest.responseText);
      alert("無此教室資訊!");
      chrome.runtime.sendMessage({isClassing:1});
    }
  });
}
function sure(teachername,teacherid){
  chrome.runtime.sendMessage({isClassing:6});
  if (teachername == ''||teacherid == '') {
    alert("請輸入資料!");
  }
  else{
    teacher_name=teachername;
    teacher_id=teacherid;
    chrome.runtime.sendMessage({isClassing:11,checkteacherName:teacher_name,checkteacherID:teacher_id});
  }
}
function login(){
  chrome.runtime.sendMessage({isClassing:6});
  $.ajax({
    type:"POST",
    contentType: 'application/json',
    dataType: "json",
    url: "https://concern-backend-202106.herokuapp.com/api/teacher/teacherRegisterLogin",
    data: JSON.stringify({
      "teacherName": teacher_name,
      "teacherID":teacher_id
    }),
    success: function(data) {
      console.log("成功登入");
      teacherDataID = data.teacherDataID ;
      courses=data.courses;
      chrome.runtime.sendMessage({isClassing:8,courses:courses});
    },
    error: function(XMLHttpRequest){
      //告知登入失敗並提供代碼
      alert('登入失敗，代碼'+XMLHttpRequest.status+'請重新輸入資料！');
      chrome.runtime.sendMessage({isClassing:7});
    }
  });
}
function addnewCourse(courseName){
  if (courseName == '') {
    alert("請輸入課程名稱!");
  }
  else {
    chrome.runtime.sendMessage({isClassing:6});
    $.ajax({
      type:"POST",
      contentType: 'application/json',
      dataType: "json",
      url: "https://concern-backend-202106.herokuapp.com/api/course/addCourse",
      data: JSON.stringify({
        "teacherDataID": teacherDataID,
        "courseName":courseName
      }),
      success: function(data) {
        console.log("成功新增課程");
        courses=data.courses;
        chrome.runtime.sendMessage({isClassing:8,courses:courses});
      },
      error: function(XMLHttpRequest){
        console.log(XMLHttpRequest.responseText);
        if(XMLHttpRequest.status===403){
          //課程已存在
          alert("課程已存在");
          chrome.runtime.sendMessage({isClassing:9});
        }
        else{
          //尚無此位老師
          alert("尚無此位老師");
          chrome.runtime.sendMessage({isClassing:7});
        }
      }
    });
  }
}
function selectClass(courseDataID_function){
  if(courseDataID_function==null ||courseDataID_function==""||courseDataID_function==''){
    alert("請選擇課程!");
  }
  else{
    courseDataID=courseDataID_function;
    chrome.runtime.sendMessage({isClassing:6});
    $.ajax({
      type:"POST",
      contentType: 'application/json',
      dataType: "json",
      url: "https://concern-backend-202106.herokuapp.com/api/course/linkClassroomToCourseWeek",
      data: JSON.stringify({
        "courseDataID": courseDataID,
        "classroomDataID": classroomDataID
      }),
      success: function(data) {
        console.log("連結成功"+data);
        // data.weekName
        chrome.runtime.sendMessage({isClassing:10,courseName:data.courseName});
      },
      error: function(XMLHttpRequest){
        console.log(XMLHttpRequest.responseText);
        if(XMLHttpRequest.status===403){
          //尚無此教室
          alert("尚無此教室!");
          chrome.runtime.sendMessage({isClassing:1});
        }
        else{
          //尚無此堂課程或無法重複連結
          alert('代碼:'+XMLHttpRequest.status+"尚無此堂課程或無法重複連結");
          chrome.runtime.sendMessage({isClassing:8});
        }
      }
    });
  }
}
//比對系統
function adminSystem() {
  // console.log("自動比對");
  for (let element of document.getElementsByTagName('span')) {
      if (element.innerHTML === '接受') {
          // console.log(courseDataID+document.querySelector(".W0LGoe").innerHTML);
          document.querySelector(".AmEdyd").innerHTML="辨識是否為課堂成員中...";
          $.ajax({
            type:"POST",
            contentType: 'application/json',
            dataType: "text",
            url: "https://concern-backend-202106.herokuapp.com/api/course/checkStudentInList",
            data: JSON.stringify({
              "courseDataID": courseDataID,
              "studentGoogleName": document.querySelector(".W0LGoe").innerHTML
            }),
            success: function(data) {
              // console.log(data);
              if(data=="true"){
                element.click();
              }
              else{
                // console.log("課程名單中無此人");
                if(document.querySelector(".AmEdyd")!=null){
                  document.querySelector(".AmEdyd").innerHTML="課程名單中無此人";
                }
              }
            },
            error: function(XMLHttpRequest){
              console.log(XMLHttpRequest.responseText);
              //無此課程
              // console.log("無此課程");
            }
          });
      }
  }
}

function openBackendweb(){
  //傳遞以下querysting開啟後台
  // TeacherDataID
  // CourseDataID
  // ClassroomDataID
  chrome.runtime.sendMessage({
    msg: 'openBackendweb',
    data:{
      TeacherDataID: teacherDataID,
      CourseDataID: courseDataID,
      ClassroomDataID:classroomDataID
    }
  });
}

window.addEventListener("message",function(me) {
  // console.log("教師端監聽me.data.status"+me.data.status);
  if(me.data.status==404){
    //無此教室資訊
    chrome.runtime.sendMessage({isClassing:1});
  }
  else if(me.data.status==200){
    //上課中
    chrome.runtime.sendMessage({isClassing:3});
  }
});
