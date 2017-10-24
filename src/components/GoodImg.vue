<template>
  <!-- 商品图片，在图片还没加载完成的时候显示默认图片 -->
  <div class="good-img">
    <img v-if="!onload" src="static/images/light-store/good_default.jpg" alt="">
    <!--<img class="good_img"  v-bind:src="url" alt="" v-on:load="setBG(this)" >-->
    <transition name="el-fade-in">
      <div  v-if="onload" class="img_box" :style="{background:'url('+url+')'}" :class="widthMore?'width_more':''">
        <img src="static/images/extra/usurp.png" alt="">
        <i class="iconfont icon-arrDnR-fill no_good" v-if="noStock"></i>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'good-img',
    props:['url','noStock'],
    data () {
      return {
        onload:false,
        widthMore:false,
      }
    },
    mounted:function(){
      var that=this;
      var img=new Image();
      img.src=this.url;
      img.onload=function(){
        that.onload=true;
        if(img.width/img.height>1) that.widthMore=true;
      }
    },
    methods:{
      setBG(e){
        this.onload=!this.onload;
        console.log(e.width,e.height);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  img{
    width:100%;
    height:auto;
  }
  .good-img{
    cursor: pointer;
    background: #efefef;
  }
  .good-img:active{
    background: #dfdfdf;
  }
  .good_img{
    display: none;
  }
  .show{
    display: block;
  }
  .img_box{
    width:100%;
    background-position: 50% 50% !important;
    background-repeat:no-repeat !important;
    background-size:100% auto !important;
    position: relative;
  }
  .img_box.width_more{
    background-size:auto 100% !important;
  }
  .no_good{
    display: inline-block;
    position: absolute;
    bottom: 0;
    right: 0;
    color: #ffa538;
    font-size: 2rem;
  }
</style>
