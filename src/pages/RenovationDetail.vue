<template>
  <div class="shopping-cart">
    <header class="detail">
      <div class="toBack" @click="toBack">
        <i class="iconfont icon-guanbi"></i>
      </div>
      <div class="toEdit" @click="toEdit">
        <i class="iconfont icon-bianji"></i>
      </div>

    </header>
    <div class="main">
        <img :src='goodInfo.mainImg' >
    </div>
  </div>
</template>

<script>
    import bus from '../assets/bus'
    export default{
        name: 'renovation-detail',
        compoents: {},
        data () {
            return {
                goodInfo: [],
            }
        },
        mounted: function () {
            var data=JSON.parse(sessionStorage.renovation);
            if (!data){
                this.$message({
                    message: '沒有数据',
                    type: 'error',
                });
            }

            this.goodInfo = data;
          console.log('renovation',this.goodInfo);
        },
        methods: {
          toEdit(){
            bus.$emit('curPage','renovation-add');
          },
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
  .toEdit{
    float: right;
    cursor: pointer;
    height:60px;
    line-height:60px;
    padding:0 10px;
    display: inline-block;
  }
  .toEdit:active{
    background: #222;
  }
  .toEdit>.iconfont{
    padding-right:5px;
  }
  .main{
    overflow: auto;
  }
  .main img{
    width: 100%;
  }
</style>
