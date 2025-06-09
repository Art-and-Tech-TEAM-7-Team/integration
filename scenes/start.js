export function makeStartSketch() { // AI이용 - 시작 화면 스케치 함수
return function(p) { // AI이용 - p는 p5.js의 인스턴스(캔버스) 객체
 

let viewPoint = 0;
let startImg;
let eyeImg = ["", ""];
let eyeOpen = false;
let showTitle = true;
let zoomOut = 1;      
let darkAlpha = 0;   

p.preload = function() {
    startImg = p.loadImage("assets/start/시작화면.jpg");
    eyeImg[0] = p.loadImage("assets/start/감은 눈.png");
    eyeImg[1] = p.loadImage("assets/start/뜬 눈.png");
};

p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
};

p.draw = function() {
    p.background(255);

    // 이미지 
    // AI이용 - 줌아웃 효과
    p.push();
    p.translate(p.width/2, p.height/2);
    p.scale(zoomOut);
    p.imageMode(p.CENTER);
    p.image(startImg, 0, 0, p.width, p.height);
    drawEyes();
    p.pop();
    if (showTitle) {
        // 블러 효과 비슷하게 만들기
        p.push();
        p.tint(255, 80); // 배경 흐리게
        p.image(startImg, 0, 0, p.width, p.height);
        drawEyes();
        p.pop();

        // 반투명 오버레이(더 블러 느낌)
        p.push();
        p.noStroke();
        p.fill(240, 240, 240, 140);
        p.rect(0, 0, p.width, p.height);
        p.pop();

        // 제목/제작자 글자
        p.fill(40);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(56);
        p.text("두 가지 출근법", p.width / 2, p.height / 2 - 80);

        p.textSize(28);
        p.fill(80);
        p.text("제작: 신진호, 유다은, 조혜진", p.width / 2, p.height / 2 + 10);

        p.textSize(28);
        p.fill(80);
        p.text("스크롤, 마우스 클릭, 좌우 화살표로 인터렉션이 가능합니다.", p.width / 2, p.height / 2 + 100);

    } else {
        if (eyeOpen) {
            zoomOut = 1 - p.constrain(viewPoint / 200, 0, 0.5);   // 1 ~ 0.5
            darkAlpha = p.constrain(viewPoint * 3, 0, 180);        // 0 ~ 180 (최대 어두워짐)

            // 검은 오버레이 (알파로 조절)
            p.push();
            p.noStroke();
            p.fill(0, darkAlpha);
            p.rect(0, 0, p.width, p.height);
            p.pop();
        } else {
            p.textSize(28);
            p.fill(80);
            p.text("눈을 뜨면 다음 화면으로 이동 가능합니다.", p.width / 2, p.height / 2 + 100);
        }
        drawEyes();
    }
};

p.mousePressed = function() {
    if (showTitle) {
        showTitle = false;
    } else {
        if (!eyeOpen) {
            eyeOpen = true;
        }
    }
}

p.mouseWheel = function(event) {
    if (!showTitle && eyeOpen) {
        if (event.delta > 0) { // AI이용 - 스크롤 다운, 업 판정
        viewPoint += 10; // 스크롤 다운 
        } 
        if (event.delta < 0) {
        viewPoint -= 10; // 스크롤 업
        }
        viewPoint = p.constrain(viewPoint, 0, 110);
    }

    //일정 정도 이상 스크롤 시 화면 이동
    if (viewPoint >= 50) { 
        window.dispatchEvent(new Event("goToHouse")); // AI이용 - 장면 전환 이벤트 생성
    }
};

// AI이용 - 브라우저 창의 크기가 변경되었을 때 캔버스의 크기를 브라우저에 맞추는 함수
p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
};

function drawEyes() {
    let eyeSize = 100;
    if (eyeOpen) {
        p.image(eyeImg[1], -33, -150, eyeSize, eyeSize*(eyeImg[1].height/eyeImg[1].width))
    } else {
        p.image(eyeImg[0], -33, -150, eyeSize, eyeSize*(eyeImg[0].height/eyeImg[0].width))
    }
}


}}