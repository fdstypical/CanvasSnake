var canvas    = document.getElementById('canvas'),
    ctx       = canvas.getContext('2d'),
    px        = canvas.width/2,
    py        = canvas.height/2,
    velosity  = 4,
    requestId = null,
    minLength = 25,
    bodies    = [],
    dir       = null,
    gamePoint = 1, 
    losegame  = true;
    foods     = [];

ctx.fillStyle = 'lime';

function game(event){
  var keyCode = event.keyCode;

  if(keyCode === 37 && dir !== 39 ){ // left
    window.cancelAnimationFrame(requestId);
    dir = 37;
    anim();
  }
  if(keyCode === 38 && dir !== 40 ){ // top
    window.cancelAnimationFrame(requestId);
    dir = 38;  
    anim();
  }
  if(keyCode === 39 && dir !== 37 ){ // right
    window.cancelAnimationFrame(requestId);
    dir = 39; 
    anim();
  }
  if(keyCode === 40 && dir !== 38 ){ // bottom
    window.cancelAnimationFrame(requestId);
    dir = 40;
    anim();
  }

};

function anim(){

  reset();
  losegame = go(dir);

  if(!losegame && losegame !== undefined){
    ctx.fillStyle = 'rgba(249, 0, 0,0.3';
    ctx.fillRect(0,0,canvas.width ,canvas.height);
    window.cancelAnimationFrame(requestId);
    window.removeEventListener('keydown', game);
    return;
  }

  requestId = window.requestAnimationFrame(anim);
};

function go(direction) {

  ctx.save();

  if(direction === 37){ // left
    px -= velosity;
    ctx.fillRect(px,py,20,20);
    bodies.push({x:px, y:py , w:20, h:20});
  }
  if(direction === 38){ // top
    py -= velosity;
    ctx.fillRect(px,py,20,20);
    bodies.push({x:px, y:py , w:20, h:20});
  }
  if(direction === 39){ // right
    px += velosity;
    ctx.fillRect(px,py,20,20);
    bodies.push({x:px, y:py , w:20, h:20});
  }
  if(direction === 40){ // bottom
    py += velosity;
    ctx.fillRect(px,py,20,20);
    bodies.push({x:px, y:py , w:20, h:20});
  }

  var sh = bodies[(bodies.length - 1)]; //shakeHead

  // collision 
  for(var i = 0; i < foods.length;i++){

    let food = foods[i];

    var fc = { // foodCoords
      x: food.x,
      y: food.y,
      w: food.w,
      h: food.h
    }

    if( (fc.x < (sh.x + sh.w)) && ((fc.x + fc.w) > sh.x) && (fc.y < (sh.y + sh.h)) && (fc.y+fc.h > sh.y)){
      ctx.clearRect(food.x , food.y , food.w , food.h);
      foods.splice(i,1);
      minLength += 2;
      reloadGamepoint(gamePoint);
    }

  }

  if(px > canvas.width){
    px = 0;
  }
  if(px < 0){
    px = canvas.width
  }
  if(py > canvas.height){
    py = 0;
  }
  if(py < 0){
    py = canvas.height;
  }

  if(bodies.length >= 25){
    // self collision
    for(var i = bodies.length - 10; i >= 0; i-- ){

      if( (bodies[i].x < (sh.x + sh.w)) 
          && ((bodies[i].x + bodies[i].w) > sh.x) 
          && (bodies[i].y < (sh.y + sh.h)) 
          && (bodies[i].y+bodies[i].h > sh.y) ){
        return false;
      }
    }
  }

  ctx.restore();
};

function reset() {
  ctx.save();
  
  if( bodies.length > minLength ){
    var tail = bodies.shift();
    ctx.clearRect( tail.x - 2 , tail.y - 2 , tail.w + 4, tail.h + 4);
  }
  
  ctx.restore();
}

setInterval(function(){
  ctx.save();

  var food = {
    x: Math.floor(Math.random() * canvas.width),
    y: Math.floor(Math.random() * canvas.height),
    w:20,
    h:20
  };

  ctx.fillStyle = 'red';
  ctx.fillRect( food.x , food.y ,20 ,20);

  foods.push(food);

  ctx.restore();
}, 3500)

function reloadGamepoint(point){
  var elem = document.getElementById('game-point');
  elem.innerHTML = 'Ваш счет: ' + point;
  gamePoint++;
}

window.addEventListener('keydown', game);