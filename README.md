Blender教學基本講義
目錄
1.	網頁中使用鏡頭	2
1.1.	初始設定	2
1.2.	程式加入	2
1.3.	加入影像鏡頭影片碼	3
1.4.	影片位置	4
2.	使用臉部辨識API	4
2.1.	加入到專案內	4
2.2.	使用API	5
2.3.	加入其他數據	6
2.3.1.	總程式	6
2.3.2.	執行結果	8
2.3.3.	細部說明	8
3.	延伸資料	9
3.1.	臉抓取	9
3.2.	任務組成	9
3.3.	使用結構	9
3.4.	臉上部位資料	10
3.5.	資料	10

 

1.	網頁中使用鏡頭
1.1.	初始設定
1.	建立一個資料夾[faceCon_project]，並且用[Vistual Studio Code]打開
2.	建立index.html、script.js、style.css三個檔案
 
3.	Index.html生成初始碼(打!可以直接生成出來下面程式)
 
4.	另外想要開發更順利可以在VScode安裝這個Live Sever
存檔即時變更，這樣不必存檔→去頁面按重新整理→在debug了。
 
1.2.	程式加入
1.	新增加入程式(黃色標記)
程式(Index.html)
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script defer src="script.js"></script>
    <link rel ="stylesheet" href="style.css">
</head>
備註:這是javaScript基本程式
程式	說明
<script src="script.js"></script>
備註:
defer等待瀏覽器解析完才執行
asysc 做完馬上接做
 
	<script>□</script>嵌入javaScript，可使用script.js內程式
□內寫入javaScript程式
<link rel ="stylesheet" href="style.css">	<link>嵌入CSS
rel 名稱
Href使用哪個css檔案
1.3.	加入影像鏡頭影片碼
程式(Index.html)
<body>
  <video id="video" width="640" height="480" autoplay muted></video>
</body>
備註:
程式	說明
autoplay	自動播放
muted	静音
script.js加入攝像頭畫面程式
程式(script.js)
const video= document.getElementById("video");
function webCam()
{
    navigator.mediaDevices.getUserMedia(
        {
            video:true,
            audio:false,
        }).then(
            (stream)=>
                {
                    video.srcObject =stream;
                }
        ).catch(
            (error)=>{
                console.log(error)
            }
        ); 
}
webCam();
完成後應該就有畫面了
 
1.4.	影片位置
style.css設定位置
程式(style.css)
body
{  
margin: 0;
padding: 0;
width: 100vw;
height: 100vh;
display:flex;
justify-content: center;
align-items: center;   
}
2.	使用臉部辨識API
2.1.	加入到專案內
到這個網頁https://github.com/justadudewhohacks/face-api.js 其中2個資料夾比較重要需要放在專案內。
	[Dist資料夾]內SourceCode
 
	[weight資料夾] 就是model一堆訓練資料
 
請將上述的資料複製到你的專案內
 
這樣就可以使用他的API。
2.2.	使用API
script.js要使用人臉辨識js
程式(script.js)
const video= document.getElementById("video");

function webCam()
{
   //(省略同上)
};

Promise.all(
[ 
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
]  
).then(webCam);

video.addEventListener("play",()=>{
    const canvas= faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    
    setInterval(async()=>{
        const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    //console.log(detections);
    canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);//清空畫面
    faceapi.draw.drawDetections(canvas, detections); // 位置
    faceapi.draw.drawFaceLandmarks(canvas, detections); // 路阔
},100);   //0.1秒更新一次

})
 
//webCam();

Index.html要新增face-api.min.js
程式(script.js)
<script defer src="face-api.min.js"></script>
style.css要新增
程式(script.js)
canvas
{
position: absolute;
}
結果
 
2.3.	加入其他數據
2.3.1.	總程式
總之程式如下:
程式(script.js)
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
    //RecognitionNet
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
    })//以這Video大小為實際數值計算((精確

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
},100);  //N豪秒觸觸發一次 
})
2.3.2.	執行結果
 

