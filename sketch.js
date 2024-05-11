/*
Tank Domination
Vincent Pham
History:
April 22, 2024 - v1.0
*/

// https://p5play.org/learn
let peformance = false;
let playermines = 0;
alert("Use fullscreen (F11) for the best experience!");
let body;
let canvasW = 1440;
let canvasH = 810;
let forwardSpeed = 0;
let backwardSpeed = 0;
let reload = 0;
var gameStatus = "startScreen";
let reloadTimer = 2000;
let maxForwardSpeed = 0.1;
let fade = 0;
let enemyRel = false;
level = 1;
function setup() {
  bg = loadImage("Tank Title Screen.png");
  new Canvas(canvasW, canvasH, "fullscreen");
  body = new Sprite(100, 700, canvasW / 40, canvasH / 16);
  turret = new Sprite(body.x, body.y, canvasW / 25, canvasH / 110);
  body.layer = 2;
  j = new HingeJoint(turret, body);
  turret.overlap(body);
  body.color = "	#0D98BA";
  turret.color = "	#0D98BA";
  turret.offset.x = canvasH / 55;
  wheelLeft = new Sprite(
    body.x - canvasW / 80,
    body.y,
    canvasW / 120,
    canvasH / 16
  );
  wheelLeft.color = "black";
  wheelRight = new Sprite(
    body.x + canvasW / 80,
    body.y,
    canvasW / 120,
    canvasH / 16
  );
  wheelRight.color = "black";
  wheelLeft.layer = 1;
  wheelRight.layer = 1;
  wheelLeft.overlap(wheelRight);
  body.overlap(wheelLeft);
  turret.overlap(wheelLeft);
  body.overlap(wheelRight);
  turret.overlap(wheelRight);
  l = new GlueJoint(wheelLeft, body);
  r = new GlueJoint(wheelRight, body);
  directionFront = new Sprite(body.x, body.y - canvasW / 100, 10);

  directionBack = new Sprite(body.x, body.y + canvasW / 100, 10);
  directionBack.opacity = 0;
  // directionLeft = new Sprite(body.x-30, body.y, 10);

  // directionRight = new Sprite(body.x+30, body.y, 10);

  // directionFront.opacity = 0
  a = new GlueJoint(body, directionFront);
  b = new GlueJoint(body, directionBack);
  // c = new GlueJoint(body, directionLeft);
  // d = new GlueJoint(body, directionRight);
  body.overlap(directionFront);
  turret.overlap(directionFront);
  turret.overlap(directionBack);
  // turret.overlap(directionLeft);
  // turret.overlap(directionRight);

  shots = new Group();

  shot = new Sprite(-50, -50, canvasW / 110);
  shot.remove();
  let mine;
  mines = new Group();
  mines.d = 20;
  mines.color = red;
  mines.collider = "k";

  body.overlap(mines);
  turret.overlap(mines);
  directionFront.overlap(allSprites);
  directionBack.overlap(allSprites);
  mines.color = "red";

  // wine = new Sprite(100, 100, 50, 50);

  g = new Group();
  g.tile = "1";
  // gbody = new g.Sprite(1000, canvasH / 2, canvasW / 40, canvasH / 16, "k");
  // gturret = new g.Sprite(gbody.x, gbody.y, canvasW / 25, canvasH / 110, "k");
  // gbody.layer = 2;
  // gj = new HingeJoint(gturret, gbody);
  // gturret.overlap(gbody);
  // gbody.color = "	#345715";
  // gturret.color = "	#345715";
  // gturret.offset.x = canvasH / 55;
  // gwheelLeft = new g.Sprite(
  //   gbody.x - canvasW / 80,
  //   gbody.y,
  //   canvasW / 120,
  //   canvasH / 16
  // );
  // gwheelLeft.color = "black";
  // gwheelRight = new g.Sprite(
  //   gbody.x + canvasW / 80,
  //   gbody.y,
  //   canvasW / 120,
  //   canvasH / 16
  // );
  // gwheelRight.color = "black";
  // gwheelLeft.layer = 1;
  // gwheelRight.layer = 1;
  // gwheelLeft.overlap(gwheelRight);
  // gbody.overlap(gwheelLeft);
  // gturret.overlap(gwheelLeft);
  // gbody.overlap(gwheelRight);
  // gturret.overlap(gwheelRight);
  // gl = new GlueJoint(gwheelLeft, gbody);
  // gr = new GlueJoint(gwheelRight, gbody);
  // gState = "wander";

  newMap();
  cur = new Sprite();
  cur.overlap(allSprites);
  enemyReload();
  cur.img = "blueCursor.webp";
  cur.scale = 0.07;
  mouse.visible = false;
  mines.layer = 1;
  rock.layer = 1;
  metal.layer = 1;
  sand.layer = 1;
  cur.layer = 5;
  text = new Sprite(0.8 * canvasW, 0.6 * canvasH, canvasW / 4, 100, "s");
  text.color = "brown";
  text.text = "Press [SPACE] to Start";
  text.textSize = 30;
  text.textColor = "white";
  screenCover = new Sprite(0, 0, canvasW * 2, canvasH * 2, "s");
  screenCover.color = "black";
  screenCover.overlap(allSprites);
  screenCover.layer = 4;

  ET = new Group();
  ET.layer = 1;
  ET.color = "brown";
  enemyBody = new ET.Sprite(1000, canvasH / 2, canvasH / 16, "k");
  enemyTurret = new ET.Sprite(
    enemyBody.x,
    enemyBody.y,
    canvasW / 25,
    canvasH / 110,
    "k"
  );
  enemyTurret.offset.x = canvasH / 55;
  enemyShots = new Group();
  enemyShots.life = 3000;
  enemyShot = new enemyShots.Sprite(
    enemyTurret.x,
    enemyTurret.y,
    canvasW / 180
  );
  enemyShot.remove();
  damageIndicator = new Group();
  damageIndicator.opacity = 0.5;
  damageIndicator.color = "black";
  damageIndicator.life = 60;
  damageIndicator.collider = "s";
  damageIndicator.overlap(allSprites);
  controls = new Sprite();
  controls.diameter = 40;
  controls.collider = "s";
  controls.image = "controls.png";
  enemyAI();
}

