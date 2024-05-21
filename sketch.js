//defining all the variables
let tankIdle;
let peformance = false;
let playermines = 0;
let body;
let canvasW = 1440;
let canvasH = 810;
let forwardSpeed = 0;
let backwardSpeed = 0;
let reload = 0;
var gameStatus = "startScreen";
let reloadTimer = 2000;
let maxForwardSpeed = 0.125;
let fade = 0;
let enemyRel = false;
let overlappingEnemyMine = false;
overlappingMine = false;
runGameOver = false;
level = 1;
let enemyCantShoot = false;
let enemyFadeOut = 0;
function setup() {
  //loading images
  bg = loadImage("Tank Title Screen.png");
  ebg = loadImage("end.png");
  //using values for canvas so I could reuse them for other sprites
  new Canvas(canvasW, canvasH, "fullscreen");
  //making player things
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
  //overlaps so collision doesnt go ham
  wheelLeft.overlap(wheelRight);
  body.overlap(wheelLeft);
  turret.overlap(wheelLeft);
  body.overlap(wheelRight);
  turret.overlap(wheelRight);
  l = new GlueJoint(wheelLeft, body);
  r = new GlueJoint(wheelRight, body);
  //direction sprites are for movement
  directionFront = new Sprite(body.x, body.y - canvasW / 100, 10);

  directionBack = new Sprite(body.x, body.y + canvasW / 100, 10);
  directionBack.opacity = 0;

  a = new GlueJoint(body, directionFront);
  b = new GlueJoint(body, directionBack);

  body.overlap(directionFront);
  turret.overlap(directionFront);
  turret.overlap(directionBack);

  //pre-loading sprites that are created on command to avoid a specific bug
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
  //player decoration to give them a sense of which way is front and which way is back.
  thing = new Sprite(body.x + 5, body.y + 10, 20, 10);
  thing.color = "#0D98BA";
  thing.layer = 3;
  turret.layer = 4;
  a = new GlueJoint(thing, body);
  thing.overlap(allSprites);

  //creates map for first level
  newMap();
  //cursor
  cur = new Sprite();
  cur.overlap(allSprites);
  enemyReload();
  cur.img = "blueCursor.webp";
  cur.scale = 0.07;
  mouse.visible = false;
  //make sure cursor is displayed above all other things.
  mines.layer = 1;
  rock.layer = 1;
  metal.layer = 1;
  sand.layer = 1;
  cur.layer = 5;
  //creating text
  text = new Sprite(0.8 * canvasW, 0.6 * canvasH, canvasW / 4, 100, "s");
  text.color = "brown";
  text.text = "Press [SPACE] to Start";
  text.textSize = 30;
  text.textColor = "white";
  screenCover = new Sprite(0, 0, canvasW * 2, canvasH * 2, "s");
  screenCover.color = "black";
  screenCover.overlap(allSprites);

  //ET group that encompasses all enemy sprites. ET is no longer used but enemy sprites still are.
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
  //pre-loading enemy shots
  enemyShot = new enemyShots.Sprite(
    enemyTurret.x,
    enemyTurret.y,
    canvasW / 180
  );
  enemyShot.remove();
  //damage indicator
  damageIndicator = new Group();
  damageIndicator.opacity = 0.5;
  damageIndicator.color = "black";
  damageIndicator.life = 60;
  damageIndicator.collider = "s";
  damageIndicator.overlap(allSprites);
  controls = new Sprite();
  controls.diameter = 20;
  controls.collider = "s";
  controls.image = "controls.png";
  //death text
  GG = new Sprite(canvasW / 2, canvasH / 3, 0, 0);
  GG.opacity = 0;
  GG.overlap(allSprites);
  enemyAI();
}
//first level map
function newMap() {
  //making tiles
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
}
//second level map
function L2Map() {
  tilesGroup = new Tiles(
    [
      "rrrrrrrrrrrrrrrrrrrrrrrr",
      "r.............r........r",
      "r......................r",
      "r..........sss.........r",
      "r...r..................r",
      "r........s.....r.......r",
      "r........s.............r",
      "r........s.....sss.....r",
      "r......................r",
      "r....sss...............r",
      "r......................r",
      "r.....sss.....sss......r",
      "r......................r",
      "rrrrrrrrrrrrrrrrrrrrrrrr",
    ],
    30,
    30,
    rock.w + 0,
    rock.h + 0
  );
}
//third level map
function L3Map() {
  tilesGroup = new Tiles(
    [
      "rrrrrrrrrrrrrrrrrrrrrrrr",
      "r......................r",
      "r........r.....r.......r",
      "r........r.....r.......r",
      "r......rrrssssrrr......r",
      "r........s.....s.......r",
      "r........s.....s.......r",
      "r........s.....s.......r",
      "r........s.....s.......r",
      "r......rrrssssrrr......r",
      "r........r.....r.......r",
      "r........r.....r.......r",
      "r......................r",
      "rrrrrrrrrrrrrrrrrrrrrrrr",
    ],
    30,
    30,
    rock.w + 0,
    rock.h + 0
  );
}
function draw() {
  //replaces cursor with custom sprite
  cur.moveTowards(mouse, 1);

  //game statuses
  if (gameStatus == "startScreen") {
    start();
  } else if (gameStatus == 1) {
    levelOne();
    background("#C2B280");
  } else if (gameStatus == 2) {
    levelTwo();
  } else if (gameStatus == "lose") {
    if ((runGameOver = true)) {
      gameOver();
    }
  } else if (gameStatus == "win") {
    win();
  } else if (gameStatus == "instructions") {
    starting();
  } else if (gameStatus == 3) {
    levelThree();
  } else if (gameStatus == 4) {
    if (enemyFadeOut == 1) {
      setTimeout(enemyBye, 2000);
    }
    enemyFadeOut = 0;
    tilesGroup.remove();
    background("black");
    allSprites.speed = 0;
  } else if (gameStatus == "end") {
    background(ebg);
    mouse.visible = true;
  }
}
//instructions
function start() {
  background(bg);
  allSprites.opacity = 0;
  screenCover.opacity = fade;
  text.opacity = 1;
  if (kb.pressed(" ")) {
    gameStatus = "instructions";
  }
}
//fading in to black. Used in death screen
function fadeIn() {
  fade = fade + 0.01;
  //screencover is a sprite that covers the whole screen making a cool effect.
  screenCover.opacity = fade;
  setTimeout(fadeIn, 1000);
}
//used as a "setup" function for level one
function starting() {
  allSprites.opacity = 1;
  directionFront.opacity = 0;
  directionBack.opacity = 0;
  controls.x = canvasW / 2;
  controls.y = canvasH / 2;
  controls.scale = 0.3;
  controls.overlap(allSprites);
  if (kb.pressed(" ")) {
    gameStatus = level;
  }
  tracker.opacity = 0;
}
//things that need to be done for level 1 to run
function levelOne() {
  text.remove();
  controls.remove();
  playerControls();

  screenCover.opacity = fade;

  //if enemy can see the player or not
  if (tracker.overlap(rock)) {
    enemyTurret.rotationSpeed = 1;
    tracker.remove();
  } else if (tracker.overlap(body)) {
    //if it sees, it points its turret towards the player
    enemyTurret.rotateMinTo(body, 1, 0);
    //... and fires.
    if (enemyRel == true) {
      enemyShoot();
    }
    tracker.remove();
  }
  //bullet shot collisions and results Also includes damage indicators.
  enemyShot.collides(rock, enemyShotBlowup);
  enemyShot.collides(body, hit);
  enemyShot.collides(wheelLeft, whit);
  enemyShot.collides(wheelRight, whit);
  enemyShot.collides(turret, thit);
  shot.collides(sand, shit);
  enemyShot.collides(sand, shit);

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
  if (shot.collides(enemyTurret)) {
    let bulletChance = random(0, 100);
    if (bulletChance > 50) {
      damageShow = new damageIndicator.Sprite(enemyBody.x, enemyBody.y, 0, 0);
      damageIndicator.opacity = 1;
      damageIndicator.text = "Turret Disabled";
      setTimeout(enemyTurretRepair, 3000);
      enemyCantShoot = true;
    } else {
      gameStatus = "win";
    }
  }
  if (enemyBody.overlapping(mines)) {
    gameStatus = "win";
  }
  bullet();
  if (body.overlapping(mines)) {
    overlappingMine = true;
  } else {
    overlappingMine = false;
  }
  //show that the player can't shoot.
  if (reload == 1) {
    turret.color = "grey";
  } else {
    turret.color = "	#0D98BA";
  }
}
function shit(sands, shots) {
  shots.remove();
  sands.remove();
}
//second level. Most of the things are the same as the first level except it doesn't remove the text and the instructions sprite.

