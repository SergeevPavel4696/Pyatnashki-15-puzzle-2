//Кнопка старта.
const startButton = document.getElementById("start");
//Поле игры.
const gameField = document.getElementById("field");


const sizeButton = document.getElementById("size-field");
//Размерность поля.
const fieldSize = document.getElementById("size");
//Ашность игры.
let size = 4;
let newSize = 4;
//Позиции на поле.
const poz = {};
//Карта элементов
let els = {};
//Пустое место на поле.
let empty;


//Изменить размерность поля.
function changeField() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            els[String(j * 10 + i)] && els[String(j * 10 + i)].el.remove();

        }
    }
    els = {};
    size = newSize;
    gameField.setAttribute("style", "width: " + String(100 * size) + "px; height: " + String(100 * size) + "px;");
    startButton.setAttribute("style", "width: " + String(100 * size) + "px;");
    sizeButton.setAttribute("style", "width: " + String(100 * size) + "px; top: " + String(100 * size) + "px;");
    createEls();
}

//Задать обработчик ввода размерности поля.
function change() {
    if (localStorage.getItem("ptnshksize")) {
        size = localStorage.getItem("ptnshksize");
        fieldSize.value = size;
        newSize = fieldSize.value;
    }
    fieldSize.addEventListener("input", function () {
        newSize = fieldSize.value;
    })
}

//Сохранить эелемент в хранилище.
function setElInStorage(el, p) {
    //Сохранить позицию элемента по id в хранилище.
    localStorage.setItem(String(113 * size * size * el), p);
    //Сохранить id элемента по позиции в хранилище.
    localStorage.setItem(p, String(113 * size * size * el));
}

//Разместить элемент на поле.
function setElOnField(el, p) {
    if (el) {
        //Разместить элемент на поле по координатам.
        el.el.setAttribute("style", "left: " + poz[p].x + "px; top: " + poz[p].y + "px;");
        //Сохранить элемент в хранилище.
        setElInStorage(el.id, p);
    } else {
        //Сохранить пустой элемент в хранилище.
        setElInStorage(size * size, p);
    }
}

//Получить позицию элемента из хранилища по id или id элемента по позиции.
function getFromStorage(el) {
    return localStorage.getItem(el);
}

//Создать элементы на странице.
function createEls() {
    let el;
    let elTag;
    const field = document.querySelector(".field");
    function addEl(el, elTag, id) {
        el.classList.add("item");
        el.id = id;
        el.innerHTML = elTag;
        field.append(el);
    }
    for (let i = 0; i < size; i++) {
        for (let j = 1; j <= size; j++) {
            if (i * size + j !== size * size) {
                el = document.createElement("div");
                elTag = "<p class=\"item-title\">" + (i * size + j) + "</p>";
                addEl(el, elTag, i * size + j);
            }
        }
    }
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            poz[String(j * 10 + i)] = {x: 100 * j, y: 100 * i};
        }
    }
}

//Получить элементы со страницы.
function getElsFromPage() {
    const elsArr = [];
    for (let i = 0; i < size * size - 1; i++) {
        elsArr[i] = {el: document.getElementById(String(i + 1)), id: i + 1};
    }
    return elsArr;
}

//Задать массив элементов при новой игре.
function setElArrayForNewGame() {
    //Массив элементов по возрастанию id.
    const temp1 = getElsFromPage();
    //Массив для элементов в произвольном расположении.
    const temp2 = [];
    //Цикл для произвольного расположения элементов.
    for (let i = 0; i < size * size - 1; i++) {
        const n = Math.floor(Math.random() * temp1.length);
        temp2[i] = temp1[n];
        temp1.splice(n, 1);
    }
    //Задать в массив элементы в произвольном расположении.
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (i * size + j !== size * size - 1) {
                els[String(j * 10 + i)] = temp2[i * size + j];
            } else {
                els[String(j * 10 + i)] = null;
            }
        }
    }
}

