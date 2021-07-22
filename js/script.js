var switchStatus = false;
var getSelectedTab = (tab) => {
  var tabId = tab.id;
  var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);
  document.getElementById('open').addEventListener('click', () => {
    //開啟教室
    var name = document.getElementById("name");
    sendMessage({ action: 'OPEN' , name: name.value});
  });
  document.getElementById('start').addEventListener('click', () => {
    //開始課程
    sendMessage({ action: 'START' });
  });
  document.getElementById('rest_start').addEventListener('click', () => {
    //下課休息
    sendMessage({ action: 'REST_START' });
  });
  document.getElementById('rest_end').addEventListener('click', () => {
    //繼續上課
    sendMessage({ action: 'REST_END' });
  });
  document.getElementById('end').addEventListener('click', () => {
    //結束課程
    sendMessage({ action: 'END' });
  });
  document.getElementById('close').addEventListener('click', () => {
    //關閉教室
    sendMessage({ action: 'CLOSE' });
    window.close();
  });
  document.getElementById('reload').addEventListener('click', () => {
    //壞掉重載Reload
    chrome.runtime.reload();
  });
  //後台區
  document.getElementById('login_backend').addEventListener('click', () => {
    //開啟教室
    var password = document.getElementById("password");
    sendMessage({ action: 'LOGIN' , password: password.value});
  });
  document.getElementById('addnewCourse_backend').addEventListener('click', () => {
    //新增課程
    var newCourse = document.getElementById("newCourse");
    sendMessage({ action: 'ADDNEWCOURSE' , newCourse: newCourse.value});
  });
  document.getElementById('selectClass_backend').addEventListener('click', () => {
    //進入課程紀錄中
    sendMessage({ action: 'SELECTCLASS' , courseDataID: $("#selectClass option:selected").val()});
  });
  document.getElementById('webpage_backend').addEventListener('click', () => {
    //開啟後台管理網頁
    sendMessage({ action: 'OPENBACKENDWEB' });
  });
  //自動允許開關
  $("#togBtn").on('change', function() {
      if ($(this).is(':checked')) {
          switchStatus = $(this).is(':checked');
          sendMessage({ action: 'AUTOADMIN_START'});
      }
      else {
        switchStatus = $(this).is(':checked');
        sendMessage({ action: 'AUTOADMIN_END'});
      }
      chrome.runtime.sendMessage({msg: 'togBtnStatus',
        data:{
          togBtnStatus: switchStatus
      }}); 
  });
}
chrome.tabs.getSelected(null, getSelectedTab);

//開啟後台第一頁按鈕只需切換頁面，傳值至backgroundscript
document.getElementById('open_backend').addEventListener('click', () => {
  chrome.runtime.sendMessage({isClassing: 6}); 
  chrome.runtime.sendMessage({isClassing: 7}); 
});
//選擇課程的+按鈕只需切換頁面，傳值至backgroundscript
document.getElementById('addClass_backend').addEventListener('click', () => {
  chrome.runtime.sendMessage({isClassing: 6}); 
  chrome.runtime.sendMessage({isClassing: 9}); 
  document.getElementById('newCourse').value = '';
});
//新增課程的返回按鈕只需切換頁面，傳值至backgroundscript
document.getElementById('backselect_backend').addEventListener('click', () => {
  chrome.runtime.sendMessage({isClassing: 6}); 
  chrome.runtime.sendMessage({isClassing: 8}); 
  document.getElementById('newCourse').value = '';
});



