import { SCENE_MAP, EVENT_TO_SCENE } from './scenes/index.js';

let currentP5 = null;

// 캔버스를 담을 컨테이너 div가 index.html에 필요!
// AI이용 - SCENE_MAP에 있는 장면을 불러오는 함수
function launchScene(sceneName) {
  if (currentP5) { // currentP5 초기화
    currentP5.remove();
    currentP5 = null;
  }
  if (SCENE_MAP[sceneName]) { // 객체 생성
    currentP5 = new p5(SCENE_MAP[sceneName](), "canvas-container"); // canvas-container라는 id를 가진 곳에 캔버스 생성
  }
}

// AI이용 - 이벤트 발생 시 장면 전환
Object.entries(EVENT_TO_SCENE).forEach(([eventName, sceneName]) => {
  window.addEventListener(eventName, () => launchScene(sceneName)); // 이벤트 발생 시 함수 호출
});


window.onload = () => launchScene("start"); // AI이용 - 시작 시 start화면

window.state = window.state || {}; // AI이용 - 모든 파일에서 사용가능한 변수들(객체 이용)
window.state.characterX = 100; // window.state의 사용법 (캐릭터 위치 저장)
window.state.cameraX = 0; 
window.state.selectedItem = ""; // 운전면허증(car)를 가져갔는지 교통카드(stair)를 가져갔는지 판단
window.state.ending = [false, false]; // 엔딩(정확히 엔딩은 아님님)을 봤는 지 여부 - 첫번째 요소는 자동차 엔딩, 두번쨰 요소은 지하철 엔딩
window.state.doorOpen = false; //move.js에서 문 열림 판정
window.state.getCoffee = false; //move.js에서 커피 가져감 판정