function newMap() {
  rock = new Group();
  rock.w = canvasW / 24;
  rock.h = canvasH / 13.5;
  rock.collider = "k";
  rock.tile = "r";
  rock.color = "grey";

  metal = new Group();
  metal.w = canvasW / 24;
  metal.h = canvasH / 13.5;
  metal.collider = "k";
  metal.tile = "m";
  metal.color = "	#222222";

  sand = new Group();
  sand.w = canvasW / 24;
  sand.h = canvasH / 13.5;
  sand.collider = "k";
  sand.tile = "s";
  sand.color = "	#c46f69";
  tilesGroup = new Tiles(
    [
      "rrrrrrrrrrmmmmrrrrrrrrrr",
      "r......................m",
      "r.........r............m",
      "r........r.........rr..r",
      "r........r.............r",
      "r........s.............r",
      "r........s.............m",
      "r........r.............r",
      "r........r.............r",
      "r........r.........rr..r",
      "r.........r............r",
      "r......................m",
      "r......................m",
      "rrrrrrrrrrmmmmrrrrrrrrrr",
    ],
    30,
    30,
    rock.w + 0,
    rock.h + 0
  );

  // var matrix = [
  //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
  //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
  //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  // ];
  // var grid = new PF.Grid(matrix);

  // var finder = new PF.AStarFinder({
  //   allowDiagonal: true,
  //   dontCrossCorners: true,
  // });
  // var path = finder.findPath(16, 6, 3, 9, grid);
  // // console.log(path);

  // node = new Group();
  // node.visited = false;
  // node.radius = 10;
  // node.collider = "n";
  // // console.log(path);
  // for (p of path) {
  //   n = new node.Sprite(p[0] * 60 + 20, p[1] * 60 + 20);
  // }
}

