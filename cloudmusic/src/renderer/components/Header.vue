<template>
  <div class="header alignCenter" style="-webkit-app-region: drag;">
      <div class="logoContainer alignCenter" style="-webkit-app-region: no-drag;" @click="tofind">
          <i class="logo"></i>
          <p class="name">网易云音乐</p>
      </div>
      <div class="searchContainer" style="-webkit-app-region: drag;">
          <span class="prev iconfont icon-zuo" @click="prev" :class="{'active':true}" style="-webkit-app-region: no-drag;"></span><span class="next iconfont icon-you" style="-webkit-app-region: no-drag;" :class="{'active':true}" @click="next" ></span>
          <input type="text" placeholder="搜索音乐，视频，歌词，电台" style="-webkit-app-region: no-drag;" maxlength="14"
          @focus="inithotSearch"  v-model="keywords" @keyup="adviseSearch"  @keyup.enter="searchAll"
          >
          <i class="iconfont icon-sousuo" style="-webkit-app-region: no-drag;" @click="searchAll"></i>
      </div>
      <div class="headerNav alignCenter" style="-webkit-app-region: drag;">
          <i class="iconfont icon-geren" style="-webkit-app-region: no-drag;" v-show="!userName"></i>
          <img class="userimg" :src="avatarUrl" v-show="userName"/>
          <p class="state" style="-webkit-app-region: no-drag;" @click.stop="dialogVisible = true" v-show="!userName">未登录</p>
          <p class="state" style="-webkit-app-region: no-drag;" v-show="userName"  @click="showDrap">{{nickName}}</p>  
          <i class="iconfont icon-xiasanjiao" style="-webkit-app-region: no-drag;" v-if="!userName"></i>
          <i class="iconfont icon-xiasanjiao" style="-webkit-app-region: no-drag;" v-if="userName" @click="showDrap"></i>
          <i class="iconfont icon-yifu" style="-webkit-app-region: no-drag;"></i>
          <i class="iconfont icon-youjian" style="-webkit-app-region: no-drag;"></i>
          <i class="iconfont icon-shezhi-tianchong" style="-webkit-app-region: no-drag;"></i>
          <i>|</i>
          <i class="iconfont icon-jianhao" style="-webkit-app-region: no-drag;" @click="min"></i>
          <i class="iconfont icon-rectangle" style="-webkit-app-region: no-drag;"  @click="max"></i>
          <i class="iconfont icon-code" style="-webkit-app-region: no-drag;" @click="close"></i>
      </div>
      <!-- 登录弹框 -->
      <el-dialog
        title="请输入手机号和密码"
        :visible.sync="dialogVisible"
        :append-to-body='true'
        width="30%"
        :before-close="handleClose">
        <span class="iphone">手机号：</span><input type="text" class="username" v-model="username" placeholder="请输入手机号"> <br>
        <span class="pass">密&nbsp;&nbsp;&nbsp;&nbsp;码：</span><input type="password" class="password" v-model="password" placeholder="请输入密码" @keyup.enter="login">
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="login">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 退出确认弹框 -->
        <el-dialog
            title="是否确认退出"
            :visible.sync="logoutVisible"
            :append-to-body='true'
            width="30%"
            :before-close="handleLogutClose">
            <span slot="footer" class="dialog-footer">
                <el-button @click="logoutVisible = false">取 消</el-button>
                <el-button type="primary" @click="logout">确 定</el-button>
            </span>
        </el-dialog>
        <div class="modules" @click="drap = false,searchDrap = false,adviseDrap = false" v-if="drap || searchDrap || adviseDrap"></div>
        <transition name="fade">
            <div class="dropContainer" v-if="drap">
                <drop-list>
                    <template v-slot:header>
                        <img class="userimg" :src="avatarUrl"/>
                        <p class="state" style="-webkit-app-region: no-drag;">{{nickName}}</p>
                        <p class="sign">签到</p>
                    </template>
                    <ul class="message allCenter">
                        <li><b>0</b><p>动态</p></li>
                        <li><b>3</b><p>关注</p></li>
                        <li><b>1</b><p>粉丝</p></li>
                    </ul>
                    <ul class="other">
                        <li><p><i class="iconfont icon-bendiyinle"></i>会员中心</p><i class="iconfont icon-you"></i></li>
                        <li><p><i class="iconfont icon-dengji"></i>等级</p><i class="iconfont icon-you"></i></li>
                        <li><p><i class="iconfont icon-cart-copy"></i>商城</p><i class="iconfont icon-you"></i></li>
                        <li><p><i class="iconfont icon-shezhi-tianchong"></i>个人信息设置</p><i class="iconfont icon-you"></i></li>
                        <li><p><i class="iconfont icon-shouji"></i>绑定社交账号</p><i class="iconfont icon-you"></i></li>
                    </ul>
                    <template v-slot:footer>
                        <div class="logout" @click.stop="logoutVisible = true">
                            退出登录
                        </div>
                    </template>
                </drop-list>
            </div>
        </transition>
        <transition name="fade">
            <div class="dropContainer2 clearFix" v-if="searchDrap">
                <drop-list :width="450">
                    <template v-slot:header>
                        <div class="hotSearch alignCenter">
                            <i class="iconfont icon-sousuo"></i>
                            <p class="hsTitle">热门搜索</p>
                        </div>
                        <div class="hotSearch alignCenter">
                            <i class="iconfont icon-shijian"></i>
                            <p class="hisTitle">搜索历史</p>
                        </div>
                    </template>
                    <ul class="ItemContainer">
                        <li class="ItemContent" v-for="item in hotSearchList" :key="item.first"
                        @click="hotSearch(item.first)"
                        >{{item.first}}</li>
                    </ul>
                    <ul class="ItemContainer">
                        <p class="nothing" v-if="hisSearchList.length == 0">暂无搜索历史</p>
                        <li class="ItemContent" v-for="(item,index) in hisSearchList" :key="item"
                        @click="keywords = item,searchDrap = false,searchAll()"
                        >{{item}} <i class="iconfont icon-code del" @click.stop="delHisSearchItem(index)"></i></li>
                    </ul>
                </drop-list>
            </div> 
        </transition>
        <transition name = "fade">
            <div class="dropContainer3" v-if="adviseDrap">
                <drop-list :width="230">
                    <template #header>
                        <p class="searchTitle" @click="searchAll">搜“{{keywords}}”相关的结果></p>
                    </template>
                    <div class="adviseItem">
                        <div class="ItemTitle"><i class="iconfont icon-yinle"></i>单曲</div>
                        <ul class="adviseItemContainer">
                            <li class="adviseItemContent" v-for="(item,index) in adviseSongList" :key="index" @click="playSong(item.mid,item.aid,index)">
                                {{item.name}}&nbsp;-&nbsp;{{item.singer}}
                            </li>
                        </ul>
                    </div>
                    <div class="adviseItem">
                        <div class="ItemTitle"><i class="iconfont icon-geren"></i>歌手</div>
                        <ul class="adviseItemContainer">
                            <li class="adviseItemContent" v-for="(item,index) in adviseSearchList.artists" :key="index" @click="toSinger(item.id)">
                                {{item.name}}
                            </li>
                        </ul>
                    </div>
                    <div class="adviseItem">
                        <div class="ItemTitle"><i class="iconfont icon-zhuanji"></i>专辑</div>
                        <ul class="adviseItemContainer">
                            <li class="adviseItemContent" v-for="(item,index) in adviseSearchList.albums" :key="index" @click="toAlbum(item.id)">
                                {{item.name}}&nbsp;-&nbsp;{{item.artist.name}}
                            </li>
                        </ul>
                    </div>
                    <div class="adviseItem">
                        <div class="ItemTitle"><i class="iconfont icon-gedan"></i>歌单</div>
                        <ul class="adviseItemContainer">
                            <li class="adviseItemContent" v-for="(item,index) in adviseSearchList.playlists" :key="index" @click="toSongList(item.id)">
                                {{item.name}}
                            </li>
                        </ul>
                    </div>
                </drop-list>
            </div>
        </transition>
  </div>
