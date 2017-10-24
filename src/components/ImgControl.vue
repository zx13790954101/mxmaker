<template>
  <div class="img-control">
    <div class="img_box" @mousewheel="zoom"  :style="[moving?styleObj:styleObjFinal,{zIndex:zIndex}]" @mousemove.prevent="mouseMove"
         @mousedown.prevent="mouseDown" @mouseup.prevent="mouseUp" @mouseout.prevent="mouseOut" @contextmenu.prevent="planeShow=!planeShow">

      <img :src="url" alt=""  :style="{filter:'brightness('+brightness+'%)',transform:'rotate('+angle+'deg) scaleX('+filp+')'}">
      <transition name="animate-transition" enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut" :duration="200">
        <div class="control_plane" v-if="planeShow">
          <div class="block">
            <div class="action">
              <el-button type="primary" @click="toDetail">详情</el-button>
              <el-button type="primary" @click="filp=-filp">镜像</el-button>
              <el-button type="primary" @click="deleteGood">删除</el-button>
            </div>
          </div>
          <div class="block">
            <span class="demonstration">角度</span>
            <el-slider v-model="angle" :format-tooltip="formatAngle" :min="0" :max="360"></el-slider>
          </div>
          <div class="block">
            <span class="demonstration">曝光</span>
            <el-slider v-model="brightness" :format-tooltip="formatBrightness" :min="50" :max="150"></el-slider>
          </div>
        </div>
      </transition>
    </div>

    <!--<p>mouseStart:</p>
    <p>{{mouseStart.x}},{{mouseStart.y}}</p>
    <p>mouseEnd:</p>
    <p>{{mouseEnd.x}},{{mouseEnd.y}}</p>-->
  </div>
</template>

<script>
  export default {
    name: 'img-control',
    props: ['url'],
    data () {
      return {
        filp:1,
        planeShow:false,
        brightness: 100,
        angle: 0,
        mouseStart: {
          x: 0,
          y: 0
        },
        mouseEnd: {
          x: 0,
          y: 0
        },
        moving: false,
        zoomNum: 1,
        zIndex:1,
        width:300,
        finalLeft: ($(window).width()*0.7-300)/2,
        finalTop: ($(window).height()-300)/2
      }
    },
    methods: {
      toDetail(){
        this.$emit('setCurGood',true);
      },
      zoom: function (data) {
        //console.log(data.deltaY);
        if (data.wheelDelta > 1) {
          this.width += 20;
        } else {
          this.width -= 20;
        }
        if (this.width < 100) {
          this.width = 100;
          this.$message({
            message: '不能再小了',
            type: 'warning',
            showClose: true
          })
        } else if (this.width > 1000) {
          this.width = 1000;
          this.$message({
            message: '不能再大了',
            type: 'warning',
            showClose: true
          })
        }
      },
      mouseDown: function (data) {
        this.moving = true;
        this.zIndex=2;
        this.mouseStart.x = data.clientX;
        this.mouseStart.y = data.clientY;
        this.mouseEnd.x = data.clientX;
        this.mouseEnd.y = data.clientY;
      },
      mouseMove: function (data) {
        if (!this.moving) return;
        this.mouseEnd.x = data.clientX;
        this.mouseEnd.y = data.clientY;
      },
      mouseUp: function (data) {
        if(!this.moving) return;
        this.zIndex=1;
        this.moving = false;
        this.mouseEnd.x = data.clientX;
        this.mouseEnd.y = data.clientY;
        this.finalLeft += this.mouseEnd.x - this.mouseStart.x;
        this.finalTop += this.mouseEnd.y - this.mouseStart.y;
      },
      mouseOut: function (data) {
        if(!this.moving) return;
        this.zIndex=1;
        this.moving = false;
        this.mouseEnd.x = data.clientX;
        this.mouseEnd.y = data.clientY;
        this.finalLeft += this.mouseEnd.x - this.mouseStart.x;
        this.finalTop += this.mouseEnd.y - this.mouseStart.y;
      },
      deleteGood(){
          this.$emit('deleteUrl',this.url);
      },
      formatBrightness(val) {
        return val +'%';
      },
      formatAngle(val) {
        return val +'度';
      }
    },
    computed: {
      styleObj: function () {
        return {
          //transform: 'scale(' + this.zoomNum + ') translate(' + (this.finalLeft + this.mouseEnd.x - this.mouseStart.x) + 'px,' + (this.finalTop + this.mouseEnd.y - this.mouseStart.y) + 'px)'
          transform: 'translate(' + (this.finalLeft + this.mouseEnd.x - this.mouseStart.x) + 'px,' + (this.finalTop + this.mouseEnd.y - this.mouseStart.y) + 'px)',
          width:this.width+'px'
        }
      },
      styleObjFinal: function () {
        return {
          //transform: 'scale(' + this.zoomNum + ') translate(' + (this.finalLeft) + 'px,' + (this.finalTop) + 'px)'
          transform: 'translate(' + (this.finalLeft) + 'px,' + (this.finalTop) + 'px)',
          width:this.width+'px'
        }
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .img-control{
    position: absolute;
    left:0;
    top:0;
  }
  .img_box{
    position: absolute;
    left:0;
    top:0;
    width:600px;
    z-index:1;
  }
  img {
    width:100%;
    cursor: move;
    display: block;
    z-index: 1;
  }
  .flipx {
    -moz-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    transform: scaleX(-1);
  }
  .control_plane{
    position: absolute;
    left:100%;
    top:50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    background: #ffffff;
    -webkit-border-radius:5px;
    -moz-border-radius:5px;
    border-radius:5px;
    padding:10px;
    width:250px;
    -webkit-box-shadow:  0 1px 3px rgba(0, 0, 0, 0.42);
    -moz-box-shadow:  0 1px 3px rgba(0, 0, 0, 0.42);
    box-shadow:  0 1px 3px rgba(0, 0, 0, 0.42);
  }
  .action {
    display: inline-block;
    padding: 5px;
    padding-left:0;
    text-align: center;
    margin: 5px;
    margin-left: 0;
    border-radius: 3px;
    cursor: pointer;
  }
  /*.action .iconfont{
    color: #0c6eff;
    text-decoration: none;
  }*/
</style>