function draw() {
  if (peformance == false) {
    if (kb.pressed("p")) {
      p5play.renderStats = true;
      peformance = true;
    }
  } else if (peformance == true) {
    if (kb.pressed("p")) {
      p5play.renderStats = false;
      peformance = false;
    }
  }
  // moveEnemy();

  // async function moveEnemy() {
  // for (i = 0; i < node.length; i++) {
  // await gbody.moveTo(node[i]);
  // if (gbody.x == node[i].x) {
  //   if (gbody.y == node[i].y) {

  //   }
  // }
  // }
  // }
  // moveEnemy().then();

  cur.moveTowards(mouse, 1);
  if (gameStatus == "startScreen") {
    start();
  } else if (gameStatus == 1) {
    levelOne();
    background("green");
    console.log(gameStatus);
  } else if (gameStatus == 2) {
    levelTwo();
  } else if (gameStatus == "lose") {
    gameOver();
  } else if (gameStatus == "win") {
    win();
  }
}
function start() {
  background(bg);
  allSprites.opacity = 0;
  screenCover.opacity = fade;
  text.opacity = 1;
  if (kb.pressed(" ")) {
    // fadeIn();
    setTimeout(starting, 1000);
    // alert("hi");
  }
}
function fadeIn() {
  fade = fade + 0.01;
  screenCover.opacity = fade;
  setTimeout(fadeIn, 1000);
}
// function fadeOut() {
//   fade = fadeOut - 0.01;
//   if (fade == 0) {
//     return;
//   } else {
//     setTimeout(fadeOut, 10);
//   }
// }
function starting() {
  allSprites.opacity = 1;
  directionFront.opacity = 0;
  directionBack.opacity = 0;
  gameStatus = level;
}
function levelOne() {
  text.remove();
  controls.x = 300;
  controls.y = 400;
  controls.scale = 0.8;
  controls.overlap(allSprites);
  playerControls();
  // fadeOut();
  screenCover.opacity = fade;
  // gturret.x = gbody.x;
  // gturret.y = gbody.y;
  if ((gState = "wander")) {
    // gbody.moveTo(gbody.x+15)
  }
  if (tracker.overlap(rock)) {
    enemyTurret.rotationSpeed = 1;
    tracker.remove();
  } else if (tracker.overlap(body)) {
    enemyTurret.rotateMinTo(body, 1, 0);

    if (enemyRel == true) {
      enemyShoot();
    }
    tracker.remove();
  }
  enemyShot.collides(rock, enemyShotBlowup);
  enemyShot.collides(body, hit);
  enemyShot.collides(wheelLeft, whit);
  enemyShot.collides(wheelRight, whit);
  enemyShot.collides(turret, thit);
  if (shot.collides(enemyBody)) {
    let bulletChance = random(0, 100);
    if (bulletChance > 50) {
      damageShow = new damageIndicator.Sprite(enemyBody.x, enemyBody.y, 0, 0);
      damageIndicator.opacity = 1;
      damageIndicator.text = "No Penetration";
    } else {
      gameStatus = "win";
    }
  }
  if (mines.overlap(enemyBody)) {
    gameStatus = "win";
  }
  bullet();
}

function levelTwo() {
  controls.remove();
  playerControls();

  // fadeOut();
  screenCover.opacity = fade;
  // gturret.x = gbody.x;
  // gturret.y = gbody.y;
  if ((gState = "wander")) {
    // gbody.moveTo(gbody.x+15)
  }
  if (tracker.overlap(rock)) {
    enemyTurret.rotationSpeed = 1;
    tracker.remove();
  } else if (tracker.overlap(body)) {
    enemyTurret.rotateMinTo(body, 1, 0);

    if (enemyRel == true) {
      enemyShoot();
    }
    tracker.remove();
  }
  enemyShot.collides(rock, enemyShotBlowup);
  enemyShot.collided(body, hit);
  enemyShot.collided(wheelLeft, whit);
  enemyShot.collided(wheelRight, whit);
  enemyShot.collided(turret, thit);
  if (shot.collides(enemyBody)) {
    let bulletChance = random(0, 100);
    if (bulletChance > 50) {
      damageShow = new damageIndicator.Sprite(enemyBody.x, enemyBody.y, 0, 0);
      damageIndicator.opacity = 1;
      damageIndicator.text = "No Penetration";
    } else {
      gameStatus = "win";
    }
  }
  if (mines.overlap(enemyBody)) {
    gameStatus = "win";
  }
  bullet();
}
function hit(body, enemyShot) {
  enemyShotBlowup(body);
  let bulletChance = random(0, 100);
  if (bulletChance > 50) {
    damageShow = new damageIndicator.Sprite(body.x, body.y, 0, 0);
    damageIndicator.opacity = 1;
    damageIndicator.text = "Hit! No major damage.";
  } else if (bulletChance < 30) {
    damageShow = new damageIndicator.Sprite(body.x, body.y, 0, 0);
    damageIndicator.opacity = 1;
    damageIndicator.text = "Reparing. EST: 3s";
    maxForwardSpeed = 0;
    setTimeout(repair, 3000);
  } else {
    gameStatus = "lose";
  }
}
function whit(wheelLeft, enemyShot) {
  enemyShotBlowup(wheelLeft);
  let bulletChance = random(0, 100);
  if (bulletChance > 80) {
    damageShow = new damageIndicator.Sprite(body.x, body.y, 0, 0);
    damageIndicator.opacity = 1;
    damageIndicator.text = "Hit! No major damage.";
  } else if (bulletChance < 80) {
    damageShow = new damageIndicator.Sprite(body.x, body.y, 0, 0);
    damageIndicator.opacity = 1;
    damageIndicator.text = "Tracks damaged. Reparing Tracks";
    maxForwardSpeed = 0;
    setTimeout(repair, 5000);
  }
}
function thit() {
  let bulletChance = random(0, 100);
  if (bulletChance > 90) {
    damageShow = new damageIndicator.Sprite(body.x, body.y, 0, 0);
    damageIndicator.opacity = 1;
    damageIndicator.text = "Hit! No major damage.";
  } else if (bulletChance < 90) {
    damageShow = new damageIndicator.Sprite(body.x, body.y, 0, 0);
    damageIndicator.opacity = 1;
    damageIndicator.text = "Turret Damaged. Reparing.";
    reload = 1;
    setTimeout(reloading, 3000);
  }
}
function repair() {
  maxForwardSpeed = 0.1;
}
function enemyShoot() {
  enemyShot = new enemyShots.Sprite(
    enemyTurret.x,
    enemyTurret.y,
    canvasW / 180
  );

  enemyShot.direction = enemyTurret.rotation;
  enemyShot.speed = 20;
  enemyShots.color = "black";
  enemyShots.overlap(enemyBody);
  enemyShots.overlap(enemyTurret);
  enemyShots.bounciness = 0.999;
}
function enemyShotBlowup(enemyShot, rock) {
  enemyShot.diameter = canvasW / 80;
  enemyShot.speed = 0;
  enemyShot.color = "yellow";
  setTimeout(() => {
    removeShell(enemyShot), 1;
  });
}

