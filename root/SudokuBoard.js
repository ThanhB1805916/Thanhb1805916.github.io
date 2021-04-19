/* #region  Attribute */
const BOARD = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2, 6, 7, 2, 1, 9, 5, 3, 4, 8, 1, 9, 8, 3, 4, 2, 5, 6, 7, 8, 5, 9, 7, 6, 1, 4, 2, 3, 4, 2, 6, 8, 5, 3, 7, 9, 1, 7, 1, 3, 9, 2, 4, 8, 5, 6, 9, 6, 1, 5, 3, 7, 2, 8, 4, 2, 8, 7, 4, 1, 9, 6, 3, 5, 3, 4, 5, 2, 8, 6, 1, 7, 9],
    [4, 7, 9, 6, 8, 5, 1, 3, 2, 1, 6, 2, 7, 3, 4, 5, 9, 8, 5, 3, 8, 2, 1, 9, 7, 6, 4, 3, 4, 5, 9, 2, 6, 8, 7, 1, 7, 2, 6, 8, 5, 1, 3, 4, 9, 8, 9, 1, 4, 7, 3, 2, 5, 6, 9, 1, 3, 5, 6, 8, 4, 2, 7, 6, 8, 7, 3, 4, 2, 9, 1, 5, 2, 5, 4, 1, 9, 7, 6, 8, 3],
    [8, 6, 5, 2, 3, 1, 9, 7, 4, 3, 7, 4, 8, 9, 5, 2, 6, 1, 1, 2, 9, 4, 6, 7, 8, 3, 5, 4, 3, 2, 5, 1, 9, 7, 8, 6, 6, 5, 8, 7, 2, 4, 3, 1, 9, 9, 1, 7, 3, 8, 6, 4, 5, 2, 7, 4, 3, 6, 5, 2, 1, 9, 8, 5, 8, 1, 9, 4, 3, 6, 2, 7, 2, 9, 6, 1, 7, 8, 5, 4, 3],
    [1, 3, 2, 9, 7, 4, 6, 8, 5, 5, 9, 8, 2, 6, 1, 7, 3, 4, 7, 6, 4, 8, 3, 5, 2, 1, 9, 4, 2, 7, 3, 1, 9, 5, 6, 8, 9, 1, 5, 7, 8, 6, 3, 4, 2, 6, 8, 3, 4, 5, 2, 1, 9, 7, 8, 7, 1, 5, 4, 3, 9, 2, 6, 3, 4, 9, 6, 2, 7, 8, 5, 1, 2, 5, 6, 1, 9, 8, 4, 7, 3],
    [2, 8, 4, 1, 9, 6, 7, 5, 3, 3, 9, 6, 7, 4, 5, 2, 1, 8, 1, 5, 7, 8, 3, 2, 4, 9, 6, 4, 1, 5, 3, 7, 8, 9, 6, 2, 7, 6, 3, 4, 2, 9, 1, 8, 5, 9, 2, 8, 5, 6, 1, 3, 7, 4, 6, 7, 2, 9, 8, 4, 5, 3, 1, 8, 3, 1, 2, 5, 7, 6, 4, 9, 5, 4, 9, 6, 1, 3, 8, 2, 7]
]

// Độ khó tập chơi - dễ - trung bình - khó - cực khó
const level = [76, 50, 40, 30, 20];

// Kiểm tra giá trị điền vào được
enables = [];

// Điếm số lần
//Trong hàng
countRows = [];
//Trong cột
countCols = [];
//Trong ma trận 3x3
countMatrixes = [];

var selectedNum;
var selectedCell;
disableSelect = false;

// Lưu lời giải
var rawBoard;
var solvedBoard;
var autoGener = true;

/* #endregion */

/* #region  Kết thúc game */

// Kiểm tra khi nào các cell đã được điền
function checkDone() {
    let cells = doc_qsa(".cell");
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent === "" || cells[i].classList.contains("incorrect")) return false;
    }
    return true;
}

