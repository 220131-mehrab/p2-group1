// noinspection TypeScriptCheckImport

import { Component } from '@angular/core';
import { gameChoice, startOver} from "./game-list/game-list.component";

let megamanIdle1 = document.getElementById('megamanIdle1');
let megamanIdle2 = document.getElementById('megamanIdle2');
let elecManInsideFloor1 = document.getElementById('elecManInsideFloor1');


let ctxGame1 : CanvasRenderingContext2D;
let textInput1 : HTMLInputElement;

const CANVAS_WIDTH = 416;
const CANVAS_HEIGHT = 416;
const SQUARE_WIDTH = 100;
const SQUARE_HEIGHT = 100;
const FRAMES_PER_SECOND = 30;

let squareSpeed = 5;
let squareX = 0;
let squareY = 0;
let squareRight = squareX + SQUARE_WIDTH;
let squareBottom = squareY + SQUARE_HEIGHT;

let gameOneReset = false;
let gameTwoReset = false;
let gameThreeReset = false;

let squareDancePhase1 = true;
let squareDancePhase2 = false;
let squareDancePhase3 = false;
let squareDancePhase4 = false;


/**
 * Game 1: Pong game variables
 */
const PADDLE_WIDTH:number = 100;
const PADDLE_HEIGHT:number = 10;
let distance:number = 60;
let paddleX:number = 220;
let paddleY:number = 380;
let ballX: number = 75;
let ballY: number = 75;
let ballSpeedX: number = 5;
let ballSpeedY: number = 7;
let mouseX:number, mouseY:number;


/*
*   G
*    a
*     m
*      e
*       2 Global Variables / functions
*
 */

let keys = {
  left: false,
  right: false,
  space: false,
  quote: false
}

let megaman = {
  x: 176,
  y: 306,
  x_v: 0,
  y_v: 0,
  imgWidth: 64,
  imgHeight: 64,
  trueWidth: 48,
  trueHeight: 42,
  flipped: false,
  moveSpeed: .02,
  jumpSpeed: 5.6,
  maxJumpFrame: 10,
  jumpInterval: 8.25,
  action : {
    idle: true,
    walk: false,
    grounded: true,
    jump: false,
    fall: false
  }

};
let gravity = 0.6;
let friction = 0.7;
let megamanIdlingFrameCount = 0;
let megamanMovingFrameCount = 0;
let megamanJumpingFrameCount = 0;

