<template>
  <div class="bottom alignCenter" ref="bottom">
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
      <div class="listContainer alignCenter" @click="showDrop=!showDrop">
        <i class="iconfont icon-bofangliebiao list" ></i>
        <span class="num">{{playList.length}}</span>
      </div>
    </div>
    <audio ref="audio" :src="currentSong.url" @timeupdate="updateTime" @ended="end" autoplay>

    </audio>
    <div class="dropListContainer" v-if="showDrop">
      <dropList :width="580">
          <template v-slot:header>
              <div class="bplayContainer allCenter">
                  <div class="bplayItem" :class="{'active':activeCur== 'playList'}"
                  @click="activeCur ='playList'"
                  >
                    播放列表
                    </div>
                  <div class="bplayItem" :class="{'active':activeCur== 'playHistory'}"
                  @click="activeCur ='playHistory'"
                  >
                    历史记录
                    </div>
              </div>
          </template>
          <div class="bDetail spCenter alignCenter">
            <p class="bNum" v-if="activeCur == 'playList'">共{{sequenceList.length}}首</p>
            <p class="bNum" v-if="activeCur == 'playHistory'">共{{playHistoryList.length}}首</p>
            <div class="bControl alignCenter">
              <div class="bCollection">
                <i class="iconfont icon-shoucanggedan"></i>
                <span class="bcol">收藏全部</span>
              </div>
              <div class="bClear">
                <i class="iconfont icon-lajixiang"></i>
                <span class="bcle">清空</span>
              </div>
            </div>
          </div>
          <div class="albumContainer">
            <album :Songs="sequenceList" :types="3" :width='100' :nameWidth="55" :show="activeCur == 'playList'" :key="`value:${renderAlbum1}`">
            </album>

            <album :Songs="playHistoryList" :types="4" :width='100' :nameWidth="55" :show="activeCur == 'playHistory'" :key="`value:${renderAlbum2}`">
            </album>
          </div>
            
      </dropList>
    </div>
    <div class="modules" @click="showDrop = false" ref="modules" v-show="showDrop"
    style="position: fixed;
            width: 100%;
            top: 0;
            left: 0;
            z-index: 99;
            height: 630px;"
    ></div>
  </div>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from 'vuex'
import axios from 'axios'
import DropList from '../base/DropList'
import Album from '../components/Album'

const offSetLeft = 250
const boxWidth = 12

export default {
  data() {
    return {
      timeWidth: 0,
      time: 0,
      activeCur:'playList',
      currentTime:0,
      timeSchedule:0,
      showDrop:false,
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
      'sequenceList',
      'currentIndex',
      'playing',
      'playHistoryList'
    ]),
    renderAlbum1() {
      if(this.activeCur==="playList") {
        return 1
      }
      return 2
    },
    renderAlbum2() {
      if(this.activeCur==="playHistory") {
        return 3
      }
      return 4
    },
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
  components: {
    DropList,
    Album
  },
  watch: {
    currentTime(newVal) {
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
  mounted() {
    this.init()
  },
  updated() {
    //  设置进度条的宽度
    this.timeWidth = this.$refs.timeContainer.offsetWidth
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
    init() {
      //  设置vuex中的audio，提供给歌曲详情页使用
      this.setAudio(this.$refs.audio)
      //  设置进度条的宽度
      this.timeWidth = this.$refs.timeContainer.offsetWidth
      //  设置蒙版层的高度，不遮住底部
      this.$refs.modules.style.height = document.documentElement.clientHeight - this.$refs.bottom.clientHeight
      
      window.onresize = () => {
        this.timeWidth = this.$refs.timeContainer.offsetWidth
        setTimeout(() => {
          this.$refs.modules.style.height = `${document.documentElement.clientHeight - this.$refs.bottom.clientHeight}px`
        }, 200);    
    }
    },
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

      let index = this.sequenceList.findIndex((item) => {
         return item == this.currentSong
      })

      if(this.nowMode == this.mode[2]) {
          this.setCurrentIndex(index)
          this.setPlayList(this.sequenceList)
        return
      }else {
        this.selectPlay({
                list:this.sequenceList,
                index:this.currentIndex
              })
      }
      
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
      if(this.playList === 1 || this.nowMode === this.mode[2]) {
        this.loop()
      }else if(this.nowMode === this.mode[0]) {
        let index = this.currentIndex + 1
        if(index === this.playList.length) {
          index = 0
        }
        this.setPlayList(this.sequenceList)
        this._getUrl(this.playList[index].mid,index)
      }else{
        let index = this.currentIndex
        this.setPlayList(this.sequenceList)
        /*标记*/
        this._getUrl(this.playList[index].mid,index)
      }
    },
    prev() {
      if(!this.currentSong.duration) {
        return 
      }
      this.setPlayState(true)
      if(this.playList === 1  || this.nowMode === this.mode[2]) {
        this.loop()
      }else if(this.nowMode === this.mode[0]) {
        let index = this.currentIndex - 1
        if(index === - 1) {
          index = this.playList.length - 1
        }
        this.setPlayList(this.sequenceList)
        this._getUrl(this.playList[index].mid,index)
      }else {
        /*标记*/
        let index = this.currentIndex
        this.setPlayList(this.sequenceList)
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
      // if(this.playList[index].url) {
      //   let list = this.playList.slice(0)
      //   this.setPlayList(list)
      //   this.setCurrentIndex(index)
      //   return 
      // }
      axios.get('http://localhost:3000/song/url',{
        params: {
            id: mid
        }
        }).then((result) => {
            let res = result.data
            let url = res.data[0].url
            let list = this.playList.slice(0)
            list[index].url = url   
            this.selectPlay({
              list:this.sequenceList,
              index:index
            })
        })
    },
    ...mapActions([
      'selectPlay',
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
    .modules {
            
        }
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
    .dropListContainer  {
      position: absolute;
      right: 0;
      height: 470px;
      top: -470px;
      width: 580px;
      .bplayContainer {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #E1E1E2;
        .bplayItem {
          font-size: 14px;
          padding: 5px 30px;
          border-top: 1px solid #E1E1E2;
          border-bottom: 1px solid #E1E1E2;
          color: #555555;
          cursor: pointer;
          &:first-child {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
            border-right: 1px solid #E1E1E2;
            border-left: 1px solid #E1E1E2;
          }
          &:last-child {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            border-right: 1px solid #E1E1E2;
          }
          &.active {
            background: #7C7D85;
            color:#f1f1f1;
          }
        }
      }
      .bDetail {
        width: 100%;
        height: 30px;
        color: #666666;
        font-size: 13px;
        border-bottom: 1px solid #EBECED;
        .bNum {
          padding: 5px 20px;
        }
        .bCollection {
          padding-right: 10px;
          border-right: 1px solid #E1E1E2;
          .icon-shoucanggedan {
            font-size: 15px;
          }
        }
        .bClear {
          padding-left: 10px;
          padding-right: 20px;
        }
      }
      .albumContainer {
        height:390px; 
        overflow:hidden;
        overflow-y: scroll;
        &::-webkit-scrollbar {
        width: 10px;
        }
        &::-webkit-scrollbar-thumb {
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            border-radius: 10px;
            background: rgba(236,236,236,1);
            &:hover {
              background: #CFCFD1;
            }
        }
        &::-webkit-scrollbar-track {
            border-right:1px solid rgba(100,100,100,.2);
            background: rgba(188,188,188,.1);
        }
          }
    }
}
</style>