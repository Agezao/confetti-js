var AppClass = function() {
  var appstate = {
    target: 'confetti-holder',
    max: 80,
    size: 1,
    animate: true,
    props: ['circle', 'square', 'triangle', 'line', {type:'svg', src:'hat.svg', weight: 0.2, size: 25}],
    colors: [[165,104,246],[230,61,135],[0,199,228],[253,214,126]],
    clock: 25,
    rotate: false,
    width: window.innerWidth,
    height: window.innerHeight,
    start_from_edge: false,
    respawn: true,
    enable_opacity: true
  };

  var confetti = null;

  //
  var updateForm = function() {
    document.getElementById('canvas-id').value = typeof appstate.target == 'object'
      ? appstate.target.id
      : appstate.target;
    document.getElementById('max-confetti').value = appstate.max;
    document.getElementById('clock').value = appstate.clock;
    document.getElementById('size').value = appstate.size;
    document.getElementById('width').value = appstate.width;
    document.getElementById('height').value = appstate.height;

    document.getElementById('circle').checked = appstate.props.indexOf('circle') > -1;
    document.getElementById('square').checked = appstate.props.indexOf('square') > -1;
    document.getElementById('triangle').checked = appstate.props.indexOf('triangle') > -1;
    document.getElementById('line').checked = appstate.props.indexOf('line') > -1;
    document.getElementById('rotate').checked = appstate.props.rotate;
    var svgProp = appstate.props.find(function(el) { return el.type == 'svg' });
    document.getElementById('svg').checked = !!svgProp;
    document.getElementById('svg-size').value = svgProp.size || 15;
    document.getElementById('svg-weight').value = svgProp.weight || 1;

    var parsedColors = JSON.stringify(appstate.colors);
    document.getElementById('colors').value = parsedColors.substring(1, parsedColors.length - 1);

    document.getElementById('animate').checked = appstate.animate;

    document.getElementById('start_from_edge').checked = appstate.start_from_edge;

    document.getElementById('respawn').checked = appstate.respawn;

    document.getElementById('enable_opacity').checked = appstate.enable_opacity;

    document.getElementById('json-output').innerHTML = JSON.stringify(appstate);
  };

  var updateState = function() {
    appstate.target = document.getElementById('canvas-id').value;
    appstate.max = document.getElementById('max-confetti').value;
    appstate.clock = document.getElementById('clock').value;
    appstate.size = document.getElementById('size').value;
    appstate.width = document.getElementById('width').value;
    appstate.height = document.getElementById('height').value;
    
    appstate.props = [];
    if(document.getElementById('circle').checked)
      appstate.props.push('circle');
    if(document.getElementById('square').checked)
      appstate.props.push('square');
    if(document.getElementById('triangle').checked)
      appstate.props.push('triangle');
    if(document.getElementById('line').checked)
      appstate.props.push('line');
    if(document.getElementById('svg').checked) {
      var hatProp = {type:'svg', src:'site/hat.svg'};
      hatProp.size = parseFloat(document.getElementById('svg-size').value);
      hatProp.weight = parseFloat(document.getElementById('svg-weight').value);
      appstate.props.push(hatProp);
      
    }

    appstate.colors = '['+document.getElementById('colors').value+']';
    appstate.colors = JSON.parse(appstate.colors);

    appstate.animate = document.getElementById('animate').checked;

    appstate.start_from_edge = document.getElementById('start_from_edge').checked;

    appstate.respawn = document.getElementById('respawn').checked;

    appstate.rotate = document.getElementById('rotate').checked;

    appstate.enable_opacity = document.getElementById('enable_opacity').checked;

    document.getElementById('json-output').innerHTML = JSON.stringify(appstate);
  };
  //

  var render = function() {
    updateState();
    if(confetti)
      confetti.clear();
    confetti = new ConfettiGenerator(appstate);
    confetti.render();
  };

  var start = function() {
    updateForm();
    render();
  };

  var clear = function() {
    confetti.clear();
  }

  return {
    start: start,
    clear: clear,
    render: render
  };
}

///

var app = null;

window.onload = function(){
  app = new AppClass();
  app.start();
}
