export function makeCompany2Sketch() {
  return function (p) {
    let companyIMG, img, documentImg;
    let clockIMG;
    let bossX, bossY, bossW, bossH;
    let clockX, clockY;
    let documentStack = [];
    let documentTimer = 0;
    let maxDocuments = 12;
    let showSpeech = false;
    let alpha = 0;
    let fadingIn = true;
    let fadingOut = false;
    let speechTimer = 0;
    let speechDuration = 120; // 약 2초 (60fps 기준)
    let timerStart = false;
    let bossSpeech = false;

    let blackScreen = false;

    let darkness = 0;
    let rotating = false;

    let hourAngle, minuteAngle;
    let targetHourAngle, targetMinuteAngle;
    const minuteLength = 70;
    const hourLength = 40;
    const minuteSpeed = 0.5;
    let hourSpeed;

    p.preload = function () {
      companyIMG = p.loadImage("assets/company/company2.png");
      img = p.loadImage("assets/company/boss2.png");
      documentImg = p.loadImage("assets/company/paper.png");
      clockIMG=p.loadImage("assets/company/clock.png");
    };

    p.setup = function () {
      p.createCanvas(p.windowWidth, p.windowHeight);
      clockX = p.width * 0.87;
      clockY = p.height * 0.15;
      bossX = p.width * 0.6;
      bossY = p.height * 0.3;
      bossW = img.width;
      bossH = img.height;
      resetClock();
    };

    p.windowResized = function () {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      bossX = p.width * 0.6;
      bossY = p.height * 0.3;
      clockX = p.width * 0.87;
      clockY = p.height * 0.15;
      bossW = img.width;
      bossH = img.height;
    };
//AI 사용: 시계 각도 계산산
    function resetClock() {
      hourAngle = p.radians(275);
      minuteAngle = p.radians(60);
      targetHourAngle = p.radians(195);
      targetMinuteAngle = minuteAngle + p.TWO_PI * 10;

      const minuteDelta = targetMinuteAngle - minuteAngle;
      const hourDelta = (targetHourAngle + p.TWO_PI) - hourAngle;
      hourSpeed = minuteSpeed * (hourDelta / minuteDelta);
    }
//AI 사용: 시계,보스에 마우스 가져다 놓았을 때 떨림림
    function drawHoverClock(img, x, y, w) {
  let h = w * (img.height / img.width);
  p.imageMode(p.CENTER);

  // CENTER 기준으로 hover 판정
  let isHover =
    p.mouseX >= x - w / 2 && p.mouseX <= x + w / 2 &&
    p.mouseY >= y - h / 2 && p.mouseY <= y + h / 2;

  if (isHover) {
    let hoverW = w + 10;
    let hoverH = hoverW * (img.height / img.width);
    p.image(img, x, y, hoverW, hoverH);
  } else {
    p.image(img, x, y, w, h);
  }

  p.imageMode(p.CORNER); // 다른 이미지 위해 복구
    }

    function drawHoverBoss(img, x, y) {
      let w = img.width;
      let h = img.height;

      let isHover =
        p.mouseX >= x && p.mouseX <= x + w &&
        p.mouseY >= y && p.mouseY <= y + h;

      if (isHover) {
        let hoverW = w * 1.1;
        let hoverH = h * 1.1;
        p.image(img, x - (hoverW - w)/2, y - (hoverH - h)/2, hoverW, hoverH);
      } else {
        p.image(img, x, y, w, h);
      }
    }




p.draw = function () {
  p.background(135, 206,250);

  // 시계 클릭 시 배경 어두워짐
  if (rotating && darkness < 225) darkness += 1;
  p.noStroke();
  p.fill(30,40,100, darkness);
  p.rect(0, 0, p.width, p.height);
  p.image(companyIMG, 0, 0, p.width, p.height);
  drawHoverClock(clockIMG,clockX,clockY,200);


  // ai 사용: 시계 바늘
  p.push();
  p.translate(clockX, clockY);
  p.rotate(minuteAngle);
  p.stroke(0);
  p.strokeWeight(4);
  p.line(0, 0, 0, -minuteLength);
  p.pop();

  p.push();
  p.translate(clockX, clockY);
  p.rotate(hourAngle);
  p.stroke(0);
  p.strokeWeight(6);
  p.line(0, 0, 0, -hourLength);
  p.pop();

  // AI 사용:상사 페이드 인/아웃
  if (fadingIn) {
    alpha += 5;
    if (alpha >= 255) {
      alpha = 255;
      fadingIn = false;
    }
  } else if (fadingOut) {
    alpha -= 5;
    if (alpha <= 0) {
      alpha = 0;
      fadingOut = false;
    }
  }

  p.push();
  p.tint(255, alpha);
  drawHoverBoss(img, bossX, bossY);
  p.noTint();
  p.pop();

  // AI사용: 회전
  if (rotating) {
    if (minuteAngle < targetMinuteAngle) {
      minuteAngle += minuteSpeed;
      if (minuteAngle > targetMinuteAngle) minuteAngle = targetMinuteAngle;
    }

    if (hourAngle < targetHourAngle + p.TWO_PI) {
      hourAngle += hourSpeed;
      if (hourAngle > targetHourAngle + p.TWO_PI) hourAngle = targetHourAngle + p.TWO_PI;
    }

    if (
      Math.abs(minuteAngle - targetMinuteAngle) < 0.01 &&
      Math.abs(hourAngle - (targetHourAngle + p.TWO_PI)) < 0.01
    ) {
      rotating = false;
      window.state.ending[1] = true;
    }

    // ai 사용: 서류 생성
    documentTimer++;
    if (documentTimer % 15 >= 0 && documentStack.length < maxDocuments) {
      documentStack.push({
        x: p.width * 0.5,
        y: p.height * 0.38 - documentStack.length * 3
      });
      documentTimer = 0;
    }
  }

  // 서류 출력
  for (let doc of documentStack) {
    p.imageMode(p.CENTER);
    p.image(documentImg, doc.x, doc.y, 1000, 1000);
    p.imageMode(p.CORNER);
  }

  // 말풍선
  if (showSpeech) {
    speechTimer++;
    if (speechTimer > speechDuration) {
      showSpeech = false;
      fadingOut = true;
    }

    const balloonX = p.width - 400;
    const balloonY = p.height * 0.3;

    p.fill(255);
    p.stroke(0);
    p.strokeWeight(2);
    p.rect(balloonX, balloonY, 300, 50, 10);

    p.fill(0);
    p.noStroke();
    p.textSize(14);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("오늘 지각도 하시고 근무태도도 불량하시군요?!!", balloonX + 150, balloonY + 25);
  }

  

if (blackScreen) {
  p.fill(255, 50);
  p.rect(0, 0, p.width, p.height);
  p.fill(0);
  p.noStroke();
  p.textSize(30);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("만약 운전면허증을을 가져갔다면?", p.width/2, p.height/2);
}

};

function drawElement(img, imgX, imgY, imgW) {
  let imgH = imgW * (img.height / img.width);
  p.image(img, imgX, imgY, imgW, imgH);
}

p.mousePressed = function () {
  const clickedClock = p.dist(p.mouseX, p.mouseY, clockX, clockY) < 80;
  const clickedBoss =
    p.mouseX >= bossX && p.mouseX <= bossX + bossW &&
    p.mouseY >= bossY && p.mouseY <= bossY + bossH;

  if (clickedBoss && !bossSpeech) {
    showSpeech = true;
    speechTimer = 0;
    bossSpeech = true;
  }

  if (clickedClock && bossSpeech && !timerStart) {
    resetClock();
    rotating = true;
    documentStack = [];
    documentTimer = 0;
    darkness = 0;
    timerStart = true;
  }

  if (window.state.ending[1]) {
    if (window.state.ending[0]) {
      window.dispatchEvent(new Event("goToEndingcredit"));
    } else if (blackScreen) {
      window.dispatchEvent(new Event("goToDesk"));
      window.state.characterX = 1200;
      window.state.doorOpen = false;
    } else {
      blackScreen = true;
    }
  }


}
};
}