function levelTwo() {
  enemyBody.moveTo(1250, 200);
  enemyTurret.moveTo(1250, 200);

  background("green");
  playerControls();
  if (tracker.overlap(rock)) {
    //The enemy tank will not look away if it doesn't see you anymore, making it more difficult
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
  shot.collides(sand, shit);
  enemyShot.collides(sand, shit);

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
  if (shot.collides(enemyTurret)) {
    let bulletChance = random(0, 100);
    if (bulletChance > 50) {
      damageShow = new damageIndicator.Sprite(enemyBody.x, enemyBody.y, 0, 0);
      damageIndicator.opacity = 1;
      damageIndicator.text = "Turret Disabled";
      setTimeout(enemyTurretRepair, 3000);
      enemyCantShoot = true;
    } else {
      damageShow = new damageIndicator.Sprite(enemyBody.x, enemyBody.y, 0, 0);
      damageIndicator.opacity = 1;
      damageIndicator.text = "No Damage";
    }
  }
  if (enemyBody.overlapping(mines)) {
    gameStatus = "win";
  }
  bullet();
  if (body.overlapping(mines)) {
    overlappingMine = true;
  } else {
    overlappingMine = false;
  }
  if (reload == 1) {
    turret.color = "grey";
  } else {
    turret.color = "	#0D98BA";
  }
}
//Third level.
function levelThree() {
  rock.layer = 1;
  sand.layer = 1;
  metal.layer = 1;
  enemyBody.layer = 2;
  enemyTurret.layer = 2;
  background("green");
  playerControls();
  if (tracker.overlap(rock)) {
    tracker.remove();
  } else if (tracker.overlap(body)) {
    //the enemy is mad and chases you down!
    enemyTurret.rotateMinTo(body, 1, 0);
    enemyBody.moveTo(body.x, body.y);
    enemyTurret.moveTo(body.x, body.y);
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
  shot.collides(sand, shit);
  enemyShot.collides(sand, shit);

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
  if (shot.collides(enemyTurret)) {
    let bulletChance = random(0, 100);
    if (bulletChance > 50) {
      damageShow = new damageIndicator.Sprite(enemyBody.x, enemyBody.y, 0, 0);
      damageIndicator.opacity = 1;
      damageIndicator.text = "Turret Disabled";
      setTimeout(enemyTurretRepair, 3000);
      enemyCantShoot = true;
    } else {
      damageShow = new damageIndicator.Sprite(enemyBody.x, enemyBody.y, 0, 0);
      damageIndicator.opacity = 1;
      damageIndicator.text = "No Damage";
    }
  }
  if (enemyBody.overlapping(mines)) {
    gameStatus = "win";
  }
  bullet();
  if (body.overlapping(mines)) {
    overlappingMine = true;
  } else {
    overlappingMine = false;
  }
  if (reload == 1) {
    turret.color = "grey";
  } else {
    turret.color = "	#0D98BA";
  }
}
//what happens if you're hit
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
    runGameOver = true;
  }
}
function whit(wheelLeft, enemyShot) {
  enemyShotBlowup(wheelLeft);
  let bulletChance = random(0, 100);
  if (bulletChance > 80) {
    damageShow = new damageIndicator.Sprite(body.x, body.y, 0, 0);
    damageIndicator.opacity = 1;
    damageIndicator.text = "Hit! No major damage.";
  } else if (bulletChance < 60) {
    damageShow = new damageIndicator.Sprite(body.x, body.y, 0, 0);
    damageIndicator.opacity = 1;
    damageIndicator.text = "Tracks damaged. Reparing Tracks";
    maxForwardSpeed = 0;
    setTimeout(repair, 5000);
  } else {
    gameStatus = "lose";
    runGameOver = true;
  }
}
function thit() {
  let bulletChance = random(0, 100);
  if (bulletChance > 90) {
    damageShow = new damageIndicator.Sprite(body.x, body.y, 0, 0);
    damageIndicator.opacity = 1;
    damageIndicator.text = "Hit! No major damage.";
  } else if (bulletChance < 90) {
    enemyShot.remove();
    damageShow = new damageIndicator.Sprite(body.x, body.y, 0, 0);
    damageIndicator.opacity = 1;
    damageIndicator.text = "Turret Damaged. Reparing.";
    reload = 1;
    setTimeout(reloading, 3000);
  }
}
//make the player unable to move
function repair() {
  maxForwardSpeed = 0.1;
}
//when the enemy shoots
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
//when the enemy bullet hits rock tile
function enemyShotBlowup(enemyShot, rock) {
  enemyShot.diameter = canvasW / 80;
  enemyShot.speed = 0;
  enemyShot.color = "yellow";
  setTimeout(() => {
    removeShell(enemyShot), 1;
  });
}