const STAGE_COLS = 13;
const STAGE_ROWS = 13;
let stageImage: CanvasImageSource;
let elecmanStageRoom1 =  [2, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
                          2, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
                          2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
                          2, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2,
                          2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
                          2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
                          2, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 2,
                          2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
                          2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
                          2, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2,
                          2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
                          2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
                          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

let getCanvasElementById = (id : 'SampleGame1') : HTMLCanvasElement => {
  let canvasGame1 = document.getElementById(id);
  if (!(canvasGame1 instanceof HTMLCanvasElement)) {
    throw new Error('Can\'t access "${id}"');
  }
  return canvasGame1;
};

// let canvas = getCanvasElementById('SampleGame1');

let getCanvasRenderingContext2D = (canvasGame1 : HTMLCanvasElement) : CanvasRenderingContext2D => {
  let context1 = canvasGame1.getContext('2d');

  if (context1 === null) {
    throw new Error("Browser doesn't support Canvas Context Drawing");
  }
  return context1;
};

let grabTextElement = (id: 'textField1') : HTMLInputElement => {
  let textField1 = document.getElementById(id);
  if (!(textField1 instanceof HTMLInputElement))
    throw new Error('Can\'t grab the text box');
  return textField1;
};

let grabTextArea = (id: 'textField2') : HTMLTextAreaElement => {
  let textField2 = document.getElementById(id);
  if (!(textField2 instanceof HTMLTextAreaElement))
    throw new Error('Can\'t grab the text area');
  return textField2;
};




/*
*   G
*    a
*     m
*      e
*       3 Global Variables / functions
*
 */
let mines = 5;
let minesSet = false;

let squareColor = '#00ff00';
let row1 = [0, 0, 0, 0, 0];
let row2 = [0, 0, 0, 0, 0];
let row3 = [0, 0, 0, 0, 0];
let row4 = [0, 0, 0, 0, 0];
let row5 = [0, 0, 0, 0, 0];

let row1Ex = [1, 1, 1, 1, 1];
let row2Ex = [1, 1, 1, 1, 1];
let row3Ex = [1, 1, 1, 1, 1];
let row4Ex = [1, 1, 1, 1, 1];
let row5Ex = [1, 1, 1, 1, 1];

function ResetMineField() {
  row1 = [0, 0, 0, 0, 0];
  row2 = [0, 0, 0, 0, 0];
  row3 = [0, 0, 0, 0, 0];
  row4 = [0, 0, 0, 0, 0];
  row5 = [0, 0, 0, 0, 0];
}

function ResetMineSquares() {
  // Draws the black and white squares of the board.
  let valueToPrint: string = '';
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      // if j is even, squareColor is black, else white
      if (i % 2 == 0)
        squareColor = j % 2 == 0 ? "black" : "white";
      else
        squareColor = j % 2 == 0 ? "white" : "black";
      DrawRectangle(i * 80, j * 80, 80, 80, squareColor);
    }
  }
      for (let k = 0; k < 5; k++) {
        let squareColorOdd = k % 2 == 0 ? "white" : "black";
        let squareColorEven = k % 2 == 0 ? "black" : "white";

        let stringConvert = row1[k] == 10 ? "\u{1F4A3}" : row1[k].toString();
        DrawText(stringConvert, k * 80 + 30, 40, "24px Arial", squareColorOdd);

        stringConvert = row2[k] == 10 ? "\u{1F4A3}" : row2[k].toString();
        DrawText(stringConvert, k * 80 + 30, 120, "24px Arial", squareColorEven);

        stringConvert = row3[k] == 10 ? "\u{1F4A3}" : row3[k].toString();
        DrawText(stringConvert, k * 80 + 30, 200, "24px Arial", squareColorOdd);

        stringConvert = row4[k] == 10 ? "\u{1F4A3}" : row4[k].toString();
        DrawText(stringConvert, k * 80 + 30, 280, "24px Arial", squareColorEven);

        stringConvert = row5[k] == 10 ? "\u{1F4A3}" : row5[k].toString();
        DrawText(stringConvert, k * 80 + 30, 360, "24px Arial", squareColorOdd);
      }

  }

