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
let gameStatus = "1";
let reloadTimer = 2000;
let maxForwardSpeed = 0.1;
function setup() {
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
  directionFront.opacity = 0;
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
  gbody = new g.Sprite(1000, canvasH / 2, canvasW / 40, canvasH / 16, "k");
  gturret = new g.Sprite(gbody.x, gbody.y, canvasW / 25, canvasH / 110, "k");
  gbody.layer = 2;
  gj = new HingeJoint(gturret, gbody);
  gturret.overlap(gbody);
  gbody.color = "	#345715";
  gturret.color = "	#345715";
  gturret.offset.x = canvasH / 55;
  gwheelLeft = new g.Sprite(
    gbody.x - canvasW / 80,
    gbody.y,
    canvasW / 120,
    canvasH / 16
  );
  gwheelLeft.color = "black";
  gwheelRight = new g.Sprite(
    gbody.x + canvasW / 80,
    gbody.y,
    canvasW / 120,
    canvasH / 16
  );
  gwheelRight.color = "black";
  gwheelLeft.layer = 1;
  gwheelRight.layer = 1;
  gwheelLeft.overlap(gwheelRight);
  gbody.overlap(gwheelLeft);
  gturret.overlap(gwheelLeft);
  gbody.overlap(gwheelRight);
  gturret.overlap(gwheelRight);
  gl = new GlueJoint(gwheelLeft, gbody);
  gr = new GlueJoint(gwheelRight, gbody);
  gState = "wander";

  newMap();
  cur = new Sprite();
  cur.overlap(allSprites);

  cur.img = "blueCursor.webp";
  cur.scale = 0.07;
  mouse.visible = false;
  mines.layer = 1;
  rock.layer = 1;
  metal.layer = 1;
  sand.layer = 1;
  cur.layer = 5;

  enemyAI();
}

function newMap() {
  var matrix = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
  var grid = new PF.Grid(matrix);

  var finder = new PF.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true,
  });
  var path = finder.findPath(16, 6, 3, 9, grid);
  console.log(path);

  node = new Group();
  node.visited = false;
  node.radius = 10;
  node.collider = "n";
  console.log(path);
  for (p of path) {
    n = new node.Sprite(p[0] * 60 + 20, p[1] * 60 + 20);
  }

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
  if ((gameStatus = "1")) {
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
  }
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

  node[0].visited = false;
  if (node[0].visited == false) {
    gbody.direction = gbody.angleTo(node[0]);
    gbody.speed = 2;
  }
  if (gbody.overlap(node[0])) {
    node[0].visted = true;
  }
  if ((node[0].visited = true)) {
    gbody.direction = gbody.angleTo(node[1]);
    gbody.speed = 2;
  }

  background("green");
  cur.moveTowards(mouse, 1);
  if (gameStatus == "1") {
    levelOne();
  } else if (gameStatus == "lose") {
    gameOver();
  } else if (gameStatus == "win") {
    win();
  }
}

function levelOne(mine) {
  playerControls();
  gturret.x = gbody.x;
  gturret.y = gbody.y;
  if ((gState = "wander")) {
    // gbody.moveTo(gbody.x+15)
  }
  if (tracker.overlap(rock)) {
    gturret.rotationSpeed = 0;
    tracker.remove();
  } else if (tracker.overlap(body)) {
    gturret.rotateMinTo(body, 1, 0);
    tracker.remove();
  }
  bullet();
}

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
}

function enemyAI() {
  tracker = new Sprite(gbody.x, gbody.y, 5);
  tracker.overlap(allSprites);
  tracker.direction = tracker.angleTo(body);
  tracker.speed = 100;
  // tracker.moveTo(body, 50);
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
  shot.rotation = turret.rotation;
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
  console.log("AHH");
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
  console.log("MONGUS!");
  shot.remove();
}
function gameOver() {
  body.color = "red";
  turret.color = "red";
  body.speed = 0;
  body.rotationSpeed = 0;
  background("black");
}
function win() {
  background("green");
}
