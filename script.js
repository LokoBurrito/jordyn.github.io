const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let particles = [];
let heartParticles = [];

const backgroundMusic = document.getElementById('backgroundMusic');

const particleSound = new Audio('https://github.com/LokoBurrito/jordyn.github.io/blob/main/music/explosion.wav?raw=true');
particleSound.volume = 0.5;

const clickSound = new Audio('https://github.com/LokoBurrito/jordyn.github.io/blob/main/music/Aww%20Sound%20Effect.mp3?raw=true');
clickSound.volume = 0.5;

function Star(x, y) {
  this.x = x;
  this.y = y;
  this.size = Math.random() * 2;
  this.speed = Math.random() * 0.5 + 0.2;
  this.color = 'white';
}

Star.prototype.update = function() {
  this.y += this.speed * backgroundSpeed;
  if (this.y > canvas.height) {
    this.y = 0;
  }
};

Star.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fillStyle = this.color;
  ctx.fill();
};

function Particle(x, y, image = null) {
  this.x = x;
  this.y = y;
  this.size = Math.random() * 3 + 1;
  this.speedX = Math.random() * 3 - 1.5;
  this.speedY = Math.random() * 3 - 1.5;
  this.opacity = 1;
  this.image = image;
}

Particle.prototype.update = function() {
  this.x += this.speedX;
  this.y += this.speedY;
  this.opacity -= 0.02;
  if (this.opacity <= 0) {
    this.opacity = 0;
  }
};

Particle.prototype.draw = function() {
  ctx.globalAlpha = this.opacity;
  if (this.image) {
    ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
  } else {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
  ctx.globalAlpha = 1;
};

function createStars() {
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    stars.push(new Star(x, y));
  }
}

function isStarInText(star) {
  const textElement = document.querySelector('#content h1');
  const textRect = textElement.getBoundingClientRect();
  const rectLeft = textRect.left;
  const rectRight = textRect.right;
  const rectTop = textRect.top;
  const rectBottom = textRect.bottom;
  return star.x > rectLeft && star.x < rectRight && star.y > rectTop && star.y < rectBottom;
}

function handleParticles() {
  particles.forEach((particle, index) => {
    particle.update();
    particle.draw();
    if (particle.opacity <= 0) {
      particles.splice(index, 1);
    }
  });

  heartParticles.forEach((heartParticle, index) => {
    heartParticle.update();
    heartParticle.draw();
    if (heartParticle.opacity <= 0) {
      heartParticles.splice(index, 1);
    }
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    star.update();
    if (isStarInText(star)) {
      star.color = 'black';
    } else {
      star.color = 'white';
    }
    star.draw();
  });
  handleParticles();
  requestAnimationFrame(animate);
}

canvas.addEventListener('click', (event) => {

  particleSound.play();

  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(event.clientX, event.clientY));
  }
});

document.getElementById('bottomImage').addEventListener('click', (event) => {

  clickSound.play();

  for (let i = 0; i < 20; i++) {
    heartParticles.push(new Particle(event.clientX, event.clientY, heartImage));
  }
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = [];
  createStars();
});

function togglePlay() {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }
}

function changeVolume(volume) {
  backgroundMusic.volume = volume;
}

let backgroundSpeed = 1;
document.getElementById('backgroundSpeed').addEventListener('input', (event) => {
  backgroundSpeed = event.target.value;
});

function toggleSettings() {
  const panel = document.getElementById('settingsPanel');
  panel.style.display = panel.style.display === 'none' || panel.style.display === '' ? 'block' : 'none';
}


createStars();
animate();
