const gol = function () {
    const aliveColor = '#0f0';
    const deadColor = '#000';
    const canvas = document.getElementById('field');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 45;

    let width = 100;
    let height = 100;
    let scale = Math.min(canvas.width, canvas.height) / Math.max(width, height);
    let field = [];
    let fieldBuffer = [];
    let pause = true;
    let framerate = 60;
    let offsetX = (canvas.width - width * scale) / 2;
    let offsetY = (canvas.height - height * scale) / 2;


    const translateX = function (x) {
        const w = width - 1;
        return x < 0 ? w + x : x > w ? x - width : x;
    };

    const translateY = function (y) {
        const h = height - 1;
        return y < 0 ? h + y : y > h ? y - height : y;
    };

    const drawCell = function (x, y) {
        context.fillStyle = aliveColor;
        context.fillRect(translateX(x) * scale + offsetX, translateY(y) * scale + offsetY, scale, scale);
        if (scale > 3) {
            context.strokeStyle = deadColor;
            context.strokeRect(translateX(x) * scale + offsetX, translateY(y) * scale + offsetY, scale, scale);
        }
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

    const resizeField = function (w, h) {
        if (w !== w || !w) {
            w = 3;
        }
        if (h !== h || !h) {
            h = 3;
        }

        for (let i = 0; i < w; i++) {
            if (!field[i]) {
                field.push([]);
                fieldBuffer.push([]);
            }
            for (let j = 0; j < h; j++) {
                if (!field[i][j]) {
                    field[i].push(false);
                    fieldBuffer[i].push(false);
                }
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
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = '#FF0000';
        context.strokeRect(offsetX, offsetY, width * scale, height * scale);
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
        for (let i = -1; i < width + 1; i++) {
            for (let j = -1; j < height + 1; j++) {
                const tX = translateX(i);
                const tY = translateY(j);
                const aliveAround = getAliveNumber(i, j);
                if (isAlive(i, j)) {
                    fieldBuffer[tX][tY] = (aliveAround === 2 || aliveAround === 3);
                } else {
                    fieldBuffer[tX][tY] = aliveAround === 3;
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
        setTimeout(function () {
            requestAnimationFrame(loop);
            if (pause) {
                return;
            }
            step();
            swap();
            drawField();
        }, 1000 / framerate)
    }

    const setPause = function(p) {
        pause = p;
        document.getElementById('playPuse').innerText = pause ? 'Play' : 'Pause';
    };

    canvas.addEventListener('click', function (e) {
        const x = translateX(Math.floor((e.layerX - offsetX) / scale));
        const y = translateY(Math.floor((e.layerY - offsetY) / scale));
        field[x][y] = !field[x][y];
        field[x][y] ? drawCell(x, y) : eraseCell(x, y);
    });

    document.getElementById('playPuse').addEventListener('click', function () {
        setPause(!pause);
    });

    document.getElementById('random').addEventListener('click', function () {
        fillRandom();
        drawField();
    });

    document.getElementById('size').addEventListener('input', function (e) {
        requestAnimationFrame(function () {
            width = height = parseInt(e.target.value);
            if (width !== width || !width) {
                width = height = 3;
            }
            document.getElementById('scale').value = scale = Math.min(canvas.width, canvas.height) / Math.max(width, height);
            offsetX = (canvas.width - width * scale) / 2;
            offsetY = (canvas.height - height * scale) / 2;
            resizeField(width, height);
            drawField();
        })
    });

    document.getElementById('scale').addEventListener('input', function (e) {
        requestAnimationFrame(function () {
            scale = e.target.value;
            document.getElementById('size').value = width = height = Math.floor(Math.min(canvas.width, canvas.height) / scale);
            offsetX = (canvas.width - width * scale) / 2;
            offsetY = (canvas.height - height * scale) / 2;
            resizeField(width, height);
            drawField();
        })
    });

    document.getElementById('framerate').addEventListener('input', function (e) {
        framerate = e.target.value;
    });

    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 45;
        scale = Math.min(canvas.width, canvas.height) / Math.max(width, height);
        offsetX = (canvas.width - width * scale) / 2;
        offsetY = (canvas.height - height * scale) / 2;
        drawField();
    });

    createField();
    drawField();
    loop();
}();