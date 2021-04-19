var timer;
var timeRemaining;
var isImp = false;

onload = () => {
    //Run startgame function when button is clicked
    doc_id("start-btn").addEventListener("click", startGame);

    addEventListenerToDownloadButton();

    addEventListenterToNumberContainer();

    addEventListenerToReadSudokuFile();

    addEventListenerToReadSudokuUserInput();
};

function startGame() {
   createBoard();
   doc_id("notify").textContent = "";
    // Kiểm tra nếu có lời giải
   if(board !== rawBoard)
   {
        drawBoard(rawBoard);

        //Show number container
        doc_id("number-container").classList.remove("hidden");
        //Download button
        doc_id("downloadBoard").classList.remove("hidden");
        
        if (checkDone()) {
            endGame();
        }

        startTimmer();
   }
}

// Kiểm tra nếu người dùng chọn import bảng hay không.
function showImport()
{
    if(!isImp)
    {
        doc_id("auto-gen").classList.add("hidden");
        doc_id("usr-imp").classList.remove("hidden");
    } 
    else
    {
        doc_id("auto-gen").classList.remove("hidden");
        doc_id("usr-imp").classList.add("hidden");
    }

    isImp = !isImp;
}

// Tạo đồng hồ bấm giờ
function startTimmer() {
    timeRemaining = 0;
    doc_id("timer").textContent = timeConversion(timeRemaining);

    //Cập nhật mỗi giây
    timer = setInterval(() => {
        timeRemaining++;
        doc_id("timer").textContent = timeConversion(timeRemaining);
    }, 1000);
}

function addTheme() {
    //Sets theme based on input
    if (doc_id("theme-1").checked) doc_qs("body").classList.remove("dark");
    else doc_qs("body").classList.add("dark");
}


/* #region Add Event */
function addEventListenerToReadSudokuUserInput() {
    // Hiện prompt rồi đọc text
    doc_id("inputText").addEventListener("click", function () {
        usrInput = prompt("Nhập vào có thể nhập vào chữ dấu nhưng vẫn phải đủ 81 số");
        if (usrInput?.length > 80) {
            sudokuInt = convertToSudokuBoard(usrInput);
            if (validLength(sudokuInt) && validHint(sudokuInt)) {
                rawBoard = sudokuInt;
                autoGener = false;
                startGame();
            }
        }
        else
        {
            alert("Đầu vào không hợp lệ");
        }
        autoGener = true;

    });
}

function addEventListenerToDownloadButton()
{
     //Run startgame function when button is clicked
     doc_id("downloadBoard").addEventListener("click", function () {
        data = rawBoard;
        if(data)
        {
            const a = document.createElement('a');
            const blob = new Blob([JSON.stringify(data)]);
            a.href = URL.createObjectURL(blob);
            a.download = "sudokuBoard.txt"; //filename to download
            a.click();
        }
        else
        {
            alert("Không có dữ liệu");
        }
    });
}

function addEventListenerToReadSudokuFile() {
    doc_id("sudokuFile").addEventListener("change", function () {
        file = new FileReader();
        file.onload = function () {
            fileContent = this.result.split("");
            sudokuInt = convertToSudokuBoard(fileContent);
            if (validLength(sudokuInt)&& validHint(sudokuInt)) {
                rawBoard = sudokuInt;
                autoGener = false;
                startGame();
            }
        }
        autoGener = true;
        if(this.files[0])
            file?.readAsText(this.files[0]);
    });
}

/* #endregion */

/* #region Extension functions */
function doc_id(id) {
    return document.getElementById(id);
}

function doc_qs(selector) {
    return document.querySelector(selector);
}

function doc_qsa(selector) {
    return document.querySelectorAll(selector);
}

// Chuyển đầu vào thành mảng 1 chiều chứa sudoku
function convertToSudokuBoard(board) {
    sudokuInt = [];
    for (let i = 0; i < board.length; i++) {
        num = parseInt(board[i]);
        if (Number.isInteger(num) && num >= 0 && num <= 9)
            sudokuInt.push(num);
    }

    return sudokuInt;
}

// Đếm số phần tử khác 0 trong mảng
function countN(board)
{
    cnt = 0;
    for (let i = 0; i < board.length; i++) {
        if(board[i] !== 0)
            cnt++;
    }

    return cnt;
}

// Trả về số ngẫu nhiên trong khoảng min tới max 
function getRandomRange(min, max)
{
    return Math.floor(Math.random() * (max - min + 1));
}

// Chuyển board 1 chiều sang 2 chiều
function to2D(rawArr) {
    arr = JSON.parse(JSON.stringify(rawArr));
    subArr = [];
    while (arr.length) subArr.push(arr.splice(0, 9));

    return subArr;
}

// Chuyển board 2 chiều về 1 chiều
function to1D(rawArr) {
    arr = JSON.parse(JSON.stringify(rawArr));
    return [].concat(...arr);
}

//Chuyển giây sang định dạng MM:SS
function timeConversion(sec) {
    let minutes = Math.floor(sec / 60);
    if (minutes < 10) minutes = "0" + minutes;
    let seconds = sec % 60;
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}


function validLength(sudokuInt) {
    if (sudokuInt.length != 81) {
        alert("Đầu vào không đúng 81 chữ số");
        return false;
    }

    return true;
}

function validHint(sudokuInt)
{
    let n = countN(sudokuInt);
    if(n < 17)
    {
        alert("Phải có ít nhất 17 chữ số khác 0");
        return false;
    }

    return true;
}

/* #endregion */
