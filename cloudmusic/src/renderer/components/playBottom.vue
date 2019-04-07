<template>
  <div class="bottom alignCenter">
    <div class="playControl">
      <i class="iconfont icon-shangyishou prev" @click="prev"></i>
      <i class="iconfont palyClass play" :class="palyClass" @click="playState"></i>
      <i class="iconfont icon-xiayishou next" @click="next"></i>
    </div>
    
    <div class="timeContainer alignCenter">
        <span class="run">{{currentTime | songTime}}</span>
        <div class="timeschedule alignCenter" @click="toTime" ref="timeContainer">
          <div class="box" 
          ref="box" @mousedown.stop="drap"
          :style="{'left':`${time}px`}"></div>
          <div class="in"></div>
          <div class="out" :style="{'width':`${timeSchedule}%`}"></div>
        </div> 
        <span class="duration" v-if = "currentSong.duration">{{currentSong.duration | time}}</span>
        <span class="duration" v-if = "!currentSong.duration">00:00</span>
    </div>
    <div class="soundContainer alignCenter">
      <i class="iconfont icon-horn-copy sound"></i>
      <div class="soundschedule alignCenter">
        <div class="in"></div>
        <div class="out"></div>
      </div>
    </div>
    <div class="other alignCenter">
      <i class="iconfont mode" :class="[modeClass]" @click="changeMode"></i>
      <i class="iconfont icon-geci word"></i>
      <div class="listContainer alignCenter">
        <i class="iconfont icon-bofangliebiao list" ></i>
        <span class="num">50</span>
      </div>
    </div>
    <audio ref="audio" :src="currentSong.url" @timeupdate="updateTime" @ended="end" autoplay></audio>
  </div>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from 'vuex'
import axios from 'axios'
const offSetLeft = 250
const boxWidth = 12

