const canvasSketch = require('canvas-sketch');
const Tweakpane = require('tweakpane');
const math = require('canvas-sketch-util/math');

const settings = {
    dimensions: [ 1080, 1080 ],
    animate: true,
};

const params = {
    sides: 3,
    sidesToDraw: 100,
    radius: 320,
    curvesSize: 160,
    rotation: 30,
    center: {
      x: 0,
      y: 0,
    },
    arcs: true,
    lines: true,
    circle: true,
    colors: true,
    colorsTransparency: 50,
};

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

        const p0x = centerX + Math.cos(step * i + (Math.PI * params.rotation / 180)) * params.radius;
        const p0y = centerY + Math.sin(step * i + (Math.PI * params.rotation / 180)) * params.radius;
        const p1x = centerX + Math.cos(step * (i + 1) + (Math.PI * params.rotation / 180)) * params.radius;
        const p1y = centerY + Math.sin(step * (i + 1) + (Math.PI * params.rotation / 180)) * params.radius;
        const p2x = centerX + Math.cos(step * (i + 0.5) + Math.PI + (Math.PI * params.rotation / 180)) * params.curvesSize;
        const p2y = centerY + Math.sin(step * (i + 0.5) + Math.PI + (Math.PI * params.rotation / 180)) * params.curvesSize;

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
            context.fillStyle = `hsla(${hue}, 100%, 50%, ${params.colorsTransparency}%)`;
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
    folder.addInput(params, 'curvesSize', { min: 0, max: 1000, step: 10 });
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
    folder.addInput(params, 'colors');
    folder.addInput(params, 'colorsTransparency', { min: 0, max: 100 })
};
  
createPane();
canvasSketch(sketch, settings);