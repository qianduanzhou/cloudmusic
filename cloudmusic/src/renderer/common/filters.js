
export function bigTime(value) {
    var time = new Date(value);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    function add0(m){return m<10 ? '0'+ m : m }
  
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

export function middleTime(value) {
    var time = new Date(value);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    function add0(m){return m<10 ? '0'+ m : m }
  
    return y+'-'+add0(m)+'-'+add0(d);
}

export function addZero(value) {
    if(value / 10 < 1) {
      return "0" + value
  }
  return value
}

export function wan(value) {
  if(value/10000 > 1) {
    return Math.floor(value / 10000)+'万'
  }else {
    return value
  }
}

export function time(value) {
  let seconds = Math.floor(value / 1000 % 60)
  if (seconds / 10 < 1) {
      seconds = "0" + seconds
  }
  let minute = Math.floor(value / 1000 / 60)
  return `0${minute}:${seconds}`
}