//Задать массив элементов при старой игре.
function setElArrayForOldGame() {
    //Массив элементов по возрастанию id.
    const temp1 = getElsFromPage();
    temp1[size * size - 1] = null;
    //Загрузка id элеметов из хранилища по позициям.
    for (let i = 0; i < (size * size - 1); i++) {
        if (getFromStorage(String(113 * size * size * (i + 1)))) {
            els[getFromStorage(String(113 * size * size * (i + 1)))] = temp1[i];
        }
    }
}

//Задать позиции элементов на поле по позициям.
function setElPosForGame() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            setElOnField(els[String(j * 10 + i)], String(j * 10 + i));
        }
    }
}

//Проверка правильности последовательности.
function isOk() {
    let isOk = Number(empty) === (size - 1) * 11;
    for (let i = size - 1; i >= 0; i--) {
        for (let j = size - 1; j >= 0; j--) {
            if (isOk && !(i === size - 1 && j === size - 1)) {
                isOk &&= els[String(10 * j + i)] !== null && Number(els[String(10 * j + i)].id) === i * size + j + 1;
            }
        }
    }
    //Отключить обработчики событий кнопкам стрелок.
    isOk && window.removeEventListener("keydown", go);
}

//Подключить обработчики событий кнопкам стрелок.
function go(evt) {
    function changePos(newEmpty) {
        //Задать смещаемому элементу в хранилище позицию пустого элемента.
        setElOnField(els[String(newEmpty)], String(empty));
        //Задать смещаемому элементу в массиве позицию пустого элемента.
        els[String(empty)] = els[String(newEmpty)];
        //Задать пустому элементу в массиве позицию смещаемого элемента.
        els[String(newEmpty)] = null;
        //Задать новую позицию пустого элемента.
        empty = newEmpty;
        //Задать пустому элементу в хранилище позицию смещаемого элемента.
        setElOnField(null, String(empty));
        //Проверить правильность последовательности элементов.
        isOk();
    }

    //Затать действие клику по стрелке вправо.
    if (evt.key === "ArrowRight" && Math.floor(empty / 10) !== 0) {
        changePos(empty - 10);
    }
    //Затать действие клику по стрелке вниз.
    if (evt.key === "ArrowDown" && empty % 10 !== 0) {
        changePos(empty - 1);
    }
    //Затать действие клику по стрелке влево.
    if (evt.key === "ArrowLeft" && Math.floor(empty / 10) !== size - 1) {
        changePos(empty + 10);
    }
    //Затать действие клику по стрелке вверх.
    if (evt.key === "ArrowUp" && empty % 10 !== size - 1) {
        changePos(empty + 1);
    }
}

//Начать новую игру нажатием кнопки старт.
function startNewGame() {
    //Подключить обработчик событий к кнопке "Старт".
    startButton.addEventListener("click", function () {
        changeField();
        newSize = fieldSize.value;
        localStorage.setItem("ptnshksize", size);
        //Задать массив элементов при новой игре.
        setElArrayForNewGame();
        //Задать позиции элементов на поле по позициям.
        setElPosForGame();
        //Задать позицию пустого элемента.
        empty = 11 * (size - 1);
        //Подключить обработчик событий стрелкам.
        window.addEventListener("keydown", go);
    })
}

//Продолжить игру при загрузке страницы.
function startOldGame() {
    newSize = localStorage.getItem("ptnshksize");
    changeField();
    if (getFromStorage(String(113 * size * size * size * size))) {
        //Задать массив элементов при старой игре.
        setElArrayForOldGame();
        //Задать позиции элементов на поле по позициям.
        setElPosForGame();
        //Задать позицию пустого элемента.
        empty = Number(getFromStorage(113 * size * size * size * size));
        //Подключить обработчик событий стрелкам.
        window.addEventListener("keydown", go);
    }
}

//Изменить игру
change();
//Начать новую игру.
startOldGame();
//Продолжить старую игру.
startNewGame();
//Проверить правильность последовательности элементов.
isOk();
