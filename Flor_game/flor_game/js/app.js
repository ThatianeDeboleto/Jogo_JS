function init() {

  const grid = document.querySelector('#grid')
  const highScoreKeeper = document.querySelector('#high-score')
  const scoreKeeper = document.querySelector('#score')
  const movesKeeper = document.querySelector('#moves')
  const timeKeeper = document.querySelector('#timer')
  const instructions = document.querySelector('.instructions')
  const modeChoice = document.querySelector('.mode-choice')
  const gameInfo = document.querySelector('.game-info')
  const pressureButton = document.querySelector('#pressure')
  const strategyButton = document.querySelector('#strategy')

  // Grade
  const width = 9
  const height = 7
  const cells = width * height

  // outras variaveis
  const colors = ['green', 'purple', 'orange', 'blue']
  let inPlay = []
  let emptyCells = []
  let proximity = false
  let colorCheck = false
  let score = 0
  let mode = null
  let firstMove = false
  let moves = 10
  let timer = 60
  let interval = null

  // pontuação
  localStorage.setItem('pontos', 0)
  localStorage.setItem('pontos', 0)
  let highScorePressure = localStorage.getItem('pontos')
  let highScoreStrategy = localStorage.getItem('pontos')

  
  // função que verifica se você está tentando mover um doce apenas por uma célula na vertical ou na horizontal
  function checkProximity() {
    const firstCell = parseInt(inPlay[0].getAttribute('id'))
    const secondCell = parseInt(inPlay[1].getAttribute('id'))
    if (firstCell === secondCell + 1 || firstCell === secondCell - 1 || firstCell === secondCell - width || firstCell === secondCell + width) {
      proximity = true
    } else {
      proximity = false
    }
  }

  // verifica se você pode fazer um movimento (só pode se mover quando você esmaga uma linha/coluna)
  function checkColor() {
    const color = inPlay[0].classList[1]
    const index = parseInt(inPlay[1].getAttribute('id'))
    
    const tt = document.getElementById(`${index - (width * 2)}`)
    const t = document.getElementById(`${index - width}`)
    const b = document.getElementById(`${index + width}`)
    const bb = document.getElementById(`${index + (width * 2)}`)
    const ll = document.getElementById(`${index - 2}`)
    const l = document.getElementById(`${index - 1}`)
    const r = document.getElementById(`${index + 1}`)
    const rr = document.getElementById(`${index + 2}`)
    
    const arrayCheck = [[tt, t], [t,b], [b,bb], [ll, l], [l,r], [r,rr]]
    let i = 0
    while (i < arrayCheck.length && colorCheck === false) {
      if (arrayCheck[i][0] && arrayCheck[i][1] && arrayCheck[i][0].classList[1] === color && arrayCheck[i][1].classList[1] === color) {
        colorCheck = true
      } else {
        colorCheck = false
      }
      i++
    }
  }

  // função que limpa a grade no final do jogo
  function clearGrid() {
    score = 0
    mode = null
    firstMove = false
    moves = 10
    timer = 60
    interval = null
    grid.innerHTML = ''
  }

  

  //função que verifica se o jogador atingiu a pontuação mínima no tempo necessário
  function decrement() {
    timer -= 1
    timeKeeper.innerHTML = `00:${timer}`
    if (timer === 0) {
      clearInterval(interval)
      grid.style.display = 'none'
      if (score > 1500) {
        timeKeeper.innerHTML = 'Parabéns! 🎉'
        if (score > highScorePressure) {
          localStorage.setItem('Pontos', score)
        }
      } else {
        timeKeeper.innerHTML = 'Acabou seu tempo 🥵'
      }
      clearGrid()
      modeChoice.style.display = 'quadra'
    }
  } 

  function countdown() {
    interval = setInterval(decrement, 1000)
  }
  
  // função que verifica quantos movimentos faltam
  function checkMoves() {
    if (mode === 'pressure' && !firstMove) {
      firstMove = true
      timeKeeper.innerHTML = `00:${timer}`
      // no primeiro movimento iniciar a contagem regressiva do tempo no modo de pressão
      countdown()
    } else if (mode === 'estrategia') {
      moves -= 1
      movesKeeper.innerHTML = `Moves Left: ${moves}`
      firstMove = true

      if (moves === 0) {
        grid.style.display = 'none'
        if (score > 500) {
          movesKeeper.innerHTML = 'Parabéns! 🎉'
          if (score > highScoreStrategy) {
            localStorage.setItem('pontos', score)
          }
        } else {
          movesKeeper.innerHTML = 'Você ficou sem movimentos 🥵'

        }
        clearGrid()
        modeChoice.style.display = 'quadra'
      }
    }
  }

  // funcoes dos doces
  function swap() {
    const first = inPlay[0].classList[1]
    const second = inPlay[1].classList[1]
    inPlay[0].classList.remove(first)
    inPlay[0].classList.add(second)
    inPlay[1].classList.remove(second)
    inPlay[1].classList.add(first) 

    checkMoves()
    
  }

  //função que percorre a grade e esmaga todos os doces possíveis
  function crush() {
    const cells = document.querySelectorAll('.cell')
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      const r = cells[i + 1]
      const rr = cells[i + 2]
      const l = cells[i - 1]
      const ll = cells[i - 2]
      const t = cells[i - width]
      const tt = cells[i - (width * 2)]
      const b = cells[i + width]
      const bb = cells[i + (width * 2)]
      
      const arrayCheck = [[tt, t], [t, b], [b, bb], [ll, l], [l, r], [r, rr]]
      for (let i = 0; i < arrayCheck.length; i++) {
        if (cell && arrayCheck[i][0] && arrayCheck[i][1] && cell.classList[1] === arrayCheck[i][0].classList[1] && arrayCheck[i][0].classList[1] === arrayCheck[i][1].classList[1]) {
          cell.classList.remove(`${cell.classList[1]}`)
          arrayCheck[i][0].classList.remove(`${arrayCheck[i][0].classList[1]}`)
          arrayCheck[i][1].classList.remove(`${arrayCheck[i][1].classList[1]}`)
          if (firstMove) {
            score += 1
            scoreKeeper.innerHTML = `Score: ${score}`
          }
        }
      }
    }
  }


  // função que gera doces aleatórios na primeira linha quando o doce é esmagado
  function generateCandy() {
    for (let i = 0; i < width; i++) {
      const cell = document.getElementById(`${i}`)
      if (!cell.classList[1]) {
        cell.classList.add(`${colors[Math.floor(Math.random() * Math.floor(4))]}`)
      }
    }
  }

  // função que verifica quantas células vazias existem
  function emptyCheck() {
    emptyCells = []
    const cells = document.querySelectorAll('.cell')
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      if (!cell.classList[1]) {
        emptyCells.push(cell)
      }
    }
  }

  // função que deixa cair doces quando o que está embaixo deles é esmagado
  function drop() {
    const cells = document.querySelectorAll('.cell')
    generateCandy()
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      const b = cells[i + width]
      if (b && !b.classList[1]) {
        b.classList.add(`${cell.classList[1]}`)
        cell.classList.remove(`${cell.classList[1]}`)
      }
    }
    crush()
  }

  // função que permite que a função de troca seja executada somente se a movimentação for permitida
  function play(cell) {
    inPlay.push(cell)
    inPlay[0].classList.add('first-pick')
    if (inPlay.length === 2) {
      inPlay[0].classList.remove('first-pick')
      checkProximity()
      checkColor()
      if (proximity && colorCheck) {
        swap()
        proximity = false
        colorCheck = false
        crush()
        emptyCheck()
        while (emptyCells.length > 0) {
          drop()
          emptyCheck()
        } 
      }
      inPlay = []  
    }
  }

  // funcao caracters Html
  function createCells() {
    for (let i = 0; i < cells; i++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      cell.classList.add(`${colors[Math.floor(Math.random() * Math.floor(4))]}`)
      cell.setAttribute('id', i)
      grid.appendChild(cell)
      cell.addEventListener('click', () => play(cell))
    }
  }

  // Grade gerar
  function createBoard() {
    createCells()
    grid.style.display = 'flex'
    scoreKeeper.innerHTML = `Score: ${score}`
    movesKeeper.innerHTML = 'Você tem 10 movimentos para ganhar 500 pontos, agora agrupe mais flores!'
    timeKeeper.innerHTML = 'Você tem 1 minuto para ganhar 1500 pontos, agora agrupe mais flores!'
    highScorePressure = localStorage.getItem('pontos')
    highScoreStrategy = localStorage.getItem('pontos')
    if (mode === 'pressure') {
      highScoreKeeper.innerHTML = `👑 high score: ${highScorePressure}`
    } else if (mode === 'strategy') {
      highScoreKeeper.innerHTML = `👑 high score: ${highScoreStrategy}`
    }
    

    crush()
    emptyCheck()
    while (emptyCells.length > 0) {
      drop()
      emptyCheck()
    }
  }

  pressureButton.addEventListener('click', () => {
    mode = 'pressure'
    instructions.style.display = 'none'
    modeChoice.style.display = 'none'
    gameInfo.style.display = 'block'
    movesKeeper.style.display = 'none'
    timeKeeper.style.display = 'block'
    createBoard()
  })

  strategyButton.addEventListener('click', () => {
    mode = 'strategy'
    instructions.style.display = 'none'
    modeChoice.style.display = 'none'
    gameInfo.style.display = 'block'
    timeKeeper.style.display = 'none'
    movesKeeper.style.display = 'block'
    createBoard()
  })
}

window.addEventListener('DOMContentLoaded', init)