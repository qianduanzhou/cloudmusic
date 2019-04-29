import {run} from './d3'
import { mapGetters,mapMutations} from 'vuex'
import {Axios,likeMusic,collectSongList} from './api'


export const lyricMixin = {
    data() {
        return {
            timer:'',
            cur: 0,
            currentTime:0,
            mousein:false,
            lyc:[],
        }
    },
    computed: {
        ...mapGetters([
            'currentSong',
            'playing',
            'audio',
            'collectSong'
        ]),
    },
    created() {
        this.id = parseInt(this.currentSong.mid)
    },
    watch: {
        
    },
    updated(){
        this.toWordPosition()
    },
    methods: {
        // 调到指定歌词
        toWord() {
            var _this = this
            this.audio.addEventListener("timeupdate",function(e){
                let currentTime = e.target.currentTime
                for(let key in _this.lyc) {
                    if(key == Math.floor(currentTime)) {
                        if(_this.lyc[key] == "&#8197;") {
                            continue;
                        }
                        _this.cur = key
                    }
                }
            });
        },
        // 调到指定歌词的位置
        toWordPosition() {
            if(this.mousein) {
                return 
            }
            this.$nextTick(() => {
                let lis = this.$refs.wordContainer.children
                setTimeout(() => {
                    clearTimeout(this.timer)
                    for(let i = 0; i < lis.length; i ++) {
                        if(lis[i].classList[1] == "active" && lis[i-1]) {
                            let prevOffsetTop = lis[i-1].offsetTop ? lis[i-1].offsetTop : '',
                            nowOffsetTop = lis[i].offsetTop ? lis[i].offsetTop : '',
                            diff = nowOffsetTop - prevOffsetTop,
                            t = 0,
                            d = 30,
                            height = this.$refs.outsideContainer.offsetHeight
                            run(this.$refs.outsideContainer,this.timer,t,prevOffsetTop,diff,d,height)
                        }
                    }
                }, 50);
            })
        }
    }
}


export const collectMusic = {
    computed: {
        ...mapGetters([
            'currentSong',
            'collectSong'
        ])
    },
    methods: {
        created() {
            this.id = parseInt(this.currentSong.mid)
        },
        //收藏
        collect() {
            let params = {
                like:true,
                id: this.id,
                timestamp: (new Date()).getTime()
            }
            Axios(likeMusic,params).then((res) => {
                let collectList = this.collectSong.slice(0)
                collectList.push(this.id)
                this.set_collectSong(collectList)
                this.$message({
                    type:'success',
                    message:'喜欢该音乐成功',
                    center: true
                });
            })   
        },
        //取消收藏
        canCollect() {
            let params =  {
                    like:false,
                    id: this.id,
                    timestamp: (new Date()).getTime()
            }
            Axios(likeMusic,params).then((res) => {
                let collectList = this.collectSong.slice(0)
                let index = collectList.findIndex((item) => {
                    return item == this.id
                })
                collectList.splice(index,1)
                this.set_collectSong(collectList)
                this.$message({
                    type:'success',
                    message:'取消喜欢成功',
                    center: true
                });
            })  
        },
        isCollect() {
            return this.collectSong.includes(this.id)
        },
        ...mapMutations({
            set_collectSong:'SET_COLLECTSONG'
        })
    }
}

export const collectPlayList = {
    computed: {
        ...mapGetters([
            'collectSongList' 
         ]),
        isCollect() {
            return this.collectSongList.includes(this.id)
        }
    },
    methods: {
        collect() {
            let params = {
                t: 1,
                id: this.id,
                timestamp: (new Date()).getTime()   
            }
            Axios(collectSongList,params).then((res) => {
                let collectList = this.collectSongList.slice(0)
                collectList.push(this.id)
                this.set_collectSongList(collectList)
                this.collectNum += 1
                this.$message({
                    type:'success',
                    message:'收藏成功',
                    center: true
                });
            })        
        },
        canCollect() {
            if(this.$route.query.me) {
                this.$message({
                    type:'error',
                    message:'不能取消自己创建的歌单哦',
                    center: true
                });
                return
            }
            let params = {
                t: 2,
                id: this.id,
                timestamp: (new Date()).getTime()
            }
            Axios(collectSongList,params).then((res) => {
                let collectList = this.collectSongList.slice(0)
                let index = collectList.findIndex((item) => {
                    return item == this.id
                })
                collectList.splice(index,1)
                this.set_collectSongList(collectList)
                this.collectNum -= 1
                this.$message({
                    type:'success',
                    message:'取消收藏成功',
                    center: true
                });
            })      
        },
        ...mapMutations({
            set_collectSongList:'SET_COLLECTSONGLIST'
         })
    }
}

export const toSAS = {
    methods: {
        toSinger() {
            this.$router.push(`/singerDetail/${this.currentSong.id}`)
        },
        toAlbum() {
            this.$router.push(`/album/${this.currentSong.aid}`)
        },
        toSongList(data) {
            this.$router.push(`/songListDetail/${data.id}`)
        },
    }
}

export const setLoading = {
    created() {
        this.set_loading(true)
    },
    methods: {
        ...mapMutations({
            set_loading:'SET_LOADING'
        })
    }
}