<template>
  <div class="find" ref="find">
      <nav>
          <ul class="allCenter navContainer">
              <li>
                  <router-link to="/find/recommend">个性推荐</router-link>
              </li>
              <li>
                  <router-link to="/find/songlist">歌单</router-link>
              </li>
              <!-- <li>
                  <router-link to="/find/transceiver">主播电台</router-link>
              </li> -->
              <li>
                  <router-link to="/find/rankinglist">排行榜</router-link>
              </li>
              <li>
                  <router-link to="/find/singer">歌手</router-link>
              </li>
              <!-- <li>
                  <router-link to="/find/newmusic">最新音乐</router-link>
              </li> -->
          </ul>
      </nav>
      <transition :name="transitionName" mode="out-in"> 
        <router-view :key="Math.random()" :root="root"/>
      </transition>
  </div>
</template>

<script>
import {mapMutations,mapGetters} from 'vuex'
export default {
    props:['root'],
    computed: {
        ...mapGetters([
            'scroll'
        ])
    },
    mounted() {
    },
    watch: {
      '$route' (to, from) {
    　　　　let isBack = this.$router.isBack //  监听路由变化时的状态为前进还是后退
    　　　　if(isBack) {
    　　　　　　this.transitionName = 'slide-right'
    　　　　} else {
    　　　　    this.transitionName = 'slide-left'
    　　　　 }
    　　}
    },
    methods: {
        ...mapMutations({
            set_scroll:'SET_SCROLL'
        })
    }
}
</script>

<style lang='scss'>
@import '../assets/css/base.scss';
@media screen and (min-width:670px){
.find {
    position: relative;
    box-sizing: border-box;
    padding: 0 30px 0 30px;
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
    .navContainer {
        border-bottom: 1px solid $borderColor;
        li {
            a {
                display: block;
                padding: 15px 20px 15px 20px;
                color: rgb(0,0,0);
                font-size: 14px;
                text-decoration: none;
                position: relative;
                &:hover{
                    color: #C62F2F;
                    transition: color .2s ease-in;
                }
                &.router-link-active {
                    color: #C62F2F;
                }
                &.router-link-active:before {
                    content:'';
                    width: 70%;
                    height: 3px;
                    background: #C62F2F;
                    position: absolute;
                    left: 13px;
                    bottom: 0;
                }
            }
            
        }
    }
}
}
@media screen and (min-width:1100px){
    .find {
        width: 900px;
        padding: 0 30px 0 30px;
        margin: 0 auto;
    }
}
</style>