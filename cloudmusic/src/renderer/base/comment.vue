<template>
  <ul class="commitList">
      <li class="listItem  alignCenter" v-for="(item,index) in listc" :key="item.id" @contextmenu="showDelete(item)">
            <div class="avaPic" :style="{backgroundImage:`url(${item.user.avatarUrl})`}"></div>
             <div class="avaCommit">
                 <p class="avator">{{item.user.nickname}}:</p><b class="content">{{item.content}}</b>
                 <div class="timeContainer alignCenter">
                     <p class="time">{{item.time | bigTime}}</p>
                     <div class="likeContainer">
                         <span class="like" @click="likeComment(item.commentId,index)"><i class="iconfont icon-dianzan1" :class="{'likeActive':like.includes(item.commentId)}"></i>({{item.likedCount}})</span>
                         <span class="share">分享</span>
                         <span class="replay">回复</span>
                     </div>
                 </div>
             </div>
        </li>
  </ul>
</template>

<script>
import {mapGetters} from 'vuex'
import {Axios,sendComment} from '../common/api'
export default {
    data() {
        return {
            like:[]
        }
    },
    props: ['list','songListId','type'],
    computed: {
        ...mapGetters([
            'nickName'
        ])
    },
    created() {
        this.listc = this.list.slice(0)
    },
    methods: {
        showDelete(item) {
            if(this.nickName == item.user.nickname) {
            this.$alert('是否删除评论', '删除评论', {
            confirmButtonText: '确定',
            callback: (action,instance) => {
                if(action == "confirm") {
                    this.deleteComment(item)
                    this.$message({
                        type: 'success',
                        message: `删除评论成功`
                    });
                }else {
                    this.$message({
                        type: 'info',
                        message: `取消删除`
                    });
                }
                
            }
            });
            }
        },
        deleteComment(item) {
            let params = {
                t: 0,
                type: this.type,
                id: this.songListId,
                commentId:item.commentId,
                timestamp: (new Date()).getTime()
            }
            Axios(sendComment,params).then((res) => {
                this.$emit('deleteComment',item.commentId)
            })
        },
        likeComment(commentId,index) {
            if(this.like.includes(commentId)) {
                let indexs = this.like.indexOf(commentId)
                this.like.splice(indexs,1)
                this.listc[index].likedCount -= 1
                this.$message({
                    type: 'success',
                    message: `取消点赞成功`
                });
                return
            }
            this.like.push(commentId)
            this.listc[index].likedCount += 1
            this.$message({
                type: 'success',
                message: `点赞成功`
            });
        }
    }
}
</script>

<style lang='scss'>
.commitList {
    .listItem {
        padding: 20px 0;
        border-top: 1px solid #F0F0F0;
        height: 80px;
        box-sizing: border-box;
        .avaPic {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-position: center;
            background-size: cover;
            border: 1px solid #ccc;
        }
        .avaCommit {
            cursor: pointer;
            box-sizing: border-box;
            width: 90%;
            margin-left: 10px;
            font-size: 12px;
            .avator {
                margin-right: 5px;
                color:#0A63A8;
                display: inline-block;
                padding-bottom: 6px;
            }
            .content {
                display:inline-block;
                text-overflow:ellipsis;
                position: relative;
                top: 2px;
                width: 70%;
                overflow: hidden;
                white-space: nowrap;
                
            }
            .timeContainer {
                justify-content: space-between;
                font-size: 13px;
                color: rgba(88,88,88,0.6);
                .time {
                    margin-top: 10px;
                    position: relative;
                    font-size: 14px;
                    top: -2px;
                }
                .likeContainer {
                    span {
                        cursor: pointer;
                        padding-right: 10px;
                        padding-left: 10px;
                        border-left: 1px solid #CECECE;
                        &:first-child {
                            border-left: none;
                        }
                        &:hover {
                            color: #888888;
                        }
                    }
                    .likeActive{
                        color:red;
                    }
                }
            }
        }
    }
}
</style>