function enemyShotRemove() {}
function playerControls() {
  turret.rotateMinTo(mouse, 1, 0);
  // camera.x = body.x;
  // camera.y = body.y;
  playerMovement();
  // if (body.overlap(mines)) {
  //   gameStatus = "lose";
  // }

  shots.overlap(mines, blowMine);

  if (mouse.presses("left")) {
  }
  if (mouse.released("left") && reload == 0) {
    playerShoot();
  }
  if (kb.pressed(" ") && playermines == 0) {
    playerMine();
  }
  // if (body.collides(wine)) {
  //   gameStatus = "win";
  // }
}

function playerMovement() {
  body.speed = 3;
  if (kb.pressing("up")) {
    body.moveTowards(directionFront.x, directionFront.y, forwardSpeed);
    forwardSpeed = forwardSpeed + 0.001;
    if (forwardSpeed > maxForwardSpeed) {
      forwardSpeed = maxForwardSpeed;
    }
    rotationSpeed = 0;
  } else if (kb.pressing("down")) {
    body.moveTowards(directionBack.x, directionBack.y, backwardSpeed);
    backwardSpeed = backwardSpeed + 0.0005;
    if (backwardSpeed > maxForwardSpeed / 2) {
      backwardSpeed = maxForwardSpeed / 2;
    }
    rotationSpeed = 0;
  } else if (kb.pressing("left")) {
    body.rotate(-1, 3);
    body.speed = 0;
  } else if (kb.pressing("right")) {
    body.rotate(1, 3);
    body.speed = 0;
  } else {
    body.speed = 0;
    body.rotationSpeed = 0;
  }

  if (kb.released("up")) {
    forwardSpeed = 0;
  }
  if (kb.released("down")) {
    backwardSpeed = 0;
  }

  if (kb.pressing("right") && kb.pressing("up")) {
    body.rotate(1, 3);
    body.moveTowards(directionFront.x, directionFront.y, forwardSpeed);
    forwardSpeed = forwardSpeed + 0.001;
    if (forwardSpeed > maxForwardSpeed) {
      forwardSpeed = maxForwardSpeed;
    }
  } else if (kb.pressing("left") && kb.pressing("up")) {
    body.rotate(-1, 3);
    body.moveTowards(directionFront.x, directionFront.y, forwardSpeed);
    forwardSpeed = forwardSpeed + 0.001;
    if (forwardSpeed > maxForwardSpeed) {
      forwardSpeed = maxForwardSpeed;
    }
  } else if (kb.pressing("right") && kb.pressing("down")) {
    body.rotate(1, 3);
    body.moveTowards(directionBack.x, directionBack.y, backwardSpeed);
    backwardSpeed = backwardSpeed + 0.0005;
    if (backwardSpeed > 0.05) {
      backwardSpeed = 0.05;
    }
  } else if (kb.pressing("left") && kb.pressing("down")) {
    body.rotate(-1, 3);
    body.moveTowards(directionBack.x, directionBack.y, backwardSpeed);
    backwardSpeed = backwardSpeed + 0.0005;
    if (backwardSpeed > 0.05) {
      backwardSpeed = 0.05;
    }
  }

  if (kb.released("left")) {
    rotationSpeed = 0;
  }
  if (kb.released("right")) {
    rotationSpeed = 0;
  }
  //AI for level 1
  // if (gState == "wander") {
  //   gbody.direction = -90;
  //   gturret.rotate = (15,30);
  //   gbody.speed = 1;
  // }
}

