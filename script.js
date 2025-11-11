const board = document.getElementById('game-board');
const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question');
const optionsDiv = document.getElementById('options');
const timerSpan = document.getElementById('time');
const resultContainer = document.getElementById('result-container');
const finalScore = document.getElementById('final-score');
const rankText = document.getElementById('rank');
const restartBtn = document.getElementById('restart-btn');
const namePromptContainer = document.getElementById('name-prompt-container');
const playerNameInput = document.getElementById('player-name-input');
const startGameBtn = document.getElementById('start-game-btn');
const playerProfile = document.getElementById('player-profile');
const currentScoreSpan = document.getElementById('current-score');

const flipSound = document.getElementById('flip-sound');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const timeoutSound = document.getElementById('timeout-sound');

let score = 0;
let currentQuestion = null;
let timer;
let timeLeft = 15;
let answeredQuestions = 0;

const questions = [
  // FÁCEIS
  {q: "Qual desses é um corpo redondo?", a: ["Cilindro", "Cubo", "Pirâmide", "Prisma"], c: 0},
  {q: "O cilindro tem quantas bases circulares?", a: ["1", "2", "3", "nenhuma"], c: 1},
  {q: "Qual é a forma de uma bola de futebol?", a: ["Esfera", "Cone", "Cilindro", "Cubo"], c: 0},
  {q: "Um copo tem formato de qual corpo redondo?", a: ["Cilindro", "Cubo", "Esfera", "Cone"], c: 0},
  {q: "Qual desses objetos lembra um cone?", a: ["Sorvete de casquinha", "Lata", "Bola", "Caixa"], c: 0},
  {q: "Uma lata de refrigerante tem formato de:", a: ["Cilindro", "Cubo", "Cone", "Pirâmide"], c: 0},

  // MÉDIOS
  {q: "Quantas faces planas tem um cone?", a: ["1", "2", "3", "nenhuma"], c: 0},
  {q: "Qual desses corpos redondos tem uma única base?", a: ["Cone", "Cilindro", "Esfera", "Cubo"], c: 0},
  {q: "A base do cone tem formato de:", a: ["Quadrado", "Triângulo", "Círculo", "Retângulo"], c: 2},
  {q: "O que diferencia um cilindro de uma esfera?", a: ["A esfera não tem bases planas", "O cilindro é menor", "A esfera é quadrada", "Nenhuma"], c: 0},
  {q: "Quantas bases planas tem um cilindro?", a: ["1", "2", "3", "4"], c: 1},
  {q: "A superfície da esfera é:", a: ["Plana", "Curva", "Pontuda", "Quadrada"], c: 1},

  // DIFÍCEIS
  {q: "O volume de uma esfera depende de qual medida?", a: ["Raio", "Altura", "Base", "Diâmetro"], c: 0},
  {q: "Um cone e um cilindro têm a mesma altura e base. Quem tem maior volume?", a: ["Cilindro", "Cone", "Mesma coisa", "Nenhum"], c: 0},
  {q: "O cilindro tem superfícies:", a: ["2 planas e 1 curva", "3 planas", "2 curvas", "1 plana"], c: 0},
  {q: "A área lateral de um cilindro depende de:", a: ["Raio e altura", "Base e lado", "Altura e diâmetro", "Volume"], c: 0},
  {q: "O ponto central da esfera se chama:", a: ["Centro", "Raiz", "Topo", "Altura"], c: 0},
  {q: "A geratriz está presente em qual corpo redondo?", a: ["Cone e cilindro", "Esfera", "Cubo", "Prisma"], c: 0}
];

function createBoard() {
  for (let i = 0; i < questions.length; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${i + 1}</div>
        <div class="card-back">❓</div>
      </div>
    `;
    card.addEventListener('click', () => handleCardClick(card, i));
    board.appendChild(card);
  }
}

function handleCardClick(card, index) {
  // Impede que a mesma carta seja clicada novamente ou que outras sejam clicadas
  if (card.classList.contains('answered') || board.classList.contains('locked')) {
    return;
  }
  board.classList.add('locked'); // Bloqueia o tabuleiro
  flipSound.play();
  card.classList.add('flipped');
  setTimeout(() => {
    showQuestion(index, card);
  }, 600);
}

function showQuestion(index) {
  currentQuestion = questions[index];
  questionText.textContent = currentQuestion.q;
  optionsDiv.innerHTML = "";
  currentQuestion.a.forEach((alt, i) => {
    const btn = document.createElement('button');
    btn.textContent = `${String.fromCharCode(65 + i)}. ${alt}`;
    btn.onclick = (event) => checkAnswer(i, event.target);
    optionsDiv.appendChild(btn);
  });
  questionContainer.classList.remove('hidden');
  startTimer();
}

function startTimer() {
  timeLeft = 15;
  timerSpan.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      timeoutSound.play();
      score--;
      nextQuestion();
    }
  }, 1000);
}

function checkAnswer(selectedIndex, selectedButton) {
  clearInterval(timer);
  const correctIndex = currentQuestion.c;

  // Desabilita todos os botões após uma escolha
  optionsDiv.querySelectorAll('button').forEach(btn => btn.disabled = true);

  if (selectedIndex === correctIndex) {
    correctSound.play();
    score++;
    updateScoreDisplay();
    selectedButton.classList.add('correct');
  } else {
    wrongSound.play();
    selectedButton.classList.add('wrong');
    // Mostra a resposta correta também
    optionsDiv.children[correctIndex].classList.add('correct');
  }
  setTimeout(nextQuestion, 1500); // Dá um tempo para o jogador ver o resultado
}

function nextQuestion() {
  answeredQuestions++;
  if (answeredQuestions === questions.length) {
    endGame();
  } else {
    questionContainer.classList.add('hidden');
    // Encontra a carta que foi virada e marca como respondida
    const flippedCard = document.querySelector('.card.flipped:not(.answered)');
    if (flippedCard) {
      flippedCard.classList.add('answered');
      const cardInner = flippedCard.querySelector('.card-inner');
      cardInner.innerHTML = `<div class="card-front answered-front">✔️</div>`;
    }
    board.classList.remove('locked'); // Desbloqueia o tabuleiro
  }
}

function endGame() {
  questionContainer.classList.add('hidden');
  resultContainer.classList.remove('hidden');
  finalScore.textContent = `Você fez ${score} ponto(s)!`;
  if (score <= 6) rankText.textContent = "🥉 Iniciante dos corpos redondos!";
  else if (score <= 12) rankText.textContent = "🥈 Explorador dos corpos redondos!";
  else rankText.textContent = "🥇 Mestre dos corpos redondos!";

  // Dispara os confetes!
  confetti({
    particleCount: 150, // Mais confetes!
    spread: 100, // Espalha mais
    origin: { y: 0.6 } // Começa um pouco abaixo do topo da tela
  });
}

restartBtn.onclick = () => {
  location.reload();
};

function updateScoreDisplay() {
  currentScoreSpan.textContent = score;
}

startGameBtn.addEventListener('click', () => {
  let playerName = playerNameInput.value.trim();
  if (playerName === "") {
    playerName = "Anônimo"; // Nome padrão se nada for digitado
  }

  document.querySelector('.player-name').textContent = playerName;

  namePromptContainer.classList.add('hidden');
  playerProfile.classList.remove('hidden');
  board.classList.remove('hidden');

  // Inicia o jogo
  createBoard();
  updateScoreDisplay(); // Mostra a pontuação inicial (0)
});