function enemyShotRemove() {}
//player shooting controls
function playerControls() {
  turret.rotateMinTo(mouse, 1, 0);

  playerMovement();

  shots.overlap(mines, blowMine);

  if (mouse.presses("left")) {
  }
  if (mouse.released("left") && reload == 0) {
    playerShoot();
  }
  if (kb.pressed(" ") && playermines == 0) {
    playerMine();
  }
}
//player moving controls
function playerMovement() {
  body.speed = 3;
  //forward
  if (kb.pressing("up")) {
    body.moveTowards(directionFront.x, directionFront.y, forwardSpeed);
    forwardSpeed = forwardSpeed + 0.001;
    if (forwardSpeed > maxForwardSpeed) {
      forwardSpeed = maxForwardSpeed;
    }
    rotationSpeed = 0;
  } //backwards
  else if (kb.pressing("down")) {
    body.moveTowards(directionBack.x, directionBack.y, backwardSpeed);
    backwardSpeed = backwardSpeed + 0.0005;
    if (backwardSpeed > maxForwardSpeed / 2) {
      backwardSpeed = maxForwardSpeed / 2;
    }
    rotationSpeed = 0;
  } //turn left
  else if (kb.pressing("left")) {
    body.rotate(-1, 3);
    body.speed = 0;
  } //turn right
  else if (kb.pressing("right")) {
    body.rotate(1, 3);
    body.speed = 0;
  } else {
    //make sure player doesn't drift
    body.speed = 0;
    body.rotationSpeed = 0;
  }
  //make sure player doesn't drift
  if (kb.released("up")) {
    forwardSpeed = 0;
  }
  if (kb.released("down")) {
    backwardSpeed = 0;
  }
  //move and turn
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
//spawn tracker to make enemy see you
function enemyAI() {
  tracker = new Sprite(enemyBody.x, enemyBody.y, 5);
  tracker.opacity = 0;
  tracker.overlap(allSprites);
  tracker.direction = tracker.angleTo(body);
  tracker.speed = 50;
  tracker.life = 20;

  setTimeout(enemyAI, 500);
}

//mine when it explodes.
function blowMine() {
  mine.diameter = canvasW / 8;
  mine.color = "yellow";
  mine.overlap(wheelLeft);
  mine.overlap(wheelRight);
  mine.overlap(turret);
  if (overlappingMine == true) {
    gameStatus = "lose";
    runGameOver = true;
  }
  setTimeout(removeMine, 200);
}
//deletes mine after exploding
function removeMine() {
  mine.remove();
  playermines = 0;
}
//spawning player bullet
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

  shot.speed = 20;
  reloading();
}

