<template>
  <div class="img-detail">
    <header class="detail">
      <div class="toBack" @click="toBack">
        <i class="iconfont icon-guanbi"></i>
      </div>
    </header>
    <div class="main">
        <img :src='imgUrl' >
    </div>
  </div>
</template>

<script>
    import bus from '../assets/bus'
    export default{
        name: 'img-detail',
        compoents: {},
        data () {
            return {
                imgUrl:'',
            }
        },
        mounted: function () {
            var data=sessionStorage.imgDetailUrl;
            if (!data){
                this.$message({
                    message: '沒有数据',
                    type: 'error',
                });
            }

            this.imgUrl = data;
        },
        methods: {
          toBack: function(){
            bus.$emit('curPage','main')
          },
        }
    }
</script>

<style scoped>

  .detail {
    background: rgba(255, 255, 255, 0);
  }
  .toBack{
    cursor: pointer;
    height:60px;
    line-height:60px;
    padding:0 10px;
    display: inline-block;
  }
  .toBack:active{
    background: #222;
  }
  .toBack>.iconfont{
    padding-right:5px;
  }
  .main{
    overflow: auto;
  }
  .main img{
    width: 100%;
  }
</style>
