window.ConfettiGenerator = function(params) {
  //////////////
  // Defaults
  var appstate = {
    target: 'confetti-holder', // Id of the canvas
    max: 80, // Max itens to render
    size: 1, // prop size
    animate: true, // Should aniamte?
    props: ['circle', 'square', 'triangle', 'line'], // Types of confetti
    colors: [[165,104,246],[230,61,135],[0,199,228],[253,214,126]], // Colors to render confetti
    clock: 25, // Speed of confetti fall
    interval: null, // Draw interval holder
    width: window.innerWidth, // canvas width (as int, in px)
    height: window.innerHeight // canvas height (as int, in px)
  };

  //////////////
  // Setting parameters if received
  if(params) {
    if(params.target)
      appstate.target = params.target;
    if(params.max)
      appstate.max = params.max;
    if(params.size)
      appstate.size = params.size;
    if(params.animate !== undefined && params.animate !== null)
      appstate.animate = params.animate;
    if(params.props)
      appstate.props = params.props;
    if(params.colors)
      appstate.colors = params.colors;
    if(params.clock)
      appstate.clock = params.clock;
    if(params.width)
      appstate.width = params.width;
    if(params.height)
      appstate.height = params.height;
  }

  //////////////
  // Properties
  var cv = document.getElementById(appstate.target);
  var ctx = cv.getContext("2d");
  var particles = [];

  //////////////
  // Random helper (to minimize typing)
  function rand(limit, floor) {
    if(!limit) limit = 1;
    var rand = Math.random() * limit;
    return !floor ? rand : Math.floor(rand);
  }

  //////////////
  // Confetti particle generator
  function particleFactory() {
    var p = {
      prop: appstate.props[rand(appstate.props.length, true)], //prop type
      x: rand(appstate.width), //x-coordinate
      y: rand(appstate.height), //y-coordinate
      radius: rand(4) + 1, //radius
      line: Math.floor(rand(65) - 30), // line angle
      angles: [rand(10, true) + 2, rand(10, true) + 2, rand(10, true) + 2, rand(10, true) + 2], // triangle drawing angles
      color: appstate.colors[rand(appstate.colors.length, true)], // color
      rotation: rand(360, true) * Math.PI/180,
      speed: rand(appstate.clock / 7) + (appstate.clock / 30)
    };

    return p;
  }

  //////////////
  // Confetti drawing on canvas
  function particleDraw(p) {
    var op = (p.radius <= 3) ? 0.4 : 0.8;

    ctx.fillStyle = ctx.strokeStyle = "rgba(" + p.color + ", "+ op +")";
    ctx.beginPath();

    switch(p.prop) {
      case 'circle':{
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.radius * appstate.size, 0, Math.PI * 2, true);
        ctx.fill();
        break;  
      }
      case 'triangle': {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + (p.angles[0] * appstate.size), p.y + (p.angles[1] * appstate.size));
        ctx.lineTo(p.x + (p.angles[2] * appstate.size), p.y + (p.angles[3] * appstate.size));
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'line':{
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + (p.line * appstate.size), p.y + (p.radius * 5));
        ctx.lineWidth = 2 * appstate.size;
        ctx.stroke();
        break;
      }
      case 'square': {
        ctx.save();
        ctx.translate(p.x+15, p.y+5);
        ctx.rotate(p.rotation);
        ctx.fillRect(-15 * appstate.size,-5 * appstate.size,15 * appstate.size,5 * appstate.size);
        ctx.restore();
        break;
      }
    }
  }
  
  //////////////
  // Public itens
  //////////////

  //////////////
  // Clean actual state
  var _clear = function() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    var w = cv.width;
    cv.width = 1;
    cv.width = w;
    clearInterval(appstate.interval);
  }

  //////////////
  // Render confetti on canvas
  var _render = function() {
      //canvas dimensions
      cv.width = appstate.width;
      cv.height = appstate.height;
      particles = [];

      for(var i = 0; i < appstate.max; i ++)
        particles.push(particleFactory());
      
      function draw(){
        ctx.clearRect(0, 0, appstate.width, appstate.height);

        for(var i in particles)
          particleDraw(particles[i]);
        
        update();
      }

      function update() {

        for (var i = 0; i < appstate.max; i++) {
          var p = particles[i];
          if(appstate.animate)
            p.y += p.speed;
          
          if (p.y > appstate.height) {
            particles[i] = p; 
            particles[i].x = rand(appstate.width, true);
            particles[i].y = -10;
          }
        }
      }

      //animation loop
      if(appstate.animate)
        return appstate.interval = setInterval(draw, 20);
      
      return draw();
  };

  return {
    render: _render,
    clear: _clear
  }
}