const video=document.getElementById("video");;
function webCam(){
    navigator.mediaDevices.getUserMedia({
            video:true,
            audio:false,
        }).then(
            (stream)=>{
                    video.srcObject =stream;//Ū�J�v����y               
                }
        ).catch(
            (error)=>{
                console.log(error)
            }
        );
};

Promise.all([ 
    //�@���B�z�H�U�Ʊ�
    //���y
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    //���y�W68�I�аO  
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    //
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    //��
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    //��~��
    faceapi.nets.ageGenderNet.loadFromUri('./models'),
]).then(webCam);
//Ĳ�ovideor��ť�ƥ�
video.addEventListener("play",()=>{   
    const canvas= faceapi.createCanvasFromMedia(video);//�إߵe��
    document.body.append(canvas);//��ܦbbody����
    faceapi.matchDimensions(canvas,{height:video.height,width:video.width});
    //�H��Ĳ�o�@���Ʊ�
    setInterval(async()=>{
        const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();
        //����FaceApi��FaceLandmarks�BFaceExpressions�BAgeAndGender�p��
    canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);//�M�ŵe��(()
    
   const resizeWindow= faceapi.resizeResults(detections,{
        height: video.height,
        width: video.width,

    })
    faceapi.draw.drawDetections(canvas, resizeWindow); //�e�X�y���ۦ���
    faceapi.draw.drawFaceLandmarks(canvas, resizeWindow); //�e�X���y�W���аO
    faceapi.draw.drawFaceExpressions(canvas, resizeWindow); //�e�X���y�W��
    //��ܦ~��+�ʧO
    resizeWindow.forEach(detections => {
        const box=detections.detection.box;
        const drawBox=new faceapi.draw.DrawBox(box,{
            label: Math.round(detections.age)+"year,"+detections.gender,
        });
        drawBox.draw(canvas);
    });
   // var str=JSON.stringify(detections);
    //console.log(str);
},100);  //N����ĲĲ�o�@�� 
})
