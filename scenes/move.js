export function makeHouseSketch() {
return function(p) {


let houseImg, parkImg;
let totalWidth;

let deskImg, cardThinkingImg;
let deskX, drawDeskY;
let doorImg=['', '']; // 0-> 닫힌 문, 1 -> 열린 문
let drawDoorX, drawDoorY; //문의 위치
let thinkingType;
let thinkingTime;

let coffeeShopImg, carImg, stairImg, thinkCoffeeImg;
let coffeeShopX, coffeeShopY, objX, objY;
let drawcoffeeShopX, drawobjX;

let characterImg = ['', '', '', ''];
let characterX = 100; // 캐릭터의 초기 X 위치
let characterBack = false;
let characterFrame = 0;         // 현재 프레임 번호
let frameCountForStep = 0;      // 프레임 전환 카운터(속도조절용)
const FRAME_CHANGE_SPEED = 10;   // 몇 프레임마다 한 번씩 이미지가 바뀔지

let cameraX = 0; // 카메라의 초기 X 위치
let speed = 10; // 캐릭터의 속도도
let viewWidth;

let messageCount; 
let showMessage = false; 
let message = "";


p.preload = function() {
    houseImg = p.loadImage("assets/house/집 배경.png");
    parkImg = p.loadImage("assets/park/공원.jpg");

    deskImg = p.loadImage("assets/house/책상-외부.png");
    doorImg[0] = p.loadImage("assets/house/닫힌 문.png");
    doorImg[1] = p.loadImage("assets/house/열린 문.png");
    cardThinkingImg = p.loadImage("assets/house/생각.png");

    coffeeShopImg = p.loadImage("assets/park/커피숍-외부.png");
    thinkCoffeeImg = p.loadImage("assets/park/커피생각.png");
    carImg = p.loadImage("assets/park/자동차.png");
    stairImg = p.loadImage("assets/park/지하철 계단.png");

    characterImg[0] = p.loadImage("assets/character/캐릭터1.png");
    characterImg[1] = p.loadImage("assets/character/캐릭터2.png");
    characterImg[2] = p.loadImage("assets/character/캐릭터3.png");
    characterImg[3] = p.loadImage("assets/character/캐릭터2.png");
};

p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight); 

    totalWidth = houseImg.width + parkImg.width * 2;
    // window를 사용해서 전역(파일 전체)에서 공유하는 변수들 설정정
    characterX = window.state.characterX !== undefined ? window.state.characterX : 100;
    cameraX = window.state.cameraX !== undefined ? window.state.cameraX : 0;
    

    objY = p.height - 350;
    coffeeShopX = houseImg.width + parkImg.width - 200;
    coffeeShopY = p.height - 500;
    objX = houseImg.width + parkImg.width*2 - 500;

    deskX = houseImg.width/2 + 100;
    console.log(deskX);
    drawDeskY = houseImg.height - deskImg.height;
};

p.draw = function() {
    p.background(220);

    viewWidth = Math.min(p.windowWidth, houseImg.width);

    // 화면에서 캐릭터가 중앙을 벗어나면 카메라가 따라감
    let screenCenter = viewWidth / 2;
    // (1) characterX - cameraX : 화면 상의 캐릭터 위치
    if (characterX - cameraX > screenCenter + 100) cameraX = characterX - (screenCenter + 100);
    if (characterX - cameraX < screenCenter - 100) cameraX = characterX - (screenCenter - 100);
    
    // 이미지 범위 밖으로 나가지 않게 만들기
    cameraX = p.constrain(cameraX, 0, totalWidth- viewWidth);

    
    // 배경
    p.image(houseImg, -cameraX, 0, houseImg.width, p.height);
    p.image(parkImg, houseImg.width - cameraX, 0, parkImg.width, p.height);
    p.image(parkImg, houseImg.width + parkImg.width - cameraX, 0, parkImg.width, p.height);
    
    
    drawDoor(); // 문 이미지 그리는 함수 
    drawDesk(); // 책상을 그리는 함수
    drawcoffeeShopX = coffeeShopX - cameraX;
    drawElement(coffeeShopImg, drawcoffeeShopX, coffeeShopY, 400);
    drawobjX = objX - cameraX;
    if (window.state.selectedItem === "car") {
        drawElement(carImg, drawobjX, objY, 400);
    } else if (window.state.selectedItem === "stair") {
        drawElement(stairImg, drawobjX, objY, 400);
    }

    if (p.millis() - thinkingTime <= 1000) {
        if (thinkingType === "card") {
            drawElement(cardThinkingImg, characterX - cameraX - 270,  p.height - 620, 200);
        } else if (thinkingType === "coffee") {
            drawElement(thinkCoffeeImg, characterX - cameraX - 270,  p.height - 620, 200);
        }
    } 
    drawCharacter(); // 캐릭터를 그리는 함수
    if (showMessage) {
        messageCount++;
        if (messageCount >= 1000) {
            showMessage = false;
            messageCount = 0;
            message = "";
        }
        drawText();
    }
};