function endGame() {
    clearTimeout(timer);
    timer = null;
    timeRemaining = null;
    disableSelect = true;
    doc_id("notify").textContent = "Chúc mừng bạn đã hoàn thành trò chơi";
    alert("Chúc mừng");
}

/* #endregion */

/* #region  Cập nhật ô số */

//Đánh dấu ô đã có giá trị
function countNum(row, col, num, value = 1) {
    if (enables) {
        countRows[row][num - 1] += value;
        countCols[col][num - 1] += value;
        countMatrixes[parseInt(row / 3)][parseInt(col / 3)][num - 1] += value;
    }
}

// Kiểm tra trùng
function duplicate(row, col, num) {
    return countRows[row][num - 1] > 1 || countCols[col][num - 1] > 1 || countMatrixes[parseInt(row / 3)][parseInt(col / 3)][num - 1] > 1;
}

// Chọn số
// Đếm số của dòng - cột - trong ma trận 3x3
// undo dùng để trừ số lần xuất hiện
function select(cell, undo = false) {
    let id = cell.id;
    let row = Math.floor(id / 9);
    let col = id % 9;
    let num = parseInt(cell.textContent);
    countNum(row, col, num, undo ? -1 : 1);

    // Cập nhật giá trị trong bảng
    rawBoard[id] = parseInt(cell.textContent);
}

function notValidCell(cell) {
    let id = cell.id;
    row = Math.floor(id / 9);
    col = id % 9;
    num = cell.textContent;

    return duplicate(row, col, num);
}

// Highlight cell bị sai
function highlightCell(cell, undo = false) {
    id = cell.id;
    row = Math.floor(id / 9);
    col = id % 9;
    if (!undo && enables[row][col]) //  && cells[i].id === selectedCell.id
    {
        cell.classList.add("invalidAdd");
    } else {
        cell.classList.remove("invalidAdd");
    }
}

// Hàm thêm số vào cell khi người dùng chọn cell và num
function updateMove() {
    // Kiểm tra cell vs num khác null 
    if (selectedCell && selectedNum) {

        // Chỉ cập nhật khi giá trị cell với num khác
        if (selectedCell.textContent !== selectedNum.textContent) {
            // Bỏ select ô cũ ( màu css )
            select(selectedCell, true);

            // Cập nhật giá trị mới
            selectedCell.textContent = selectedNum.textContent;

            select(selectedCell);
            selectedCell.classList.add("add");

            let cells = doc_qsa(".cell");
            // Cật nhật toàn bộ cell
            for (let i = 0; i < cells.length; i++) {
                if (notValidCell(cells[i])) {
                    cells[i].classList.add("incorrect");

                    highlightCell(cells[i]);
                } else {
                    cells[i].classList.remove("incorrect");

                    highlightCell(cells[i], true);
                }
            }
        }

        diselectCellAndNum();

        if (checkDone()) {
            endGame();
        }
    }
}


function diselectCellAndNum() {
    // Nếu cell vs num khác null sẽ remove select
    selectedCell ?.classList.remove("selected");
    selectedNum ?.classList.remove("selected");
    selectedCell = null;
    selectedNum = null;
}

/* #endregion */
/* #region  Vẽ bảng */

// Vẽ giao diện bảng
function drawBoard(board) {

    clearPrevousBoard();

    //Tạo id cho từng cell
    let idCount = 0;

    //81 cell
    for (let i = 0; i < board.length; i++) {
        let cell = document.createElement("p");
        //Nếu có giá trị
        if (board[i] !== 0) {
            cell.textContent = board[i];
        } else {
            //Thêm event cho cell
            addEventListenerToCell(cell);
        }

        //Gán id cho cell
        cell.id = idCount;
        idCount++;

        addCellIntoBoard(cell);
    }
}

function addCellIntoBoard(cell) {
    cell.classList.add("cell");

    //Tô đậm biên ở dưới
    if ((cell.id > 17 && cell.id < 27) || (cell.id > 44 && cell.id < 54)) {
        cell.classList.add("bottomBorder");
    }

    //Tô đậm biên bên phải
    if ((cell.id + 1) % 9 == 3 || (cell.id + 1) % 9 == 6) {
        cell.classList.add("rightBorder");
    }

    //Add cell to board
    doc_id("board").appendChild(cell);
}