function enemyAI() {
  tracker = new Sprite(enemyBody.x, enemyBody.y, 5);
  tracker.opacity = 0;
  tracker.overlap(allSprites);
  tracker.direction = tracker.angleTo(body);
  tracker.speed = 50;
  tracker.life = 20;
  setTimeout(enemyAI, 500);
}
function blowMine() {
  mine.diameter = canvasW / 10;
  mine.color = "yellow";
  setTimeout(removeMine, 200);
}
function removeMine() {
  mine.remove();
  playermines = 0;
}
function playerShoot() {
  shot = new shots.Sprite(turret.x, turret.y, canvasW / 180);
  shot.direction = turret.rotation;
  shots.color = "darkblue";
  shots.overlap(body);
  shots.overlap(turret);
  shots.overlap(wheelLeft);
  shots.overlap(wheelRight);
  shots.overlap(directionBack);
  shots.overlap(directionFront);
  shots.bounciness = 0.999;
  // shot.life = 300;
  shot.speed = 20;
  reloading();
}
function bullet() {
  for (i = 0; i < shots.length; i++) {
    if (shots[i].collides(rock)) {
      shellExplode(shots[i]);
      // } else if (shots[i].collides(sand)) {
      //   shellExplode(shots[i]);

      //   setTimeout(() => {
      //     removeShell(shot), 1;
      //   });
    } else if (shots[i].collides(metal)) {
      shots[i].collides(body);
      shots[i].collides(turret);
      shots[i].collides(wheelLeft);
      shots[i].collides(wheelRight);
      shots[i].collides(directionBack);
      shots[i].collides(directionFront);
    }
  }
}
function playerMine() {
  playermines++;
  mine = new mines.Sprite(body.x, body.y);
}
function reloading() {
  reload = 1;
  setTimeout(doneReloading, reloadTimer);
}
function doneReloading() {
  reload = 0;
}

function shellExplode(shot) {
  shot.diameter = canvasW / 80;
  shot.speed = 0;
  shot.color = "yellow";
  // console.log("AHH");
  // for (i=0;i<sand.length;i++){
  //   dist[i] = (sqrt((sand[i].x-shot.x)**2+(sand[i].y-shot.y)**2))
  // }

  // var min = (Math.min(...dist));
  // var index = dist.indexOf(min);
  // console.log(index)
  // sand[index].remove();
  setTimeout(() => {
    removeShell(shot), 1;
  });
}
function removeShell(shot) {
  // console.log("MONGUS!");
  shot.remove();
}
function gameOver() {
  controls.remove();
  body.color = "red";
  turret.color = "red";
  body.speed = 0;
  body.rotationSpeed = 0;
  background("black");
  setTimeout(fadeIn, 1000);
  setTimeout(gameOverText, 2000);
  setTimeout(sorryForTrauma, 5000);
}
function gameOverText() {
  GG = new Sprite(canvasW / 2, canvasH / 3, 0, 0);
  GG.opacity = 0.2;
  GG.text = "You only live once.";
  GG.textSize = 40;
  GG.textColor = "red";
  GGFade();
}

function sorryForTrauma() {
  location.reload();
}
function win() {
  enemyBody.color = "black";
  enemyTurret.color = "black";
  level++;
  gameStatus = level;
}
function enemyReload() {
  if (enemyRel == false) {
    enemyRel = true;
  } else {
    enemyRel = false;
  }
  setTimeout(enemyReload, reloadTimer);
}
