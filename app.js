const menu = document.querySelector('.menu-container'),
      game = document.querySelector('.game-container'),
      startBtn = document.querySelector('.start-game'),
      wordDiv = document.querySelector('.word'),
      hangedMan = document.querySelector('.hanged-man'),
      resultContainer = document.querySelector('.result-container'),
      resultText = document.querySelector('.result'),
      playAgainBtn = document.querySelector('.play-again'),
      buttonDiv = document.querySelector('.letters'),
      answerDiv = document.querySelector('.answer');

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
function checkWinCondition(answer){
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

  answerDiv.innerHTML = `
  <h4>The answer was:<h4>
  <h1>${answer}</h1>
  `;

  toggle(game);
  toggle(resultContainer);
};

function generateButtons(){
  //Resets buttons before adding new
  buttonDiv.innerHTML = '';

  for(let i = 97; i <= 122; i++){
    buttonDiv.innerHTML += `
      <button class="${String.fromCharCode(i)} letter-btn">${String.fromCharCode(i).toUpperCase()}</button>
    `;
  }
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
            checkWinCondition(word);
          } else if(flippedLetters == word.length) {
            checkWinCondition(word);
          }
        }
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