// God forgive me for this awful code I wrote
(function ($) {
    $(document).ready(() => {
        const EASY_SPEED = 150;
        const NORMAL_SPEED = 100;
        const HARD_SPEED = 80;

        let currentDifficulty = 'easy';
        let isGameOver = false;

        const difficulty = {
            easy: EASY_SPEED,
            normal: NORMAL_SPEED,
            hard: HARD_SPEED,
        };
        const easyElement = $('#easy');
        const normalElement = $('#normal');
        const hardElement = $('#hard');

        const leftArrowClick = () => {
            switch (currentDifficulty) {
                case 'easy':
                    break;
                case 'normal':
                    normalElement.css('opacity', '0');
                    easyElement.css('opacity', '1');
                    currentDifficulty = 'easy';
                    break;
                case 'hard':
                    hardElement.css('opacity', '0');
                    normalElement.css('opacity', '1');
                    currentDifficulty = 'normal';
                    break;
            }
        };

        const rightArrowClick = () => {
            switch (currentDifficulty) {
                case 'easy':
                    easyElement.css('opacity', '0');
                    normalElement.css('opacity', '1');
                    currentDifficulty = 'normal';
                    break;
                case 'normal':
                    normalElement.css('opacity', '0');
                    hardElement.css('opacity', '1');
                    currentDifficulty = 'hard';
                    break;
                case 'hard':
                    break;
            }
        };

        $('#left-arrow').click(leftArrowClick);
        $('#right-arrow').click(rightArrowClick);

        $(document).keydown((event) => {
            if (event.keyCode === 13) {
                $('.game-menu-wrapper').css('display', 'none');
                $('.game-wrapper').css({ 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' });
                start();
            } else if (event.keyCode === 37) {
                leftArrowClick();
            } else if (event.keyCode === 39) {
                rightArrowClick();
            }
        });

        const start = () => {
            $(document).off('keydown');
            const cvs = $('#snake')[0];
            const canvasContext = cvs.getContext('2d');

            isGameOver = false;
            // Create the unit
            const box = 32;

            // Load images

            const ground = new Image();
            ground.src = 'img/ground.png';

            const foodImg = new Image();
            foodImg.src = 'img/food.png';

            const fastFood = new Image();
            fastFood.src = 'img/food-fast.png';

            // Create the snake

            let snake = [];
            snake[0] = {
                x: 9 * box,
                y: 10 * box,
            };

            // Create food

            let food = {
                x: Math.floor(Math.random() * 17 + 1) * box,
                y: Math.floor(Math.random() * 15 + 3) * box,
            };

            let foodChance = 0;

            // Create the score var

            let score = 0;
            let applesEaten = 0;
            let pearsEaten = 0;

            // Control the snake
            let direction;
            // movingDirection is needed for a but where pressing two buttons faster than the canvas rerender will go from in the opposite direction and will kill the snake
            let movingDirection;
            const getDirection = (event) => {
                if (event.keyCode === 37 && direction !== 'RIGHT' && movingDirection !== 'RIGHT') {
                    direction = 'LEFT';
                } else if (event.keyCode === 38 && direction !== 'DOWN' && movingDirection !== 'DOWN') {
                    direction = 'UP';
                } else if (event.keyCode === 39 && direction !== 'LEFT' && movingDirection !== 'LEFT') {
                    direction = 'RIGHT';
                } else if (event.keyCode === 40 && direction !== 'UP' && movingDirection !== 'UP') {
                    direction = 'DOWN';
                }
            };
            const possiblePlacements = {
                0: { x: 1 * box, y: 2 * box }, // placement: x + 4 | movement: y + 18 
                1: { x: 18 * box, y: 17 * box }, // placement: y - 4 | movement x - 18
                2: { x: 17 * box, y: 18 * box }, // placement: x - 4 | movement y - 18
                3: { x: 0, y: 3 * box }, // placement: y + 4 | movement x + 18
            };
            let wallPlacement = 0;
            setInterval(() => {
                wallPlacement = Math.floor(Math.random() * 4);
                // if (direction) {
                //     setTimeout(() => {

                //     }, 3000);
                // }
            }, 2000);

            // Check collision
            const collision = (head, snake) =>
                snake.some((bodyPart) => head.x === bodyPart.x && head.y === bodyPart.y);

            const spawnFood = () => {
                let availableX = Math.floor(Math.random() * 17 + 1) * box;
                let availableY = Math.floor(Math.random() * 15 + 3) * box;

                while (
                    !snake.every((snakeBody) => snakeBody.x !== availableX && snakeBody.y !== availableY)
                ) {
                    availableX = Math.floor(Math.random() * 17 + 1) * box;
                    availableY = Math.floor(Math.random() * 15 + 3) * box;
                }

                return [availableX, availableY];
            };

            $(document).keydown(getDirection);
            let test = true;
            // draw everything into the canvas
            const draw = () => {
                canvasContext.drawImage(ground, 0, 0);

                // const fillStyle = test ? 'black' : 'red';
                // canvasContext.fillStyle = fillStyle;
                // canvasContext.fillRect(possiblePlacements[wallPlacement].x, possiblePlacements[wallPlacement].y, box, box);
                // test = !test;

                for (let i = 0; i < snake.length; i += 1) {
                    canvasContext.fillStyle = i === 0 ? 'green' : 'white';
                    canvasContext.fillRect(snake[i].x, snake[i].y, box, box);

                    canvasContext.strokeStyle = 'red';
                    canvasContext.strokeRect(snake[i].x, snake[i].y, box, box);
                }

                if (foodChance < 76) {
                    canvasContext.drawImage(foodImg, food.x, food.y);
                } else {
                    canvasContext.drawImage(fastFood, food.x, food.y, box, box);
                }

                // Old head position
                let snakeX = snake[0].x;
                let snakeY = snake[0].y;

                // Which direction
                if (direction === 'LEFT') {
                    snakeX -= box;
                    movingDirection = 'LEFT';
                } else if (direction === 'UP') {
                    snakeY -= box;
                    movingDirection = 'UP';
                } else if (direction === 'RIGHT') {
                    snakeX += box;
                    movingDirection = 'RIGHT';
                } else if (direction === 'DOWN') {
                    snakeY += box;
                    movingDirection = 'DOWN';
                }

                // If the snake eats the food
                if (snakeX === food.x && snakeY === food.y) {
                    if (foodChance > 75) {
                        score += 2;
                        pearsEaten += 1;
                        difficulty[currentDifficulty] -= 50;
                        setTimeout(() => {
                            difficulty[currentDifficulty] = EASY_SPEED;
                        }, 2000);
                    } else {
                        applesEaten += 1;
                        score += 1;
                    }
                    const [x, y] = spawnFood();
                    food = { x, y };
                    foodChance = Math.random() * 100;

                    // We don't remove the tail
                } else {
                    // Remove the tail
                    snake.pop();
                }

                // Add new head
                let newHead = {
                    x: snakeX,
                    y: snakeY,
                };

                canvasContext.fillStyle = 'white';
                canvasContext.font = '45px Changa one';
                canvasContext.fillText(score, 2.5 * box, 1.6 * box);

                // Game over
                if (snakeX < box || snakeX > 17 * box ||
                    snakeY < 3 * box || snakeY > 17 * box ||
                    collision(newHead, snake)) {
                    $('.game-over').css('visibility', 'visible');
                    $('.game-over-score').html(score);
                    $('.fast-food-score').html(pearsEaten);
                    $('.food-score').html(applesEaten);
                    $('.fast-food-final-score').html(pearsEaten * 2);
                    $('.food-final-score').html(applesEaten);
                    isGameOver = true;
                    return;
                }

                snake.unshift(newHead);

                setTimeout(draw, difficulty[currentDifficulty]);
            };

            draw();
        };

        $(document).keypress((event) => {
            if (event.keyCode === 13 && isGameOver) {
                $('.game-over').css('visibility', 'hidden');
                start();
            }
        });

    });

})(jQuery);