function clearPrevousBoard() {
    //Lấy ra tất cả cell
    let cells = doc_qsa(".cell");

    //Xóa hết cell trong board
    for (let i = 0; i < cells.length; i++) {
        cells[i].remove();
    }

    //Chỉnh lại đồng hồ
    if (timer) clearTimeout(timer);

    //Xóa 2 giá trị được chọn
    diselectCellAndNum();
}

/* #endregion */

/* #region  Tạo bảng */
// Lấy ra 1 bảng ngẫu nhiêu trong dãy bảng
function loadBoardFromDb() {
    let pos = getRandomRange(0, BOARD.length - 1);
    return JSON.parse(JSON.stringify(BOARD[pos]));
}

// Tạo bảng theo độ khó
function createRandoomBoard() {
    board = loadBoardFromDb();
    // Copy sâu
    rawBoard = JSON.parse(JSON.stringify(board));

    // Độ khó càng cao càng ít chữ số
    let valueSpace = 0;

    // Lấy độ khó theo radio button
    let diff = document.getElementsByName("diff");

    for (let i = 0; i < diff.length; i++) {
        if (diff[i].checked) {
            valueSpace = level[i];
            break;
        }
    }

    for (let i = 0; i < board.length - valueSpace; i++) {
        rawBoard[getRandomRange(0, 80)] = 0;
    }
}

// Khởi tạo bộ đếm
function resetCouter() {
    for (let i = 0; i < 9; i++) {
        enables[i] = [false, false, false, false, false, false, false, false, false];
        countRows[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        countCols[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    for (let i = 0; i < 3; i++) {
        countMatrixes[i] = [
            [
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            ],
            [
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            ],
            [
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            ]
        ];

    }
}

function createBoard() {

        resetCouter();

        if (rawBoard === null || autoGener) {
            // Có sẵn lời giải
            createRandoomBoard();
        } else {
            // Dùng giải thuật để giải
            let engine = new SudokuSolver(to2D(rawBoard));
            board = rawBoard;

            if (!engine.isSolved()) {
                engine.solve();

                if (!engine.isSolved()) {
                    alert("Bài toán này không có lời giải");
                } else {
                    board = to1D(engine.board);
                }
            }
        }

        //Khởi tạo enables với các count
        for (let i = 0; i < rawBoard.length; i++) {
            row = Math.floor(i / 9);
            col = i % 9;
            num = rawBoard[i];

            if (num === 0) {
                enables[row][col] = true;
            } else {
                countNum(row, col, num, value = 1)
            }
        }
    }
    /* #endregion */

/* #region  Event */
function addEventListenterToNumberContainer() {
    num_con_children = doc_id("number-container").children;
    for (let i = 0; i < num_con_children.length; i++) {
        num_con_children[i].addEventListener("click", function() {
            if (!disableSelect) {
                if (this.classList.contains("selected")) {
                    //Then remove selection
                    this.classList.remove("selected");
                    selectedNum = null;
                } else {
                    //Deselect all other numbers
                    for (let i = 0; i < 9; i++) {
                        num_con_children[i].classList.remove("selected");
                    }
                    this.classList.add("selected");
                    selectedNum = this;

                    //Update move dành cho chọn từ cell -> number (1)
                    updateMove();
                }
            }
        });
    }
}

function addEventListenerToCell(cell) {
    cell.addEventListener("click", function() {
        if (!disableSelect) {
            //Nếu cell đang được chọn sẽ bỏ chọn
            if (cell.classList.contains("selected")) {
                cell.classList.remove("selected");
                selectedCell = null;
            } else {
                //Bỏ chọn các ô còn lại 
                for (let i = 0; i < 81; i++) {
                    doc_qsa(".cell")[i].classList.remove("selected");
                }
                //Thêm ô được chọn
                cell.classList.add("selected");
                selectedCell = cell;

                //Update move dành cho từ number -> cell (2)
                updateMove();
            }
        }
    });
}
/* #endregion */