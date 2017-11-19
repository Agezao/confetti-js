var AppClass = function() {
  var appstate = {
    target: 'confetti-holder',
    max: 80,
    size: 1,
    animate: true,
    props: ['circle', 'square', 'triangle', 'line'],
    colors: [[165,104,246],[230,61,135],[0,199,228],[253,214,126]],
    clock: 25,
    width: window.innerWidth,
    height: window.innerHeight
  };

  var confetti = null;

  //
  var updateForm = function() {
    document.getElementById('canvas-id').value = appstate.target;
    document.getElementById('max-confetti').value = appstate.max;
    document.getElementById('clock').value = appstate.clock;
    document.getElementById('size').value = appstate.size;
    document.getElementById('width').value = appstate.width;
    document.getElementById('height').value = appstate.height;

    document.getElementById('circle').checked = appstate.props.indexOf('circle') > -1;
    document.getElementById('square').checked = appstate.props.indexOf('square') > -1;
    document.getElementById('triangle').checked = appstate.props.indexOf('triangle') > -1;
    document.getElementById('line').checked = appstate.props.indexOf('line') > -1;

    var parsedColors = JSON.stringify(appstate.colors);
    document.getElementById('colors').value = parsedColors.substring(1, parsedColors.length - 1);

    document.getElementById('animate').checked = appstate.animate;

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

    appstate.colors = '['+document.getElementById('colors').value+']';
    appstate.colors = JSON.parse(appstate.colors);

    appstate.animate = document.getElementById('animate').checked;

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

  return {
    start: start,
    render: render
  };
}

///

var app = null;

window.onload = function(){
  app = new AppClass();
  app.start();
}