export default {
  data() {
    return {
      timeWidth: 0,
      time: 0,
      currentTime:0,
      timeSchedule:0,
      mode:[
        'sequence',
        'random',
        'loop'
      ],
      nowMode:'sequence',
    }
  },
  computed: {
    ...mapGetters([
      'currentSong',
      'playList',
      'currentIndex',
      'playing',
    ]),
    modeClass() {
      switch (this.nowMode) {
        case 'sequence':
          return 'icon-biao-'
        case 'random':
          return 'icon-bofangye-caozuolan-suijibofang'
        case 'loop':
          return 'icon-danquxunhuan'
        default:
          break;
      }
    },
    palyClass() {
      if(this.playing) {
        return 'icon-zanting'
      }
      return 'icon-bofang'
    },
    percent() {
      return this.currentTime * 1000/this.currentSong.duration
    }
  },
  watch: {
    currentTime(newVal) {
      // this.$refs.box.style.left = this.percent * this.timeWidth - boxWidth/2 + 'px'
      this.time = this.percent * this.timeWidth - boxWidth/2
    },
    time(newVal) {
        if(newVal < 0) {
         this.timeSchedule = 0
         return 0
        }
         this.timeSchedule = (newVal / this.timeWidth)*100
    }
  },
  updated() {
    this.timeWidth = this.$refs.timeContainer.offsetWidth
  },
  mounted() {
    this.setAudio(this.$refs.audio)
  },
  filters: {
    songTime(value) {
      var min = Math.floor(value/60)
      var seconds = Math.floor(value % 60)
      if(seconds < 10) {
        seconds = '0' + seconds
      }
      if(min < 10) {
        min = '0' + min
      }
      return `${min}:${seconds}`
    }
  },
  methods: {
    drap(e) {
      e.stopPropagation()
      if(!this.currentSong.duration) {
        return
      }
      let box = this.$refs.box
      var _this = this
      let startX =  offSetLeft - boxWidth/2 
      let moveX = 0,endX = 0
      document.addEventListener('mousemove',move)

      document.addEventListener('mouseup',function (e) {
        e.stopPropagation()
        document.removeEventListener("mousemove",move)
      })
      function move(e) {
        e.stopPropagation()
        moveX = e.clientX - offSetLeft - boxWidth/2
        if(e.clientX - offSetLeft >= _this.timeWidth) {
         _this.time = _this.timeWidth - boxWidth/2
         moveX = 0
        }else if(e.clientX - offSetLeft <= 0) {
          moveX = 0 - boxWidth/2
        }else {
          _this.time = moveX
          _this.$refs.audio.currentTime = _this.time / _this.timeWidth * _this.currentSong.duration / 1000
        }  
      }
    },
    toTime(e) {
      if(!this.currentSong.duration) {
        return
      }
      this.time = e.clientX - offSetLeft - boxWidth/2
      this.$refs.audio.currentTime = this.time / this.timeWidth * this.currentSong.duration / 1000
      if(e.clientX > this.timeWidth + offSetLeft) {
        this.time = this.timeWidth
      }else if(e.clientX < offSetLeft) {
        this.time = 0
      }
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    changeMode() {
      this.nowMode = this.nowMode == this.mode[0] ? this.mode[1] : this.nowMode == this.mode[1] ? this.mode[2] : this.mode[0]
      this.setPlayMode(this.nowMode)
      this.selectPlay({
        list:this.playList,
        index:this.currentIndex
      })
    },
    end() {
      this.setPlayState(true)
      if(this.nowMode === this.mode[2]) {
        this.loop()
      }else {
        this.next()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    next() {
      if(!this.currentSong.duration) {
        return 
      }
      this.setPlayState(true)
      let url = ''
      if(this.playList === 1) {
        this.loop()
      }else {
        let index = this.currentIndex + 1
        if(index === this.playList.length) {
          index = 0
        }
        /*标记*/
        this._getUrl(this.playList[index].mid,index)
      }
    },
    prev() {
      if(!this.currentSong.duration) {
        return 
      }
      this.setPlayState(true)
      if(this.playList === 1) {
        this.loop()
      }else {
        let index = this.currentIndex - 1
        if(index === -1) {
          index = this.playList.length-1
        }
        /*标记*/
        this._getUrl(this.playList[index].mid,index)
      }
    },
    
    playState() {
      if(!this.currentSong.duration) {
        return 
      }
      if(this.playing) {
        this.$refs.audio.pause()
        this.setPlayState(false)
      }else {
        this.$refs.audio.play()
        this.setPlayState(true)
      }
    },
    _getUrl(mid,index) {
      if(this.playList[index].url) {
        let list = this.playList.slice(0)
        this.setPlayList(list)
        this.setCurrentIndex(index)
        return 
      }
      axios.get('http://localhost:3000/song/url',{
        params: {
            id: mid
        }
        }).then((result) => {
            let res = result.data
            let url = res.data[0].url
            let list = this.playList.slice(0)
            list[index].url = url   
            this.setPlayList(list)
            this.setCurrentIndex(index)
        })
    },
    ...mapActions([
      'selectPlay'
    ]),
    ...mapMutations({
      setCurrentIndex:'SET_CURRENT_INDEX',
      setPlayList:'SET_PLAYLIST',
      setPlayMode:'SET_PLAY_MODE',
      setPlayState:'SET_PLAY_STATE',
      setAudio:'SET_AUDIO'
    })
  }
}
</script>

<style lang='scss'>
.bottom {
    position: fixed;
    z-index: 1000;
    bottom: 0;
    box-sizing: border-box;
    border-top: 1px solid #E1E1E2;
    width: 100%;
    height: 50px;
    background: #F6F6F8;
    .playControl {
      width: 200px;
      i {
        font-size: 35px;
        color:#D23030;
      }
      .prev {
        padding-left: 30px;
      }
      .play {
        padding: 0 20px;
      }
    }
    .timeContainer {
      flex: 1;
      margin-right: 10px;
      span {
        font-size: 13px;
        padding: 0 10px;
      }
      .timeschedule {
        flex: 1;
        padding: 10px 0;
        position: relative;
        .box {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          z-index: 100;
          background: #f1f1f1;
          top: 3px;
          left: -6px;
          border: 1px solid #C2C2C4;
          &::before {
            content: '';
            width: 4px;
            height: 4px;
            position: absolute;
            left: 4px;
            top: 4px;
            background: #D23030;
            border-radius: 50%;
          }
        }
        .in {
          position: absolute;
          width: 100%;
          left: 0;
          height: 4px;
          background: #C2C2C4;
          border-radius: 3px;
        }
        .out {
          left: 0;
          /* width: 100%; */
          position: absolute;
          height: 4px;
          background: #D23030;
          border-radius: 3px;
        }
      }
    }
    .soundContainer {
      width: 130px;
      .sound {
        font-size: 20px;
      }
      .soundschedule {
        width: 90px;
        position: relative;
        .in {
          position: absolute;
          width: 100%;
          left: 0;
          height: 4px;
          background: #C2C2C4;
          border-radius: 3px;
        }
        .out {
          left: 0;
          width: 100%;
          position: absolute;
          height: 4px;
          background: #D23030;
          border-radius: 3px;
        }
      }
    }
    .other {
      width: 140px;
      i{
        font-size: 20px;
      }
      .mode {
        padding-right: 10px;
      }
      .word {
        padding-right: 10px;
        color: #888;
        font-size: 25px;
        position: relative;
        top: 2px;
      }
      .listContainer {
        width: 50px;
        border-radius: 10px;
        background: #E1E1E2;
        padding: none;
        .list {
          font-size: 18px;
          position: relative;
          top: 2px;
        }
        .num {
          font-size: 13px;
          display: block;
          margin-right: 10px;
        }
      }
    }
}
</style>