export function makeBusStopSketch() {
return function(p) {


let busStopImg, busImg;
let busX, busY, busW;
let busMove;

let characterImg = ['', '', '', ''];
let characterX; // 캐릭터의 X 위치
let characterBack = false;
let characterFrame = 0;         // 현재 프레임 번호
let frameCountForStep = 0;      // 프레임 전환 카운터(속도조절용)
const FRAME_CHANGE_SPEED = 7;   // 몇 프레임마다 한 번씩 이미지가 바뀔지

let cameraX; // 카메라의 초기 X 위치
let speed = 15; // 캐릭터의 속도도
let viewWidth;

let speak = false;
let messageCount = 0;
let showMessage = false;
let message = "";

p.preload = function() {
    busStopImg = p.loadImage("assets/subway/버스 정류장.png");
    busImg = p.loadImage("assets/subway/버스.png");
    
    characterImg[0] = p.loadImage("assets/character/캐릭터1.png");
    characterImg[1] = p.loadImage("assets/character/캐릭터2.png");
    characterImg[2] = p.loadImage("assets/character/캐릭터3.png");
    characterImg[3] = p.loadImage("assets/character/캐릭터2.png");
}

p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight); 
    characterX = 100;
    cameraX = 0;
    busX = busStopImg.width - 1000;
    busY = busStopImg.height -500;
    busW = 600;
    busMove = false;
}

p.draw = function() {
    p.background(220);
    viewWidth = Math.min(p.windowWidth, busStopImg.width); // AI이용 - 화면 너비를 버스 정류장 이미지 너비로 설정

    let screenCenter = viewWidth / 2;

    if (characterX - cameraX > screenCenter + 100) cameraX = characterX - (screenCenter + 100);
    if (characterX - cameraX < screenCenter - 100) cameraX = characterX - (screenCenter - 100);
    
    // 이미지 범위 밖으로 나가지 않게 만들기
    cameraX = p.constrain(cameraX, 0, busStopImg.width- viewWidth);

    p.image(busStopImg, -cameraX, 0, busStopImg.width, p.height);
    drawBus();
    drawCharacter();
    
    if (showMessage) {
        messageCount++;
        if (messageCount >= 1000) {
            showMessage = false;
            messageCount = 0;
            message = "";
        }
        drawText();
    }
}

p.mousePressed = function() {
    if (speak) {
        window.dispatchEvent(new Event("goToCompany2"));
    }
}

function drawCharacter() {
    let isMoving = false;

    if (p.keyIsPressed) {
        if (p.keyCode === p.RIGHT_ARROW) {
            characterX += speed;
            isMoving = true;
            characterBack = false;
        }
        if (p.keyCode === p.LEFT_ARROW) {
            characterX -= speed;
            isMoving = true;
            characterBack = true;
        }

        // 캐릭터가 이미지 범위 밖으로 못 나가게
        characterX = p.constrain(characterX, 0, busStopImg.width - 1);
    }

    if (characterX >= busStopImg.width - 1000 + busW/2 - 50  && !speak) {
        messageCount = 0;
        showMessage = true;
        message = "버스가 놓쳤다. 큰일났다!";
        speak = true;
    } 

    if (isMoving) {
        frameCountForStep++;
        if (frameCountForStep >= FRAME_CHANGE_SPEED) {
            characterFrame = (characterFrame + 1) % characterImg.length;
            frameCountForStep = 0;
        }
    } else {
        characterFrame = 1; // 안 움직일 땐 정지 프레임
    }

    // 화면 내에서의 캐릭터 x, y좌표
    let drawX = characterX - cameraX;
    let drawY = p.height - 450/2 - 30; 

    p.push();
    p.translate(drawX, drawY);
    if (characterBack) {
        p.scale(-1, 1);
    }
    p.imageMode(p.CENTER);
    p.image(characterImg[characterFrame], 0, 0, 300*(characterImg[characterFrame].width/characterImg[characterFrame].height) , 300);
    p.pop();
}

function drawBus() {
    let busH = busW*(busImg.height/busImg.width);
    if (characterX >= busStopImg.width - 1050) { //임시시
        busMove = true;
    }
    if (busMove) {
        busX +=16;
    }
    let drawBusX = busX - cameraX;
    p.image(busImg, drawBusX, busY, busW , busH);
}

function drawText() {
    const balloonX = characterX - cameraX;
    const balloonY = p.height - 530;
    // let drawX = characterX - cameraX + 100;
    // let drawY = p.height - 530; // 머리 위
    p.push();

    p.fill(255);
    p.stroke(0);
    p.strokeWeight(2);
    p.rectMode(p.CENTER, p.CENTER);
    p.rect(balloonX, balloonY + 15, 300, 50, 10);

    p.fill(0);
    p.noStroke();
    p.textSize(21);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(message, balloonX, balloonY + 15);
    p.pop();
}


}
}
