<template>
  <div class="remark-show">
    <header>
      <div class="pull-left" @click="toBack">
        <btn-icon text="返回" icon="icon-fanhui1" @click="buyAll"></btn-icon>
      </div>
      <!--<div class="pull-right" @click="save">
        <btn-icon text="保存" icon="icon-baocun"></btn-icon>
      </div>-->
      <div class="pull-right" @click="buyAll">
        <btn-icon text="购买全部" icon="icon-finished-cart"></btn-icon>
      </div>
    </header>
    <div class="con" :style="{'background-image':'url('+detecte(bg)+')'}" :class="[imgWidth/imgHeight-conWidth/conHeight<0?'fill_x':'']">
      <img-control v-for="item in goodList" :url="item.mainImg" :key="item.goodId"
      ></img-control>
    </div>
    <div class="right_bar">
        <div class="row">
          <textarea class="form-control" rows="5" style="resize:none" v-model="remark" placeholder="请输入备注"></textarea>
        </div>
        <div class="row">
          <div class="col-xs-4 reset" v-for="(item,index) in goodList" @click="toDetail(index)">
            <good-img  :url="item.thumbImg" :noStock="item.number==0?true:false"></good-img>
          </div>

        </div>
      <div class="price_box">
        <p>参考价格</p>
        <p class="price">￥{{price}}</p>
      </div>
    </div>

    <!-- 商品详情 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <good-detail-copy v-if="showDetail" @close="showDetail=false"></good-detail-copy>
    </transition>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import BtnIcon from '../components/BtnIcon.vue'
  import GoodImg from '../components/GoodImg.vue'
  import ImgControl from '../components/ImgControl.vue'
  import GoodDetailCopy from '../pages/GoodDetailCopy.vue'
  export default {
    name: 'remark-show',
    components: {BtnIcon,GoodImg,ImgControl,GoodDetailCopy},
    data () {
      var curRemark = JSON.parse(sessionStorage.curRemark);
      console.log(curRemark);
      return {
        showDetail:false,
        bg: curRemark.mainImg,
        goodList: curRemark.memoImgList[0].memoImgGoodList,
        remark: curRemark.memo,
        imgWidth: 0,
        imgHeight: 0,
        conWidth: 0,
        conHeight: 0,
        price:curRemark.memoImgList[0].price,
        goodsList: [],
        totalPrice:0
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

    },
    methods: {
      toDetail(index){
        var that = this;
        this.$http.get(globalPath+'/GetGoodById', {params: {id:that.goodList[index].goodId,userId:sessionStorage.userId}}).then(function (res) {
          sessionStorage.setItem('curGood',JSON.stringify(res.body));
          that.showDetail=true;
        })
      },
      buyAll(){
        var that=this
        $(that.goodList).each(function (index,element) {
          that.GetGoodById(element.goodId);
        });

      },
      detecte(url){
        var mUrl = url;
        var pattern = /http/ig;
        if (!pattern.test(url)) {
          mUrl = 'http://7xo8yg.com1.z0.glb.clouddn.com/' + url;
        }
        return mUrl;
      },
      GetGoodById(goodId){
        var that = this;
        this.$http.get(globalPath+'/GetGoodById', {params: {id:goodId,userId:sessionStorage.userId}}).then(function (res) {
          var data=res.body;
          data.goodNumer=1;
          that.goodsList.push(data);
          that.totalPrice=that.totalPrice+data.goodMoney;
        })
      },
      toBack(){
        bus.$emit('curPage', 'main');
      },
    },
    watch:{
      goodsList(val){
          var that=this;
          if(val.length==this.goodList.length){
            var data2={
              body: that.goodsList,
              price: that.totalPrice.toFixed(2)
            }
            if(that.goodsList.length>0) {
              localStorage.setItem("order_Array", JSON.stringify(data2));
              console.log('that.totalPrice', that.totalPrice);

              bus.$emit('curPage', 'submit-order');
            }else {
              that.$message({
                message:'没有灯饰',
                type:'error'
              });
            }


          }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .remark-show {
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