2.3.3.	細部說明
2.3.3.1.	使用他的模型
程式(script.js)
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
2.3.3.2.	執行計算
程式(script.js)
const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();
2.3.3.3.	求得結果
看起來數據都會在[detections]裡面
程式(script.js)
//顯示年齡+性別
    resizeWindow.forEach(detections => {
        const box=detections.detection.box;
        const drawBox=new faceapi.draw.DrawBox(box,{
            label: Math.round(detections.age)+"year,"+detections.gender,
        });
        drawBox.draw(canvas);
3.	延伸資料
這裡會貼一些他們的提供的資料，詳細就直接到https://github.com/justadudewhohacks/face-api.js看
3.1.	臉抓取
程式(script.js)
const detections = await faceapi.detectAllFaces(input); //抓全部的臉
const detection = await faceapi.detectSingleFace(input); //只有抓最高分
const detections1 = await faceapi.detectAllFaces(input, new faceapi.SsdMobilenetv1Options())//算分方式1
const detections2 = await faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())//算分方式2
3.2.	任務組成
很多任務可以加。
程式(script.js)
// all faces
await faceapi.detectAllFaces(input)
await faceapi.detectAllFaces(input).withFaceExpressions()
await faceapi.detectAllFaces(input).withFaceLandmarks()
await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceExpressions()
await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceExpressions().withFaceDescriptors()
await faceapi.detectAllFaces(input).withFaceLandmarks().withAgeAndGender().withFaceDescriptors()
await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceExpressions().
withAgeAndGender().withFaceDescriptors()

// single face
await faceapi.detectSingleFace(input)
await faceapi.detectSingleFace(input).withFaceExpressions()
await faceapi.detectSingleFace(input).withFaceLandmarks()
await faceapi.detectSingleFace(input).withFaceLandmarks().withFaceExpressions()
await faceapi.detectSingleFace(input).withFaceLandmarks().withFaceExpressions().withFaceDescriptor()
await faceapi.detectSingleFace(input).withFaceLandmarks().
withAgeAndGender().withFaceDescriptor()
await faceapi.detectSingleFace(input).withFaceLandmarks().withFaceExpressions().
withAgeAndGender().withFaceDescriptor()
3.3.	使用結構
看看就好。
程式(script.js)
export interface IBox {
  x: number
  y: number
  width: number
  height: number
}
export interface IFaceDetection {
  score: number
  box: Box
}
export interface IFaceLandmarks {
  positions: Point[]
  shift: Point
}
export type WithFaceDetection<TSource> = TSource & {
  detection: FaceDetection
}
export type WithFaceLandmarks<TSource> = TSource & {
  unshiftedLandmarks: FaceLandmarks
  landmarks: FaceLandmarks
  alignedRect: FaceDetection
}
export type WithFaceDescriptor<TSource> = TSource & {
  descriptor: Float32Array
}
export type WithAge<TSource> = TSource & {
  age: number
}
export type WithGender<TSource> = TSource & {
  gender: Gender
  genderProbability: number
}

export type WithGender<TSource> = TSource & {
  gender: Gender
  genderProbability: number
}

export enum Gender {
  FEMALE = 'female',
  MALE = 'male'
}
3.4.	臉上部位資料
程式(script.js)
const landmarkPositions = landmarks.positions

// or get the positions of individual contours,
// only available for 68 point face ladnamrks (FaceLandmarks68)
const jawOutline = landmarks.getJawOutline()
const nose = landmarks.getNose()
const mouth = landmarks.getMouth()
const leftEye = landmarks.getLeftEye()
const rightEye = landmarks.getRightEye()
const leftEyeBbrow = landmarks.getLeftEyeBrow()
const rightEyeBrow = landmarks.getRightEyeBrow()

3.5.	資料
Detections裡面資料。
JSON.stringify(detections);

裡面資料
[{"detection":{"_imageDims":{"_width":640,"_height":480},"_score":0.6364867565184985,"_classScore":0.6364867565184985,"_className":"","_box":{"_x":226.58290309289268,"_y":171.3862930649146,"_width":220.66934881507336,"_height":216.26201554584986}},
(略…mark點座標…資訊)
 ,"expressions":{"neutral":0.9960296154022217,"happy":0.001679802779108286,"sad":0.000609975541010499,"angry":0.00003407437907299027,"fearful":2.4444969426440366e-7,"disgusted":0.000003308933173684636,"surprised":0.0016430227551609278},"gender":"male","genderProbability":0.8398293852806091,"age":20.266374588012695}]



