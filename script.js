var mcf = true; // mapChangerFlag
var wall = [];

document.getElementById('start').onclick = function (event) {
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
      losegame  = true,
      foods     = [];

  // модификации карты
  if(wall.length !== 0 ){
    ctx.fillStyle = '#bdbebf';

    for(var i = 0; i < wall.length; i++){
      var nWall = wall[i];

      ctx.fillRect(nWall.x , nWall.y, nWall.w , nWall.h);

    }

  }

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

    if(wall.length !== 0){

      for(var i = 0; i < wall.length; i++){
        var nWall = wall[i];

        if( (nWall.x < (sh.x + sh.w)) && ((nWall.x + nWall.w) > sh.x) && (nWall.y < (sh.y + sh.h)) && (nWall.y+nWall.h > sh.y)){
          return false;
        }

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

}; 

// редактор карты

var button = document.getElementById('map-changer'),
    wrap   = document.getElementById('game-changer-wrap'),
    save   = document.getElementById('save');

wrap.hidden = mcf;

button.onclick = function(event) {
  mcf = !mcf;
  wrap.hidden = mcf;

  var cmc = document.getElementById('canvas-map-changer'), // canvasMapChanger
      ctx2 = cmc.getContext('2d'), // context 
      coords = getCoords(cmc);

  cmc.onclick = function (event) {
    
    var x = Math.floor(event.clientX - coords.left),
        y = Math.floor(event.clientY - cmc.getBoundingClientRect().top);        

    ctx2.fillStyle = '#bdbebf';
    ctx2.fillRect(x,y ,20,20);

    wall.push({x:x, y:y , w:20 , h:20});

  }

  save.onclick = function (event) {
    mcf = !mcf;
    wrap.hidden = mcf;

    var event = new Event("click");
    document.getElementById('start').dispatchEvent(event);
  }

}


function getCoords(elem) { // кроме IE8-
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };

}