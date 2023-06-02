const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [ 1080, 1080 ],
	animate: true
};

class Particle {
	constructor() {
		this.xDir = Math.random() * 2 -1;
		this.yDir = Math.random() * 2 -1;
		this.vel = 10;
		this.xPos = 0;
		this.yPos = 0;
		this.size = 1;
	}

	move() {
		this.xPos += this.xDir * this.vel;
		this.yPos += this.yDir * this.vel;
		this.size += (Math.abs(this.xDir) + Math.abs(this.yDir)) / 6;
	}

	draw(context) {
		context.beginPath();
		context.arc(this.xPos, this.yPos, this.size, 0, Math.PI * 2);
		context.fill();
		console.log('drew', this.xPos, this.yPos);
	}

	isOutOfBounds() {
		return !!(
			(Math.abs(this.xPos) + this.size) > (settings.dimensions[0] / 2) ||
			(Math.abs(this.yPos) + this.size) > (settings.dimensions[1] / 2)
		);
	}
}

const sketch = ({ context, width, height }) => {
	const particles = [];
	for(let i = 0; i < 10; i++) {
		particles.push(new Particle());
	}

	return ({ context, width, height, frame }) => {
		context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'white';

		context.translate(width/2, height/2);

		for(let i = 0; i < particles.length; i++) {
			const particle = particles[i];
			particle.move();

			if (particle.isOutOfBounds()) {
				particles.splice(i, 1, new Particle());
				console.log(particles);
			} else {
				particle.draw(context);
			}
		}
	}
}

canvasSketch(sketch, settings);
