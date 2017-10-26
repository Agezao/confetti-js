var ConfettiGenerator = function(params) {
  //////////////
  // Defaults
  var appstate = {
    target: 'confetti-holder', // Id of the canvas
    max: 80, // Max itens to render
    animate: true, // Should aniamte?
    props: ['circle', 'square', 'triangle', 'line'], // Types of confetti
    colors: [[165,104,246],[230,61,135],[0,199,228],[253,214,126]], // Colors to render confetti
    clock: 25, // Speed of confetti fall
    interval: null // Draw interval holder
  };

  //////////////
  // Setting parameters if received
  if(params) {
    if(params.target)
      appstate.target = params.target;
    if(params.max)
      appstate.max = params.max;
    if(params.animate !== undefined && params.animate !== null)
      appstate.animate = params.animate;
    if(params.props)
      appstate.props = params.props;
    if(params.colors)
      appstate.colors = params.colors;
    if(params.clock)
      appstate.clock = params.clock;
  }

  //////////////
  // Properties
  var cv = document.getElementById(appstate.target);
  var ctx = cv.getContext("2d");
  var globalWidth = window.innerWidth;
  var globalHeight = window.innerHeight;
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
      x: rand(globalWidth), //x-coordinate
      y: rand(globalHeight), //y-coordinate
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
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, true);
        ctx.fill();
        break;  
      }
      case 'triangle': {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + (p.angles[0]), p.y + (p.angles[1]));
        ctx.lineTo(p.x + (p.angles[2]), p.y + (p.angles[3]));
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'line':{
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.line, p.y + (p.radius * 5));
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
      }
      case 'square': {
        ctx.save();
        ctx.translate(p.x+15, p.y+5);
        ctx.rotate(p.rotation);
        ctx.fillRect(-15,-5,15,5);
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
      cv.width = globalWidth;
      cv.height = globalHeight;
      particles = [];

      for(var i = 0; i < appstate.max; i ++)
        particles.push(particleFactory());
      
      function draw(){
        ctx.clearRect(0, 0, globalWidth, globalHeight);

        for(var i in particles)
          particleDraw(particles[i]);
        
        update();
      }

      function update() {

        for (var i = 0; i < appstate.max; i++) {
          var p = particles[i];
          if(appstate.animate)
            p.y += p.speed;
          
          if (p.y > globalHeight) {
            particles[i] = p; 
            particles[i].x = rand(globalWidth, true);
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