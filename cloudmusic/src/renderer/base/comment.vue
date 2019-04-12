<template>
  <ul class="commitList">
      <li class="listItem  alignCenter" v-for="item in list" :key="item.id" @contextmenu="showDelete(item)">
            <div class="avaPic" :style="{backgroundImage:`url(${item.user.avatarUrl})`}"></div>
             <div class="avaCommit">
                 <p class="avator">{{item.user.nickname}}:</p><b class="content">{{item.content}}</b>
                 <div class="timeContainer alignCenter">
                     <p class="time">{{item.time | bigTime}}</p>
                     <div class="likeContainer">
                         <span class="like"><i class="iconfont icon-dianzan1"></i>({{item.likedCount}})</span>
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
import axios from 'axios'
export default {
    props: ['list','songListId'],
    computed: {
        ...mapGetters([
            'nickName'
        ])
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
            axios.get('http://localhost:3000/comment',{
                params: {
                    t: 0,
                    type: 2,
                    id: this.songListId,
                    commentId:item.commentId,
                    timestamp: (new Date()).getTime()
                }
            }).then((result) => {
                let res = result.data
                if(res.code === 200) {
                    this.$emit('deleteComment',item.commentId)
                }
            })
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
                }
            }
        }
    }
}
</style>