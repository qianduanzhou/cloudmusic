<template>
  <div id="app">
    <music-header></music-header>
    <music-nav :key="uid"></music-nav>
    <div class="RootContainer scrollStyle" ref="RootContainer" 
      style=
      "height: 570px;
      width: 840px;
      margin-top: 50px;
      margin-bottom: 50px;">
      
      <transition :name="transitionName" mode="out-in"> 
        <keep-alive include="fm">
          <router-view :root="$refs.RootContainer"
          ></router-view>
        </keep-alive>
      </transition>
      
    </div>
    <play-bottom></play-bottom>
  </div>
</template>

<script>
  import MusicHeader from './components/Header'
  import MusicNav from './components/Nav'
  import PlayBottom from './components/playBottom'
  import {initPage} from './common/utils'
  export default {
    name: 'cloudmusic',
    data() {
      return {
        transitionName: 'slide-right' 
      }
    },
    components: {
      MusicHeader,
      MusicNav,
      PlayBottom
    },
    created() {
      console.log('created')
      this.uid = parseInt(localStorage.getItem('userId'))
    },
    mounted() {
      this.init()
    },
    watch: {
      '$route' (to, from) {
          let isBack = this.$router.isBack  //  监听路由变化时的状态为前进还是后退
  　　　　if(isBack) {
  　　　　　　this.transitionName = 'slide-right'
  　　　　} else {
  　　　　    this.transitionName = 'slide-left'
  　　　　 }
      }　
    },
    methods: {
      init() {
        setTimeout(() => {
          let outside = document.documentElement,
          innerside = this.$refs.RootContainer
          initPage(outside,innerside)
        }, 500);
      },
    }
  }
</script>

<style lang="scss">
  @import url('./assets/css/reset');

  @import './assets/iconfont/iconfont.css';

  @import url('./assets/css/base');
  @import './assets/css/base.scss';
  #app {
    background: #FAFAFA;
    .slide-left-enter, .slide-right-leave-to,{
      opacity: 0;
      transform: translate(-100%, 0);
    }
    .slide-left-enter-active,.slide-left-leave-active,.slide-right-enter-active,.slide-right-leave-active{
      transition: all .3s ease-in;
    }
    .slide-right-enter,.slide-left-leave-to {
      opacity: 0;
      transform: translate(100%, 0);
    }
    .RootContainer {
      height: 570px;
      width: 880px;
      margin-top: 50px;
      margin-bottom: 50px; 
      margin-left: 200px;
      overflow: auto;
      opacity: 1;
      border-left: 1px solid $borderColor;
    }
  }
</style>
