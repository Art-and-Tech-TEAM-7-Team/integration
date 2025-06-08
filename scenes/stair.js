export function makeStairSketch() {
  return function (p) {
    let stair, person, phone, stairs, chat;
    let pX = 290;
    let pY = 390;
    let personW = 100;
    let phoneVisible = false;
    let phoneTimer = 0;
    let transitionStart = null;
    let showChat = false;
    let moveEnabled = false;
    let hasPhoneShown = false;
    let moveCount = 0;

    p.preload = function () {
      stair = p.loadImage('assets/subway/지하철-계단.jpg');
      stairs = p.loadImage('assets/subway/에스컬레이터.png');
      person = p.loadImage('assets/subway/일어난사람.png');
      phone = p.loadImage('assets/subway/핸드폰.png');
      chat = p.loadImage('assets/subway/말풍선2.png');
    };

    p.setup = function () {
      p.createCanvas(1366, 768);
      p.imageMode(p.CORNER);
    };

    p.draw = function () {
      p.background(255);
      p.image(stair, 0, 0, p.width, p.height);
      

      drawElement(person, pX, pY, personW, !hasPhoneShown);

      let phoneX = pX + 110;
      let phoneY = pY - 300;

      // 핸드폰과 말풍선 전환 처리
      if (phoneVisible) {
        let elapsed = p.millis() - phoneTimer;

        if (elapsed < 2000) {
          // 0~2초: 핸드폰만
          p.image(phone, phoneX, phoneY, 350, 250);
        } else if (elapsed < 3000) {
          // 2~3초: 혼합
          let alpha = p.map(elapsed, 2000, 3000, 0, 255);
          p.push();
          p.tint(255, 255 - alpha);
          p.image(phone, phoneX, phoneY, 350, 250);
          p.pop();

          p.push();
          p.tint(255, alpha);
          p.image(chat, phoneX, phoneY, 350, 250);
          p.pop();
        } else if (elapsed < 4000) {
          // 3~4초: 말풍선만
          p.image(chat, phoneX, phoneY, 350, 250);
        } else {
          // 이후: 종료
          phoneVisible = false;
          moveEnabled = true;
        }
      }

      p.image(stairs, 5, 170, 1500, 650);  

      // 다음 장면으로 이동 (bus.js)
      if (moveCount >= 5) {
        window.dispatchEvent(new Event("goToBusStop"));
      }
    };

    function drawElement(img, imgX, imgY, imgW, allowZoom) {
      let imgH = imgW * (img.height / img.width);
      if (
        allowZoom &&
        imgX <= p.mouseX &&
        p.mouseX <= imgX + imgW &&
        imgY <= p.mouseY &&
        p.mouseY <= imgY + imgH
      ) {
        let enlargedW = imgW + 10;
        let enlargedH = enlargedW * (img.height / img.width);
        p.image(img, imgX - 5, imgY - 10, enlargedW, enlargedH);
      } else {
        p.image(img, imgX, imgY, imgW, imgH);
      }
    }

    p.mousePressed = function () {
      if (phoneVisible || moveEnabled || hasPhoneShown) return;

      let imgH = personW * (person.height / person.width);
      let distToPerson = p.dist(p.mouseX, p.mouseY, pX + personW / 2, pY + imgH / 2);
      if (distToPerson < 100) {
        phoneVisible = true;
        phoneTimer = p.millis();
        hasPhoneShown = true;
      }
    };

    p.keyPressed = function () {
      if (moveEnabled && p.keyCode === p.RIGHT_ARROW) {
        pX += 230;
        pY -= 70;
        moveCount++;
      }
    };
  };
}