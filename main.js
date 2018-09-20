const gol = function () {
    let width = 30;
    let height = 30;
    let scale = 10;
    let field = [];
    let fieldBuffer = [];
    let pause = true;

    const aliveColor = '#0f0';
    const deadColor = '#000';
    const canvas = document.getElementById('field');
    const context = canvas.getContext('2d');


    const translateX = function (x) {
        const w = width - 1;
        return x < 0 ? w + x : x > w ? x - w : x;
    };

    const translateY = function (y) {
        const h = height - 1;
        return y < 0 ? h + y : y > h ? y - h : y;
    };

    const drawCell = function (x, y) {
        context.fillStyle = aliveColor;
        context.fillRect(translateX(x) * scale, translateY(y) * scale, scale, scale);
    };

    const eraseCell = function (x, y) {
        context.fillStyle = deadColor;
        context.fillRect(translateX(x) * scale, translateY(y) * scale, scale, scale);
    };

    const createField = function () {
        for (let i = 0; i < width; i++) {
            field.push([]);
            fieldBuffer.push([]);
            for (let j = 0; j < height; j++) {
                field[i].push(false);
                fieldBuffer[i].push(false);
            }
        }
    };

    const fillRandom = function () {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                field[i][j] = fieldBuffer[i][j] = !!Math.round(Math.random());
            }
        }
    };

    const eraseField = function () {
        context.fillStyle = deadColor;
        context.fillRect(0, 0, width * scale, height * scale);
    };

    const drawField = function () {
        eraseField();
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                field[i][j] && drawCell(i, j);
            }
        }
    };

    const getAliveNumber = function (x, y) {
        let alive = -field[translateX(x)][translateY(y)];
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (field[translateX(i)][translateY(j)]) {
                    alive++;
                }
            }
        }
        return alive;
    };

    const isAlive = function (x, y) {
        return field[translateX(x)][translateY(y)];
    };

    const step = function () {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const aliveAround = getAliveNumber(i, j);
                if (isAlive(i, j)) {
                    fieldBuffer[i][j] = (aliveAround === 2 || aliveAround === 3);
                } else {
                    fieldBuffer[i][j] = aliveAround === 3;
                }
            }
        }
    };

    const swap = function () {
        const f = field;
        field = fieldBuffer;
        fieldBuffer = f;
    };

    function loop() {
        requestAnimationFrame(loop);
        if (pause) {
            return;
        }
        step();
        swap();
        drawField();
    }

    canvas.addEventListener('click', function (e) {
        const x = Math.floor(e.layerX / scale);
        const y = Math.floor(e.layerY / scale);
        field[x][y] = !field[x][y];
        field[x][y] ? drawCell(x, y) : eraseCell(x, y);
    });

    document.getElementById('playPuse').addEventListener('click', function () {
        pause = !pause;
    });

    document.getElementById('random').addEventListener('click', function () {
        pause = true;
        fillRandom();
        drawField();
    });

    document.getElementById('size').addEventListener('input', function (e) {
        pause = true;
        requestAnimationFrame(function () {
            width = height = e.target.value;
            canvas.width = canvas.height = width * scale;
            createField();
            drawField();
        })
    });

    document.getElementById('scale').addEventListener('input', function (e) {
        requestAnimationFrame(function () {
            scale = e.target.value;
            canvas.width = canvas.height = width * scale;
            createField();
            drawField();
        })
    });

    createField();
    drawField();
    loop();
}();