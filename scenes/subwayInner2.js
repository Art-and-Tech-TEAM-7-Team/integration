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
    let doorOpened = false;
    let doorOpeningStart = null;
    let doorOpenDuration = 800;

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
        !doorOpened;

      let doorScale = isMouseOverDoor ? 1.05 : 1.0;

      if (doorOpened) {
        let doorElapsed = p.millis() - doorOpeningStart;
        let dOffset = p.constrain(doorElapsed / doorOpenDuration, 0, 1) * 150;
        p.image(door1, door1X - dOffset, door1Y, 300, 750);
        p.image(door2, door2X + dOffset, door2Y, 300, 750);
      } else {
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
      }

      // 사람 hover 체크 (클릭 전까지만 확대)
      let isMouseOverPerson = !isFinished && 
        p.mouseX >= pX && p.mouseX <= pX + 220 &&
        p.mouseY >= pY && p.mouseY <= pY + 700;

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
      if (
        isFinished &&
        !doorOpened &&
        p.mouseX >= door1X &&
        p.mouseX <= door2X + 300 &&
        p.mouseY >= door1Y &&
        p.mouseY <= door1Y + 750
      ) {
        doorOpened = true;
        doorOpeningStart = p.millis();
      } else if (doorOpened) {
        window.dispatchEvent(new Event("goToStair"));
      }
    };

    p.mouseWheel = function () {
      if (doorOpened) {
        window.dispatchEvent(new Event("goToStair"));
      }
    };
  };
}
