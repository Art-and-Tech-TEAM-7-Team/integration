import { makeStartSketch } from "./start.js";
import { makeHouseSketch } from "./move.js";
import { makeDeskSketch } from "./desk.js";
import { makeCoffeeSHopSketch } from "./coffeeShop.js";

import { makeCarInsideSketch } from "./carInside.js";
import { makeContrastSketch } from "./contrast.js";
import { makeCompanySketch } from "./company.js";
import { makeCompany2Sketch } from "./company2.js";

import { makeScreendoorSketch } from "./screendoor.js";
import { makeInnerSketch } from "./subwayInner.js";
import { makeInner2Sketch } from "./subwayInner2.js";
import { makeStairSketch } from "./stair.js";
import { makeBusStopSketch } from "./busStop.js";

import { makeEndingcreditSketch } from "./endingcredit.js";

export const SCENE_MAP = { // AI이용 - 각 장면을 생성하는 함수들
  start:        () => makeStartSketch(), 
  house:        () => makeHouseSketch(),
  desk:         () => makeDeskSketch(),
  coffeeShop:   () => makeCoffeeSHopSketch(),
  carInside:    () => makeCarInsideSketch(),
  contrast:     () => makeContrastSketch(),
  company:      () => makeCompanySketch(),
  company2:     () => makeCompany2Sketch(),
  screendoor:   () => makeScreendoorSketch(),
  subwayInner:  () => makeInnerSketch(),
  subwayInner2: () => makeInner2Sketch(),
  stair:        () => makeStairSketch(),
  busStop:      () => makeBusStopSketch(),
  endingcredit: () => makeEndingcreditSketch()
};

// 이벤트 이름 <-> 장면 이름 매핑 - 위의 객체 참고(AI이용용)
export const EVENT_TO_SCENE = {
  goToHouse: "house",
  goToDesk: "desk",
  goToCoffeeShop: "coffeeShop",
  goToContrast: "contrast",
  goToCompany: "company",
  goToCompany2: "company2",
  goToEndingcredit: "endingcredit",
  goToCar: "carInside",
  goToSubway: "screendoor",
  goToInner: "subwayInner",
  goToInner2: "subwayInner2",
  goToStair: "stair",
  goToBusStop: "busStop"
};