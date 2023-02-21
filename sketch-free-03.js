const Tweakpane = require('tweakpane');
const canvasSketch = require('canvas-sketch');

let manager;

const settings = {
  dimensions: [ 1080, 1080 ],
};

const params = {
  cols: 4,
  rows: 4,
  numCells: 16,
};

const sketch = ({ context, width, height }) => {

  return ({ context, width, height }) => {
    const cellWidth = width / params.cols;
    const cellHeight = height / params.rows;

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    console.log(width, params.cols, height, params.rows);
    console.log('numCells, cellWidth, cellHeight');
    console.log(params.numCells, cellWidth, cellHeight);
    for(let i = 0; i < params.numCells; i++) {
      const col = i % params.cols;
      const row = Math.floor(i / params.cols);

      const hue = i * 360 / params.numCells;
      context.fillStyle = `hsla(${hue}, 100%, 50%, 100%)`;
      context.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);

      // console.log(i, col, row, hue); 
    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Dimensions' });
  folder.addInput(params, 'cols', { min: 1, max: 100, step: 1 });
  folder.addInput(params, 'rows', { min: 1, max: 100, step: 1 });
  folder.addInput(params, 'numCells', { min: 1, max: 100, step: 1 });

  pane.on('change', ev => {
    if (ev.presetKey === 'numCells') {
      params.cols = Math.ceil(Math.sqrt(ev.value));
      params.rows = Math.ceil(ev.value / params.cols);
    }

    if (ev.presetKey === 'cols' || ev.presetKey === 'rows') {
      params.numCells = params.cols * params.rows;
    }

    pane.refresh();
    console.log(ev, params);
    manager.render();
  });
};

createPane();

canvasSketch(sketch, settings).then(e => {
  manager = e;
});