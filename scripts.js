document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.board')
    const scoreDisplay = document.getElementById('score')
    const width = 8
    const squares = []
    let score = 0
    
    let active = false
    let currentX
    let currentY
    let initialX
    let initialY
    let xOffset = 0
    let yOffset = 0
    
    const candyColors = [
        'url(images/red-candy.png)',
        'url(images/yellow-candy.png)',
        'url(images/orange-candy.png)',
        'url(images/purple-candy.png)',
        'url(images/green-candy.png)',
        'url(images/blue-candy.png)'
      ]
    
    
    //create your board
    function createBoard() {
      for (let i = 0; i < width*width; i++) {
        const square = document.createElement('div')
        square.setAttribute('draggable', true)
        square.setAttribute('id', i)
        let randomColor = Math.floor(Math.random() * candyColors.length)
        square.style.backgroundImage = candyColors[randomColor]
        grid.appendChild(square)
        squares.push(square)
      }
    }
    createBoard()
    
    // Dragging the Candy
    let colorBeingDragged
    let colorBeingReplaced
    let squareIdBeingDragged
    let squareIdBeingReplaced
    
    // Drag on pc
    squares.forEach(square => square.addEventListener('dragstart', dragStart))
    squares.forEach(square => square.addEventListener('dragend', dragEnd))
    squares.forEach(square => square.addEventListener('dragover', dragOver))
    squares.forEach(square => square.addEventListener('dragenter', dragEnter))
    squares.forEach(square => square.addEventListener('drageleave', dragLeave))
    squares.forEach(square => square.addEventListener('drop', dragDrop))
    
    // Touch drag on mobile
    squares.forEach(square => square.addEventListener('touchstart', dragStart, false))
    squares.forEach(square => square.addEventListener('touchend', dragEnd, false))
    squares.forEach(square => square.addEventListener('touchmove', dragOver, false))


    function dragStart(e){
      if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX - xOffset
        initialY = e.touches[0].clientY - yOffset
      } else {
        initialX = e.clientX - xOffset
        initialY = e.clientY - yOffset
      }
      if (e.target === squares[squareIdBeingDragged]) {
        active = true
      }
        colorBeingDragged = this.style.backgroundImage
        squareIdBeingDragged = parseInt(this.id)
        console.log('Touch started')
        // this.style.backgroundImage = ''
    }
    
    function dragOver(e) {
        if (active) {
          e.preventDefault()
          
          if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX - initialX
            currentY = e.touches[0]/clientY - initialY
          } else {
            currentX = e.clientX - initialX
            currentY = e.clientY - initialY
          }
          xOffset = currentX
          yOffset = currentY

          setTranslate(currentX, currentY, squares[squareIdBeingDragged])
        }
    }
    
    function setTranslate(xPos, yPos, el) {
      el.style.transform = "translated3d(" + xPos + "px, " + yPos + "px, 0)"
    }
    function dragEnter(e) {
        e.preventDefault()
    }
    
    function dragLeave() {
        this.style.backgroundImage = ''
    }
    
    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage
        squareIdBeingReplaced = parseInt(this.id)
        this.style.backgroundImage = colorBeingDragged
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced
    }
    
    function dragEnd(e) {
        initialX = currentX
        initialY = currentY

        active = false
        //What is a valid move?
        let validMoves = [squareIdBeingDragged -1 , squareIdBeingDragged -width, squareIdBeingDragged +1, squareIdBeingDragged +width]
        let validMove = validMoves.includes(squareIdBeingReplaced)
    
        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null
        }  else if (squareIdBeingReplaced && !validMove) {
           squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced
           squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
        } else  squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
    }
    
    //drop candies once some have been cleared
    function moveIntoSquareBelow() {
        for (i = 0; i < 55; i ++) {
            if(squares[i + width].style.backgroundImage === '') {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage
                squares[i].style.backgroundImage = ''
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
                const isFirstRow = firstRow.includes(i)
                if (isFirstRow && (squares[i].style.backgroundImage === '')) {
                  let randomColor = Math.floor(Math.random() * candyColors.length)
                  squares[i].style.backgroundImage = candyColors[randomColor]
                }
            }
        }
    }
    
    
    ///Checking for Matches
    //for row of Four
      function checkRowForFour() {
        for (i = 0; i < 60; i ++) {
          let rowOfFour = [i, i+1, i+2, i+3]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
          const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
          if (notValid.includes(i)) continue
    
          if(rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 4
            scoreDisplay.innerHTML = score
            rowOfFour.forEach(index => {
            squares[index].style.backgroundImage = ''
            })
          }
        }
      }
      checkRowForFour()
    
    //for column of Four
      function checkColumnForFour() {
        for (i = 0; i < 39; i ++) {
          let columnOfFour = [i, i+width, i+width*2, i+width*3]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
          if(columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 4
            scoreDisplay.innerHTML = score
            columnOfFour.forEach(index => {
            squares[index].style.backgroundImage = ''
            })
          }
        }
      }
    checkColumnForFour()
    
      //for row of Three
      function checkRowForThree() {
        for (i = 0; i < 61; i ++) {
          let rowOfThree = [i, i+1, i+2]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
          const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
          if (notValid.includes(i)) continue
    
          if(rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 3
            scoreDisplay.innerHTML = score
            rowOfThree.forEach(index => {
            squares[index].style.backgroundImage = ''
            })
          }
        }
      }
      checkRowForThree()
    
    //for column of Three
      function checkColumnForThree() {
        for (i = 0; i < 47; i ++) {
          let columnOfThree = [i, i+width, i+width*2]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
          if(columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 3
            scoreDisplay.innerHTML = score
            columnOfThree.forEach(index => {
            squares[index].style.backgroundImage = ''
            })
          }
        }
      }
    checkColumnForThree()
    
    // Checks carried out indefintely - Add Butotn to clear interval for best practise
    window.setInterval(function(){
        checkRowForFour()
        checkColumnForFour()
        checkRowForThree()
        checkColumnForThree()
        moveIntoSquareBelow()
    }, 100);
})