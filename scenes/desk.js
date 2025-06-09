export function makeDeskSketch() {
return function(p) {
    let deskImg; 
    let licenseImg;
    let cardImg;

    p.preload = function() {
        deskImg = p.loadImage("assets/desk/책상.jpg");
        licenseImg = p.loadImage("assets/desk/운전면허증.png");
        cardImg = p.loadImage("assets/desk/교통카드.png");
    }

    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight);
    };

    p.draw = function() {
        p.background(220);
        p.image(deskImg, 0, 0, p.windowWidth, p.windowHeight);

        if (window.state.selectedItem !== "car" && window.state.ending[0] === false) {
            drawElement(licenseImg, p.width*(3/5), p.height*(3/5), 150);
        } 
        if (window.state.selectedItem !== "stair" && window.state.ending[1] === false) {
            drawElement(cardImg, p.width*(4/5), p.height*(3/5), 150);
        }
    };

    p.mousePressed = function() {
        if (p.width*(3/5)<=p.mouseX && p.mouseX <= p.width*(3/5)+150 && window.state.ending[0] === false) {
            window.state.selectedItem = "car";
        } else if (p.width*(4/5)<=p.mouseX && p.mouseX <= p.width*(4/5)+150 && window.state.ending[1] === false) {
             window.state.selectedItem = "stair";
        } else if (window.state.selectedItem !== "") {
            window.dispatchEvent(new Event("goToHouse")); // 이동
        } 
    };

    // 요소를 그리는 함수
    // parameter: 이미지, x좌표, y좌표, 가로크기
    // 이미지의 비율을 유지하기 위해서 세로크기는 가로크기에 의존해서 설정
    function drawElement(img, imgX, imgY, imgW) {
        let imgH = imgW*(img.height/img.width);
        if (imgX<=p.mouseX && p.mouseX <= imgX+imgW) { // 마우스 위치에 따라 크기 조정
            imgH = (imgW+20)*(img.height/img.width);
            p.image(img, imgX-10, imgY-10, imgW + 20, imgH);
        } else {
            p.image(img, imgX, imgY, imgW, imgH);
        }
    }
};
}