chrome.runtime.onMessage.addListener(  
  function(request, sender, sendResponse) {   
    if (request.msg === "sendtoPOPUP") {
      document.getElementById('loading').style.display='none';
      document.getElementById('loading_backend').style.display='none';
      switch(request.data.isClassing){
        case 0:
          document.getElementById('loading').style.display='block';
          document.getElementById('open_classroom').style.display='none';
          document.getElementById('not_classing').style.display='none';
          document.getElementById('is_classing').style.display='none';
          document.getElementById('rest_time').style.display='none';
          document.getElementById('close_classroom').style.display='none';
          break;
        case 1:
          //開啟教室
          document.getElementById('close_classroom').style.display='none';
          document.getElementById('open_classroom').style.display='block';
          chrome.runtime.sendMessage({msg: 'ClassroomStatus',
          data:{
            ClassroomStatus: 'open_classroom'
          }}); 
          //按鈕回歸false
          document.getElementById('togBtn').checked =false;
          chrome.runtime.sendMessage({msg: 'togBtnStatus',
          data:{
            togBtnStatus: false
          }}); 
          //後臺功能全部關掉
          document.getElementById('open_backend_page').style.display='none';
          document.getElementById('login_backend_page').style.display='none';
          document.getElementById('selectClass_backend_page').style.display='none';
          document.getElementById('addnewCourse_backend_page').style.display='none';
          document.getElementById('record_backend_page').style.display='none';
          chrome.runtime.sendMessage({msg: 'BackendStatus',
          data:{
            BackendStatus: 'open_backend_page'
          }}); 
          break;
        case 2:
          //開始課程
          document.getElementById('open_classroom').style.display='none';
          document.getElementById('not_classing').style.display='block';
          document.getElementById('backend').style.display='block';
          document.getElementById(request.data.BackendStatus).style.display='block';
          //開啟後台管理功能
          document.getElementById('open_backend_page').style.display='block';
          document.getElementById('login_backend_page').style.display='none';
          document.getElementById('selectClass_backend_page').style.display='none';
          document.getElementById('addnewCourse_backend_page').style.display='none';
          document.getElementById('record_backend_page').style.display='none';
          chrome.runtime.sendMessage({msg: 'ClassroomStatus',
          data:{
            ClassroomStatus: 'not_classing'
          }}); 
          break;
        case 3:
          //上課中
          document.getElementById('rest_time').style.display='none';
          document.getElementById('not_classing').style.display='none';
          document.getElementById('is_classing').style.display='block';
          //後台區
          document.getElementById('backend').style.display='block';
          document.getElementById(request.data.BackendStatus).style.display='block';
          document.getElementById('togBtn').checked = request.data.togBtnStatus;
          chrome.runtime.sendMessage({msg: 'ClassroomStatus',
          data:{
            ClassroomStatus: 'is_classing'
          }}); 
          break;
        case 4:
          //下課休息
          document.getElementById('is_classing').style.display='none';
          document.getElementById('rest_time').style.display='block';
          //後台區
          document.getElementById('backend').style.display='block';
          document.getElementById(request.data.BackendStatus).style.display='block';
          document.getElementById('togBtn').checked = request.data.togBtnStatus;
          chrome.runtime.sendMessage({msg: 'ClassroomStatus',
          data:{
            ClassroomStatus: 'rest_time'
          }}); 
          break;
        case 5:
          //課程結束
          document.getElementById('rest_time').style.display='none';
          document.getElementById('is_classing').style.display='none';
          document.getElementById('close_classroom').style.display='block';
          //後台區
          document.getElementById('backend').style.display='block';
          document.getElementById(request.data.BackendStatus).style.display='block';
          document.getElementById('togBtn').checked = request.data.togBtnStatus;
          chrome.runtime.sendMessage({msg: 'ClassroomStatus',
          data:{
            ClassroomStatus: 'close_classroom'
          }}); 
          break;
        //後台管理頁面
        case 6:
          //後台區Loading
          document.getElementById('backend').style.display='block';
          document.getElementById('loading_backend').style.display='block';
          document.getElementById('open_backend_page').style.display='none';
          document.getElementById('login_backend_page').style.display='none';
          document.getElementById('selectClass_backend_page').style.display='none';
          document.getElementById('addnewCourse_backend_page').style.display='none';
          document.getElementById('record_backend_page').style.display='none';
          break;
        case 7:
          document.getElementById('open_backend_page').style.display='none';
          document.getElementById('backend').style.display='block';
          document.getElementById('login_backend_page').style.display='block';
          // 前台區
          document.getElementById(request.data.ClassroomStatus).style.display='block';
          chrome.runtime.sendMessage({msg: 'BackendStatus',
          data:{
            BackendStatus: 'login_backend_page'
          }}); 
          break;
        case 8:
          document.getElementById('addnewCourse_backend_page').style.display='none';
          document.getElementById('login_backend_page').style.display='none';
          document.getElementById('backend').style.display='block';
          //選擇課程
          document.getElementById('selectClass_backend_page').style.display='block';
          // 前台區
          document.getElementById(request.data.ClassroomStatus).style.display='block';
          chrome.runtime.sendMessage({msg: 'BackendStatus',
          data:{
            BackendStatus: 'selectClass_backend_page'
          }}); 
          break;
        case 9:
          document.getElementById('selectClass_backend_page').style.display='none';
          document.getElementById('backend').style.display='block';
          //新增新課程
          document.getElementById('addnewCourse_backend_page').style.display='block';
          // 前台區
          document.getElementById(request.data.ClassroomStatus).style.display='block';
          chrome.runtime.sendMessage({msg: 'BackendStatus',
          data:{
            BackendStatus: 'addnewCourse_backend_page'
          }}); 
          break;
        case 10:
          document.getElementById('addnewCourse_backend_page').style.display='none';
          document.getElementById('backend').style.display='block';
          //課程紀錄中
          document.getElementById('record_backend_page').style.display='block';
          document.getElementById('togBtn').checked = request.data.togBtnStatus;
          // 前台區
          document.getElementById(request.data.ClassroomStatus).style.display='block';
          chrome.runtime.sendMessage({msg: 'BackendStatus',
          data:{
            BackendStatus: 'record_backend_page'
          }}); 
          break;
      }
      //request.data.courses產生課程清單
      var ClassArray = []; 
      $('#selectClass option').each(function(){ClassArray.push(this.value)}); 
      request.data.courses.forEach(element => {
        if(ClassArray.indexOf(element.courseDataID)==-1&&element.courseName!=null){
          $('#selectClass').append($(document.createElement('option')).prop({
            value: element.courseDataID,
            text: element.courseName,
            selected:true
          }))
        }
      });
      //課程名稱
      $('.courseName').text(request.data.courseName);
    } 
});
