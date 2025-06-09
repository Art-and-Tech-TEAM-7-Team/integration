export function makeCarInsideSketch(){
return function(p){

let carInsideIMG, startupIMG;
let playButton;
let startupX, startupY;
let playButtonX, playButtonY;
let sound, music;
let shake = false;
let shakeStartTime = 0;
let shakeDuration = 1000; // 1초 동안 흔들림
let startupPressed=false;
let musicStart=false;
let transitionStarted = false;

p.preload=function(){
    carInsideIMG = p.loadImage("assets/car/carInside.jpg");
    startupIMG= p.loadImage("assets/car/startup.png");
    sound= p.loadSound("assets/car/sound.m4a");
    music=p.loadSound("assets/car/music.m4a");
    playButton=p.loadImage("assets/car/playbutton.png");
} 

p.setup=function(){
    p.createCanvas(p.windowWidth, p.windowHeight);
    startupX = p.width * 0.38;
    startupY = p.height * 0.58;
    sound.playMode("sustain");
    playButtonX=p.width *0.58;
    playButtonY=p.height* 0.88;
}

function shakeScreen(){
    shake = true;
    shakeStartTime = p.millis();
}

p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    startupX = p.width * 0.38;
    startupY = p.height * 0.58; 
    playButtonX = p.width *0.58;
    playButtonY = p.height * 0.857;   
};

function drawElement(img, imgX, imgY, imgW = null) {
    let drawW = imgW ?? img.width;
    let drawH = drawW * (img.height / img.width);

    if (imgX <= p.mouseX && p.mouseX <= imgX + drawW && imgY <= p.mouseY && p.mouseY <= imgY + drawH) {
        drawW += 5;
        drawH = drawW * (img.height / img.width);
        p.image(img, imgX - 2.5, imgY - 7, drawW, drawH);
    } else {
        p.image(img, imgX, imgY, drawW, drawH);
    }
}
    

//ai 사용 : 화면 전체 흔들림림
p.draw=function() {
    p.push();
    if (shake) {
        let elapsed = p.millis() - shakeStartTime;
        if (elapsed < shakeDuration) {
            let offsetX = p.random(-2, 2);
            let offsetY = p.random(-2, 2);
            p.translate(offsetX, offsetY);
            } else {
                shake = false; // 흔들림 종료
            }
        }
        p.image(carInsideIMG, 0, 0, p.windowWidth, p.windowHeight);
        drawElement(startupIMG, startupX, startupY);
        drawElement(playButton,playButtonX,playButtonY,150);
        p.pop();
                
    }

    p.mousePressed = function() {
        if (startupIMG && startupIMG.width > 0 && p.mouseX > startupX && p.mouseX < startupX + startupIMG.width && p.mouseY > startupY && p.mouseY < startupY + startupIMG.height){
            sound.play();
            shakeScreen();
            startupPressed=true;
        }
        if (playButton && playButton.width > 0 && p.mouseX > playButtonX && p.mouseX < playButtonX + playButton.width && p.mouseY > playButtonY && p.mouseY < playButtonY + playButton.height) {
            music.play(); 
            musicStart=true;
        } if (startupPressed && musicStart && !transitionStarted){
            transitionStarted = true;
            setTimeout(() => {
                music.stop();
                window.dispatchEvent(new Event("goToContrast"));
            }, 3000); 
        }
    }
} 
}
