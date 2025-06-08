export function makeCompanySketch() {
  return function (p) {


let companyIMG, bossImg, documentImg;
let clockIMG;
let bossX, bossY, bossW, bossH;
let clockX, clockY;
let documentStack = [];
let documentTimer = 0;
let maxDocuments = 30;
let showSpeech = false;
let alpha = 0;
let fadingIn = true;
let fadingOut = false;
let speechTimer = 0;
let speechDuration = 120; // 약 2초 (60fps 기준)
let bossSpeech = false;

let darkness = 0;
let rotating = false;

let hourAngle, minuteAngle;
let targetHourAngle, targetMinuteAngle;
const minuteLength = 70;
const hourLength = 40;
const minuteSpeed = 0.2;
let hourSpeed;

let coffeeImg = ["","","","",""];
let coffeeX, coffeeY;
let selectCoffee = 0;
let coffeeW = 70;

p.preload = function () {
  companyIMG = p.loadImage("assets/company/company.png");
  bossImg = p.loadImage("assets/company/boss1.png");
  documentImg = p.loadImage("assets/company/paper.png");
  clockIMG = p.loadImage("assets/company/clock.png");
  for (let i = 0; i < 5; i++) {
    coffeeImg[i] = p.loadImage("assets/coffeeShop/커피"+(i + 1)+".png");
  }
};

p.setup = function () {
  p.createCanvas(p.windowWidth, p.windowHeight);
  clockX = p.width * 0.87;
  clockY = p.height * 0.15;
  bossX = p.width * 0.6;
  bossY = p.height * 0.3;
  bossW = bossImg.width;
  bossH = bossImg.height;
  coffeeX=p.width*0.5;
  coffeeY=p.height*0.7;
  resetClock();
};

p.windowResized = function () {
  p.resizeCanvas(p.windowWidth, p.windowHeight);
  clockX = p.width * 0.87;
  clockY = p.height * 0.15;
  bossX = p.width * 0.6;
  bossY = p.height * 0.3;
  bossW = bossImg.width;
  bossH = bossImg.height;
  coffeeX = p.width * 0.5;
  coffeeY = p.height * 0.7;
};

function resetClock() {
  hourAngle = p.radians(255);
  minuteAngle = p.radians(180);
  targetHourAngle = p.radians(195);
  targetMinuteAngle = minuteAngle + p.TWO_PI * 10;

  const minuteDelta = targetMinuteAngle - minuteAngle;
  const hourDelta = (targetHourAngle + p.TWO_PI) - hourAngle;
  hourSpeed = minuteSpeed * (hourDelta / minuteDelta);
}

function drawHoverClock(img, x, y, w) {
  let h = w * (img.height / img.width);
  p.imageMode(p.CENTER);

  // CENTER 기준으로 hover 판정
  let isHover = p.mouseX >= x - w / 2 && p.mouseX <= x + w / 2 &&
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

  let isHover = p.mouseX >= x && p.mouseX <= x + w &&
                p.mouseY >= y && p.mouseY <= y + h;

  if (isHover) {
    let hoverW = w * 1.1;
    let hoverH = h * 1.1;
    p.image(img, x - (hoverW - w) / 2, y - (hoverH - h) / 2, hoverW, hoverH);
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


  // 시계 바늘
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

  // 상사 페이드 인/아웃
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
  drawHoverBoss(bossImg, bossX, bossY);
  p.noTint();
  p.pop();

  // 회전
  if (rotating) {
    if (minuteAngle < targetMinuteAngle) {
      minuteAngle += minuteSpeed;
      if (minuteAngle > targetMinuteAngle) minuteAngle = targetMinuteAngle;
    }

    if (hourAngle < targetHourAngle + p.TWO_PI) {
      hourAngle += hourSpeed;
      if (hourAngle > targetHourAngle + p.TWO_PI) hourAngle = targetHourAngle + p.TWO_PI;
    }

    if (Math.abs(minuteAngle - targetMinuteAngle) < 0.01 && Math.abs(hourAngle - (targetHourAngle + p.TWO_PI)) < 0.01) {
      rotating = false;
      window.state.ending[0] = true; // 자동차 장면 완료료
    }

    // 서류 생성
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
    p.text("오늘 출근도 빠르고 근무태도도 성실하군요~.", balloonX + 150, balloonY + 25);
  }

  switch (selectCoffee) {
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

  if (clickedBoss) {
    showSpeech = true;
    speechTimer = 0;
    bossSpeech = true;
  }

  if (clickedClock && bossSpeech) {
    resetClock();
    rotating = true;
    documentStack = [];
    documentTimer = 0;
    darkness = 0;
  }

  if (window.state.ending[0]) {
    if (window.state.ending[1]) {
      window.dispatchEvent(new Event("goToEndingcredit"));
    } else {
      window.dispatchEvent(new Event("goToDesk"));
      window.state.characterX = 1200;
    }
  }
};



  };
}