let currentQuestion = 0;
let totalScore = 0;
let codingScore = 0;
let username = "";
let mode = "fun";
let musicOn = false;
let audioUnlocked = false;

/* AUDIO */
const bgMusic = new Audio("assets/music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.4;

const soundClick = new Audio("assets/click.mp3");
const soundCorrect = new Audio("assets/correct.mp3");
const soundWrong = new Audio("assets/incorrect.mp3");

soundClick.volume = 0.6;
soundCorrect.volume = 0.7;
soundWrong.volume = 0.7;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

/* UNLOCK AUDIO */
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;

  [soundClick, soundCorrect, soundWrong].forEach(a => {
    a.play().then(() => {
      a.pause();
      a.currentTime = 0;
    }).catch(() => {});
  });
}


/* SOUND */
function playClick() {
  soundClick.currentTime = 0;
  soundClick.play();
}

function repeatQuiz() {
  playClick(); // 🔊 bunyi dulu
  setTimeout(() => {
    location.reload();
  }, 150); // kasih waktu audio
}

/* NAV */
function goHome() {
  location.reload();
}

function toggleOption() {
  const menu = document.getElementById("optionMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function toggleMusic() {
  const status = document.getElementById("musicStatus");
  playClick();

  if (!musicOn) {
    bgMusic.play();
    status.innerText = "ON";
  } else {
    bgMusic.pause();
    status.innerText = "OFF";
  }
  musicOn = !musicOn;
}

/* DATA */
const questions = shuffle([
  {
    question: "Kalau kode kamu error, biasanya kamu...",
    options: [
      { text: "Panik", score: 1 },
      { text: "Cari di Google", score: 2 },
      { text: "Debug pelan-pelan", score: 3 },
      { text: "Langsung paham", score: 4 }
    ]
  },
  {
    question: "Ngoding paling enak kapan?",
    options: [
      { text: "Subuh", score: 4 },
      { text: "Siang", score: 2 },
      { text: "Malam", score: 3 },
      { text: "Deadline mepet", score: 1 }
    ]
  },
  {
    question: "Lihat error merah artinya...",
    options: [
      { text: "Panik", score: 1 },
      { text: "Tantangan", score: 4 },
      { text: "Skip dulu", score: 2 },
      { text: "Copas solusi", score: 3 }
    ]
  },
  {
    question: "Tools favorit buat ngoding?",
    options: [
      { text: "VS Code", score: 4 },
      { text: "Notepad", score: 1 },
      { text: "IDE online", score: 2 },
      { text: "Apa aja bisa", score: 3 }
    ]
  },
  {
    question: "StackOverflow itu...",
    options: [
      { text: "Penyelamat", score: 4 },
      { text: "Tempat nyontek", score: 2 },
      { text: "Bingungin", score: 1 },
      { text: "Belum pernah buka", score: 0 }
    ]
  }
]);

const codingQuestions = shuffle([
  {
    question: "Fungsi IF dalam pemrograman?",
    options: [
      { text: "Looping", score: 0 },
      { text: "Percabangan", score: 2 },
      { text: "Menyimpan data", score: 0 },
      { text: "Menampilkan output", score: 0 }
    ]
  },
  {
    question: "Bahasa yang jalan di browser?",
    options: [
      { text: "Python", score: 0 },
      { text: "Java", score: 0 },
      { text: "JavaScript", score: 2 },
      { text: "C++", score: 0 }
    ]
  },
  {
    question: "Apa itu bug?",
    options: [
      { text: "Fitur", score: 0 },
      { text: "Kesalahan program", score: 2 },
      { text: "Framework", score: 0 },
      { text: "Bahasa", score: 0 }
    ]
  },
  {
    question: "HTML digunakan untuk?",
    options: [
      { text: "Logika", score: 0 },
      { text: "Struktur web", score: 2 },
      { text: "Database", score: 0 },
      { text: "Server", score: 0 }
    ]
  },
  {
    question: "CSS berfungsi untuk?",
    options: [
      { text: "Desain", score: 2 },
      { text: "Logika", score: 0 },
      { text: "Database", score: 0 },
      { text: "Server", score: 0 }
    ]
  }
]);


/* START */
function handleStart() {
  unlockAudio();   // hanya unlock
  startQuiz();     // logika quiz
}

function startQuiz() {
  const input = document.getElementById("username");
  if (!input.value.trim()) {
    alert("Nama tidak boleh kosong!");
    return;
  }

  username = input.value;
  document.getElementById("usernameNav").innerText = username;

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";

  showQuestion();
}

/* QUIZ */
function showQuestion() {
  const q = mode === "fun"
    ? questions[currentQuestion]
    : codingQuestions[currentQuestion];

  document.getElementById("question").innerText = q.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option.text;

    btn.onclick = () => {
      playClick();
      selectAnswer(option.score);
    };

    optionsDiv.appendChild(btn);
  });

  updateProgress();
}

function selectAnswer(score) {
  if (mode === "coding") {
    score > 0 ? soundCorrect.play() : soundWrong.play();
  }

  if (mode === "fun") {
    totalScore += score;
    currentQuestion++;
    if (currentQuestion >= questions.length) {
      mode = "coding";
      currentQuestion = 0;
    }
  } else {
    codingScore += score;
    currentQuestion++;
  }

  if (
    (mode === "fun" && currentQuestion < questions.length) ||
    (mode === "coding" && currentQuestion < codingQuestions.length)
  ) {
    showQuestion();
  } else {
    showResult();
  }
}

/* RESULT */
function showResult() {
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "block";

  const badge = document.getElementById("badge");
  badge.src =
    codingScore <= 2
      ? "assets/badges/beginner.jpg"
      : codingScore <= 4
      ? "assets/badges/intermediate.jpg"
      : "assets/badges/pro.jpg";

  badge.style.animation = "none";
  void badge.offsetWidth;
  badge.style.animation = "badgePop 0.6s ease forwards";

  document.getElementById("result-title").innerText = "Hasil Kamu";
  document.getElementById("result-desc").innerText =
    `${username}\nSkor Coding: ${codingScore}`;
}

function updateProgress() {
  const total = questions.length + codingQuestions.length;
  const done =
    mode === "fun"
      ? currentQuestion
      : questions.length + currentQuestion;

  document.getElementById("progress-bar").style.width =
    (done / total) * 100 + "%";
}

