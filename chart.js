//-----------------搜尋-------------------
(function(document) {
  'use strict'; //嚴謹模式

  // 建立 LightTableFilter
  var LightTableFilter = (function(Arr) {
    var _input;

    // 資料輸入事件處理函數
    function _onInputEvent(e) {
      _input = e.target;
      var tables = document.getElementsByClassName(_input.getAttribute('data-table'));
      Arr.forEach.call(tables, function(table) {
        Arr.forEach.call(table.tBodies, function(tbody) {
          Arr.forEach.call(tbody.rows, _filter);
        });
      });
    }

    // 資料篩選函數，顯示包含關鍵字的列，其餘隱藏
    function _filter(row) {
      var text = row.textContent.toLowerCase(), val = _input.value.toLowerCase();
      row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
    }

    return {
      // 初始化函數
      init: function() {
        var inputs = document.getElementsByClassName('light-table-filter');
        Arr.forEach.call(inputs, function(input) {
          input.oninput = _onInputEvent;
        });
      }
    };
  })(Array.prototype);

  // 網頁載入完成後，啟動 LightTableFilter
  document.addEventListener('readystatechange', function() {
    if (document.readyState === 'complete') {
      LightTableFilter.init();
    }
  });

})(document);

//-----------------頁面產生-------------------
const url = new URL(window.location.href);
var classroomDataID=url.searchParams.get('classroomDataID');
var teacherName=url.searchParams.get('teacherName');
var rankCount=url.searchParams.get('rankCount');
var timeSpacing=url.searchParams.get('timeSpacing');
console.log("classroomDataID"+classroomDataID);
console.log("teacherName"+teacherName);
console.log("rankCount"+rankCount);
console.log("timeSpacing"+timeSpacing);

var slider_Ave = document.getElementById("ClassAveRange");
var slider_Count = document.getElementById("ClassCountRange");
var slider_student = document.getElementById("StudentRange");
var dict = {}; // 學生資訊字典
var NowstudentID; //儲存現在學生圖表顯示的人

