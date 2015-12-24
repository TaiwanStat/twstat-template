# [Team-12 遊戲數據](https://riljian.github.io/ncku-csie-ikdd)

藉由依遊戲語言、平台、類型標色，觀察遊戲發展的趨勢

### 功能

* 局部放大<br>
![Zoom in](https://raw.githubusercontent.com/riljian/ncku-csie-ikdd/gh-pages/img/pic_1.jpg)
* 依屬性標色<br>
![Catagory](https://raw.githubusercontent.com/riljian/ncku-csie-ikdd/gh-pages/img/pic_3.jpg)
* 顯示特定類別 - 選取類別後點選`套用`按鈕<br>
![Type](https://raw.githubusercontent.com/riljian/ncku-csie-ikdd/gh-pages/img/pic_4.jpg)
* 關鍵字搜尋<br>
![Keyword](https://raw.githubusercontent.com/riljian/ncku-csie-ikdd/gh-pages/img/pic_5.jpg)

### 設計流程

* 以 Python 抓取遊戲網站資料，並存放於 Firebase
* 使用 D3.js 進行資料視覺化
* 藉 D3 中 brush 實作局部放大

### 資料來源

* [多玩TVGAME游戏下载库](http://tvgdb.duowan.com/)
* [用數據看台灣](https://github.com/TaiwanStat/twstat-template)
