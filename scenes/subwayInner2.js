export function makeInner2Sketch() {
  return function (p) {
    let inner2, person, person2, w1, w2, door1, door2;
    let scaleFactor = 1;
    let pX = 850;
    let pY = 70;
    let door1X = 100;
    let door1Y = 10;
    let door2X = 400;
    let door2Y = 10;

    let isFinished = false;
    let vibrationAmplitude = 4;
    let doorState = 'closed'; // 문 상태 관리

    p.preload = function () {
      inner2 = p.loadImage('assets/subway/지하철-내부3.jpg');
      person = p.loadImage('assets/subway/일어난사람.png');
      person2 = p.loadImage('assets/subway/아픈 다리.png');
      w1 = p.loadImage('assets/subway/떨림1.png');
      w2 = p.loadImage('assets/subway/떨림2.png');
      door1 = p.loadImage('assets/subway/문3.png');
      door2 = p.loadImage('assets/subway/문4.png');
    };

    p.setup = function () {
      p.createCanvas(1366, 768);
      p.imageMode(p.CORNER);
    };

    p.draw = function () {
      p.background(255);
      p.push();
      p.translate(p.width / 2, p.height / 2);
      p.scale(scaleFactor);
      p.translate(-p.width / 2, -p.height / 2);

      p.image(inner2, 0, 0, p.width, p.height);

      // 문 hover 체크
      let isMouseOverDoor =
        isFinished &&
        p.mouseX >= door1X &&
        p.mouseX <= door2X + 300 &&
        p.mouseY >= door1Y &&
        p.mouseY <= door1Y + 750 &&
        doorState === 'closed';

      let doorScale = isMouseOverDoor ? 1.05 : 1.0;

      // 문 열림 애니메이션 적용
      if (doorState === 'opening') {
        if (door1X > -150) {
          door1X -= 8;
          door2X += 8;
        } else {
          doorState = 'open';
        }
      }

      // 문 그리기
      p.push();
      p.translate(door1X + 150, door1Y + 375);
      p.scale(doorScale);
      p.image(door1, -150, -375, 300, 750);
      p.pop();

      p.push();
      p.translate(door2X + 150, door2Y + 375);
      p.scale(doorScale);
      p.image(door2, -150, -375, 300, 750);
      p.pop();

      // 사람 hover 체크 (클릭 전까지만 확대)
      let isMouseOverPerson =
        !isFinished &&
        p.mouseX >= pX &&
        p.mouseX <= pX + 220 &&
        p.mouseY >= pY &&
        p.mouseY <= pY + 700;

      let personScale = isMouseOverPerson ? 1.05 : 1.0;
      let currentPerson = isFinished ? person2 : person;

      p.push();
      p.translate(pX + 110, pY + 350);
      p.scale(personScale);
      p.image(currentPerson, -110, -350, 220, 700);
      p.pop();

      if (isFinished) {
        drawVibration();
      }

      p.pop();
    };

    function drawVibration() {
      let shake1 = p.random(-vibrationAmplitude, vibrationAmplitude);
      let shake2 = p.random(-vibrationAmplitude, vibrationAmplitude);
      p.image(w1, 850 + shake1, 600 + shake1, 20, 100);
      p.image(w2, 1050 + shake2, 500 + shake2, 20, 100);
    }

    p.mousePressed = function () {
      // 사람 클릭
      if (
        !isFinished &&
        p.mouseX >= pX &&
        p.mouseX <= pX + 220 &&
        p.mouseY >= pY &&
        p.mouseY <= pY + 700
      ) {
        isFinished = true;
      }

      // 문 클릭
      const door1Clicked = p.mouseX >= door1X &&
                           p.mouseX <= door1X + 300 &&
                           p.mouseY >= door1Y &&
                           p.mouseY <= door1Y + 750;

      const door2Clicked = p.mouseX >= door2X &&
                           p.mouseX <= door2X + 300 &&
                           p.mouseY >= door2Y &&
                           p.mouseY <= door2Y + 750;

      if (isFinished && doorState === 'closed' && (door1Clicked || door2Clicked)) {
        doorState = 'opening';
      } else if (doorState === 'open') {
        window.dispatchEvent(new Event("goToStair"));
      }
    };

    p.mouseWheel = function () {
      if (doorState === 'open') {
        window.dispatchEvent(new Event("goToStair"));
      }
    };
  };
}