try {
    //------------------------------slider們
    slider_Ave_func();
    slider_Count_func();
    slider_student_func();
    //------------------------------header
    $('#sayhello').text("你好， "+teacherName+" 老師！");
    //------------------------------排名
    $.ajax({
      type:"POST",
      contentType: 'application/json',
      dataType: "json",
      url: "https://concern-backend-202106.herokuapp.com/api/classroom/getRankData",
      data: JSON.stringify({
          "classroomDataID":  classroomDataID,
          "rankCount": rankCount
      }),
      success: function (msg) {
          // console.log(msg);
          CreateRank(msg);
      },
      error: function(error){
          console.log(error);
          if(error.responseText=="此教室尚無學生資料"){
            $('#error').text('此教室尚無學生資料');
          }
          $('.container').css('display', 'none');
          $('#error').css('display', 'block');
      }
  });
    //------------------------------全班資訊
    $.ajax({
      type:"POST",
      contentType: 'application/json',
      dataType: "json",
      url: "https://concern-backend-202106.herokuapp.com/api/classroom/getStatisticsDiagram",
      data: JSON.stringify({
          "classroomDataID": classroomDataID,
          "timeSpacing": timeSpacing
      }),
      success: function (msg) {
          // console.log(msg);
          DataCategory_ave(msg);
          DataCategory_count(msg);
      },
      error: function(error){
          console.log(error);
          if(error.responseText=="此教室尚無學生資料"){
            $('#error').text('此教室尚無學生資料');
          }
          $('.container').css('display', 'none');
          $('#error').css('display', 'block');
      }
    });
    //------------------------------同學個人資訊
    $.ajax({
      type:"POST",
      contentType: 'application/json',
      dataType: "json",
      url: "https://concern-backend-202106.herokuapp.com/api/classroom/getPersonDiagramList",
      data: JSON.stringify({
        "classroomDataID": classroomDataID,
        "timeSpacing": timeSpacing
      }),
      success: function (msg) {
        // console.log(msg);
        createClassList(msg);
      },
      error: function(error){
        console.log(error.responseText);
        $('.container').css('display', 'none');
        $('#error').css('display', 'block');
      }
    });
} catch (error) {
    console.log(error);
    if(error=="此教室尚無學生資料"){
      $('#error').text('此教室尚無學生資料');
    }
    $('.container').css('display', 'none');
    $('#error').css('display', 'block');
}
//------------------------------
//排名
function CreateRank(results) {
  if(results==undefined){
      return
  }
  results.aveConcernRank.forEach(function(r){
    // console.log(r.aveConcern);
    var html=`
    <div class="each_block">
        <div class="block_top rank`+r.rank+`">`+
            r.studentName+`<br>`+r.studentID+
        `</div>
        <div class="block_bottom">`+
            r.aveConcern.toString()
        +`</div>
    </div>`;
    $('#aveConcernRank>.rank_block').append(html);    
  });
  results.bestLastedRank.forEach(function(r){
    // console.log(r.bestLasted);
    var html=`
    <div class="each_block">
        <div class="block_top rank`+r.rank+`">`+
            r.studentName+`<br>`+r.studentID+
        `</div>
        <div class="block_bottom">`+
            r.bestLasted.toString()
        +`</div>
    </div>`;
    $('#bestLastedRank>.rank_block').append(html);    
  });
  results.concernPercentageRank.forEach(function(r){
    // console.log(r.concernPercentage);
    var html=`
    <div class="each_block">
        <div class="block_top rank`+r.rank+`">`+
            r.studentName+`<br>`+r.studentID+
        `</div>
        <div class="block_bottom">`+
            r.concernPercentage.toString()
        +`</div>
    </div>`;
    $('#concernPercentageRank>.rank_block').append(html);    
    $('#loading_rank').css('display', 'none');
  });
}
//------------------------------
//全班數據分類_平均
function DataCategory_ave(results) {
  if(results==undefined){
      return
  }
  var times = [];
  var concerns = [];
  var concernValues;
  results.forEach(function(r){
    //時間
    times.push(r.time);
    concernValues=null;
    if(r.aveConcernDegree>0.8 || r.aveConcernDegree==0.8)
      concernValues=1;
    else if (r.aveConcernDegree<0.8&&r.aveConcernDegree>0.5)
      concernValues=0.5;
    else if ((r.aveConcernDegree<0.5 || r.aveConcernDegree==0.5) &&r.aveConcernDegree!=null)
      concernValues=0;
    concerns.push(concernValues);
    // if(r.aveConcernDegree>0.8){
    //   concerns.push(1);
    // }
    // else{
    //   concerns.push(r.aveConcernDegree);
    // }
  })
  //呼叫全班平均專注度
  drawaveChart_class(times,concerns);
}
//全班數據分類_各程度人數
function DataCategory_count(results) {

  if(results==undefined){
      return
  }
  var times = [];
  var concentratedCount = [];
  var normalCount = [];
  var unconcentratedCount = [];
  var dataCount = [];
  // var concernValues;
  results.forEach(function(r){
    //時間
    times.push(r.time);
    //各程度人數&總人數
    concentratedCount.push(r.concentratedCount);
    normalCount.push(r.normalCount);
    unconcentratedCount.push(r.unconcentratedCount);
    dataCount.push(r.dataCount);
  })
  //呼叫全班各程度人數
  drawcountChart_class(times,dataCount,concentratedCount,normalCount,unconcentratedCount);
}

//全班平均專注度圖表繪製
function drawaveChart_class(times,concerns) {

  if(times==undefined || concerns==undefined){
    console.log("times==undefined || concerns==undefined");
    $('.container').css('display', 'none');
    $('#error').css('display', 'block');
    return
  }
  const data = {
    labels: times,
    datasets: [{
      label: "全班平均",
      backgroundColor: '#82A098',
      borderColor: '#82A098',
      data: concerns,
      fill: false,
      tension: 0.1
    }]
  };
  const ave_config = {
    type: 'line',
    data,
    options: {
      scales: {
        x:{
          title: {
            display: true,
            text: '時間',
            font: {
              size: 18
            },
            color: '#82A098',
          }  
        },
        y: {
          title: {
            display: true,
            text: '專注度',
            font: {
              size: 18
            },
            color: '#82A098',
          },
          ticks: {
            callback: function(value) {
              if(value==1)
                return '專心' ;
              else if (value==0.5)
                return '普通' ;
              else if (value==0)
                return '不專心' ;
            }
          },
          beginAtZero: true
        }
      },
      plugins: {
        title: {
            display: true,
            text: "課程期間全班平均專注度統計",
            align:'start',
            font: {
              size: 18,
            }
        },
        legend: {
          display: false,
          align: 'center',
          position: 'top',
          labels:{
            padding: 10,
          }
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
                if(tooltipItem.parsed.y==1)
                return '專心' ;
              else if (tooltipItem.parsed.y==0.5)
                return '普通' ;
              else if (tooltipItem.parsed.y==0)
                return '不專心' ;
            },
          }
        }
      },
      bezierCurve : false,
      animation: {
        onComplete: drawavedone
        // duration: 0
      }
    },
    plugins: [
      {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
          const ctx = chart.canvas.getContext('2d');
          ctx.save();
          ctx.globalCompositeOperation = 'destination-over';
          // ctx.fillStyle = '#FAF9F9';
          ctx.fillStyle = '#FFF';
          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        }
      } 
    ],
  };
  //繪製圖表
  drawaveChart = new Chart(
    document.getElementById("drawaveChart").getContext("2d"),
    ave_config
  ); 
  $('#loading_class_ave').css('display', 'none');
  $('#ClassAveRange').parent().css('display', 'block');
}

