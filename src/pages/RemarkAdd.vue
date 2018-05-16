<template>
  <div class="remark-add">
    <header>
      <div class="pull-left" @click="toBack">
        <btn-icon text="返回" icon="icon-fanhui1"></btn-icon>
      </div>
      <div class="pull-right" @click="save">
        <btn-icon text="保存" icon="icon-baocun"></btn-icon>
      </div>
    </header>
    <div class="con" :style="{'background-image':'url('+detecte(bg)+')'}" :class="[imgWidth/imgHeight-conWidth/conHeight<0?'fill_x':'']">
      <img-control v-for="item in goodList" :url="item.mainImage" :key="item.id"
                   ></img-control>
    </div>
    <div class="right_bar">
        <div class="row">
          <textarea class="form-control" rows="5" style="resize:none" v-model="remark" placeholder="请输入备注"></textarea>
        </div>
        <div class="row">
          <div class="col-xs-4 reset" v-for="item in goodList" >
            <good-img  :url="item.thumbImage"></good-img>
          </div>

        </div>
      <div class="price_box">
        <p>参考价格</p>
        <p class="price">￥{{price}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import BtnIcon from '../components/BtnIcon.vue'
  import GoodImg from '../components/GoodImg.vue'
  import ImgControl from '../components/ImgControl.vue'
  export default {
    name: 'remark-add',
    components: {BtnIcon,GoodImg,ImgControl},
    data () {
      var curSimulate = JSON.parse(sessionStorage.curSimulate);
      console.log('curSimulate',curSimulate);
      var id='';
      var remark='';
      if(sessionStorage.curRemark){
          id=JSON.parse(sessionStorage.curRemark).id;
          console.log(sessionStorage.curRemark);
          remark=JSON.parse(sessionStorage.curRemark).memo;
      }
      return {
        memoId:id,
        bg: curSimulate.bg,
        goodList: curSimulate.goodList,
        remark: remark,
        imgWidth: 0,
        imgHeight: 0,
        conWidth: 0,
        conHeight: 0,
        price:0
      }
    },
    mounted(){
      var that=this;
      var img = new Image();
      img.src = this.bg;
      img.onload = function () {
        that.imgWidth=img.width;
        that.imgHeight=img.height;
      };
      $(window).resize(function (res) {
        var con=$('.con');
        that.conWidth=con.width();
        that.conHeight=con.height();
      });
      var price=0;
      $(this.goodList).each(function (index,ele) {
        price+=ele.goodMoney;
      });
      that.price=price.toFixed(2);
    },
    methods: {
        resizemy(data){
            console.log(data);
        },
      toBack(){
        bus.$emit('curPage', 'main');
      },
      detecte(url){
        var mUrl = url;
        var pattern = /http/ig;
        if (!pattern.test(url)) {
          mUrl = 'http://orbi0d8g8.bkt.clouddn.com/' + url;
        }
        return mUrl;
      },
      save(){
          var that=this;
          var memoImgGoodList=[];
          $(this.goodList).each(function (index,ele) {
            memoImgGoodList.push({
              goodId : ele.id,
              thumbImg : ele.thumbImage,
              mainImg:ele.mainImage
            });
          });
          var data={
            memo : this.remark,
            sfuId:sessionStorage.userId,
            memoImgList : [
              {
                mainImg : this.bg,
                memoImgGoodList :memoImgGoodList,
                price : this.price
              }
            ]
          };
          console.log(data);
          if(this.memoId){
            this.$http.post(globalPath+'/ManageMemo',{
              model:'edit',
              userId:sessionStorage.userId,
              memoId:that.memoId,
              memoJson:encodeURIComponent(JSON.stringify(data))
            },{emulateJSON: true}).then(function (res) {
              console.log(res);
              if(res.body==1000){
                that.$message({
                  message:'请求成功！',
                  type:'success'
                });
                bus.$emit('curPage','main');
              }else{
                that.$message({
                  message:'请求失败！',
                  type:'error'
                })
              }
            });
          }else{
            this.$http.post(globalPath+'/ManageMemo',{
              model:'add',
              userId:sessionStorage.userId,
              memoJson:encodeURIComponent(JSON.stringify(data))
            },{emulateJSON: true}).then(function (res) {
              console.log(res);
              if(res.body==1000){
                that.$message({
                  message:'请求成功！',
                  type:'success'
                });
                bus.$emit('curPage','main');
              }else{
                that.$message({
                  message:'请求失败！',
                  type:'error'
                })
              }
            });
          }

      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .remark-add {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .con {
    position: absolute;
    top: 60px;
    right: 340px;
    left: 0;
    bottom: 0;
    background: no-repeat;
    background-position: 50% 50%;
    background-size: auto 100%;
    overflow: hidden;
  }

  .fill_x {
    -webkit-background-size: 100% auto;
    background-size: 100% auto;
  }

  .right_bar {
    position: absolute;
    top: 60px;
    right: 0;
    width: 340px;
    bottom: 0;
    overflow-y: auto;
    padding:10px;
  }
  .row{
    margin: 10px 0;
  }
  .reset{
    padding:5px;
  }
  .price_box {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 20px;
  }
  .price {
    font-size: 3rem;
    color: #ffa538;
  }
</style>