function bullet() {
  for (i = 0; i < shots.length; i++) {
    if (shots[i].collides(rock)) {
      shellExplode(shots[i]);
    } else if (shots[i].collides(metal)) {
      //turn on bullet collision after it bounces on a wall
      shots[i].collides(body);
      shots[i].collides(turret);
      shots[i].collides(wheelLeft);
      shots[i].collides(wheelRight);
      shots[i].collides(directionBack);
      shots[i].collides(directionFront);
    }
  }
}
//spawning mines
function playerMine() {
  playermines++;
  mine = new mines.Sprite(body.x, body.y);
}
//players can't shoot when it's reloading
function reloading() {
  reload = 1;

  setTimeout(doneReloading, reloadTimer);
}
//let players shoot after reloading
function doneReloading() {
  reload = 0;
}
//make bullets explode when it hits rock tile
function shellExplode(shot) {
  shot.diameter = canvasW / 80;
  shot.speed = 0;
  shot.color = "yellow";

  setTimeout(() => {
    removeShell(shot), 1;
  });
}
//remove bullet  after exploding
function removeShell(shot) {
  shot.remove();
}
//game over screen
function gameOver() {
  runGameOver = false;
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
//show game over text
function gameOverText() {
  GG.opacity = GG.opacity + 0.01;
  GG.text = "You only live once. You made it to level " + level;
  GG.textSize = 40;
  GG.textColor = "red";
  GGFade();
}
//restart game
function sorryForTrauma() {
  location.reload();
}
function win() {
  gameStatus = level;
  //setup function for level 2
  if (gameStatus == 1) {
    enemyBody.color = "black";
    enemyTurret.color = "black";
    body.rotation = 0;
    allSprites.rotationSpeed = 0;
    allSprites.speed = 0;
    body.x = 200;
    body.y = 200;
    thing.x = body.x;
    thing.y = body.y;
    wheelLeft.x = body.x;
    wheelLeft.y = body.y;
    wheelRight.x = body.x;
    wheelRight.y = body.y;
    turret.x = body.x;
    turret.y = body.y;
    enemyBody.x = 1250;
    enemyBody.y = 700;
    enemyTurret.x = enemyBody.x;
    enemyTurret.y = enemyBody.y;
    enemyBody.color = "orange";
    enemyTurret.color = "red";
    tilesGroup.remove();
    if (playermines != 0) {
      blowMine();
    }

    L2Map();
  } else if (gameStatus == 2) {
    //setup function for level 3
    enemyBody.color = "black";
    enemyTurret.color = "black";
    body.rotation = 0;
    allSprites.rotationSpeed = 0;
    allSprites.speed = 0;
    body.x = canvasW / 2;
    body.y = canvasH / 2;
    thing.x = body.x;
    thing.y = body.y;
    wheelLeft.x = body.x;
    wheelLeft.y = body.y;
    wheelRight.x = body.x;
    wheelRight.y = body.y;
    turret.x = body.x;
    turret.y = body.y;
    enemyBody.x = 1250;
    enemyBody.y = 700;
    enemyTurret.x = enemyBody.x;
    enemyTurret.y = enemyBody.y;
    enemyBody.color = "white";
    enemyTurret.color = "white";
    enemyBody.opacity = 0.5;
    enemyTurret.opacity = 0.5;
    enemyBody.overlap(allSprites);
    enemyTurret.overlap(allSprites);
    tilesGroup.remove();
    if (playermines != 0) {
      blowMine();
    }
    L3Map();
  } else if (gameStatus == 3) {
    //start fading out enemy
    enemyFadeOut = 1;
  }
  level++;
  gameStatus = level;
}
function enemyBye() {
  //makes enemy fades out
  if (enemyBody.opacity < 0.01) {
    allSprites.opacity = 0;
    gameStatus = "end";
  } else {
    enemyBody.opacity = enemyBody.opacity - 0.01;
    enemyTurret.opacity = enemyTurret.opacity - 0.01;
  }

  setTimeout(enemyBye, 100);
}
//makes enemy shooting more unpredictable
function enemyReload() {
  if (enemyCantShoot == true) {
    enemyRel = false;
  } else {
    enemyRel = !enemyRel;
  }

  setTimeout(enemyReload, reloadTimer);
}
//when enemy's turret is hit it may be disabled. makes it so they can't shoot.
function enemyTurretRepair() {
  enemyCantShoot = false;
}
