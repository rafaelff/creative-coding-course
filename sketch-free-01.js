const canvasSketch = require('canvas-sketch');
const Tweakpane = require('tweakpane');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
    dimensions: [ 1080, 1080 ],
    animate: true,
};

const params = {
    sides: 3,
    sidesToDraw: 100,
    radius: 320,
    curvesSize: 16,
    rotation: 30,
    center: {
      x: 0,
      y: 0,
    },
    arcs: true,
    lines: true,
    circle: true,
    colors: true,
    transparency: 50,
    animate: {
      rotation: false,
      curvesSize: false,
      speed: 5,
      frequency: 50,
      amplitude: 100,
      variation: 20,
    }
};

let manager;

const sketch = () => {
    return ({ context, width, height, frame }) => {
      context.fillStyle = 'white';
      context.fillRect(0, 0, width, height);

      const centerX = params.center.x + 540;
      const centerY = params.center.y + 540;

      if (params.circle) {
        context.beginPath();
        context.arc(centerX, centerY, params.radius, 0, 2 * Math.PI);
        context.stroke();
      }

      const step = 2 * Math.PI / params.sides;

      for (let i = 1; i <= params.sides; i++) {
        if (i > params.sidesToDraw) {
          break;
        }

        const n = random.noise2D(frame, i * params.animate.variation, params.animate.frequency / 5000, params.animate.amplitude * 10);
        const rotation = params.animate.rotation ? params.animate.speed * frame / 5 : params.rotation;
        const curvesSize = params.animate.curvesSize ? n + params.curvesSize * 10 : params.curvesSize * 10;

        const p0x = centerX + Math.cos(step * i + (Math.PI * rotation / 180)) * params.radius;
        const p0y = centerY + Math.sin(step * i + (Math.PI * rotation / 180)) * params.radius;
        const p1x = centerX + Math.cos(step * (i + 1) + (Math.PI * rotation / 180)) * params.radius;
        const p1y = centerY + Math.sin(step * (i + 1) + (Math.PI * rotation / 180)) * params.radius;
        const p2x = centerX + Math.cos(step * (i + 0.5) + Math.PI + (Math.PI * rotation / 180)) * curvesSize;
        const p2y = centerY + Math.sin(step * (i + 0.5) + Math.PI + (Math.PI * rotation / 180)) * curvesSize;

        context.save();

        if (params.lines) {
          context.beginPath();
          context.moveTo(p0x, p0y);
          context.lineTo(p1x, p1y);
          context.stroke();
        }

        if (params.arcs) {
          context.beginPath();
          context.moveTo(p0x, p0y);
          context.quadraticCurveTo(p2x, p2y, p1x, p1y);
          context.stroke();

          if (params.colors) {
            const hue = math.mapRange(i, 0, params.sides, 0, 360);
            context.fillStyle = `hsla(${hue}, 100%, 50%, ${params.transparency}%)`;
            context.fill();
          }
        }

        context.restore();
      }
    }
}

const createPane = () => {
    const pane = new Tweakpane.Pane();
    let folder;
  
    folder = pane.addFolder({ title: 'Geometry' });
    folder.addInput(params, 'sides', { min: 3, max: 100, step: 1 });
    folder.addInput(params, 'sidesToDraw', { min: 0, max: 100, step: 1 });
    folder.addInput(params, 'radius', { min: 10, max: 500, step: 10 });
    folder.addInput(params, 'curvesSize', { min: -100, max: 100, step: 1 });
    folder.addInput(params, 'rotation', { min: 0, max: 360 });
    folder.addInput(params, 'center', {
      picker: 'inline',
      expanded: true,
      x: { min: -540, max: 540, step: 1 },
      y: { min: -540, max: 540, step: 1 }
    });

    folder = pane.addFolder({ title: 'Elements' });
    folder.addInput(params, 'circle');
    folder.addInput(params, 'lines');
    folder.addInput(params, 'arcs');
    folder.addSeparator();
    folder.addInput(params, 'colors');
    folder.addInput(params, 'transparency', { min: 0, max: 100 })

    folder = pane.addFolder({ title: 'Animate' });
    folder.addInput(params.animate, 'rotation');
    folder.addInput(params.animate, 'speed', {min: 1, max: 50, step: 1});
    folder.addSeparator();
    folder.addInput(params.animate, 'curvesSize');
    folder.addInput(params.animate, 'amplitude', {min: 0, max: 100, step: 1});
    folder.addInput(params.animate, 'frequency', {min: 0, max: 100, step: 1});
    folder.addInput(params.animate, 'variation', {min: 0, max: 100, step: 1});

    pane.on('change', ev => {
      manager.render();
    });
};

createPane();
canvasSketch(sketch, settings).then(e => manager = e);
