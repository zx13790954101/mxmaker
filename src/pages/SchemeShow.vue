<template>
  <div class="scheme-show">
    <header>
      <div class="btn_box btn_box_left" @click="toMain">返回</div>
      <!--<div class="btn_box btn_box_right" @click="save">保存</div>-->
      <div class="pull-right" @click="buyAll">
        <btn-icon text="购买全部" icon="icon-finished-cart"></btn-icon>
      </div>
      <div class="pull-right" @click="toShare">
        <btn-icon text="分享" icon="icon-fenxiang"></btn-icon>
      </div>
      <div class="pull-right" @click="toEdit" style="padding-right: 18px;">
        <btn-icon text="编辑" icon="icon-bianji"></btn-icon>
      </div>
    </header>
    <div class="setting">
      <div class="row bg" @click="setCurIndex(-1)">
        <div class="col-xs-4">方案名称：</div>
        <div class="col-xs-8">
          <p>{{mainName}}</p>
        </div>
        <div class="col-xs-12 " style="padding-top:10px;">
          <div class="decoration" :class="curIndex==-1?'active':''">
            <div class="one"></div>
            <div class="two"></div>
          </div>
        </div>
      </div>

      <div class="row ">
        <div class="col-xs-4">户型：</div>
        <div class="col-xs-8">
          <p>{{value1}}</p>
        </div>
      </div>
      <div class="row ">
        <div class="col-xs-4">面积：</div>
        <div class="col-xs-8">
          <p>{{value2}}</p>
        </div>
      </div>
      <div class="row ">
        <div class="col-xs-4">装修风格：</div>
        <div class="col-xs-8">
          <p>{{value3}}</p>
        </div>
      </div>

      <div style="text-align: center;padding: 10px;font-size: 1.6rem;color: #999;">设计区域</div>

      <design-area-show :planInfoList="planInfoList"></design-area-show>

      <div class="price_box">
        <p>参考价格</p>
        <p class="price">￥{{price}}</p>
      </div>

    </div>

    <div class="swiper_box">
      <swiper-ver-show :planInfoList="planInfoList" :headDetail="mainDetail"
                       :headImgList="mainImgList"></swiper-ver-show>
    </div>

    <!-- 选择分享渠道 -->
    <share :url="shareUrl" :title="''" :img="''"></share>

  </div>
</template>

<script>
  import bus from '../assets/bus'
  import SwiperVerShow from '../components/SwiperVerShow.vue'
  import DesignAreaShow from '../components/DesignAreaShow.vue'
  import BtnIcon from '../components/BtnIcon.vue'
  import Share from '../components/Share.vue'

  export default {
    name: 'scheme-show',
    components: {SwiperVerShow, DesignAreaShow, BtnIcon,Share},
    data () {
      var curSite = JSON.parse(sessionStorage.curSite);
      return {
        shareUrl:'',
          id:curSite.id,
        mainName: curSite.name,
        mainImgList: curSite.imgList,
        mainDetail: curSite.mainDetail,
        selectedSite: [],
        planInfoList: curSite.planInfoList,
        price: curSite.charge,
        curIndex: -1,
        value1: curSite.house,
        value2: curSite.mianji,
        value3: curSite.style
      }
    },
    mounted(){
      var that = this;
      bus.$off(['curSiteIndex']);
      setTimeout(function () {
        bus.$on('curSiteIndex', function (val) {
          that.curIndex = val;
        });
      }, 100);
      bus.$off(['selectedSite']);
      setTimeout(function () {
        bus.$on('selectedSite', function (val) {
          that.selectedSite = val;
        });
      }, 100);
      bus.$off(['count']);
      setTimeout(function () {
        bus.$on('count', function (val) {
          that.count();
        });
      }, 100);
      bus.$off(['siteMainDetail']);
      setTimeout(function () {
        bus.$on('siteMainDetail', function (val) {
          that.mainDetail = val;
        });
      }, 100);
      bus.$off(['mainImgList']);
      setTimeout(function () {
        bus.$on('mainImgList', function (val) {
          that.mainImgList = val;
        });
      }, 100);

    },
    methods: {
      toEdit(){
        bus.$emit('curPage','scheme-edit');
      },
      buyAll(){
          var that=this;
          var goodInfo=[];
        var totalPrice=0;
         $(that.planInfoList).each(function (index,element) {
           $(element.goodList).each(function (index2,element2) {
               element2.goodNumer=element2.planNum;
                goodInfo.push(element2);
                totalPrice+=element2.goodMoney*element2.planNum;
           })
         });
       if(goodInfo.length>0) {
         var data = {
           body: goodInfo,
           price: totalPrice
         }
         localStorage.setItem("order_Array", JSON.stringify(data));
         bus.$emit('curPage', 'submit-order');
       }else {
         that.$message({
           message:'没有灯饰',
           type:'error'
         });
       }


      },
      toShare(){
        var that = this;
        this.$http.post(globalPath + '/SharePlanById', {userId:sessionStorage.userId,planId:that.id}, {emulateJSON: true}).then(function (res) {

          if (res.body == 1000) {
            that.$message({
              message: '保存成功',
              type: 'success'
            })
          } else {
            that.$message({
              message: '保存失败',
              type: 'error'
            });
            return;
          }
          that.shareUrl = sharePath+'/shareTemplate/plan_' + that.id + '.html';
        });
      },
      count(){
        var price = 0;
        $(this.selectedSite).each(function (index, ele) {
          $(ele.goodList).each(function (index2, ele2) {
            price += ele2.goodMoney * ele2.needNum;
          })
        });
        this.price = price;
      },
      toMain(){
        bus.$emit('curPage', 'main');
      },
      setCurIndex(val){
        this.curIndex = val;
        bus.$emit('curSiteIndex', val);
      }
    },
    watch:{
      goodInfo(val){

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .scheme-show {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 23;
    background: #dfdfdf;
    padding: 60px 0 0 340px;
  }

  .btn_box {
    cursor: pointer;
  }

  .btn_box:active {
    color: #ffb874;
  }

  .btn_box_left {
    position: absolute;
    left: 10px;
  }

  .btn_box_right {
    position: absolute;
    top: 0;
    right: 10px;
  }

  .setting {
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
    width: 340px;
    background: #fff;
    padding: 20px;
    overflow-y: auto;
    padding-bottom: 120px;
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

  .row {
    line-height: 32px;
    margin-top: 10px;
  }

  .decoration {
    text-align: center;
    font-size: 0;
    line-height: 0px;
  }

  .decoration > div {
    display: inline-block;
    height: 5px;
    background: #999;
  }

  .decoration .one {
    width: 40%;
  }

  .decoration .two {
    height: 2px;
    width: 100%;
    margin-top: -16px;
  }

  .row_center {
    text-align: center;
    color: #ffa538;
  }

  .row_center .iconfont {
    cursor: pointer;
  }

  .row_center > div {
    display: inline-block;
  }

  .row_center .iconfont:active {
    color: #ffbf8b;
  }

  .active .one {
    background: #ffa538;
  }

  .active .two {
    background: #ffa538;
  }
</style>
