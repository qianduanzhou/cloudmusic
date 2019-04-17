<template>
  <div id="app">
    <music-header></music-header>
    <music-nav :key="uid"></music-nav>
    <div class="RootContainer" ref="RootContainer" 
      style=
      "height: 570px;
      width: 840px;
      margin-top: 50px;
      margin-bottom: 50px;">
      <router-view :root="$refs.RootContainer" :key="Math.random()"></router-view>
    </div>
    <play-bottom></play-bottom>
  </div>
</template>

<script>
  import MusicHeader from './components/Header'
  import MusicNav from './components/Nav'
  import PlayBottom from './components/playBottom'

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
      this.uid = parseInt(localStorage.getItem('userId'))
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.$refs.RootContainer.style.width = `${document.documentElement.offsetWidth - 200}px`
        this.$refs.RootContainer.style.height = `${document.documentElement.clientHeight - 100}px`
        window.onresize = () => {
          setTimeout(() => {
            this.$refs.RootContainer.style.width = `${document.documentElement.offsetWidth - 200}px`
            this.$refs.RootContainer.style.height = `${document.documentElement.clientHeight - 100}px`
          }, 200);
          }
      }
    }
  }
</script>

<style lang="scss">
  @import url('./assets/css/reset');

  @import './assets/iconfont/iconfont.css';

  @import url('./assets/css/base');

  #app {
    background: #FAFAFA;
    
    .RootContainer {
      height: 570px;
      width: 840px;
      margin-top: 50px;
      margin-bottom: 50px; 
      margin-left: 200px;
      overflow: auto;
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
    /* @media screen and (min-height:670px){
      .aaa {
        height: 570px;
      }
    }
    @media screen and (min-height:800px){
      .aaa {
        height: 700px;
      }
    }
    @media screen and (min-height:900px){
      .aaa {
        height: 800px;
      }
    }
    @media screen and (min-height:1000px){
      .aaa {
        height: 900px;
      }
    }
    @media screen and (min-height:1040px){
      .aaa {
        height: 940px;
      }
    } */
  }
</style>
