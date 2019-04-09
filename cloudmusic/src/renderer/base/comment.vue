<template>
  <ul class="commitList">
      <li class="listItem  alignCenter" v-for="item in list" :key="item.id">
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
export default {
    props: ['list']
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
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-position: center;
            background-size: cover;
            border: 1px solid #ccc;
        }
        .avaCommit {
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