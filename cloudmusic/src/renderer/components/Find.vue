<template>
  <div class="find">
      <nav>
          <ul class="allCenter navContainer">
              <li>
                  <router-link to="/find/recommend">个性推荐</router-link>
              </li>
              <li>
                  <router-link to="/find/songlist">歌单</router-link>
              </li>
              <li>
                  <router-link to="/find/transceiver">主播电台</router-link>
              </li>
              <li>
                  <router-link to="/find/rankinglist">排行榜</router-link>
              </li>
              <li>
                  <router-link to="/find/singer">歌手</router-link>
              </li>
              <li>
                  <router-link to="/find/newmusic">最新音乐</router-link>
              </li>
          </ul>
      </nav>
      <router-view/>
  </div>
</template>

<script>
export default {

}
</script>

<style lang='scss'>
@media screen and (min-width:670px){
.find {
    position: relative;
    margin-left: 200px;
    box-sizing: border-box;
    padding: 0 30px 0 30px;
    margin-top: 50px;
    .navContainer {
        border-bottom: 1px solid #E1E1E2;
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
        width: 1100px;
        padding: 0 30px 0 230px;
        margin: 50px auto;
    }
}
</style>