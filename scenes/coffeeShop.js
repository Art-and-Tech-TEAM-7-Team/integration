export function makeCoffeeSHopSketch() {
return function(p) { 


let coffeeShopImg, kioskImg;
let coffeeImg = ["","","","",""];
let coffeeX, coffeeY, coffeeW;
let kioskOn = false;
let selectCoffee = 0;

p.preload = function() {
    coffeeShopImg = p.loadImage("assets/coffeeShop/커피숍.jpg");
    for (let i = 0; i < 5; i++) {
        coffeeImg[i] = p.loadImage("assets/coffeeShop/커피"+(i+1)+".png");
    }
    kioskImg = p.loadImage("assets/coffeeShop/키오스크화면.png");
}

p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);

    coffeeX = 1000;
    coffeeY = 520;
    coffeeW = 50;
}

p.draw = function() {
    p.background(229);
    p.image(coffeeShopImg, 0, 0, p.windowWidth, p.windowHeight);
    if (kioskOn) {
        let 비율 = 0.68;
        p.image(kioskImg, 125, 185, kioskImg.width*비율+ 55, kioskImg.height*비율);
        console.log(kioskImg.width*비율 + 55); //333.12
        console.log(kioskImg.height*비율); //306
        
        for (let i = 0; i < 5; i++) {
            drawElement(coffeeImg[i], 175 + (i%3)*101, 235 + Math.floor(i/3)*90, 30);
        }
    } else if (125 <= p.mouseX && p.mouseX <= kioskImg.width*0.68+ 180 && 185 <= p.mouseY && p.mouseY <= 185 + kioskImg.height*0.68) { // 마우스 호버 인식 -> 이미지 분리 안되어 있어서 rect로 대체체
        p.fill("#373631");
        p.rect(115, 175, kioskImg.width*0.68+ 55 + 20, kioskImg.height*0.68 + 20);
    }
    switch (selectCoffee) { // 선택된 커피에 따라 이미지 그리기 - for문 쓸걸...
        case 1:
            drawElement(coffeeImg[0], coffeeX, coffeeY, coffeeW);
            break;
        case 2:
            drawElement(coffeeImg[1], coffeeX, coffeeY, coffeeW);
            break;
        case 3:
            drawElement(coffeeImg[2], coffeeX, coffeeY, coffeeW);
            break;  
        case 4:
            drawElement(coffeeImg[3], coffeeX, coffeeY, coffeeW);
            break;
        case 5:
            drawElement(coffeeImg[4], coffeeX, coffeeY, coffeeW);
            break;
    }
}

p.mousePressed = function() {
    if (!kioskOn) { 
        if (125 <= p.mouseX && p.mouseX <= kioskImg.width*0.68+ 180 && 185 <= p.mouseY && p.mouseY <= 185 + kioskImg.height*0.68)
        kioskOn = true;
    } else {
        for (let i = 0; i < 5; i++) {
            if (175 + (i%3)*101<=p.mouseX && p.mouseX <= 175 + (i%3)*101+30 && 235 + Math.floor(i/3)*90 <= p.mouseY && p.mouseY <= 235 + Math.floor(i/3)*90+30) {
                selectCoffee = i+1;
            }
        }
    } 
    if (selectCoffee && coffeeX <= p.mouseX && p.mouseX <= coffeeX + coffeeW) {
        window.state.getCoffee = true;
        selectCoffee = 0;
        return;
    } 
    if (window.state.getCoffee) {
        window.dispatchEvent(new Event("goToHouse")); // AI이용 - 이동
    }
}
// AI이용 - 브라우저 창의 크기가 변경되었을 때 캔버스의 크기를 브라우저에 맞추는 함수
p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
};

function drawElement(img, imgX, imgY, imgW) {
    let imgH = imgW*(img.height/img.width); // 이미지의 비율을 유지
    if (imgX<=p.mouseX && p.mouseX <= imgX+imgW && imgY <= p.mouseY && p.mouseY <= imgY+imgH) {
        imgH = (imgW+5)*(img.height/img.width);
        p.image(img, imgX-2.5, imgY-7, imgW + 5, imgH);
    } else {
        p.image(img, imgX, imgY, imgW, imgH);
    }
}


}
}
