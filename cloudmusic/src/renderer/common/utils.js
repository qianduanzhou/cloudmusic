
//  随机数组
export function shuffle(arr) {
    let _arr = arr.slice()
    for (let i = 0; i < _arr.length; i++) {
      let j = getRandomInt(0, i)
      let t = _arr[i]
      _arr[i] = _arr[j]
      _arr[j] = t
    }
    return _arr
}


//  解析歌词
export function bfLyc(lrc) {
  var lyrics = lrc.split("\n");//this.lrc代表歌词文件内容的引用
      var lrcObj = {};
      for(var i=0;i<lyrics.length;i++){
          var lyric = decodeURIComponent(lyrics[i]);
          var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
          var timeRegExpArr = lyric.match(timeReg);
          if(!timeRegExpArr)continue;
          var clause = lyric.replace(timeReg,'&#8197;');
          for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
              var t = timeRegExpArr[k];
              var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                  sec = Number(String(t.match(/\:\d*/i)).slice(1));
              var time = min * 60 + sec;
              lrcObj[time] = clause;
          }
      }
  return lrcObj;
}

//  初始化页面大小
export const initPage = (outside,innerside) => {
    innerside.style.width = `${outside.offsetWidth - 200}px`
    innerside.style.height = `${outside.clientHeight - 100}px`
    window.onresize = () => {
        innerside.style.width = `${outside.offsetWidth - 200}px`
        innerside.style.height = `${outside.clientHeight - 100}px`
    }  
  }


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}