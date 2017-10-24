<template>
  <div class="talk">
<!-- 左边 -->
    <div class="con_left" v-if="data.float=='left'">
      <div class="user">
        <i class="iconfont icon-yonghu"></i>
        <span class="name">{{data.name}}</span>
        <span class="time">{{data.time}}</span>
      </div>
      <div class="content" v-html="data.con"></div>
    </div>
<!-- 右边 -->
    <div class="con_right" v-if="data.float=='right'">
      <div class="user">
        <span class="time">{{data.time}}</span>
        <span class="name">客服</span>
        <i class="iconfont icon-kefu"></i>
      </div>
      <div class="content" v-html="data.con"></div>
    </div>

  </div>
</template>

<script>
  import bus from '../assets/bus'
  export default {
    name: 'talk',
    props:['data'],
    data () {
      return {

      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .user{
    padding:5px;
  }
  .name{
    font-size: 1.6rem;
  }
  .time{
    font-size:1rem;
    color: #999;
  }
  .content{
    background: #fff;
    margin-left:10px;
    max-width:80%;
    padding:5px;
    border-radius:5px;
    display: inline-block;
  }
  .con_right .user{
    text-align: right;
    overflow: hidden;
  }
  .con_right .content{
    float:right;
    margin-left:auto;
    margin-right:10px;
  }
</style>
