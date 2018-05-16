<template>
  <transition name="animate-transition"  enter-active-class="animated fadeIn" :duration="300"
              leave-active-class="animated fadeOut">
  <div class="cover-locat" @click="myIsShow=!myIsShow" v-show="myIsShow" >
    <div class="drift" :style="[myStyleData]">
      <slot name="insert"></slot>
      <div class="triangle" :style="{'background-image':'url(static/images/extra/triangle.png)'}"></div>
    </div>

  </div>
  </transition>
</template>

<script>
  import bus from '../assets/bus'
export default {
  name: 'cover-locat',
  props:['isShow','styleData'],
  data () {
    return {
      myIsShow:this.isShow,
      myStyleData:this.styleData
    }
  },
  watch:{
    isShow(val){
        this.myIsShow=val;
    },
    styleData(val){
      this.myStyleData=val
    },
    myIsShow(val){
        this.$emit('showChange',val);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .cover-locat{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index:30;
    /*background: rgba(0, 0, 0, 0.33);*/
  }
  .drift{
    position: absolute;
    left:0;
    top:0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.39);
  }
  .triangle{
    position: absolute;
    width:40px;
    height:40px;
    left:-40px;
    top:50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    /*background-image: url(/static/images/extra/triangle.png);*/
    background-position: right center ;
    background-repeat:no-repeat;
    -webkit-background-size:50%;
    background-size:50%;
  }
</style>