function drawavedone(){
  var imgUri = drawaveChart.toBase64Image();
      $('#download_class').css('display', 'block');
    var a = document.getElementById("download_class");
    a.href = imgUri;
    a.download = "課程期間全班平均專注度統計"; 
}

//課程期間專注度各程度人數統計圖表繪製
function drawcountChart_class(times,dataCount,concentratedCount,normalCount,unconcentratedCount) {
  if(times==undefined || dataCount==undefined || concentratedCount==undefined || normalCount==undefined || unconcentratedCount==undefined){
    console.log("times==undefined || dataCount==undefined || concentratedCount==undefined || normalCount==undefined || unconcentratedCount==undefined");
    $('.container').css('display', 'none');
    $('#error').css('display', 'block');
    return
  }
  const data = {
    labels: times,
    datasets: [
    {
      label: "專心",
      backgroundColor: '#00CC66',
      borderColor: '#00CC66',
      data: concentratedCount,
      fill: false,
      tension: 0.1
    },
    {
      label: "普通",
      backgroundColor: '#ffff00',
      borderColor: '#ffff00',
      data: normalCount,
      fill: false,
      tension: 0.1
    },
    {
      label: "不專心",
      backgroundColor: '#FE5F55',
      borderColor: '#FE5F55',
      data: unconcentratedCount,
      fill: false,
      tension: 0.1
    },{
      label: "總人數",
      backgroundColor: '#82A098',
      borderColor: '#82A098',
      data: dataCount,
      fill: false,
      tension: 0.1
    }
  ]
  };
  const count_config = {
    type: 'line',
    data,
    options: {
      scales: {
        x:{
          title: {
            display: true,
            text: '時間',
            font: {
              size: 18
            },
            color: '#82A098',
          }  
        },
        y: {
          title: {
            display: true,
            text: '人數',
            font: {
              size: 18
            },
            color: '#82A098',
          },
          beginAtZero: true
        }
      },
      plugins: {
        title: {
            display: true,
            text: "課程期間專注度各程度人數統計",
            align:'start',
            font: {
              size: 18,
            }
        },
        legend: {
          display: true,
          align: 'center',
          position: 'top',
          labels:{
            padding: 10
          }
        }
      },
      bezierCurve : false,
      animation: {
        onComplete: drawcountdone
        // duration: 0
      }
    },
    plugins: [
      {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
          const ctx = chart.canvas.getContext('2d');
          ctx.save();
          ctx.globalCompositeOperation = 'destination-over';
          // ctx.fillStyle = '#FAF9F9';
          ctx.fillStyle = '#FFF';
          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        }
      } 
    ],
  };
  //繪製圖表
  drawcountChart = new Chart(
    document.getElementById("drawcountChart").getContext("2d"),
    count_config
  ); 
  $('#loading_class_count').css('display', 'none');
  $('#ClassCountRange').parent().css('display', 'block');
}

function drawcountdone(){
  var imgUri = drawcountChart.toBase64Image();
  $('#download_class_count').css('display', 'block');
  var a = document.getElementById("download_class_count");
  a.href = imgUri;
  a.download = "課程期間專注度各程度人數統計"; 
}
//----------------------------------------
//學生建立清單
function createClassList(ClassList){
  var tbody_classlist=document.getElementById("classlist");
  ClassList.forEach(function(r){
    //新增學生資料
    var DataID = document.createElement('tr');
    DataID.setAttribute("id",r.studentID);
    DataID.setAttribute("class","tr_student");
    var Name = document.createElement('td');
    Name.textContent=r.studentName;
    DataID.appendChild(Name);
    var studentID = document.createElement('td');
    studentID.textContent=r.studentID;
    DataID.appendChild(studentID);
    tbody_classlist.appendChild(DataID);
    dict[r.studentID]=r;
  });
  const cells = document.querySelectorAll('tr');
  for (var i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', (event) => {
      if(event.target.parentNode.getAttribute('id')!=null){
        console.log(event.target.parentNode.getAttribute('id'));
        document.querySelectorAll(".tr_student").forEach(el => {
          el.style.backgroundColor="";
          el.style.color = "#000000";
        });
        event.target.parentNode.style.backgroundColor="#D9E1B3";
        event.target.parentNode.style.color="#000";
        $('#loading_person').css('display', 'block');
        NowstudentID=event.target.parentNode.getAttribute('id');
        drawstudentChart(dict[event.target.parentNode.getAttribute('id')]);
      }
    });
  }
  $('.order-table').css('display', 'block');
  $('.light-table-filter').css('display', 'block');
  $('.student_image').css('opacity', '1');
  $('#loading_classList').css('display', 'none');
}

