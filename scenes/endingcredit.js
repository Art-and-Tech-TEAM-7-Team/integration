export function makeEndingcreditSketch(){
    return function(p){
        let endingcreditIMG;
        let text = "shinjinho"; //yudaeun, johaejin
        p.preload=function(){
            endingcreditIMG = p.loadImage("assets/endingcredit.jpg");
        } 
        p.setup=function(){
            p.createCanvas(p.windowWidth, p.windowHeight);
        }
        p.draw=function(){
            p.background(220);
            p.image(endingcreditIMG, 0, 0, p.windowWidth, p.windowHeight); 
            drawTitle("제작 소감");
            if (text === "shinjinho") {
                drawTitle("신진호", 30, p.height*(1/2));
                drawText("이번 프로젝트에서 배웠던 p5.js를 직접 사용해보면서 js와 p.5js의 \n편의성을 체감할 수 있었습니다. \n덕분에 왜 사람들이 웹 페이지를 만들 때 js를 사용하는지 체감했습니다. \n그리고 디자인, 개발, 기획을 모두 골고루 경험할 수 있어서 \n다양한 분야에 대한 이해를 키울 수 있었습니다. \n팀 프로젝트의 강력함을 알 수 있었습니다. 프로젝트를 기획할 때 \n저와 팀원의 아이디어가 합쳐지고 제가 아이디어를 낼 때 \n팀원들이 평가해주니 좋은 아이디어를 고를 수 있었습니다.");
            } else if (text === "yudaeun") {
                drawTitle("유다은", 30, p.height*(1/2));
                drawText("보통은 디자인, 개발, 기획 분야로 나누어서 프로젝트를 진행하는데\n 아텍 팀플은 분야를 고루고루 경험할 수 있어서 좋았습니다.\n 덕분에 개발 분야에서 지하철 관련 인터렉션을 구현하고 뿌듯했습니다.\n 다만 코드를 작성하면서 너무 길고 정리가 안된 느낌을 받아서 다음에 \n이런 프로젝트에 참여한다면 이런 부분들을 개선하여 더 깔끔하게 \n코드를 구현해보고 싶습니다.");
            } else if (text === "johaejin") {
                drawTitle("조혜진", 30, p.height*(1/2));
                drawText("이번 프로젝트에서 한 학기동안 수업시간에서 배웠던 기능들을 많이 \n사용하였는데, 결과물을 보니 1학년 1학기가 담긴거 같아 뿌듯했습니다. \n배울때는 서로서로가 관련이 없어보였는데, 실제로 한 작품에\n 사용되는 것이 신기했고 프로젝트를 제작하라는 과제가 주어졌을 때\n 어떻게 해야할지 막막하기도 했고, 하면서도 이렇게 하는게 맞는지 \n의심이 들었는데 막상 해보니까 배운 선에서 충분히 할 만 했고, \n몰랐던 부분, 몰랐던 기능들에 대해서 더 자세히 배우게 된 거 같아 \n의미 있는 시간들이었던 거 같습니다");
            }
        p.windowResized = function() {
         p.resizeCanvas(p.windowWidth, p.windowHeight);
        };

        p.mousePressed = function() {
            if (text === "shinjinho") {
                text = "yudaeun";
            } else if (text === "yudaeun") {
                text = "johaejin";
            }

        }

        function drawTitle(message, size = 50, yPos = p.height*(1/3)) {
            p.fill(0);
            p.noStroke();
            p.textSize(size);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(message, p.width*(3/4), yPos);
        }

        function drawText(message) {
            p.fill(0);
            p.noStroke();
            p.textSize(20);
            p.textAlign(p.LEFT, p.CENTER);
            p.text(message, p.width*(3/5), p.height*(7/10));
        }
    }
   


    
}
}