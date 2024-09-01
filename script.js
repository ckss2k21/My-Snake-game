const gameArena = document.getElementById("game-arena");
const mobButtonDiv = document.querySelectorAll('.arrows');

let gameStarted = false;
const cellPadding = 20; //in pixel
let score = 0;
let highScore = 0;
let snake = [{r:300, c:100},{r:300, c:80},{r:300,c:60}]; // Intial position of snake
let food = {r:300, c:200}; // intial position of food () (15*20, 10*20) (15th row, 10th col)

let dc = cellPadding; //going right
let dr  = 0; // in the same row
 
function changeDirection(keyPress) {
    const isMovingDown = dr === cellPadding;
    const isMovingUp = dr === -cellPadding;
    const isMovingLeft = dc === -cellPadding;
    const isMovingRight = dc === cellPadding;
    if((keyPress ==='ArrowUp'  || keyPress ==='up') && !isMovingDown) {
        dc = 0;
        dr = -cellPadding;
    } 
    else if((keyPress === 'ArrowDown'  || keyPress ==='down') && !isMovingUp) {
        dc = 0;
        dr = cellPadding;
    }
    else if((keyPress === 'ArrowLeft' || keyPress ==='left') && !isMovingRight) {
        dc = -cellPadding;
        dr = 0;
    }
    else if((keyPress === 'ArrowRight' || keyPress ==='right') && !isMovingLeft) {
        dc = cellPadding;
        dr = 0;

    }
}
function changeDirectionMob(event) {
    
    const clickedArrow = event.target.getAttribute('id');
    changeDirection(clickedArrow);
}
function changeDirectionForDesktop(event) {
    const keyPress = event.key;
    changeDirection(keyPress)
    
}
function drawDiv(r,c,className) {
    let div = document.createElement("div");
    if(className ==='food-item') {
        div.className="food-item";
        div.style.top = r + "px";
        div.style.left = c + "px";
    }
    else
    {
        div.className="snake";
        div.style.top = r + "px";
        div.style.left = c + "px";
    }
    return div;
}

function generateRandomFood() {
    let row, col;
    do {
        row = Math.floor(Math.random() * 20) * cellPadding;
        col = Math.floor(Math.random() * 20) * cellPadding;
    } while(snake.some(snakeCell => snakeCell.x === row && snakeCell.y === col));
    food = { r: row, c: col };
    let foodDiv = drawDiv(row,col,'food-item');
    gameArena.appendChild(foodDiv);
}

function drawfoodAndSnake() {
    gameArena.innerHTML="";
    let foodDiv = drawDiv(food.r, food.c, 'food-item');
    gameArena.appendChild(foodDiv);
    for(let i = 0; i< snake.length; i++) {
        let snakeDiv = drawDiv(snake[i].r, snake[i].c,'snake');
        gameArena.appendChild(snakeDiv);
    }

}

function updateHighScoreInDB() {
    let dbHighScore = loadHighScore();
    if(dbHighScore <  highScore)
        localStorage.setItem("high-score", highScore);
}
function updateSnake() {
    let newHead = {r : snake[0].r + dr , c : snake[0].c + dc};
    snake.unshift(newHead); // add new element at the beging of array
    if(newHead.r === food.r && newHead.c === food.c) {
        score += 10;
        highScore += 10;
        updateHighScoreInDB();
        document.getElementsByClassName('food-item').innerHTML = "";
        document.getElementById('score').textContent=`Score : ${score}`;
        document.getElementById('high-score').textContent=`High Score : ${loadHighScore()}`;
        generateRandomFood();
        
    } else {
        snake.pop();
    }
}
function isGameOver() {
    for(let i = 1; i< snake.length; i++) {
        if(snake[0].r == snake[i].r && snake[0].c == snake[i].c)
        {
            return true;
        } 
    }
    let leftWall = snake[0].c < 0;
    let rightWall = snake[0].c > 400 - cellPadding;
    let upWall = snake[0].r < 0;
    let downWall = snake[0].r > 400 - cellPadding;
    return leftWall || rightWall || upWall || downWall;
}

function gameLoop(){
    var intervalId = setInterval(()=> {
        if(isGameOver()) {
            clearInterval(intervalId);
            gameStarted = false;
            document.getElementById('score-board-text').textContent="Game Over..!!";
            setTimeout(() => { location.reload() },4000);
            return;
        }
        updateSnake();
        drawfoodAndSnake();
    },500);
}
function startGame() {
    document.getElementById('start-game').style.display='none';
    if(!gameStarted) {
        gameStarted = true; 
        document.getElementById('score-board-text').textContent = "Game Running..!!";
        document.addEventListener('keydown',changeDirectionForDesktop);
        const mobButtonDiv = document.querySelectorAll('.arrow');
        mobButtonDiv.forEach((arrows) => {
            arrows.addEventListener("click",changeDirectionMob); 
        });
       
        gameLoop();
    }
}
function loadHighScore() {
    let hScore = document.getElementById('high-score');
    let score = localStorage.getItem('high-score');
    hScore.textContent =`High Score: ${score}`
    return score;
}

document.addEventListener("DOMContentLoaded", () => {

    function initGame() {
        let div = document.createElement('div');
        div.id ="score-board";
        let h2 = document.createElement('h2');
        h2.id ='score-board-text';
        h2.textContent ="Click Start Button";
        div.appendChild(h2);
        let scoreDiv = document.createElement('div');
        scoreDiv.className="scores";
        let highScore = document.createElement('h2');
        highScore.id = 'high-score';
        highScore.textContent=`High Scrore : 0`;
        scoreDiv.appendChild(highScore);
        let score = document.createElement('h2');
        score.id='score';
        score.textContent="Score : 0";
        scoreDiv.appendChild(score);
        div.appendChild(scoreDiv);
        document.body.insertBefore(div, gameArena);
        let button = document.createElement("button");
        button.id ="start-game";
        button.textContent="Start Game";
        document.body.appendChild(button);
        
        drawfoodAndSnake();
        button.addEventListener("click", startGame);

    }
    initGame();
    loadHighScore();

})

