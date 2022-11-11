const menu = document.querySelector('.menu-container'),
      game = document.querySelector('.game-container'),
      startBtn = document.querySelector('.start-game'),
      wordDiv = document.querySelector('.word'),
      hangedMan = document.querySelector('.hanged-man'),
      resultContainer = document.querySelector('.result-container'),
      resultText = document.querySelector('.result'),
      playAgainBtn = document.querySelector('.play-again'),
      buttonDiv = document.querySelector('.letters');

let guessedLetter = '',
    tries = 8;

async function fetchApi() {
  const response = await fetch('https://api.api-ninjas.com/v1/randomword/');

  if(response.ok){
    const data = await response.json();
    return data.word.toLowerCase();
  } else {
    console.log('error');
  }
}

function toggle(div){
  div.classList.toggle('hide');
};

//Generate the empty spaces for each letter in the word
function generateEmptyLetters(fetchedWord) {
  let letterDiv = '';
  for (let i = 0; i < fetchedWord.length; i++){
    letterDiv += `
      <div class="${fetchedWord[i]}">
        <div class="letter hide">${fetchedWord[i]}</div>
        <div class="line"></div>
      </div>
    `;
  }
  return letterDiv;
};

function generateHangedMan() {
  hangedMan.innerHTML = tries;
};

function updateHangedMan(tries) {
  hangedMan.innerHTML = tries;
};

//Check to see if player won or lost
function checkWinCondition(){
  let win = true;
  const divList = document.querySelectorAll('.word > div');
  divList.forEach(div => {
    if (div.firstElementChild.classList[1] === 'hide') {
      win = false;
    }
  });

  if (win) {
    resultText.innerText = 'You Won!';
  } else {
    resultText.innerText = 'You Lost';
  }

  toggle(game);
  toggle(resultContainer);
};

function generateButtons(){
  buttonDiv.innerHTML = `
    <button class="a letter-btn">A</button>
    <button class="b letter-btn">B</button>
    <button class="c letter-btn">C</button>
    <button class="d letter-btn">D</button>
    <button class="e letter-btn">E</button>
    <button class="f letter-btn">F</button>
    <button class="g letter-btn">G</button>
    <button class="h letter-btn">H</button>
    <button class="i letter-btn">I</button>
    <button class="j letter-btn">J</button>
    <button class="k letter-btn">K</button>
    <button class="l letter-btn">L</button>
    <button class="m letter-btn">M</button>
    <button class="n letter-btn">N</button>
    <button class="o letter-btn">O</button>
    <button class="p letter-btn">P</button>
    <button class="q letter-btn">Q</button>
    <button class="r letter-btn">R</button>
    <button class="s letter-btn">S</button>
    <button class="t letter-btn">T</button>
    <button class="u letter-btn">U</button>
    <button class="v letter-btn">V</button>
    <button class="w letter-btn">W</button>
    <button class="x letter-btn">X</button>
    <button class="y letter-btn">Y</button>
    <button class="z letter-btn">Z</button>
  `;
}

function newGame() {
  const letterBtn = document.querySelectorAll('.letter-btn');
  //reset
  guessedLetter = '',
  tries = 8,
  flippedLetters = 0,
  resultText.innerText = '';

  letterBtn.forEach(div => {
    div.classList.remove('guessed');
  });

  fetchApi().then(word => {
    console.log(word);
    const letterDiv = generateEmptyLetters(word);
    wordDiv.innerHTML = letterDiv;
    generateHangedMan();

    letterBtn.forEach(letter => {
      let clicked = 0;
      
      letter.addEventListener('click', (e) => {
        clicked++;
        if (clicked < 2){
        guessedLetter = letter.className[0];
        const emptyLetters = document.querySelectorAll('.word > div')
        let status = false;
          emptyLetters.forEach(emptyLetter => {
            if (guessedLetter === emptyLetter.className[0]) {
              emptyLetter.firstElementChild.classList.remove('hide');
              flippedLetters++;
              status = true;
            }

            letter.classList.add('guessed');
          })

          if (!status) {
            tries--;
            updateHangedMan(tries);
          }

          if(tries === 0){
            checkWinCondition();
          } else if(flippedLetters == word.length) {
            checkWinCondition();
          }
        }
        e.preventDefault();
        // e.stopImmediatePropagation();
        e.stopPropagation();
      })
    })
  });
}

//Initiates the game
toggle(menu);

startBtn.addEventListener('click', () => {
  generateButtons();
  newGame();
  toggle(menu);
  toggle(game);
});

playAgainBtn.addEventListener('click', () => {
  generateButtons();
  newGame();
  toggle(resultContainer);
  toggle(game);
})