</template>

<script>
import axios from 'axios'
import DropList from '../base/DropList'
import {createSong} from '../common/song'
import {mapMutations,mapGetters,mapActions} from 'vuex'
import {Axios,cellLogin,getUserSongList,getUserCollectSinger,getUserLikeMusic,
getUserPlayHistory,Logout,getHotSearch,adviseSearch,getAlbumDetail,getSongUrl,
} from '../common/api'

const {ipcRenderer} = require('electron')

export default {
    data() {
        return {
            isLast: false,
            isFirst: false,
            dialogVisible: false,
            logoutVisible: false,
            drap: false,
            searchDrap: false,
            adviseDrap: false,
            iTime: '',
            id:'',
            params:'',
            username:'',
            password:'',
            keywords:'',
            hotSearchList:[],
            hisSearchList:[],
            adviseSearchList:[],
            adviseSongList:[]
        }
    },
    computed: {
        ...mapGetters([
            'userName',
            'nickName',
            'avatarUrl',
            'collectSongList',
            'collectSinger',
            'playHistoryList',
            'collectSong'
        ])
    }, 
    components: {
        DropList
    },
    created() {
        this.checkLogin()
    },
    methods: {
        // 最小化窗口
        min() {
            ipcRenderer.send('min')
        },
        // 最大化窗口
        max() {
            ipcRenderer.send('max')
        },
        // 关闭窗口
        close() {
            ipcRenderer.send('close')
        },
        // 返回上一层
        prev() {  
            this.$router.go(-1)
        },
        // 返回下一层
        next() { 
            this.$router.go(1)
        },
        // 关闭登录模态框
        handleClose(done) {
            this.dialogVisible = false
        },
        // 关闭确认退出模态框
        handleLogutClose(done) {
            this.logoutVisible = false
        },
        // 回首页
        tofind() {
            this.$router.push('/find')
        },
        // 检查登录状态
        checkLogin() {
            if(!localStorage.getItem("username")) {
                return
            }
            let params = {
                phone: localStorage.getItem("username"),
                password: localStorage.getItem("password"),
                timestamp: (new Date()).getTime()
            }

            Axios(cellLogin,params).then((res) => {
                this.id = res.account.id
                this.params = {
                    uid : this.id
                }
                this.setUserName(localStorage.getItem("username"))
                this.setUserId(res.profile.userId)
                this.setNickName(res.profile.nickname);
                this.setAvatarUrl(res.profile.avatarUrl);
                this.username = '';
                this.password = '';
                this.initCollectSongList()
                this.initCollectSingerList()
                this.initLikeMusic()
                this.initHistory()
            })
        },


        // 登录
        login() {
            let params = {
                phone: this.username,
                password: this.password,
                timestamp: (new Date()).getTime()
            }
            Axios(cellLogin,params).then((res) => {
                this.id = res.account.id
                this.params = {
                    uid : this.id
                }
                this.setUserName(this.username)
                this.setNickName(res.profile.nickname)
                this.setUserId(res.profile.userId)
                this.setAvatarUrl(res.profile.avatarUrl)

                localStorage.setItem("username", this.username)
                localStorage.setItem("nickName", this.nickName)
                localStorage.setItem("avatarUrl", this.avatarUrl)
                localStorage.setItem("password", this.password)
                localStorage.setItem("userId", res.profile.userId)

                this.username = ''
                this.password = ''

                this.initCollectSongList()
                this.initCollectSingerList()
                this.initLikeMusic()
                this.initHistory()
            }).catch(()=>{
                alert('手机号或者密码错误')
                this.username = ''
                this.password = ''
            })
            this.dialogVisible = false
        },
        // 退出登录
        logout() {
            Axios(Logout).then((result) => {
                this.setUserName('')
                this.setNickName('')
                this.setAvatarUrl('')
                localStorage.setItem("username", '');
                localStorage.setItem("nickName", '');
                localStorage.setItem("avatarUrl", '');
                localStorage.setItem("password", '');
                localStorage.setItem("userId", '');
                this.drap = false;
                this.logoutVisible = false
                this.$router.push('/find/recommend')
            })
        },
        //  初始化用户歌单列表
        initCollectSongList() {
            Axios(getUserSongList,this.params).then((res) => {
                let ret = []
                res.playlist.forEach((item) => {
                    ret.push(item.id)
                })
                this.set_collectSongList(ret)
            })
        },

        // 初始化用户收藏歌手列表
        initCollectSingerList() {
            Axios(getUserCollectSinger,this.params).then((res) => {
                let ret = []
                res.data.forEach((item) => {
                    ret.push(item.id)
                })
                this.set_collectSinger(ret)
            })
        },
        // 初始化喜欢音乐
        initLikeMusic() {
            Axios(getUserLikeMusic,this.params).then((res) => {
                this.set_collectSong(res.ids)
            })
        },

        // 初始化播放历史
        initHistory() {
            let params = {
                uid:this.id,
                type:1
            }
            Axios(getUserPlayHistory,params).then((res) => {
                let list = []
                res.weekData.forEach((item) => {
                    list.push(item.song)
                })
                this._normalizeSongs(list)
            })
        },
        _normalizeSongs(list) {
            let ret = []
            for(let i = 0; i < list.length; i ++) {
                ret.push(createSong(list[i]))
            }
            this.setPlayHistoryList(ret)
            return ret
        },
        // 展示下拉框
        showDrap() {
            this.drap = !this.drap;
        },
        
        // 初始化热搜列表
        inithotSearch() {
            if(this.keywords != '') {
                this.adviseDrap = true
                this.adviseSearch()
            }else{
                this.searchDrap = true
                if(this.hotSearchList.length > 0) {
                    return
                }
                Axios(getHotSearch).then((res) => {
                    this.hotSearchList = res.result.hots
                })
                if(localStorage.getItem('hisSearchList')) {
                    this.hisSearchList = JSON.parse(localStorage.getItem('hisSearchList'))
                }
            }
        },
        //  搜索热搜内容
        hotSearch(keywords) {
            this.keywords = keywords
            this.searchDrap = false
            if(this.hisSearchList.includes(keywords)) {
                let index = this.hisSearchList.indexOf(keywords)
                this.hisSearchList.splice(index,1)
                this.hisSearchList.unshift(keywords)
                localStorage.setItem('hisSearchList',JSON.stringify(this.hisSearchList))
            }else {
                this.hisSearchList.push(keywords)
                localStorage.setItem('hisSearchList',JSON.stringify(this.hisSearchList))
            }
            this.searchAll()
        },
        //  删除搜索历史记录
        delHisSearchItem(index) {
            this.hisSearchList.splice(index,1)
            localStorage.setItem('hisSearchList',JSON.stringify(this.hisSearchList))
        },
        //  显示建议搜索的内容
        adviseSearch() {
            clearTimeout(this.iTime);
            this.iTime = setTimeout(() => {
                if(this.keywords == "") {
                    this.searchDrap = true
                    this.adviseDrap = false
                    return
                }else{
                    this.searchDrap = false
                    this.adviseDrap = true
                    let params = {
                        keywords: this.keywords
                    }
                    Axios(adviseSearch,params).then((res) => {
                        this.adviseSearchList = res.result
                        this.adviseSongList = this._normalizeSongs(this.adviseSearchList.songs)
                    })
                }
            }, 200);
        },
        playSong(mid,aid,index) {

            Axios(getAlbumDetail,{
                id: aid
            }).then((res) => {
                let picUrl = res.album.picUrl
                this.adviseSongList[index].picUrl = picUrl
            })
            Axios(getSongUrl,{
                id: mid
            }).then((res) => {
                let url = res.data[0].url
                this.adviseSongList[index].url = url
                this.insertSong(this.adviseSongList[index])
                this.adviseDrap = false 
            })
        },
        toSinger(id) {
            this.$router.push(`/find/singer/${id}`)
            this.adviseDrap = false
        },
        toSongList(id) {
            this.$router.push(`/find/songlist/${id}`)
            this.adviseDrap = false
        },
        toAlbum(id) {
            this.$router.push(`/album/${id}`)
            this.adviseDrap = false
        },
        searchAll() {
            this.$router.push(`/search/${this.keywords}`)
            this.adviseDrap = false
            this.searchDrap = false
        },
        ...mapMutations({
            setUserName: 'SET_USERNAME',
            setNickName: 'SET_NICKNAME',
            setUserId: 'SET_USERID',
            setAvatarUrl: 'SET_AVATARURL',
            set_collectSongList:'SET_COLLECTSONGLIST',
            set_collectSinger:'SET_COLLECTSINGER',
            set_collectSong:'SET_COLLECTSONG',
            setPlayHistoryList:'SET_PLAYHISTORYLIST',
        }),
        ...mapActions([
            'insertSong'
        ])
    },
}
</script>

