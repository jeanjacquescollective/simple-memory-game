const canvas = document.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

      let mouse = {
        x: null,
        y: null,
        radius: 150,
      };

      window.addEventListener('mousemove', function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
      });

      class Circle {
        constructor(x, y, dx, dy, radius, color) {
          this.x = x;
          this.y = y;
          this.dx = dx;
          this.dy = dy;
          this.radius = radius;
          this.color = color;
        }

        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
          ctx.fillStyle = this.color;
          ctx.fill();
        }

        update() {
          if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
          }

          if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
          }

          this.x += this.dx;
          this.y += this.dy;

          // interactivity
          if (
            mouse.x - this.x < mouse.radius &&
            mouse.x - this.x > -mouse.radius &&
            mouse.y - this.y < mouse.radius &&
            mouse.y - this.y > -mouse.radius
          ) {
            if (this.radius < 50) {
              this.radius += 1;
            }
          } else if (this.radius > 10) {
            this.radius -= 1;
          }

          this.draw();
        }
      }

      let circleArray = [];

      for (let i = 0; i < 800; i++) {
        let radius = Math.random() * 10 + 2;
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = Math.random() * (canvas.height - radius * 2) + radius;
        let dx = (Math.random() - 0.5) * 2;
        let dy = (Math.random() - 0.5) * 2;
        let color = colors[Math.floor(Math.random() * colors.length)];

        circleArray.push(new Circle(x, y, dx, dy, radius, color));
      }

      function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < circleArray.length; i++) {
          circleArray[i].update();
        }
      }

      animate();