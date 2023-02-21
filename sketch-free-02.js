const Tweakpane = require('tweakpane');
const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const params = {
  width: 0,
  height: 0,
  cols: 4,
  rows: 4,
  rotation: 0,
  center: {
    x: 0,
    y: 0,
  },
  typeCanvas: {
    width: 0,
    height: 0,
  }
};

let manager;
const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

// class
const sketch = ({ context, width, height }) => {
  /**
   * Preparing space. Something that will be done only once
   * in the initialization and won't repeat after each iteration
   * Ex: ngOnInit() {}
   */


  // cellSize = params.cols * params.rows;



  return ({ context, width, height }) => {




    // fontSize = cols;



    context.drawImage(typeCanvas, 0, 0);
    context.font = `${typeCanvas.height}px sans-serif`;

    console.log(context);

    // const typeData = typeContext.getImageData(0, 0, width, height).data;
    // console.log(typeData);

    // context.textBaseline = 'middle';
    // context.textAlign = 'center';

    const numCells = params.cols * params.rows;
    for (let i = 0; i < numCells; i++) {



      // const metrics = typeContext.measureText(i);
      // const mx = metrics.actualBoundingBoxLeft * -1;
      // const my = metrics.actualBoundingBoxAscent * -1;
      // const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
      // const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  
      // const tx = (params.cols - mw) * 0.5 - mx;
      // const ty = (params.rows - mh) * 0.5 - my;




      const col = i % params.cols;
      const row = Math.floor(i / params.rows);

      const x = col * typeCanvas.width;
      const y = row * typeCanvas.height;

      // const r = typeData[i * 4 + 0];
      // const g = typeData[i * 4 + 1];
      // const b = typeData[i * 4 + 2];
      // const a = typeData[i * 4 + 3];

      // console.log(r,g,b,a);

    //   const glyoh = getGlyph(r);

      // context.fillStyle = `rgba(${r}, ${g}, ${b}, 123)`;

      context.save();
      context.translate(x, y);
    //   context.translate(cell * 0.5, cell * 0.5);
      // context.drawImage(typeCanvas,
        // 0,
        // 0,
        // typeCanvas.width,
        // typeCanvas.height,
        // 0,
        // 0,
        // typeCanvas.width,
        // typeCanvas.height);

        // context.beginPath();
        // context.rect(0, 0, typeCanvas.width, typeCanvas.height);
        // context.stroke();

        const hue = i * 360 / numCells;
        context.fillStyle = `hsla(${hue}, 100%, 50%, 100%)`;
        context.strokeStyle = `hsla(${hue}, 100%, 50%, 100%)`;
        context.lineWidth = 30;
        
        // context.rect(0, 0, typeCanvas.width, typeCanvas.height);
        // context.stroke();

        context.fillRect(0, 0, typeCanvas.width, typeCanvas.height);
        context.fillText(i, 0, 0);

      context.restore();

      console.log(i, col, row, hue);
      console.log(tx, ty);
    }

  };
};

const getGlyph = v => {
  if (v < 50) return '';
  if (v < 100) return '.';
  if (v < 150) return '-';
  if (v < 200) return '+';

  const glyphs = '_= /'.split('');

  return random.pick(glyphs);
}

const onKeyUp = e => {
  text = e.key.toUpperCase();
  manager.render();
}

// document.addEventListener('keyup', onKeyUp);   -


canvasSketch(sketch, settings).then(e => {
  manager = e;
});

let img = new Image();
img.onload = () => {
    typeCanvas.width = Math.floor(settings.dimensions[0] / params.cols);
    typeCanvas.height = Math.floor(settings.dimensions[1] / params.rows);

    typeContext.drawImage(img, 0, 0, typeCanvas.width, typeCanvas.height);
    manager.render();
}
img.src = 'picture.jpg';

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Size' });
  folder.addInput(params, 'width', { min: 0, max: 10, step: 1 });
  folder.addInput(params, 'height', { min: 0, max: 10, step: 1 });
  folder.addInput(params, 'cols', { min: 1, max: 10, step: 1 });
  folder.addInput(params, 'rows', { min: 1, max: 10, step: 1 });
  folder.addInput(params, 'rotation', { min: 0, max: 360 });
  folder.addInput(params, 'center', {
    picker: 'inline',
    expanded: true,
    x: { min: -540, max: 540, step: 1 },
    y: { min: -540, max: 540, step: 1 }
  });

  // folder = pane.addFolder({ title: 'Elements' });
  // folder.addInput(params, 'circle');
  // folder.addInput(params, 'lines');
  // folder.addInput(params, 'arcs');
  // folder.addSeparator();
  // folder.addInput(params, 'colors');
  // folder.addInput(params, 'transparency', { min: 0, max: 100 })

  // folder = pane.addFolder({ title: 'Animate' });
  // folder.addInput(params.animate, 'rotation');
  // folder.addInput(params.animate, 'speed', {min: 1, max: 50, step: 1});
  // folder.addSeparator();
  // folder.addInput(params.animate, 'curvesSize');
  // folder.addInput(params.animate, 'amplitude', {min: 0, max: 100, step: 1});
  // folder.addInput(params.animate, 'frequency', {min: 0, max: 100, step: 1});
  // folder.addInput(params.animate, 'variation', {min: 0, max: 100, step: 1});

  pane.on('change', ev => {
    manager.render();
  });
};

createPane();