<style lang="scss">
@import '../assets/css/base.scss';
    .username, .password{
        height: 30px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        padding-left: 10px;
    }
    .header {
        width: 100%;
        height: 50px;
        position: fixed;
        top: 0;
        z-index: 999;
        background: #C62F2F;
        .dialog-footer {
            margin-right: 60px;
        }
        .modules {
            position: fixed;
            width: 100%;
            height: 1000%;
        }
        .dropContainer {
            cursor: pointer;
            position: absolute;
            top: 50px;
            height:370px;
            right: 440px;
            opacity: 1;
            &::before {
                content:'';
                background: #FAFAFA;
                height: 15px;
                width: 15px;
                position: absolute;
                top: -7px;
                left: 130px;
                z-index: 201;
                transform: rotate(135deg);
            }
            .userimg {
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 50%;
                margin: 20px 10px 0 20px;
            }
            .state {
                display: inline-block;
                position: relative;
                top: -10px;
                font-size: 15px;
                color: black;
            }
            .sign {
                width: 60px;
                position: absolute;
                top: 30px;
                right: 10px;
                height: 25px;
                border: 1px solid $borderColor;
                border-radius: 5px;
                font-size: 12px;
                line-height: 25px;
                text-align: center;
            }
            .message {
                width: 100%;
                height: 70px;
                border-bottom: 1px solid $borderColor;
                li {
                    width:33.3333%;
                    b,p {
                        text-align: center;
                        width: 100%; 
                    }
                    b{
                        font-size: 20px;
                        font-weight: bold;
                        display: block;
                        margin-bottom: 5px;
                    }
                    p{
                        color: #444444;
                        font-size: 12px
                    }
                    
                }
            }
            .other {
                li {
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    height: 38px;
                    width: 100%;
                    transition: all 0.2s ease-in;
                    p {
                        padding: 15px 20px;
                        font-size: 13px;
                        i {
                            font-size: 18px;
                            color: #8F8E94;
                        }
                    }
                    i {
                        padding: 18px 10px;
                        color: #D5D5D6;
                        font-size: 12px;
                    }
                    &:hover{
                        transition: all 0.2s ease-in;
                        background: #EBECED;
                    }
                }
            }
            .logout {
                border-top: 1px solid $borderColor;
                padding: 15px 30px;
                box-sizing: border-box;
                font-size: 13px;
                width: 100%;
                cursor: pointer;
                transition: all 0.2s ease-in;
                &:hover{
                        background: #EBECED;
                        transition: all 0.2s ease-in;
                    }
            }
        }
        .fade-enter,.fade-leave-to {
            opacity: 0;
        }
        .fade-enter-active,.fade-leave-active {
            transition: opacity .2s ease-in;
        }
        .logoContainer {
            width: 0 0 180px;
            cursor: pointer;
            .logo {
            display: block;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: url('/static/logo.jpg');
            background-size: 22px 22px;
            margin-left: 15px;
            }
            .name {
                color: white;
                font-weight: bold;
                margin-left: 5px;
                line-height: 25px;
                font-family:"幼圆";
            }
        }
        .searchContainer {
            flex: 0 0 360px;
            margin-left: 130px;
            span.active {
                color:white;
            }
            .prev,.next{
                border: 1px solid #A82828;
                padding: 3px;
                color: rgba(255,255,255,0.5);
                font-size: 12px;
            }
            .next {
                border-left:none;
                margin-right: 8px;
            }
            input {
                height: 22px;
                width: 220px;
                background: rgba(0,0,0,0.2);
                border-radius: 10px;
                padding-left: 10px;
                color: white;
                box-sizing: border-box;
                font-size: 13px;
                &::placeholder {
                    font-size: 12px;
                    color: #C77373;
                }
                &:focus{
                    border:none;
                    outline: none;
                }
            }
            .icon-sousuo {
                position: relative;
                left: -30px;
                font-size: 14px;
                color: #C77373;
                &:hover{
                    color: white;
                    transition: color .2s ease-in;
                }
            }
        }
        .headerNav {
            flex: 1 0 auto;
            display: flex;
            justify-content: flex-end;
            cursor: pointer;
            .userimg {
                width: 25px;
                height: 25px;
                border: none;
                border-radius: 50%;
            }
            i {
                padding-left: 25px;
                color: rgba(255,255,255,.6);
                &:hover{
                    color: white;
                    transition: color .2s ease-in;
                }
                &:first-child{
                    font-size: 22px;
                }
                &:nth-of-type(2) {
                    padding-left: 5px;
                }
                &:last-child, &:nth-last-of-type(2){
                    padding-left: 8px;
                }
                &:last-child {
                    padding-right: 15px;
                }
            }
            .state {
                &:hover {
                    color: rgb(255,255,255);
                    transition: color .2s ease-in;
                }
                font-size: 12px;
                color: rgba(255,255,255,.6);
                padding-left: 8px;
            }
        }
        .dropContainer2 {
            width: 450px;
            height: 330px;
            position: absolute;
            top: 50px;
            left: 300px;
            &::before {
                content:'';
                background: #FAFAFA;
                height: 15px;
                width: 15px;
                position: absolute;
                top: -7px;
                left: 30px;
                z-index: 201;
                transform: rotate(135deg);
            }
            .hotSearch,.ItemContainer {
                font-size: 13px;
                width: 50%;
                float: left;
                box-sizing: border-box;
                padding: 10px 10px;
                color:#888888;
                border-right: 1px solid $borderColor;
                border-bottom: 1px solid $borderColor;
                &:last-child {
                    border-right: none;
                }
                .iconfont {
                    font-size: 12px;
                    margin-right: 5px;
                }
            }
            .ItemContainer{
                position: relative;
                height: 296px;
                padding: 0;
                .ItemContent {
                    position: relative;
                    font-size: 13px;
                    color:#333;
                    line-height: 28px;
                    padding-left: 25px;
                    cursor: pointer;
                    &:hover {
                        background: #EBECED;
                    }
                    .del {
                        position: absolute;
                        right: 0;
                        width: 25px;
                        height: 25px;
                        text-align: center;
                    }
                }
                .nothing {
                    font-size: 20px;
                    margin: 100px 50px;
                }
            }
        }
        .dropContainer3 {
            width: 230px;
            height: 400px;
            position: absolute;
            top: 50px;
            left: 300px;
            &::before {
                content:'';
                background: #FAFAFA;
                height: 15px;
                width: 15px;
                position: absolute;
                top: -7px;
                left: 30px;
                z-index: 201;
                transform: rotate(135deg);
            }
            .searchTitle {
                cursor: pointer;
                margin: 10px;
                font-size: 13px;
                color: #555;
                &:hover {
                    color: #333;
                }
            }
            .adviseItem {
                margin-bottom: 10px;
                .ItemTitle {
                    padding-left: 10px;
                    margin-bottom: 10px;
                    font-size: 13px;
                    color:#333333;
                    .iconfont {
                        font-size: 13px;
                        margin-right: 8px;
                    }
                }
                .adviseItemContainer {
                    font-size: 13px;
                    
                    .adviseItemContent {
                        box-sizing: border-box;
                        line-height: 28px;
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        padding-left: 28px;
                        &:hover {
                            cursor: pointer;
                            background: #EBECED;
                        }
                    }
                }
            }
        }
    }
</style>
    