import { SCENE_MAP, EVENT_TO_SCENE } from './scenes/index.js';

let currentP5 = null;

// 캔버스를 담을 컨테이너 div가 index.html에 필요!
function launchScene(sceneName) {
  if (currentP5) {
    currentP5.remove();
    currentP5 = null;
  }
  if (SCENE_MAP[sceneName]) {
    currentP5 = new p5(SCENE_MAP[sceneName](), "canvas-container");
  }
}

Object.entries(EVENT_TO_SCENE).forEach(([eventName, sceneName]) => {
  window.addEventListener(eventName, () => launchScene(sceneName));
});


window.onload = () => launchScene("start"); //시작 시 start화면

window.state = window.state || {}; // 모든 파일에서 사용가능한 변수들들(객체를 이용) -> 파이썬의 딕셔너리 생각하면 좋다!
window.state.characterX = 100; // window.state의 사용법 (캐릭터의 위치를 저장)
window.state.cameraX = 0;
window.state.selectedItem = "";
window.state.ending = [false, false]; // 0은 자동차, 1은 지하철철
window.state.doorOpen = false;
window.state.getCoffee = false;
window.state.coffeeType = 0;

