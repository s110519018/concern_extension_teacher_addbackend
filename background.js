var isClassing=1;
var ClassroomStatus='open_classroom';
var BackendStatus='open_backend_page';
var togBtnStatus=false;
var courses=[{}];
var courseName="";
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.msg === "createWindow") {
        chrome.windows.create({
            url: "chart.html?teacherName=" + request.data.teacherName+"&classroomDataID="+request.data.classroomDataID+"&rankCount="+request.data.rankCount+"&timeSpacing="+request.data.timeSpacing,
            type: "popup",
            width: 1000,
            height: 800,
        }, function (newWindow) {
            console.log(newWindow);
        });
        console.log("chart.html?teacherName=" + request.data.teacherName+"&classroomDataID="+request.data.classroomDataID+"&rankCount="+request.data.rankCount+"&timeSpacing="+request.data.timeSpacing);
    }
    else if(request.msg === "ClassroomStatus"){
        console.log(request.data.ClassroomStatus);
        ClassroomStatus=request.data.ClassroomStatus;
    }
    else if(request.msg === "BackendStatus"){
        console.log(request.data.BackendStatus);
        BackendStatus=request.data.BackendStatus;
    }
    else if(request.msg === "togBtnStatus"){
        console.log(request.data.togBtnStatus);
        togBtnStatus=request.data.togBtnStatus;
    }
    else if(request.msg === "openBackendweb"){
        chrome.windows.create({
            url: "https://concern-frontend-tau.vercel.app?teacherDataID=" + request.data.TeacherDataID+"&courseDataID="+request.data.CourseDataID+"&classroomDataID="+request.data.ClassroomDataID,
            type: "normal",
            width: 1280,
            height: 800,
        }, function (newWindow) {
            console.log(newWindow);
        });
        console.log("https://concern-frontend-tau.vercel.app?teacherDataID=" + request.data.TeacherDataID+"&courseDataID="+request.data.CourseDataID+"&classroomDataID="+request.data.ClassroomDataID);
    }
    else{
        console.log(request.isClassing);
        isClassing=request.isClassing;
        if(request.courses!=undefined){
            console.log(request.courses);
            courses=request.courses;
        }
        if(request.courseName!=undefined){
            console.log(request.courseName);
            courseName=request.courseName;
        }
    }
});

window.setInterval(function(){
    chrome.runtime.sendMessage({
        msg: "sendtoPOPUP", 
        data: {
            isClassing: isClassing,
            ClassroomStatus: ClassroomStatus,
            BackendStatus: BackendStatus,
            togBtnStatus:togBtnStatus,
            courses:courses,
            courseName:courseName
        }
    }); 
}, 500);

