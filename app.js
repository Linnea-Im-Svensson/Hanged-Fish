const menu = document.querySelector('.menu-container'),
      game = document.querySelector('.game-container'),
      startBtn = document.querySelector('.start-game'),
      wordDiv = document.querySelector('.word'),
      letterBtn = document.querySelectorAll('.letter-btn'),
      hangedMan = document.querySelector('.hanged-man'),
      resultContainer = document.querySelector('.result-container');

let guessedLetter = '',
    tries = 8;

async function fetchApi() {
  const response = await fetch('https://api.api-ninjas.com/v1/randomword/');

  if(response.ok){
    const data = await response.json();
    return data.word;
  } else {
    console.log('error');
  }
}

function toggle(div){
  div.classList.toggle('hide');
};

function generateEpmtyLetters(fetchedWord, place) {
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

function checkWinCondition(){

};

toggle(menu);

function newGame() {
  //reset
  guessedLetter = '',
  tries = 8;

  fetchApi().then(word => {
    console.log(word);
    const letterDiv = generateEpmtyLetters(word);
    wordDiv.innerHTML = letterDiv;
    generateHangedMan();

    letterBtn.forEach(letter => {
      let clicked = 0;
      
        letter.addEventListener('click', () => {
          clicked++;
          if (clicked < 2){
          guessedLetter = letter.className[0];
          const emptyLetters = document.querySelectorAll('.word > div')
          let status = false;
            emptyLetters.forEach(emptyLetter => {
              if (guessedLetter === emptyLetter.className[0]) {
                emptyLetter.firstElementChild.classList.remove('hide');
                status = true;
              }

              letter.classList.add('guessed');
            })
  
            if (!status) {
              tries--;
              updateHangedMan(tries);
            }
          }
        })
    })
  });
}

startBtn.addEventListener('click', () => {
  toggle(menu);
  toggle(game);
  newGame();
});