export function makeContrastSketch(){
    return function(p){
        let contrastIMG;
        let carIMG , car2IMG;
        let car3IMG;
        let subwayIMG;
        let thinkingIMG;
        let thinkingDuration=2000;
        let thinkingStartTime =0;
        let showThinking=false;
   

        // 이미지 위치 변수
        let carX, subwayX;
        let carY; 
        let car2X ;
        let car3X;
        let carSpeed=3;
        carSpeed+=2;
        let subwaySpeed=2;
        let car2Speed=2;
        let car3Speed=3;

        let noteImages=[];
        let spawnedNotes = [];
        let notesSpawned=false;


        p.preload = function(){
            contrastIMG = p.loadImage("assets/constrast/contrast.jpg");
            carIMG = p.loadImage("assets/constrast/car.png");
            car2IMG = p.loadImage("assets/constrast/car2.png");
            car3IMG = p.loadImage("assets/constrast/car3.png");
            subwayIMG = p.loadImage("assets/constrast/subway.png");
            noteImages[0]=p.loadImage("assets/constrast/note1.png");
            noteImages[1]=p.loadImage("assets/constrast/note2.png");
            thinkingIMG= p.loadImage("assets/constrast/thinking.png");
        } 

         function drawElement(img, centerX, centerY, imgW) {
            let imgH = imgW * (img.height / img.width);
            p.imageMode(p.CENTER);
            p.image(img, centerX, centerY, imgW, imgH);
        }
        
         p.setup = function(){
            p.createCanvas(p.windowWidth, p.windowHeight);
            carX = p.width * 0.92;
            carY= p.height * 0.83;
            subwayX = p.width*0.91;
            car2X = p.width * 0.92;
            car3X=  p.width * 1.2;
        }
        

        p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        carX = p.width * 0.92;
        carY= p.height * 0.88;
        subwayX = p.width*0.91;
        car2X = p.width * 0.92;
        car3X=  p.width * 1.2;
        };


        // 배경 이미지 그리기
        function drawBackgroundImage(img) {
    const scale = Math.max(p.width / img.width, p.height / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    p.imageMode(p.CENTER);
    p.image(img, p.width / 2, p.height / 2, w, h);
}


 p.draw = function(){
            p.background(220);
            // 비율 유지해서 이미지 출력
            drawBackgroundImage(contrastIMG);
            drawElement(car3IMG, car3X, p.height*0.8, 500);
            drawElement(carIMG, carX, carY, 500);
           
            drawElement(subwayIMG, subwayX, p.height*0.559, 1200);
            drawElement(car2IMG, car2X, p.height*0.9, 500);
          

            subwayX -= subwaySpeed;
            car2X -= car2Speed // 지하철 이미지 왼쪽으로 이동
            car3X -= car3Speed; // 두 번째 자동차 이미지 왼쪽으로 이동
        if (p.keyIsPressed) {
        if (p.keyCode === p.RIGHT_ARROW) carX += carSpeed;
        if (p.keyCode === p.LEFT_ARROW) carX -= carSpeed;
        }

        if (carX<p.width*0.9 && !showThinking){
            showThinking=true;
            thinkingStartTime=p.millis();
        }
        
       for (let i = 0; i < spawnedNotes.length; i++) {
    let note = spawnedNotes[i];
    let scale = 1 + 0.05 * p.sin(p.frameCount * 0.1 + i);
    p.push();
    p.translate(note.x, note.y);
    p.scale(scale);
    p.imageMode(p.CENTER);
    p.image(note.img, 0, 0, 50, 50); // 위치 이미 translate로 했으니 (0,0)
    p.pop();
}
if(showThinking){
    if(p.millis()-thinkingStartTime<thinkingDuration){
        p.image(thinkingIMG,carX+100,carY-200);
    } else{
        showThinking=false;
        thinkingDuration=0;
    }
}
  if (carX<-20){
            window.dispatchEvent(new Event("goToCompany"));
        }
    }

    
    p.keyPressed=function(){
        if(p.key===' ' && !notesSpawned){
             for (let i = 0; i < 10; i++) {  
      let img = p.random(noteImages);
      let x = p.random(carX-400,carX+400);
      let y = p.random(carY-400,carY+400);
      spawnedNotes.push({img, x,y})
        }
        notesSpawned=true;
    }
    }
}
}
