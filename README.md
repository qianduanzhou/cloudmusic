# vue-cloudMusic

### 一.介绍

 - 用vue+electron 高仿网易云pc版，后台api是网上一位大佬根据网易云api获取的
 - 这是api地址：[网易云api](https://binaryify.github.io/NeteaseCloudMusicApi/#/)
 - 后台文件到上面github地址下载，下载后的文件为NeteaseCloudMusicApi

### 二.安装教程

#### 1. 两个文件都需要npm install
#### 2. 安装完成后在 NeteaseCloudMusicApi 文件里启动node服务，node app.js
#### 3. 在 cloudmusic里启动vue，npm run dev

### 三.上线

 - 目前已上线阿里云，打包好的exe文件在百度云：
 - 链接：https://pan.baidu.com/s/13VIKegK4mmSF1ds9FqP6mA
 - 提取码：jq98 
 - 打开exe文件即可一键安装，然后在桌面直接打开即可
### 四.技术栈
基本就是vue全家桶，还有外壳electron，后台api是网上一位大佬的
 - vue
 - vuex
 - axios
 - vue-router
 - electron
 - node
### 四.gif动图演示
- ![演示](https://github.com/qianduanzhou/cloudmusic/blob/master/cloudmusic/static/cloudmusic.gif "cloudmusic.gif")


### 五.功能介绍

#### 1. 登录
 - 可以根据自己的手机号登录网易云
#### 2. 查看个人收藏，包括歌曲，歌单，专辑，歌手
 - 登录后即可查看这些信息，如下图

- ![喜欢的音乐](https://images.gitee.com/uploads/images/2019/0512/232011_f1cef960_2295938.png "喜欢.PNG")
#### 3. 歌单大全，歌手大全，排行榜等
- 这是其中的一张，歌手大全
- ![歌手大全](https://images.gitee.com/uploads/images/2019/0512/233839_a38b8e4e_2295938.png "歌手大全.PNG")
#### 4. 此外还有一些功能，如收藏，发表评论等
- 喜欢音乐
- ![喜欢音乐](https://images.gitee.com/uploads/images/2019/0512/234204_38974649_2295938.png "喜欢音乐.PNG")
#### 5. 当然少不了音乐播放相关的操作
如播放，暂停，下一首等操作