/*
*   E
*    n
*     d
*      of Global Variables / functions
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Game Chooser';
}

function UpdateVariables() {
  squareRight = squareX + SQUARE_WIDTH;
  squareBottom = squareY + SQUARE_HEIGHT;
}


window.onload = function() {
  ctxGame1 = getCanvasRenderingContext2D(getCanvasElementById('SampleGame1'));
  textInput1 = grabTextElement('textField1');
  ResetGameOne();
  ResetGameTwo();
  ResetGameThree();
  setInterval(CallAll, 1000/FRAMES_PER_SECOND);

}

function CallAll() {
  textInput1.value = megamanJumpingFrameCount.toString();

  addEventListener('keypress', (event) => {

    if (gameChoice == 2) {
      switch (event.code) {
        case 'KeyA':
          keys.left = true;
          break;
        case 'KeyD':
          keys.right = true;
          break;
        case "Space":
          keys.space = true;
          break;
      }
      }
    }); // KeyA, Enter, Quote

  addEventListener('keyup', (event) => {
    if (gameChoice == 2) {
      switch (event.code) {
        case 'KeyA':
          keys.left = false;
          break;
        case 'KeyD':
          keys.right = false;
          break;
        case "Space":
          keys.space = false;
          megaman.action.idle = true;
          break;
      }
    }
  }
    ); // KeyA, Enter, Quote

  DrawAll();
  UpdateVariables();
}

function ResetGameOne() {
  let ballX: number = 75;
  let ballY: number = 75;
  let ballSpeedX: number = 5;
  let ballSpeedY: number = 7;
  let mouseX:number, mouseY:number;
}

function ResetGameTwo() {
  megaman.x = 176;
  megaman.y = 306;
}

function ResetGameThree() {
  minesSet = false;
  ResetMineField();
  ResetMineSquares();
}

function rowColToArrayIndex(col:number, row:number) {
  return col + STAGE_COLS * row;
}

function DrawTracks() {
  for (let eachRow = 0; eachRow < STAGE_ROWS; eachRow++)
    for (var eachCol = 0; eachCol < STAGE_COLS; eachCol++) {
      let arrayIndex = rowColToArrayIndex(eachCol, eachRow);
      if (elecmanStageRoom1[arrayIndex] == 1) {
        stageImage = new Image();
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/elecManInsideFloor1.png";
        ctxGame1.drawImage(stageImage, eachCol * 32 - 8, eachRow * 30 + 8);  // 13 is the width of each tile
      }
      if (elecmanStageRoom1[arrayIndex] == 2) {
        stageImage = new Image();
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/elecManInsideWall1.png";
        ctxGame1.drawImage(stageImage, eachCol * 32 - 8, eachRow * 30 + 6);  // 13 is the width of each tile
      }
      if (elecmanStageRoom1[arrayIndex] == 3) {
        stageImage = new Image();
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/elecManInsidePlatform1.png";
        ctxGame1.drawImage(stageImage, eachCol * 32 - 8, eachRow * 30 + 8);  // 13 is the width of each tile
      }
      if (elecmanStageRoom1[arrayIndex] == 4) {
        stageImage = new Image();
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/wilyLogoBL.png";
        ctxGame1.drawImage(stageImage, eachCol * 32 - 8, eachRow * 30 + 8);  // 13 is the width of each tile
      }
      if (elecmanStageRoom1[arrayIndex] == 5) {
        stageImage = new Image();
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/wilyLogoBR.png";
        ctxGame1.drawImage(stageImage, eachCol * 32 - 8, eachRow * 30 + 8);  // 13 is the width of each tile
      }
      if (elecmanStageRoom1[arrayIndex] == 6) {
        stageImage = new Image();
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/wilyLogoTL.png";
        ctxGame1.drawImage(stageImage, eachCol * 32 - 8, eachRow * 30 + 8);  // 13 is the width of each tile
      }
      if (elecmanStageRoom1[arrayIndex] == 7) {
        stageImage = new Image();
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/wilyLogoTR.png";
        ctxGame1.drawImage(stageImage, eachCol * 32 - 8, eachRow * 30 + 8);  // 13 is the width of each tile
      }
    }
}

function DrawAll() {
  if (gameOneReset) {
    ResetGameOne();
    gameOneReset = false;
  }
  if (gameTwoReset) {
    ResetGameTwo();
    gameTwoReset = false;
  }
  if (gameThreeReset) {
    ResetGameThree();
    gameThreeReset = false;
  }

  if (gameChoice == 1) {  // Pong Game
    gameOneReset = false;
    gameTwoReset = true;
    gameThreeReset = true;

    let canvas:HTMLCanvasElement;
    let ctx:CanvasRenderingContext2D;

    let getCanvasElementById = (id : 'SampleGame1') : HTMLCanvasElement => {
      let canvasGame1 = document.getElementById(id);
      if (!(canvasGame1 instanceof HTMLCanvasElement)) {
        throw new Error('Can\'t access "${id}"');
      }
      return canvasGame1;
    };
    canvas= getCanvasElementById('SampleGame1');

    DrawRectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'black'); // Background
    DrawRectangle(paddleX, paddleY, 100, 10, '#0080ee'); // Bottom paddle
    DrawCircle(ballX+=ballSpeedX, ballY+=ballSpeedY, 10, 'white'); // Ball
    DrawRectangle(paddleX,paddleY,100,10, '#0080ee'); // Background

    canvas.addEventListener('mousemove', function(evt:MouseEvent) {
      let rect = canvas.getBoundingClientRect(); // Position of mouse on page
      let root = document.documentElement;

      mouseX = evt.clientX - rect.left - root.scrollLeft;
      paddleX = mouseX - (PADDLE_WIDTH / 2);
    });

    if (ballY >= paddleY  && ballX >= paddleX && ballX <= paddleX + PADDLE_WIDTH) {
      ballSpeedY *= -1;
    } else if (ballX <= 10 || ballX >= CANVAS_WIDTH - 10) {
      ballSpeedX *= -1;
    } else if (ballY <= 10) {
      ballSpeedY *= -1;
    } else if (ballY >= CANVAS_HEIGHT - 10) {
      ballReset();
    }


    function ballReset() {
      ballX = CANVAS_WIDTH / 2;
      ballY = CANVAS_HEIGHT / 2;
    }





  } else if (gameChoice == 2) { // Megaman Game
    DrawRectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#9bbc0f")
    DrawTracks();
    stageImage = new Image();

    if (keys.space) {
      // I want to be able to hold the spacebar to jump higher, so I got rid of the if !action.jump
      // if (megaman.action.fall || megaman.action.jump){
      //   if (!megaman.flipped)
      //     stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanJump.png";
      //   else
      //     stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanJumpFlipped.png";
      // }
      // if grounded...
      if (megaman.action.grounded) {
        megaman.y_v -= megaman.jumpInterval;
        megaman.action.jump = true;
        megaman.action.grounded = false;
      }
      // If in the air.
      if (megaman.y < 306) {
        megaman.action.grounded = false;
        // if falling
        if (megamanJumpingFrameCount > megaman.maxJumpFrame) {
          megaman.action.jump = false;
          megaman.action.fall = true;
          megamanIdlingFrameCount = 0;
          megamanMovingFrameCount = 0;
          megamanJumpingFrameCount = megamanJumpingFrameCount;

        }
        // if jumping
        else if (megamanJumpingFrameCount <= megaman.maxJumpFrame) {
          megaman.action.jump = true;
          megaman.action.fall = false;
          megamanIdlingFrameCount = 0;
          megamanMovingFrameCount = 0;
          megamanJumpingFrameCount++;
        }
      }

      if (!megaman.action.grounded) {
        if (!megaman.flipped)
          stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanJump.png";
        else
          stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanJumpFlipped.png";
      }
    }


    // need a falling and not grounded version of this too.
    else if (keys.left && megaman.action.grounded) {
      megaman.action.idle = false;
      megaman.action.walk = true;
      megaman.action.grounded = true;
      megaman.action.jump = false;
      megaman.action.fall = false;
      megaman.flipped = false;
      megamanIdlingFrameCount = 0;
      megamanMovingFrameCount++;
      megamanJumpingFrameCount = 0;
      if (megamanMovingFrameCount <= 8)
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk1.png";
      else if (megamanMovingFrameCount > 8 && megamanMovingFrameCount <= 16)
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk2.png";
      else if (megamanMovingFrameCount > 16 && megamanMovingFrameCount <= 24)
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk3.png";
      else if (megamanMovingFrameCount <= 32)
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk4.png";
      else if (megamanMovingFrameCount <= 40)
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk3.png";
      else if (megamanMovingFrameCount <= 48) {
        if (megamanMovingFrameCount == 48)
          megamanMovingFrameCount = 17;
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk2.png";
      }
      megaman.x_v = -3.2;
      megaman.y_v += gravity;
    }
    // need a falling and not grounded version of this too.
    else if (keys.right && megaman.action.grounded) {
      megaman.action.idle = false;
      megaman.action.walk = true;
      megaman.action.grounded = true;
      megaman.action.jump = false;
      megaman.action.fall = false;
      megaman.flipped = true;
      megamanIdlingFrameCount = 0;
      megamanMovingFrameCount++;
      if (megamanMovingFrameCount <= 8)
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk1Flipped.png";
      else if (megamanMovingFrameCount > 8 && megamanMovingFrameCount <= 16)
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk2Flipped.png";
      else if (megamanMovingFrameCount > 16 && megamanMovingFrameCount <= 24)
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk3Flipped.png";
      else if (megamanMovingFrameCount <= 32)
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk4Flipped.png";
      else if (megamanMovingFrameCount <= 40)
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk3Flipped.png";
      else if (megamanMovingFrameCount <= 48) {
        if (megamanMovingFrameCount == 48)
          megamanMovingFrameCount = 17;
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk2Flipped.png";
      }
      megaman.x_v = 3.2;
      megaman.y_v += gravity;
    }
      // If not pressing the left or right keys, and not jumping
    // Need a need a not grounded version of the same below conditional.
    else if (!keys.left && !keys.right) {
      megaman.action.idle = true;
      megaman.action.walk = false;
      megaman.action.grounded = true;
      megaman.action.jump = false;
      megaman.action.fall = false;
      megamanIdlingFrameCount++;
      megamanMovingFrameCount = 0;
      if (megamanIdlingFrameCount > 90 && megamanIdlingFrameCount <= 105) {
        // if Megaman is idle for more than 3 seconds, but less than 3.5, draw the idle blinking frame.
        if (megaman.flipped)
          stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanIdle2Flipped.png";
        else
          stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanIdle2.png";
        megaman.x_v += 0;
        megaman.y_v += gravity;
      } else {
        if (megamanIdlingFrameCount > 105)
          megamanIdlingFrameCount = 0;
        // if after blinking, idle frame count is reset, but if < 90, keeps accruing.
        if (megaman.flipped)
          stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanIdle1Flipped.png";
        else
          stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanIdle1.png";
        ctxGame1.drawImage(stageImage, megaman.x, megaman.y += megaman.y_v);
        megaman.x_v = 0;
        megaman.y_v += gravity;
      }
    }
    // This takes care of Megaman blinking out when falling and being idle.
    if (megaman.action.jump || megaman.action.fall) {
      if (!megaman.flipped)
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanJump.png";
      else
        stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanJumpFlipped.png";
    }

    if (megaman.y + megaman.y_v > 305)
      megaman.y_v = 305 - megaman.y;


    if (megaman.x + megaman.x_v > 311)
      megaman.x_v = 311 - megaman.x;
    if (megaman.x + megaman.x_v < 7)
      megaman.x_v = 7 - megaman.x;

    // textInput1.value = "i = " + megaman.action.idle.toString() + ", w = " + megaman.action.walk.toString() + ", j = " + megaman.action.jump.toString() + ", g = " + megaman.action.grounded.toString() + ", f = " + megaman.action.fall.toString() ;
    // textInput1.value = "y = " + megaman.y.toString() + ", y_v = " + megaman.y_v.toString();
    ctxGame1.drawImage(stageImage, megaman.x += megaman.x_v, megaman.y += megaman.y_v);


    if (megaman.y >= 305) {
      megaman.y = 305;
      megaman.y_v = 0;
      megaman.action.grounded = true;
      megaman.action.jump = false;
      megaman.action.fall = false;
      if (!megaman.action.walk) {
        megaman.action.walk = false;
        megaman.x_v = 0;
        megamanIdlingFrameCount++;
        megamanMovingFrameCount = 0;
        megamanJumpingFrameCount = 0;
        if (megaman.flipped)
          stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanIdle1Flipped.png";
        else
          stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanIdle1.png";
      } else {
        megaman.action.walk = true;
        megamanIdlingFrameCount = 0;
        megamanMovingFrameCount++;
        megamanJumpingFrameCount = 0;
        if (megamanMovingFrameCount <= 8)
          stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk1Flipped.png";
        else if (megamanMovingFrameCount > 8 && megamanMovingFrameCount <= 16)
          stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk2Flipped.png";
        else if (megamanMovingFrameCount > 16 && megamanMovingFrameCount <= 24)
          stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk3Flipped.png";
        else if (megamanMovingFrameCount <= 32)
          stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk4Flipped.png";
        else if (megamanMovingFrameCount <= 40)
          stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk3Flipped.png";
        else if (megamanMovingFrameCount <= 48) {
          if (megamanMovingFrameCount == 48)
            megamanMovingFrameCount = 17;
          stageImage.src = "http://agamedesigner.info/appImages/AngularTesting/megamanWalk2Flipped.png";
        }
        if (megaman.flipped)
          megaman.x_v = 3.2;
        else
          megaman.x_v = -3.2;
        megaman.y_v += gravity;
      }
    }

    gameOneReset = true;
    gameTwoReset = false;
    gameThreeReset = true;


  } else if (gameChoice == 3) { // Minesweeper
    gameOneReset = true;
    gameTwoReset = true;
    gameThreeReset = false;
    ResetMineField();

    // if the mines haven't been placed yet, nor the number of bombs on each square, and the active game is Minesweeper.
    if (!minesSet && gameChoice == 3) {
      let textInput2 = grabTextArea("textField2");
      let mineCount = 0;
      let x: number;
      let y: number;
      while (mineCount < 10) {
        // Gets a random number between 0 and 1, multiplies by 100 to get a whole number, and truncates the decimal.
        x = Math.trunc((Math.random()) * 100);
        // Places the bombs in the arrays for the board.
        if (x <= 24) {// if (row1[x] == 0) {
          y = (x % 5).valueOf();
          switch (Math.trunc(x / 5)) {
            case 0:
              if (row1[y.valueOf()] == 0) {
                row1[y] = 10;
                mineCount++;
              }
              break;
            case 1:
              if (row2[y.valueOf()] == 0) {
                row2[y] = 10;
                mineCount++;
              }
              break;
            case 2:
              if (row3[y.valueOf()] == 0) {
                row3[y] = 10;
                mineCount++;
              }
              break;
            case 3:
              if (row4[y.valueOf()] == 0) {
                row4[y] = 10;
                mineCount++;
              }
              break;
            case 4:
              if (row5[y.valueOf()] == 0) {
                row5[y] = 10;
                mineCount++;
              }
              break;
          }

          textInput2.value = row1.toString() + "\n" + row2.toString() + "\n" + row3.toString() + "\n" + row4.toString() + "\n" + row5.toString();

          let squaresChecked = 0;
          let squareOn = 0;
          let bombsNearSquare = 0;
          // This variable has a type for the function return to run.
          let squareOnValue:number = 0;
          // These variables hold either -1, 0, 10, or some other positive number.
          let squareLeft = -1, squareRight = -1, squareDown = -1, squareUp = -1, squareUpLeft = -1, squareUpRight = -1, squareDownLeft = -1, squareDownRight = -1;

          // GetValueOfSquare will return the value of the squareOn parameter.
          const GetValueOfSquare = (squareOnF:number):number => {
            let rowNumber = Math.trunc(squareOnF / 5);
            let rowPOVColumn = squareOnF % 5;
            switch (rowNumber) {
              case 0:
                return row1[rowPOVColumn];
                break;
              case 1:
                return row2[rowPOVColumn];
                break;
              case 2:
                return row3[rowPOVColumn];
                break;
              case 3:
                return row4[rowPOVColumn];
                break;
              case 4:
                return row5[rowPOVColumn];
                break;
              default:
                return 0;
                break;
            }
          }


          // function SetValueOfSquare(x:number, setSquare:number) {
          //   let rowNumberSV = Math.trunc(x / 5);
          //   let rowPOVColumnSV = x % 5;
          //   switch (rowNumberSV) {
          //     case 0:
          //       row1[rowPOVColumnSV] = setSquare;
          //       break;
          //     case 1:
          //       row2[rowPOVColumnSV] = setSquare;
          //       break;
          //     case 2:
          //       row3[rowPOVColumnSV] = setSquare;
          //       break;
          //     case 3:
          //       row4[rowPOVColumnSV] = setSquare;
          //       break;
          //     case 4:
          //       row5[rowPOVColumnSV] = setSquare;
          //       break;
          //     default:
          //       break;
          //   }
          // }

          for(let x=0; x < 25; x++) {
            if (GetValueOfSquare(squareOn) != 10) {
              squareLeft = x - 1 >= 0 ? GetValueOfSquare(x - 1) : -1;
              squareRight = x + 1 <= 24 ? GetValueOfSquare(x + 1) : -1;
              squareUp = x - 5 >=0 ? GetValueOfSquare(x - 5) : -1;
              squareDown = x + 5 <= 24 ? GetValueOfSquare(x + 5) : -1;
              squareUpLeft = x - 6 >= 0 ? GetValueOfSquare(x - 6) : -1;
              squareUpRight = x - 4 >= 0 ? GetValueOfSquare(x - 4) : -1;
              squareDownLeft = x + 6 <= 24 ? GetValueOfSquare(x + 6) : -1;
              squareDownRight = x + 4 <= 24 ? GetValueOfSquare(x + 4) : -1;


              bombsNearSquare = squareLeft == 10 ? bombsNearSquare + 1 : bombsNearSquare + 0;
              bombsNearSquare = squareRight == 10 ? bombsNearSquare + 1 : bombsNearSquare + 0;
              bombsNearSquare = squareUp == 10 ? bombsNearSquare + 1 : bombsNearSquare + 0;
              bombsNearSquare = squareDown == 10 ? bombsNearSquare + 1 : bombsNearSquare + 0;
              bombsNearSquare = squareUpLeft == 10 ? bombsNearSquare + 1 : bombsNearSquare + 0;
              bombsNearSquare = squareUpRight == 10 ? bombsNearSquare + 1 : bombsNearSquare + 0;
              bombsNearSquare = squareDownLeft == 10 ? bombsNearSquare + 1 : bombsNearSquare + 0;
              bombsNearSquare = squareDownRight == 10 ? bombsNearSquare + 1 : bombsNearSquare + 0;


              SetValueOfSquare(x, bombsNearSquare);

              squareLeft = -1;
              squareRight = -1;
              squareUp = -1;
              squareDown = -1;
              squareUpLeft = -1;
              squareUpRight = -1;
              squareDownLeft = -1;
              squareDownRight = -1;
              bombsNearSquare = 0;



            }
          }

          // // making each number around the bombs say how many bombs are around it.
          // while(squaresChecked < 25) {
          //   // getting values for the squares surrounding the squareOn.
          //   squareOnValue = GetValueOfSquare(squareOn);
          //
          //   // If not a bomb, evaluate the left box
          //   if (squareOnValue < 10) {
          //     if (squareOn - 1 >= 0) {
          //       // Grab value of square to the left exists.
          //       squareLeft = GetValueOfSquare(squareOn - 1);
          //     } else {
          //       // if there is no square to the left, set it to -1.
          //       squareLeft = -1;
          //     }
          //     // Right
          //     if (squareOn + 1 <= 24) {
          //       squareRight = GetValueOfSquare(squareOn + 1);
          //     } else {
          //       squareRight = -1;
          //     }
          //     // Down
          //     if (squareOn + 5 <= 24) {
          //       squareDown = GetValueOfSquare(squareOn + 5);
          //     } else {
          //       squareDown = -1;
          //     }
          //     // Up
          //     if (squareOn - 5 >= 0) {
          //       squareUp = GetValueOfSquare(squareOn - 5);
          //     } else {
          //       squareUp = -1;
          //     }
          //     // Up Left
          //     if (squareOn - 6 >= 0) {
          //       squareUpLeft = GetValueOfSquare(squareOn - 6);
          //     } else {
          //       squareUpLeft = -1;
          //     }
          //     // Up Right
          //     if (squareOn - 4 >= 0) {
          //       squareUpRight = GetValueOfSquare(squareOn - 4);
          //     } else {
          //       squareUpRight = -1;
          //     }
          //     // Down Left
          //     if (squareOn + 4 >= 24) {
          //       squareDownLeft = GetValueOfSquare(squareOn + 4);
          //     } else {
          //       squareDownLeft = -1;
          //     }
          //     // Down Right
          //     if (squareOn + 6 >= 24) {
          //       squareDownRight = GetValueOfSquare(squareOn + 6);
          //     } else {
          //       squareDownRight = -1;
          //     }
          //
          //     if (squareLeft == 10) bombsNearSquare++;
          //     if (squareRight == 10) bombsNearSquare++;
          //     if (squareDown == 10) bombsNearSquare++;
          //     if (squareUp == 10) bombsNearSquare++;
          //     if (squareUpLeft == 10) bombsNearSquare++;
          //     if (squareUpRight == 10) bombsNearSquare++;
          //     if (squareDownLeft == 10) bombsNearSquare++;
          //     if (squareDownRight == 10) bombsNearSquare++;
          //
          //
          //     SetValueOfSquare(bombsNearSquare);
          //     // textInput2.value = textInput2.value + "squareOn: " + squareOn + ", bombsNearSquare: " + bombsNearSquare + "\n";
          //
          //     squareLeft = 0;
          //     squareRight = 0;
          //     squareDown = 0;
          //     squareUp = 0;
          //     squareUpLeft = 0;
          //     squareUpRight = 0;
          //     squareDownLeft = 0;
          //     squareDownRight = 0;
          //     bombsNearSquare = 0;
          //
          //   }
          //   // End of While loop increments.
          //   squareOn++;
          //   squaresChecked++;
          // }

          // textInput2.value = row1.toString() + "\n" + row2.toString() + "\n" + row3.toString() + "\n" + row4.toString() + "\n" + row5.toString();
          ResetMineSquares();
          minesSet = true;
        }
      }
    }
  }
}


function DrawRectangle(x:number, y:number, width:number, height:number, color:string) {

  if (color == "Clear")
    ctxGame1.clearRect(x, y, width, height);
  else {
    ctxGame1.fillStyle = color;
    ctxGame1.fillRect(x, y, width, height);
  }
}

function DrawCircle(centerX: number, centerY: number, radius: number, fillColor: string | CanvasGradient | CanvasPattern) {
  ctxGame1.fillStyle = fillColor;
  ctxGame1.beginPath();
  ctxGame1.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  ctxGame1.fill();
}

function DrawText(message:string, x:number, y:number, font:string, color:string) {
  ctxGame1.font = font;
  ctxGame1.fillStyle = color;
  ctxGame1.fillText(message, x, y);
}
