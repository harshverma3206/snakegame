import React, { use, useEffect, useRef, useState } from 'react'

const HeroPage = () => {

    //useRef Conditions
    const gameBoardRef = useRef()
    const isFirstRender = useRef(true)
    const startButtonRef = useRef()
    const restartButtonRef = useRef()
    const modalRef = useRef()
    const gameOverModalRef = useRef()
    const gameStartRef = useRef()
    const scoreRef = useRef()
    const highScoreRef = useRef()
    const timeRef = useRef()

    //useState Conditions
    const [row, setRow] = useState([])
    const [column, setColumn] = useState([])
    const [blockElements, setBlockElements] = useState([])

    //Global Variables
    let direction = 'down';
    let intervalId = null;
    let timeIntervalId = null;
    let score = 0;
    let time = `0-0`;
    let highScore = localStorage.getItem('highScore') || 0;


    //Generate food
    let food = {
        x: Math.floor(Math.random() * row),
        y: Math.floor(Math.random() * column)
    }

    //useEffect Conditions
    useEffect(() => {
        // Calculate the number of rows and columns based on the game board size
        const element = gameBoardRef.current;
        if (!element) return;

        const calculateGrid = () => {
            const blockHeight = 20
            const blockWidth = 20

            const rows = Math.floor(element.clientHeight / blockHeight);
            const columns = Math.floor(element.clientWidth / blockWidth);

            setRow(rows);
            setColumn(columns);
        };

        calculateGrid();

        // Array of board blocks
        const allBoxElements = document.querySelectorAll('.box');
        if (allBoxElements.length === 0) return;

        const block = [];
        allBoxElements.forEach((e) => {
            const row = e.dataset.row;
            const column = e.dataset.column;
            block[`${row}-${column}`] = e;
        })
        setBlockElements(block);

    }, [row, column])

    //Snake body coordinates
    let snake = [
        { x: 0, y: 13 }
    ]

    // Render Snake to gameboard
    const render = () => {
        console.log("Rendering...");

        highScoreRef.current.textContent = highScore;

        //Food rendering
        blockElements[`${food.x}-${food.y}`].classList.add('foodColor')

        //calculate snake head
        let snakeHead = null;

        //Calculate the new head position based on the current direction
        if (direction === 'right') {
            snakeHead = { x: snake[0].x, y: snake[0].y + 1 }
        } else if (direction === 'left') {
            snakeHead = { x: snake[0].x, y: snake[0].y - 1 }
        } else if (direction === 'down') {
            snakeHead = { x: snake[0].x + 1, y: snake[0].y }
        } else if (direction === 'up') {
            snakeHead = { x: snake[0].x - 1, y: snake[0].y }
        }

        //Control game over conditions
        if (snakeHead.x < 0 || snakeHead.x >= row || snakeHead.y < 0 || snakeHead.y >= column) {
            // alert('Game Over');
            clearInterval(intervalId)
            clearInterval(timeIntervalId)
            modalRef.current.style.display = 'flex';
            gameOverModalRef.current.style.display = 'flex';
            gameStartRef.current.style.display = 'none';
        }

        //food eating conditions
        if (snakeHead.x === food.x && snakeHead.y === food.y) {
            blockElements[`${food.x}-${food.y}`].classList.remove('foodColor')
            food = {
                x: Math.floor(Math.random() * row),
                y: Math.floor(Math.random() * column)
            }

            //Add new head to the snake body
            snake.unshift(snakeHead);

            score += 1;
            if (score > highScore) {
                highScoreRef.current.textContent = highScore;
                localStorage.setItem('highScore', highScore.toString());
                highScore = score;
            }
            scoreRef.current.textContent = score;
        }

        //Remove snake color from the tail segment
        snake.forEach((segment) => {
            blockElements[`${segment.x}-${segment.y}`].classList.remove('snakeColor')
        })

        snake.unshift(snakeHead);
        snake.pop();

        //fill snake color
        snake.forEach((segment) => {
            blockElements[`${segment.x}-${segment.y}`].classList.add('snakeColor')
        })
    }

    //Start Game
    const startGameHandler = () => {
        modalRef.current.style.display = 'none';
        intervalId = setInterval(() => {
            render()
        }, 200)

        timeIntervalId = setInterval(() => {
            let [min, sec] = time.split('-').map(Number)
            console.log(min, sec);

            sec += 1;
            if (sec === 60) {
                min += 1;
                sec = 0;
            } else {
                sec += 1
            }
            time = `${min}-${sec}`

            timeRef.current.textContent = time;
        }, 1000)
    }

    //Restart Game
    const restartHandler = () => {
        modalRef.current.style.display = 'none';

        score = 0;
        scoreRef.current.textContent = score;

        //Reset snake position
        snake = [
            { x: 3, y: 8 }
        ]

        //Reser Direction
        direction = 'down';

        //Reset snake color
        snake.forEach((segment) => {
            blockElements[`${segment.x}-${segment.y}`].classList.add('snakeColor')
        })

        //Remove food color
        blockElements[`${food.x}-${food.y}`].classList.remove('foodColor')

        // Reset food position
        food = {
            x: Math.floor(Math.random() * row),
            y: Math.floor(Math.random() * column)
        }

        //Add food color
        blockElements[`${food.x}-${food.y}`].classList.add('foodColor')

        //Start the game loop again
        intervalId = setInterval(() => {
            render()
        }, 200)

        //Start the timer again
        timeIntervalId = setInterval((e) => {

            time = `00-00`;

            let [min, sec] = time.split('-').map(Number)

            sec += 1;
            if (sec === 60) {
                min += 1;
                sec = 0;
            } else {
                sec += 1
            }
            time = `${min}-${sec}`

            timeRef.current.textContent = time;
        }, 1000)
    }

    //control the snake movement using arrow keys
    addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && direction !== 'left') {
            direction = 'right';
        } else if (e.key === 'ArrowLeft' && direction !== 'right') {
            direction = 'left';
        } else if (e.key === 'ArrowDown' && direction !== 'up') {
            direction = 'down';
        } else if (e.key === 'ArrowUp' && direction !== 'down') {
            direction = 'up';
        }
    })

    return (
        <div>
            {/* //Game Board */}
            <div className='py-10! px-2! lg:px-40! flex flex-col gap-10! h-screen'>
                <div className='flex flex-col items-center'>
                    <h2 className='text-4xl! text-center mb-8! lg:mb-15! font-bold!'>Snaky</h2>
                    <div className='flex flex-col lg:flex-row gap-3 px-8! items-center'>
                        <div className='border border-gray-300 py-2! px-5! rounded-2xl min-w-80 '><h1>High Score : <span ref={highScoreRef}> 0 </span></h1></div>
                        <div className='border border-gray-300 py-2! px-5! rounded-2xl min-w-80 '><h1>Score : <span ref={scoreRef}> 0 </span></h1></div>
                        <div className='border border-gray-300 py-2! px-5! rounded-2xl min-w-80 '><h1>Time : <span ref={timeRef}> 0-0 </span></h1></div>
                    </div>
                </div>
                <div ref={gameBoardRef} className='flex-1 grid grid-rows-[repeat(auto-fill,minmax(20px,1fr))] mx-5! lg:mx-53! bg-amber-800'>
                    {Array.from({ length: row }).map((_, i) => (
                        <div key={i} className='grid grid-cols-[repeat(auto-fill,minmax(20px,1fr))]'>
                            {Array.from({ length: column }).map((_, j) => (
                                <div
                                    data-row={i}
                                    data-column={j}
                                    key={j}
                                    style={{ height: "20px", width: "20px" }}
                                    className="box">
                                    {/* {`${i}-${j}`} */}
                                </div>
                            ))}
                        </div>
                    ))}

                </div>
            </div>

            {/* ModalBoard  */}
            <div ref={modalRef} className='h-screen w-full fixed top-0 bg-pink-500/5 backdrop-blur-xl flex items-center justify-center'>
                <div ref={gameStartRef} className='bg-white/90 rounded-2xl p-10! flex flex-col items-center gap-5!'>
                    <h3 className='text-2xl lg:text-3xl font-semibold'>Welcome to Snaky</h3>
                    <button ref={startButtonRef} onClick={() => {
                        startGameHandler()
                    }}>Start</button>
                </div>
                <div ref={gameOverModalRef} className='bg-white/90 rounded-2xl p-10! flex-col items-center gap-5! hidden'>
                    <h3 className='text-2xl lg:text-3xl font-semibold'>Game Over</h3>
                    <button ref={restartButtonRef} onClick={restartHandler}>
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HeroPage