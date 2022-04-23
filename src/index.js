/* eslint-disable no-undef */
export default function ConfettiGenerator(params) {
  // Defaults
  const appstate = {
    target: 'confetti-holder', // Id of the canvas
    max: 80, // Max itens to render
    size: 1, // prop size
    animate: true, // Should animate?
    respawn: true, // Should confettis be respawned when getting out of screen?
    props: ['circle', 'square', 'triangle', 'line'], // Types of confetti
    colors: [
      [165, 104, 246],
      [230, 61, 135],
      [0, 199, 228],
      [253, 214, 126],
    ], // Colors to render confetti
    clock: 25, // Speed of confetti fall
    interval: null, // Draw interval holder
    rotate: false, // Whenever to rotate a prop
    start_from_edge: false, // Should confettis spawn at the top/bottom of the screen?
    width: window.innerWidth, // canvas width (as int, in px)
    height: window.innerHeight, // canvas height (as int, in px)
  };

  // Setting parameters if received
  if (params) {
    if (params.target) appstate.target = params.target;
    if (params.max) appstate.max = params.max;
    if (params.size) appstate.size = params.size;
    if (params.animate !== undefined && params.animate !== null) appstate.animate = params.animate;
    if (params.respawn !== undefined && params.respawn !== null) appstate.respawn = params.respawn;
    if (params.props) appstate.props = params.props;
    if (params.colors) appstate.colors = params.colors;
    if (params.clock) appstate.clock = params.clock;
    if (params.start_from_edge !== undefined && params.start_from_edge !== null)
      appstate.start_from_edge = params.start_from_edge;
    if (params.width) appstate.width = params.width;
    if (params.height) appstate.height = params.height;
    if (params.rotate !== undefined && params.rotate !== null) appstate.rotate = params.rotate;
  }

  // Early exit if the target is not the correct type, or is null
  if (typeof appstate.target !== 'object' && typeof appstate.target !== 'string') {
    throw new TypeError('The target parameter should be a node or string');
  }

  if (
    (typeof appstate.target === 'object' &&
      (appstate.target === null || !(appstate.target instanceof HTMLCanvasElement))) ||
    (typeof appstate.target === 'string' &&
      (document.getElementById(appstate.target) === null ||
        !(document.getElementById(appstate.target) instanceof HTMLCanvasElement)))
  ) {
    throw new ReferenceError('The target element does not exist or is not a canvas element');
  }

  // Properties
  const cv =
    typeof appstate.target === 'object'
      ? appstate.target
      : document.getElementById(appstate.target);
  const ctx = cv.getContext('2d');
  let particles = [];

  // Random helper (to minimize typing)
  function rand(limit, floor) {
    // eslint-disable-next-line no-param-reassign
    if (!limit) limit = 1;
    const randomValue = Math.random() * limit;
    return !floor ? randomValue : Math.floor(randomValue);
  }

  const totalWeight = appstate.props.reduce((weight, prop) => weight + (prop.weight || 1), 0);

  function selectProp() {
    let randNumber = Math.random() * totalWeight;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < appstate.props.length; ++i) {
      const weight = appstate.props[i].weight || 1;
      if (randNumber < weight) return i;
      randNumber -= weight;
    }
  }

  // Confetti particle generator
  function particleFactory() {
    const prop = appstate.props[selectProp()];
    const p = {
      prop: prop.type ? prop.type : prop, // prop type
      x: rand(appstate.width), // x-coordinate
      // eslint-disable-next-line no-nested-ternary
      y: appstate.start_from_edge
        ? appstate.clock >= 0
          ? -10
          : parseFloat(appstate.height) + 10
        : rand(appstate.height), // y-coordinate
      src: prop.src,
      radius: rand(4) + 1, // radius
      size: prop.size,
      rotate: appstate.rotate,
      line: Math.floor(rand(65) - 30), // line angle
      angles: [rand(10, true) + 2, rand(10, true) + 2, rand(10, true) + 2, rand(10, true) + 2], // triangle drawing angles
      color: appstate.colors[rand(appstate.colors.length, true)], // color
      rotation: (rand(360, true) * Math.PI) / 180,
      speed: rand(appstate.clock / 7) + appstate.clock / 30,
    };

    return p;
  }

  // Confetti drawing on canvas
  function particleDraw(p) {
    if (!p) {
      return;
    }

    const op = p.radius <= 3 ? 0.4 : 0.8;

    // eslint-disable-next-line no-multi-assign
    ctx.fillStyle = ctx.strokeStyle = `rgba(${p.color}, ${op})`;
    ctx.beginPath();

    switch (p.prop) {
      case 'circle': {
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.radius * appstate.size, 0, Math.PI * 2, true);
        ctx.fill();
        break;
      }
      case 'triangle': {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.angles[0] * appstate.size, p.y + p.angles[1] * appstate.size);
        ctx.lineTo(p.x + p.angles[2] * appstate.size, p.y + p.angles[3] * appstate.size);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'line': {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.line * appstate.size, p.y + p.radius * 5);
        ctx.lineWidth = 2 * appstate.size;
        ctx.stroke();
        break;
      }
      case 'square': {
        ctx.save();
        ctx.translate(p.x + 15, p.y + 5);
        ctx.rotate(p.rotation);
        ctx.fillRect(
          -15 * appstate.size,
          -5 * appstate.size,
          15 * appstate.size,
          5 * appstate.size
        );
        ctx.restore();
        break;
      }
      case 'svg': {
        ctx.save();
        const image = new window.Image();
        image.src = p.src;
        const size = p.size || 15;
        ctx.translate(p.x + size / 2, p.y + size / 2);
        if (p.rotate) ctx.rotate(p.rotation);
        ctx.drawImage(
          image,
          -(size / 2) * appstate.size,
          -(size / 2) * appstate.size,
          size * appstate.size,
          size * appstate.size
        );
        ctx.restore();
        break;
      }
      default:
        throw new Error(`Invalid prop ${p.prop}`);
    }
  }

  // Public itens

  // Clean actual state
  const clear = () => {
    appstate.animate = false;
    clearInterval(appstate.interval);

    requestAnimationFrame(() => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      const w = cv.width;
      cv.width = 1;
      cv.width = w;
    });
  };

  // Render confetti on canvas
  const render = () => {
    cv.width = appstate.width;
    cv.height = appstate.height;
    particles = [];

    for (let i = 0; i < appstate.max; i += 1) particles.push(particleFactory());

    function update() {
      for (let i = 0; i < appstate.max; i += 1) {
        const p = particles[i];

        if (p) {
          if (appstate.animate) p.y += p.speed;

          if (p.rotate) p.rotation += p.speed / 35;

          if ((p.speed >= 0 && p.y > appstate.height) || (p.speed < 0 && p.y < 0)) {
            if (appstate.respawn) {
              particles[i] = p;
              particles[i].x = rand(appstate.width, true);
              particles[i].y = p.speed >= 0 ? -10 : parseFloat(appstate.height);
            } else {
              particles[i] = undefined;
            }
          }
        }
      }

      if (particles.every((p) => p === undefined)) {
        clear();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, appstate.width, appstate.height);

      for (let i = 0; i < particles.length; i += 1) particleDraw(particles[i]);

      update();

      if (appstate.animate) requestAnimationFrame(draw);
    }

    return requestAnimationFrame(draw);
  };

  return { render, clear };
}