// 화면 상에서 문, 책상 클릭 판정(책상 클릭 시 desk.js파일로 이동)
p.mousePressed = function() {
    // 문
    if (p.mouseX >= drawDoorX && p.mouseX <= drawDoorX + doorImg[0].width) {
        window.state.doorOpen = true;
    }

    // 책상 
    let drawDeskX = deskX - cameraX;
    if (p.mouseX >= drawDeskX && p.mouseX <= drawDeskX + deskImg.width) {
        window.state.characterX = characterX;
        window.state.cameraX = cameraX;
        
        window.dispatchEvent(new Event("goToDesk"));
    }

    // 커피숍
    if (drawcoffeeShopX <= p.mouseX && p.mouseX <= drawcoffeeShopX + 400) {
        if (window.state.selectedItem === "car") {
            window.state.characterX = characterX;
            window.state.cameraX = cameraX;

            window.dispatchEvent(new Event("goToCoffeeShop"));
        } else if (window.state.selectedItem === "stair") {
            messageCount = 0;
            showMessage = true;
            message = "시간이 없다. 지하철을 빨리 타야 한다!";
        }
    }

    // 자동차, 지하철 계단
    if (drawobjX <= p.mouseX && p.mouseX <= drawobjX + 400) {
        if (window.state.selectedItem === "car") { 
            if (window.state.getCoffee) {
                window.dispatchEvent(new Event("goToCar"));
            } else {
                thinkingType = "coffee";
                thinkingTime = p.millis();
            }
        } else if (window.state.selectedItem === "stair") {
             window.dispatchEvent(new Event("goToSubway"));
        }
    }
}

// 브라우저 창의 크기가 변경되었을 때 캔버스의 크기를 브라우저에 맞추는 함수
p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
};

// 문 이미지 그리는 함수 
// doorOpen를 통해 닫힌 문을 그릴 지, 열린 문을 그릴 지 결정
function drawDoor() {
    let doorX = houseImg.width - doorImg[0].width;
    let doorY = houseImg.height - doorImg[0].height;
    drawDoorX = doorX - cameraX;
    drawDoorY = doorY;
    // 화면에 보일 때만 그림
    if (drawDoorX + doorImg[0].width > 0 && drawDoorX-doorImg[1].width + doorImg[0].width < viewWidth) {
        if (window.state.doorOpen) {
            drawDoorY = drawDoorY - doorImg[1].height + doorImg[0].height;
            drawDoorX = drawDoorX-doorImg[1].width + doorImg[0].width;
            p.image(doorImg[1], drawDoorX, drawDoorY, doorImg[1].width, doorImg[1].height);
        } else {
            if (p.mouseX >= drawDoorX && p.mouseX <= drawDoorX + doorImg[0].width) {
                p.image(doorImg[0], drawDoorX-40, drawDoorY-40, doorImg[0].width+40, doorImg[0].height+40);
            } else {
                p.image(doorImg[0], drawDoorX, drawDoorY, doorImg[0].width, doorImg[0].height);
            }
            
        }
    }
}

// 책상을 그리는 함수
// 단순히 그리기만 함. desk.js로의 이동은 mousePressed에서
function drawDesk() {
    let drawDeskX = deskX - cameraX;
    if (drawDeskX + deskImg.width > 0 && drawDeskX < viewWidth) {
        drawElement(deskImg, drawDeskX, drawDeskY, deskImg.width);
    }
}

// 캐릭터를 그리는 함수
// 화살표 키를 이용해서 움직임
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
        characterX = p.constrain(characterX, 0, totalWidth - 1);

        if (characterX + characterImg[1].width/2 >= houseImg.width - doorImg[0].width/2) {
            if (!window.state.doorOpen) {
                characterX -= speed;
            } else if (window.state.selectedItem === "") {
                characterX -= speed;
                thinkingType = "card";
                thinkingTime = p.millis();
            }
        };
    }

    if (isMoving) {
        frameCountForStep++;
        if (frameCountForStep >= FRAME_CHANGE_SPEED) {
            characterFrame = (characterFrame + 1) % characterImg.length;
            frameCountForStep = 0;
        }
    } else {
        characterFrame = 1; // 안 움직일 땐 정지 프레임(예: characterImg[0])
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
    p.image(characterImg[characterFrame], 0, 0, 450*(characterImg[characterFrame].width/characterImg[characterFrame].height) , 450);
    p.pop();
}

// 요소를 그리는 함수
// 이미지, x좌표, y좌표, 가로크기
// 이미지의 비율을 유지하기 위해서 세로크기는 가로크기에 의존해서 설정
function drawElement(img, imgX, imgY, imgW) {
    let imgH = imgW*(img.height/img.width);
    if (imgX<=p.mouseX && p.mouseX <= imgX+imgW) {
        imgH = (imgW+40)*(img.height/img.width);
        p.image(img, imgX-20, imgY-20, imgW + 40, imgH);
    } else {
        p.image(img, imgX, imgY, imgW, imgH);
    }
}

// 경고 메시지를 띄우는 함수
// showWarningText 으로 메시지를 띄워야 하는 지 조절
// warningStartTime, WARNING_DURATION 으로 시간 조절
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
    p.textSize(14);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(message, balloonX, balloonY + 15);
    p.pop();
}

};
}