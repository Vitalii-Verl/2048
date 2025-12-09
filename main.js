document.addEventListener('DOMContentLoaded', ()=>{
  
  const gameGrid = document.querySelector('.game-grid')
  const currentScoreElement = document.querySelector('.current-score')
  const highScoreElement = document.querySelector('.high-score')
  const gameOverElement = document.querySelector('.game-over')

  const btnUp = document.querySelector('.up')
  const btnDown = document.querySelector('.down')
  const btnRight = document.querySelector('.right')
  const btnLeft = document.querySelector('.left')

  btnUp.addEventListener('click', ()=>{move('ArrowUp')})
  btnDown.addEventListener('click', ()=>{move('ArrowDown')})
  btnRight.addEventListener('click', ()=>{move('ArrowRight')})
  btnLeft.addEventListener('click', ()=>{move('ArrowLeft')})

  const SIZE = 4
  let board = []
  let currentScore = 0
  let highScore = localStorage.getItem('2048-highScore') || 0
  highScoreElement.textContent = highScore

  function countScore(){
    let score = 0
    for(let i = 0; i < SIZE; i++){
      for(let j = 0; j < SIZE; j++){
        score += board[i][j]
      }
    }
    return score
  }

  function updateScore(value) {
    currentScore = value
    currentScoreElement.textContent = currentScore

    if (currentScore > highScore) {
      highScore = currentScore
      highScoreElement.textContent = highScore
      localStorage.setItem('2048-highScore', highScore)
    }
  }

  function restartGame() {
    currentScore = 0
    currentScore.textContent = '0'
    gameOverElement.style.display = 'none'
    initializeGame()
  }

  function initializeGame() {
    board = [...Array(SIZE)].map(()=> Array(SIZE).fill(0))

    placeRandom()
    placeRandom()
    renderBoard()
  }

  function renderBoard() {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`)
        const prevValue = cell.dataset.value
        const currentValue = board[i][j]

        if (currentValue !== 0) {
          cell.dataset.value = currentValue
          cell.textContent = currentValue
          if (currentValue !== parseInt(prevValue) && !cell.classList.contains('new-tile')) {
            cell.classList.add('merged-tile')
          }
        } else {
          cell.textContent = ''
          delete cell.dataset.value
          cell.classList.remove('merged-tile')
        }

      }
    }

    updateScore(countScore())

    setTimeout(()=>{
      const cells = document.querySelectorAll('.geid-cell')
      cells.forEach(cell => {
        cell.classList.remove('merged-tile', 'new-tile')
      })
    }, 300)
  }

  function placeRandom(){
    const available = []

    for(let i = 0; i < SIZE; i++){
      for(let j = 0; j < SIZE; j++){
        if(board[i][j] === 0){
          available.push({i, j})
        }
      }
    }
    if(available.length > 0){
      const randomCell = available[Math.floor(Math.random() * available.length)]
      board[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4
      const cell = document.querySelector(`[data-row="${randomCell.i}"][data-col="${randomCell.j}"]`)
      cell.classList.add('new-tile')
    }
  }

  function btnControl(){
  }

  function move(direction){
    let hasChenged = false
    if(direction === 'ArrowUp' || direction === 'ArrowDown'){
      for(let j = 0; j< SIZE; j++){
        const column = [...Array(SIZE)].map((_, i)=> board[i][j])
        const newColumn = transform(column, direction === 'ArrowUp')
        for(let i = 0; i < SIZE; i++){
          if(board[i][j] !== newColumn[i]){
            hasChenged = true
            board[i][j] = newColumn[i]
          }
        }
      }
    }
    else if(direction === 'ArrowLeft' || direction === 'ArrowRight'){
      for(let i = 0; i <SIZE; i++){
        const row = board[i]
        const newRow = transform(row, direction === 'ArrowLeft')
        if(row.join(',') !== newRow.join(',')){
          hasChenged = true
          board[i] = newRow
        }
      }
    }
    if(hasChenged){
      placeRandom()
      renderBoard()
      checkGameOver()
    }
  }

  function transform(line, moveTowardStart){
    let newLine = line.filter(cell => cell !== 0)
    if(!moveTowardStart){
      newLine.reverse()
    }
    for(let i = 0; i < newLine.length - 1; i++){
      if(newLine[i] === newLine[i + 1]){
        newLine[i] *= 2
        // updateScore(newLine[i])
        newLine.splice(i +1, 1)
      }
    }
    while(newLine.length < SIZE){
      newLine.push(0)
    }
    if(!moveTowardStart){
      newLine.reverse()
    }
    return newLine
  }

  function checkGameOver(){
    for(let i = 0; i < SIZE; i++){
      for(let j = 0; j < SIZE; j++){
        if(board[i][j] === 0){
          return
        }
        if(j < SIZE - 1 && board[i][j] === board[i][j + 1]){
          return
        }
        if(i < SIZE - 1 && board[i][j] === board[i + 1][j]){
          return
        }
      }
    }
    gameOverElement.style.display = 'flex'
  }

  document.addEventListener('keydown', event => {
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)){
      move(event.key)
    }
  })

  document.querySelector('.restart-game').addEventListener('click', restartGame)
  initializeGame()

})