const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ボール
const ballR = 8;
let ballX = canvas.width / 2;
let ballY = canvas.height - 40;
let dx = 3;
let dy = -3;

// パドル
const paddleW = 80;
const paddleH = 10;
let paddleX = (canvas.width - paddleW) / 2;

// ブロック（4段 × 7列）
const blockW = 55;
const blockH = 18;
const colors = ["#f55", "#fa0", "#5d5", "#5af"];
const blocks = [];
for (let row = 0; row < 4; row++) {
  for (let col = 0; col < 7; col++) {
    blocks.push({ x: 18 + col * 65, y: 40 + row * 28, color: colors[row], alive: true });
  }
}

let score = 0;
let message = "";

// キー操作
let leftPressed = false;
let rightPressed = false;
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") leftPressed = true;
  if (e.key === "ArrowRight") rightPressed = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") leftPressed = false;
  if (e.key === "ArrowRight") rightPressed = false;
});

// 終わったらクリックでやり直し
canvas.addEventListener("click", () => {
  if (message) location.reload();
});

// 1コマ分の動き
function update() {
  // パドルを動かす（画面の外に出ないようにする）
  if (leftPressed) paddleX -= 6;
  if (rightPressed) paddleX += 6;
  paddleX = Math.max(0, Math.min(paddleX, canvas.width - paddleW));

  // ボールを動かす
  ballX += dx;
  ballY += dy;

  // 左右と上の壁で跳ね返る
  if (ballX < ballR || ballX > canvas.width - ballR) dx = -dx;
  if (ballY < ballR) dy = -dy;

  // パドルで跳ね返る
  const onPaddle = ballX > paddleX && ballX < paddleX + paddleW;
  if (dy > 0 && ballY > canvas.height - paddleH - ballR && onPaddle) dy = -dy;

  // 下に落ちたらゲームオーバー
  if (ballY > canvas.height + ballR) message = "GAME OVER";

  // ブロックに当たったら消して跳ね返る
  for (const b of blocks) {
    if (b.alive && ballX > b.x && ballX < b.x + blockW && ballY > b.y && ballY < b.y + blockH) {
      b.alive = false;
      dy = -dy;
      score++;
    }
  }

  // 全部消したらクリア
  if (score === blocks.length) message = "CLEAR!";
}

// 画面を描く
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const b of blocks) {
    if (b.alive) {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, blockW, blockH);
    }
  }

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillRect(paddleX, canvas.height - paddleH, paddleW, paddleH);

  ctx.font = "16px sans-serif";
  ctx.fillText("スコア: " + score, 10, 24);

  if (message) {
    ctx.textAlign = "center";
    ctx.font = "32px sans-serif";
    ctx.fillText(message, canvas.width / 2, 210);
    ctx.font = "16px sans-serif";
    ctx.fillText("クリックでもう一度", canvas.width / 2, 240);
  }
}

// 1秒に60回、動かして描く
function loop() {
  update();
  draw();
  if (message) clearInterval(timer);
}
const timer = setInterval(loop, 1000 / 60);