//學生圖表等資訊
var draw_finish=false;//是否已經產生過圖表了
var studentName;
function drawstudentChart(results) {
  $('#download_student').css('display', 'none');
  if(results==undefined){
      return
  }
  var json_data=results;
  var times = [];
  var concerns = [];
  var concernValues;

  //黃色區塊數值更新
  $('#attendTimePercentage').text(json_data.attendTimePercentage);
  $('#concernPercentage').text(json_data.concernPercentage);
  $('#aveConcern').text(json_data.aveConcern);
  if(parseFloat(json_data.aveConcern)>0.8 || parseFloat(json_data.aveConcern)==0.8){
    $('#levelConcern').css('background-color', '#00CC66');
    $('#levelConcern').css('color', '#FEFFFE');
    $('#levelConcern').text("專心");
  }
  else if(parseFloat(json_data.aveConcern)>0.5&&parseFloat(json_data.aveConcern)<0.8){
    $('#levelConcern').css('background-color', '#ffff00');
    $('#levelConcern').css('color', '#666');
    $('#levelConcern').text("普通");
  }
  else if(parseFloat(json_data.aveConcern)<0.5 || parseFloat(json_data.aveConcern)==0.5){
    $('#levelConcern').css('background-color', '#FE5F55');
    $('#levelConcern').css('color', '#FEFFFE');
    $('#levelConcern').text("不專心");
  }
  // console.log(parseFloat(msg.aveConcern));
  $('#bestLasted').text(json_data.bestLasted);

  studentName=json_data.studentName;

  for (var i = 0; i < json_data.timeLineArray.length; i++) {
      times.push(json_data.timeLineArray[i]);
      concernValues=null;
      if(json_data.concernDegreeArray[i]>0.8 || json_data.concernDegreeArray[i]==0.8)
        concernValues=1;
      else if (json_data.concernDegreeArray[i]<0.8&&json_data.concernDegreeArray[i]>0.5)
        concernValues=0.5;
      else if ((json_data.concernDegreeArray[i]<0.5 || json_data.concernDegreeArray[i]==0.5) &&json_data.concernDegreeArray[i]!=null)
        concernValues=0;
      concerns.push(concernValues);
  }
  const data = {
    labels: times,
    datasets: [{
      label: json_data.studentName,
      backgroundColor: '#82A098',
      borderColor: '#82A098',
      data: concerns,
      fill: false,
      tension: 0.1
    }]
  };
  const config = {
    type: 'line',
    data,
    options: {
      scales: {
        x:{
          title: {
            display: true,
            text: '時間',
            font: {
              size: 18
            },
            color: '#82A098',
          }  
        },
        y: {
          title: {
            display: true,
            text: '專注度',
            font: {
              size: 18
            },
            color: '#82A098',
          },
          ticks: {
            callback: function(value) {
              if(value==1)
                return '專心' ;
              else if (value==0.5)
                return '普通' ;
              else if (value==0)
                return '不專心' ;
            }
          },
          beginAtZero: true
        }
      },
      plugins: {
        title: {
            display: true,
            text: json_data.studentName+"的專注度統計",
            align:'start',
            font: {
              size: 18,
            }
        },
        legend: {
          display: false,
          align: 'center',
          position: 'top',
          labels:{
            padding: 10
          }
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
                if(tooltipItem.parsed.y==1)
                return '專心' ;
              else if (tooltipItem.parsed.y==0.5)
                return '普通' ;
              else if (tooltipItem.parsed.y==0)
                return '不專心' ;
            },
          }
        }
      },
      bezierCurve : false,
      animation: {
        onComplete: studentdone
      }
    },
    plugins: [
      {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
          const ctx = chart.canvas.getContext('2d');
          ctx.save();
          ctx.globalCompositeOperation = 'destination-over';
          // ctx.fillStyle = '#FAF9F9';
          ctx.fillStyle = '#FFF';
          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        }
      } 
    ],
  };
  //繪製圖表
  if(draw_finish){
    studentChart.destroy();
  }
  studentChart = new Chart(
    document.getElementById("drawstudentChart").getContext("2d"),
    config
  ); 
  draw_finish=true;
  $('#loading_person').css('display', 'none');
  $('#StudentRange').parent().css('display', 'block');
}

