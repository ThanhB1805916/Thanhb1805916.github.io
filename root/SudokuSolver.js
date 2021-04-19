class SudokuSolver {
    /* #region  Properties */
    //Các vector bit kiểm tra số đã tồn tại
    //Trong hàng
    markRow = [];
    //Trong cột
    markCol = [];
    //Trong ma trận 3x3
    markMatrix = [];

    //Bảng gốc
    board;

    // Kiểm tra đệ quy xong dành cho bài toán nhiều cách giải
    isDone = false;

    /* #endregion */

    constructor(board) {
        this.board = board;
        this.init();
        this.populateValues();
    }

    /* #region  Init */
    existValue(row, col) {
        return this.board[row][col] !== 0;
    }

    //Kiểm tra nếu Sudoku đã được giải
    isSolved() {
        return this.isDone;
    }

    //Đánh dấu ô đã có giá trị
    mark(row, col, num, value = true) {
        this.markRow[row][num - 1] = value;
        this.markCol[col][num - 1] = value;
        this.markMatrix[parseInt(row / 3)][parseInt(col / 3)][num - 1] = value;
        //Điền giá trị num vào bảng
        this.board[row][col] = value ? num : 0;
    }

    //Khởi tạo theo bảng dữ liệu truyền vào
    //Kiểm tra xem cell có giá trị hợp lệ hay không nếu chạy hàm này
    //Sử dụng 3 ma trận markRow, markCol, markMatrix 
    init() {

        for (let i = 0; i < 9; i++) {
            this.markRow[i] = [false, false, false, false, false, false, false, false, false];
            this.markCol[i] = [false, false, false, false, false, false, false, false, false];
        }

        for (let i = 0; i < 3; i++) {
            this.markMatrix[i] = [
                [
                    false, false, false,
                    false, false, false,
                    false, false, false
                ],
                [
                    false, false, false,
                    false, false, false,
                    false, false, false
                ],
                [
                    false, false, false,
                    false, false, false,
                    false, false, false
                ]
            ];
        }
    }

    populateValues() {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                let num = this.board[row][col];

                if (this.existValue(row, col)) {
                    this.mark(row, col, num);
                } else {
                    this.mark(row, col, num, false);
                }
            }

        }
    }

    /* #endregion */

    /* #region  Solve */
    // Kiểm tra giá trị độc nhất
    isUnique(row, col, num) {
        return !this.markRow[row][num - 1] && !this.markCol[col][num - 1] && !this.markMatrix[parseInt(row / 3)][parseInt(col / 3)][num - 1];
    }

    // Còn trong ma trận
    inMatrix(row) {
        return row < 9;
    }

    // Kiểm tra cuối dòng
    endOfRow(col) {
        return col >= 9;
    }

    fillNum(row, col) {
        // Tìm các số từ 1->9 để điền vào ma trận
        for (let num = 1; num <= 9; num++) {
            // Nếu hợp lệ
            if (this.isUnique(row, col, num)) {
                //Đánh dấu tồn tại
                this.mark(row, col, num);

		        //Cột tiếp theo
                this.solve(row, col + 1);

                // Nếu vẫn chưa xong
                if (!this.isDone) {
                    //Quay lui nếu giá trị không phù hợp
                    // Bỏ đánh dấu
                    this.mark(row, col, num, false);
                } else {
                    break;
                }
            }
        }
    }

    solve(row = 0, col = 0) {
        if (this.inMatrix(row)) {
            if (this.endOfRow(col)) {
                // Sang dòng tiếp theo
                this.solve(row + 1, 0);
            } else if (!this.existValue(row, col)) {
                // Tìm giá trị điền vào ô trống
                this.fillNum(row, col);
            } else {
                //Qua ô tiếp theo
                this.solve(row, col + 1);
            }
        } else {
            // Đánh dấu hoàn thành
            this.isDone = true;
        }
    }

    /* #endregion */
}