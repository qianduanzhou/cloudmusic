<template>
  <div class="header alignCenter" style="-webkit-app-region: drag;">
      <div class="logoContainer alignCenter" style="-webkit-app-region: no-drag;" @click="tofind">
          <i class="logo"></i>
          <p class="name">网易云音乐</p>
      </div>
      <div class="searchContainer">
          <span class="prev iconfont icon-zuo" @click="prev" :class="{'active':true}" style="-webkit-app-region: no-drag;"></span><span class="next iconfont icon-you" style="-webkit-app-region: no-drag;" :class="{'active':true}" @click="next" ></span>
          <input type="text" placeholder="搜索音乐，视频，歌词，电台" style="-webkit-app-region: no-drag;">
          <i class="iconfont icon-sousuo" style="-webkit-app-region: no-drag;"></i>
      </div>
      <div class="headerNav alignCenter">
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
        <span class="pass">密&nbsp;&nbsp;&nbsp;&nbsp;码：</span><input type="password" class="password" v-model="password" placeholder="请输入密码" @keydown="login">
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
        <div class="modules" @click="drap = false" v-if="drap"></div>
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
  </div>
</template>

<script>
import axios from 'axios'
import DropList from '../base/DropList'


import {mapMutations,mapGetters,mapState} from 'vuex'


const {ipcRenderer} = require('electron')

export default {
    data() {
        return {
            isLast:false,
            isFirst:false,
            dialogVisible: false,
            logoutVisible: false,
            drap:false,
            username:'',
            password:''
        }
    },
    computed: {
        ...mapGetters([
            'userName',
            'nickName',
            'avatarUrl'
        ])
    }, 
    components: {
        DropList
    },
    mounted() {
        if(!this.userName) {
            this.setUserName(localStorage.getItem("userName"))
            this.setNickName(localStorage.getItem("nickName"))
            this.setAvatarUrl(localStorage.getItem("avatarUrl"))
        }
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
        // 登录
        login() {
            axios.get('http://localhost:3000/login/cellphone',{
                params: {
                    phone: this.username,
                    password: this.password
                }
            }).then((result) => {
                let res = result.data
                if(res.code == 200) {
                    this.setUserName(res.account.userName);
                    this.setNickName(res.profile.nickname);
                    this.setAvatarUrl(res.profile.avatarUrl);
                    localStorage.setItem("userName", this.userName);
                    localStorage.setItem("nickName", this.nickName);
                    localStorage.setItem("avatarUrl", this.avatarUrl);
                    this.username = '';
                    this.password = '';
                }    
            }).catch(()=>{
                alert('手机号或者密码错误')
            })
            this.dialogVisible = false
        },
        // 展示下拉框
        showDrap() {
            this.drap = !this.drap;
        },
        // 退出登录
        logout() {
            axios.get('http://localhost:3000/logout').then((result) => {
                var res = result.data
                if(res.code == 200) {
                    this.setUserName('')
                    this.setNickName('')
                    this.setAvatarUrl('')
                    localStorage.setItem("userName", '');
                    localStorage.setItem("nickName", '');
                    localStorage.setItem("avatarUrl", '');
                    this.drap = false;
                    this.logoutVisible = false
                }
            })
        },
        ...mapMutations({
            setUserName: 'SET_USERNAME',
            setNickName: 'SET_NICKNAME',
            setAvatarUrl: 'SET_AVATARURL'
        })
    }
}
</script>

<style lang="scss">
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
                border: 1px solid #E1E1E2;
                border-radius: 5px;
                font-size: 12px;
                line-height: 25px;
                text-align: center;
            }
            .message {
                width: 100%;
                height: 70px;
                border-bottom: 1px solid #E1E1E2;
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
                border-top: 1px solid #E1E1E2;
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
    }
</style>
    