function studentdone(){
  html2canvas($("#student_image")[0],{
    scrollY: -window.pageYOffset,
    useCORS: true,
  }).then((canvas) => {
    var imgUri = canvas.toDataURL("image/jpeg",1);
    $('#download_student').css('display', 'block');
    var a = document.getElementById("download_student");
    a.href = imgUri;
    a.download = studentName+"的專注度統計"; 
  });
}

function slider_Ave_func(){
  slider_Ave.oninput = function() {
    var valPercent = (slider_Ave.valueAsNumber  - parseInt(slider_Ave.min)) / 
                        (parseInt(slider_Ave.max) - parseInt(slider_Ave.min));
      var style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop('+ valPercent+', #29907f), color-stop('+ valPercent+', #e3e3e4));';
      slider_Ave.style = style;
    }
    //按下去之後
    slider_Ave.addEventListener('change', function(){
      timeSpacing=slider_Ave.value*60;
      $('#loading_class_ave').css('display', 'block');
      $('#download_class').css('display', 'none');
      drawaveChart.destroy();
      $.ajax({
        type:"POST",
        contentType: 'application/json',
        dataType: "json",
        url: "https://concern-backend-202106.herokuapp.com/api/classroom/getStatisticsDiagram",
        data: JSON.stringify({
            "classroomDataID": classroomDataID,
            "timeSpacing": timeSpacing
        }),
        success: function (msg) {
            // console.log(msg);
            DataCategory_ave(msg);
        },
        error: function(error){
            console.log(error);
            $('.container').css('display', 'none');
            $('#error').css('display', 'block');
        }
      });
    });
}

function slider_Count_func(){
  slider_Count.oninput = function() {
    var valPercent = (slider_Count.valueAsNumber  - parseInt(slider_Count.min)) / 
                        (parseInt(slider_Count.max) - parseInt(slider_Count.min));
      var style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop('+ valPercent+', #29907f), color-stop('+ valPercent+', #e3e3e4));';
      slider_Count.style = style;
    }
    //按下去之後
    slider_Count.addEventListener('change', function(){
      timeSpacing=slider_Count.value*60;
      $('#loading_class_count').css('display', 'block');
      $('#download_class_count').css('display', 'none');
      drawcountChart.destroy();
      $.ajax({
        type:"POST",
        contentType: 'application/json',
        dataType: "json",
        url: "https://concern-backend-202106.herokuapp.com/api/classroom/getStatisticsDiagram",
        data: JSON.stringify({
            "classroomDataID": classroomDataID,
            "timeSpacing": timeSpacing
        }),
        success: function (msg) {
            // console.log(msg);
            DataCategory_count(msg);
        },
        error: function(error){
            console.log(error);
            $('.container').css('display', 'none');
            $('#error').css('display', 'block');
        }
      });
    });
}

function slider_student_func(){
  slider_student.oninput = function() {
    var valPercent = (slider_student.valueAsNumber  - parseInt(slider_student.min)) / 
                        (parseInt(slider_student.max) - parseInt(slider_student.min));
      var style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop('+ valPercent+', #29907f), color-stop('+ valPercent+', #e3e3e4));';
      slider_student.style = style;
    }
    //按下去之後
    slider_student.addEventListener('change', function(){
      timeSpacing=slider_student.value*60;
      $('#loading_person').css('display', 'block');
      $('#download_student').css('display', 'none');
      studentChart.destroy();
      $.ajax({
        type:"POST",
        contentType: 'application/json',
        dataType: "json",
        url: "https://concern-backend-202106.herokuapp.com/api/classroom/getPersonDiagramList",
        data: JSON.stringify({
          "classroomDataID": classroomDataID,
          "timeSpacing": timeSpacing
        }),
        success: function (msg) {
          msg.forEach(function(r){
            //更新一下時間區間
            dict[r.studentID]=r;
            if(NowstudentID==r.studentID){
              drawstudentChart(r);
            }
          });
        },
        error: function(error){
          console.log(error.responseText);
          $('.container').css('display', 'none');
          $('#error').css('display', 'block');
        }
      });
    });
}
