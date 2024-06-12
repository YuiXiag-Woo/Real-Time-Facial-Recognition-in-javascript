const video=document.getElementById("video");;
function webCam(){
    navigator.mediaDevices.getUserMedia({
            video:true,
            audio:false,
        }).then(
            (stream)=>{
                    video.srcObject =stream;//讀入影音串流               
                }
        ).catch(
            (error)=>{
                console.log(error)
            }
        );
};

Promise.all([ 
    //一次處理以下事情
    //抓臉
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    //抓臉上68點標記  
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    //
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    //表情
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    //算年齡
    faceapi.nets.ageGenderNet.loadFromUri('./models'),
]).then(webCam);
//觸發videor監聽事件
video.addEventListener("play",()=>{   
    const canvas= faceapi.createCanvasFromMedia(video);//建立畫布
    document.body.append(canvas);//顯示在body標籤
    faceapi.matchDimensions(canvas,{height:video.height,width:video.width});
    //以格觸發一次事情
    setInterval(async()=>{
        const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();
        //執行FaceApi中FaceLandmarks、FaceExpressions、AgeAndGender計算
    canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);//清空畫面(()
    
   const resizeWindow= faceapi.resizeResults(detections,{
        height: video.height,
        width: video.width,

    })
    faceapi.draw.drawDetections(canvas, resizeWindow); //畫出臉部相似度
    faceapi.draw.drawFaceLandmarks(canvas, resizeWindow); //畫出抓臉上的標記
    faceapi.draw.drawFaceExpressions(canvas, resizeWindow); //畫出抓臉上表情
    //顯示年齡+性別
    resizeWindow.forEach(detections => {
        const box=detections.detection.box;
        const drawBox=new faceapi.draw.DrawBox(box,{
            label: Math.round(detections.age)+"year,"+detections.gender,
        });
        drawBox.draw(canvas);
    });
   // var str=JSON.stringify(detections);
    //console.log(str);
},100);  //N豪秒觸觸發一次 
})
