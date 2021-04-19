process.env.PATH += __dirname+"/drivers/";
const {Builder, By, Key, util} = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const url = "http://localhost:8080/";

var driver;


// Khởi tạo driver và vào trang chủ
async function init()
{
    driver = await new Builder()
                    .forBrowser("chrome")
                    .build();
    await driver.get(url);
}

// Đóng driver
async function dispose()
{
    await driver.close();
}

//Chạy try catch final cho hàm call back truyền vào
async function run(runable)
{
    await init();
    try {
       await runable();
    } 
    catch(e)
    {
        console.log(e);
    }
    finally
    {
        await dispose();
    }
}

// Test trang chủ
// Lấy ra title và h1 coi có trùng khớp hay không
async function homePageTest()
{
    // Kiểm tra title
    let e_ti = "game sudoku";
    let a_ti = await driver.getTitle();
    console.log("\nTest home title");
    console.log(e_ti.toLowerCase() === a_ti.toLowerCase());

    // Kiểm tra h1
    let e_h1 = "sudoku";
    let a_h1 = await (await driver.findElement(By.tagName("h1"))).getText();
    console.log("\nTest home h1");
    console.log(e_h1.toLowerCase() === a_h1.toLowerCase());
}

// Test màu nền
async function themeTest()
{
    // Kiểm tra màu nền
    // Chuyển sang nền tối
    await driver.findElement(By.id("theme-2")).click();
    // Nền tối
    console.log("Test dark theme");
    let body = await driver.findElement(By.tagName("body"));
    let e_c = "rgba(255, 255, 255, 1)";
    let e_bc = "rgba(51, 51, 51, 1)";

    let a_c = await body.getCssValue("color");
    let a_bc = await body.getCssValue("background-color");

    console.log("color: ");
    console.log(e_c === a_c);
    console.log("background color: ");
    console.log(e_bc === a_bc);


    // Nền sáng
    // Chuyển sang nền sáng
    await driver.findElement(By.id("theme-1")).click();
    console.log("\n Test light theme");
    body = await driver.findElement(By.tagName("body"));
    e_c = "rgba(0, 0, 0, 1)";
    e_bc = "rgba(0, 0, 0, 0)";

    a_c = await body.getCssValue("color");
    a_bc = await body.getCssValue("background-color");

    console.log("color: ");
    console.log(e_c === a_c);
    console.log("background color: ");
    console.log(e_bc === a_bc);
}

// Kiểm tra hiển thị khi check thêm file
async function addFileDisplayTest()
{
    // Mặc định là hidden thêm file
    console.log("Kiểm tra hiển thị mặc định");
    let e = "none";
    let a = await driver.findElement(By.id("usr-imp")).getCssValue("display");
    console.log(a === e);

    // Check vào thêm file
    console.log("\nCheck vào thêm file");
    await driver.findElement(By.xpath('/html/body/header/div[2]/input')).click();
    console.log("Kiểm tra có hiển thị nhập file");
    e = "none";
    a = await driver.findElement(By.id("usr-imp")).getCssValue("display");
    console.log(a !== e);

     // Bỏ Check vào thêm file
     console.log("\nBỏ check thêm file");
     await driver.findElement(By.xpath('/html/body/header/div[2]/input')).click();
     console.log("Kiểm tra lại hiển thị mặc định");
     e = "none";
     a = await driver.findElement(By.id("usr-imp")).getCssValue("display");
     console.log(a === e);
}

// Tạo bảng game
async function createGame()
{
    await driver.findElement(By.id("start-btn")).click();
}

// Kiểm tra số ô
async function checkContainerAndTable()
{
    await createGame();
    console.log("Kiểm tra số ô trong game");
    // Number container 9 ô
    console.log("Kiểm tra số lượng chữ số trong number container bằng 9: ");
    let e_nums = 9;
    let a_nums = (await driver.findElement(By.id("number-container")).findElements(By.tagName("p"))).length;
    console.log(e_nums === a_nums);
    
    // Bảng 81 ô 
    console.log("\nKiểm tra số ông trong bảng bằng 81: ");
    e_nums = 81;
    a_nums = (await driver.findElement(By.id("board")).findElements(By.tagName("p"))).length;
    console.log(a_nums === e_nums);
}

// Kiểm tra chọn ô số
async function checkChooseCell()
{
    await createGame();
    console.log("Kiểm tra chọn số");
    // Chọn đại số đầu trong container
    let es = await (await driver.findElement(By.id("number-container")).findElements(By.tagName("p")));
    await es[0].click();

    // Tìm ô rỗng trong board
    let board = await (await driver.findElement(By.id("board")).findElements(By.tagName("p")));
    let id = 0;
    for (let i = 0; i < board.length; i++) {
        if(await board[i].getText() === "")
        {
            await board[i].click();
            id = i;
            break;
        }
        
    }
    console.log(await board[id].getText() !== "");
    
}

async function Test()
{
    console.log("Bắt đầu chạy test\n\n ");

    await run(homePageTest);

    console.log("\n------------------------------------------------\n ");

    await run(themeTest);

    console.log("\n------------------------------------------------\n ");

    await run(addFileDisplayTest);

    console.log("\n------------------------------------------------\n ");

    await run(checkContainerAndTable);

    console.log("\n------------------------------------------------\n ");

    await run(checkChooseCell);
}

Test();