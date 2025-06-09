export function makeInnerSketch() {
  return function(p) {
    let inner, chair, person, pole;
    let cX = 370;
    let cY = 400;
    let pX = 320;
    let pY = 0;
    let scaleFactor = 1;

    let people = [];
    let showPeople = false;
    let chairClicked = false; // ✅ 의자 클릭 여부 상태 변수

    p.preload = function() {
      inner = p.loadImage('assets/subway/지하철-내부2.jpg');
      chair = p.loadImage('assets/subway/의자.png');
      person = p.loadImage('assets/subway/사람.png');
      pole = p.loadImage('assets/subway/봉.png');
    };

    p.setup = function() {
      p.createCanvas(1366, 768);
      p.imageMode(p.CORNER);
    };

    // ✅ 봉/의자 마우스 오버 시 확대 함수
    p.drawElement = function(img, imgX, imgY, imgW) {
      let imgH = imgW * (img.height / img.width);
      if (
        imgX <= p.mouseX && p.mouseX <= imgX + imgW &&
        imgY <= p.mouseY && p.mouseY <= imgY + imgH
      ) {
        imgH = (imgW + 5) * (img.height / img.width);
        p.image(img, imgX - 2.5, imgY - 7, imgW + 5, imgH);
      } else {
        p.image(img, imgX, imgY, imgW, imgH);
      }
    };

    p.draw = function() {
      p.background(255);
      p.push();
      p.translate(p.width / 2, p.height / 2);
      p.scale(scaleFactor);
      p.translate(-p.width / 2, -p.height / 2);

      // 배경
      p.image(inner, 0, 0, p.width, p.height);

      // ✅ 의자 그리기: 클릭 전까지만 확대 가능
      if (!chairClicked) {
        p.drawElement(chair, cX, cY, 1000);
      } else {
        p.image(chair, cX, cY, 1000, 290);
      }

      // ✅ 봉 그리기: 무조건 drawElement 사용
      p.drawElement(pole, pX, pY, 25);

      // 사람 등장
      for (let personObj of people) {
        let elapsed = p.millis() - personObj.startTime;
        let alpha = p.map(elapsed, 0, 500, 0, 255, true);
        p.tint(255, alpha);
        p.image(person, personObj.x, personObj.y, 160, 380);
      }
      p.noTint();

      p.pop();
    };

    p.mousePressed = function() {
      // ✅ 의자 클릭 시 사람 등장 + 확대 금지
      if (
        !showPeople &&
        p.mouseX > cX && p.mouseX < cX + 1000 &&
        p.mouseY > cY && p.mouseY < cY + 290
      ) {
        showPeople = true;
        chairClicked = true; // 클릭 후 확대 막기
        let numberOfPeople = 4;
        let spacing = 230;
        let startX = 450;
        let y = 350;

        for (let i = 0; i < numberOfPeople; i++) {
          people.push({
            x: startX + i * spacing,
            y: y,
            startTime: p.millis()
          });
        }
      }

      // 봉 클릭 시 페이지 이동
      if (
        showPeople &&
        p.mouseX > pX && p.mouseX < pX + 25 &&
        p.mouseY > pY && p.mouseY < pY + 1000
      ) {
        window.dispatchEvent(new Event("goToInner2"));
      }
    };
  };
}
