let mapArray; //決定地圖中每個格子的元素
let ctx, currentImgMain;
let imgMountain, imgMain, imgEnemy,imgTarget;

const gridLength = 60;

//初始化動作
$(function(){
    mapArray = [
         //0-可走,1-障礙,2-終點,3-敵人
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0],
        [0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0],
        [0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0],
        [0,0,1,1,1,1,0,1,0,0,1,0,0,0,1,0,0],
        [0,0,1,0,0,1,0,0,0,0,1,3,1,1,1,0,0],
        [0,0,1,0,0,1,0,1,1,1,1,0,0,0,0,0,0],
        [0,0,1,0,0,1,0,0,0,0,0,0,1,1,0,0,1],//21
        [0,0,1,0,0,1,1,1,0,1,0,0,0,1,0,0,1],
        [0,0,1,0,3,1,1,1,0,1,1,0,0,1,1,1,1],
        [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1]
    ];
    ctx = $("#myCanvas")[0].getContext("2d");

    imgMain = new Image();
    imgMain.src = "20210522_1/images/girls.png";
    currentImgMain = {
        "x" : 720,
        "y" : 720
    };
    imgMain.onload = function(){
        ctx.drawImage(imgMain,0,0,91,105,currentImgMain.x,currentImgMain.y,gridLength,gridLength);
    }

    

    imgMountain = new Image();
    imgMountain.src = "20210522_1/images/background.jpg";
    imgEnemy = new Image();
    imgEnemy.src = "20210522_1/images/Enemy.png";
    imgTarget = new Image();
    imgTarget.src = "20210522_1/images/boy.png";
    imgMountain.onload = function(){
        imgEnemy.onload = function(){
            imgTarget.onload = function()
            {
                for(var x in mapArray)
                {
                for(var y in mapArray[x])
                {
                    if(mapArray[x][y] == 1)
                    {
                        ctx.drawImage(imgMountain,150,50,50,50,y*gridLength,x*gridLength,gridLength,gridLength);
                    }
                    else if(mapArray[x][y] == 2)
                    {
                        ctx.drawImage(imgTarget,32,128,32,32,y*gridLength,x*gridLength,gridLength,gridLength);
                    }
                    else if(mapArray[x][y] == 3)
                    {
                        ctx.drawImage(imgEnemy,7,40,104,135,y*gridLength,x*gridLength,gridLength,gridLength);
                    }
                }
                } 
            }
           
        }
    }


});

//處理使用者按下的按鍵
$(document).on("keydown", function(event){
    let targetImg, targetBlock; 
    let cutImagePositionX;  //決定主角臉朝向哪個方向

    targetImg = {
        "x" : -1,
        "y" : -1
    };

    targetBlock = {
        "x" : -1,
        "y" : -1
    };

    //避免鍵盤預設行為發生，如捲動/放大/換頁...
    event.preventDefault();
    
    //判斷使用者按下什麼並推算目標座標
    switch(event.key)
    {
        case "ArrowLeft":
            targetImg.x = currentImgMain.x - gridLength;
            targetImg.y = currentImgMain.y;
            cutImagePositionX = 91; //臉朝左
            break;
        case "ArrowUp":
            targetImg.x = currentImgMain.x;
            targetImg.y = currentImgMain.y - gridLength;
            cutImagePositionX = 273;  //臉朝上
            break;
        case "ArrowRight":
            targetImg.x = currentImgMain.x + gridLength;
            targetImg.y = currentImgMain.y;
            cutImagePositionX = 182;  //臉朝右
            break;
        case "ArrowDown":
            targetImg.x = currentImgMain.x;
            targetImg.y = currentImgMain.y + gridLength;
            cutImagePositionX = 10; //臉朝下
            break;
        default:  //其他按鍵不處理
            return;
    }

    //確認目標位置不會超過地圖
    if(targetImg.x <= 1000 && targetImg.x >= 0 && targetImg.y <= 800 && targetImg.y >= 0)
    {
        targetBlock.x = targetImg.y / gridLength;
        targetBlock.y = targetImg.x / gridLength;
    }
    else
    {
        targetBlock.x = -1;
        targetBlock.y = -1;
    }

    //清空主角原本所在的位置
    ctx.clearRect(currentImgMain.x, currentImgMain.y, gridLength, gridLength);

    if(targetBlock.x != -1 && targetBlock.y != -1)
    {
        switch(mapArray[targetBlock.x][targetBlock.y])
        {
            case 0:  // 一般道路(可移動)
                $("#talkBox").text("");
                currentImgMain.x = targetImg.x;
                currentImgMain.y = targetImg.y;
                break;
            case 1:  // 有障礙物(不可移動)
                $("#talkBox").text("撞到牆啦!");
                break;
            case 2:  // 終點(可移動)
                $("#talkBox").text("抵達終點~");
                //currentImgMain.x = targetImg.x;
                //currentImgMain.y = targetImg.y;
                break;
            case 3:
                $("#talkBox").text("哈囉");
                break;

        }
    }
    else
    {
        $("talkBox").text("邊界");
    }

    ctx.drawImage(imgMain,cutImagePositionX,0,80,130,currentImgMain.x, currentImgMain.y, gridLength,gridLength);

});