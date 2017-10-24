<template>
  <!-- 轮播图 -->
  <div class="swiper-ver-show">
    <!--<p>数组{{bannerList}}</p>-->

    <swiper :options="swiperOption" ref="mySwiper">

      <!-- slides -->
      <swiper-slide>
        <div class="page_box">
          <img-swiper-show :list="mainImgList" @listChange="mainListChange"></img-swiper-show>

            <textarea class="form-control" rows="3" style="resize:none" v-model="mainDetail"
                      placeholder="请输入" disabled></textarea>

        </div>
      </swiper-slide>
      <swiper-slide v-for="(item,index) in planInfoList" key="item.id" >
        <div class="page_box">
          <img-swiper-show :list="item.imgList"></img-swiper-show>
          <!-- 搭配商品 -->
          <div class="good_list">
            <div class="img_box" v-for="(item2,index2) in item.goodList" key="item2.thunbImage" @click="setCurGood(index,index2)">
              <img-limit :url="item2.thumbImage"></img-limit>
              <!--{{item2.thumbImage}}-->
              <div class="number_box" >

                <span class="num_cur" >{{item2.planNum}}</span>

              </div>
            </div>

          </div>
          <!-- 搭配技巧 -->
          <textarea class="form-control" rows="3" style="resize:none" v-model="item.detail"
                    placeholder="请输入" disabled></textarea>

        </div>
      </swiper-slide>
      <!-- Optional controls -->
      <div class="swiper-pagination" slot="pagination"></div>
      <!--<div class="swiper-scrollbar"   slot="scrollbar"></div>-->
    </swiper>
    <!-- 商品详情 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <good-detail-copy v-if="showDetail" @close="showDetail=false"></good-detail-copy>
    </transition>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import ImgSwiperShow from '../components/ImgSwiperShow.vue'
  import GoodSelect from '../components/GoodSelect.vue'
  import ImgLimit from '../components/ImgLimit.vue'
  import GoodDetailCopy from '../pages/GoodDetailCopy.vue'
  export default {
    name: 'swiper-ver-show',
    components:{ImgSwiperShow,GoodSelect,ImgLimit,GoodDetailCopy},
    props:['headImgList','headDetail','planInfoList',],
    data () {
        var that=this;
      return {
        showDetail:false,
          mainImgList:[],
        mainDetail:"",
        myGoodList:[],
        curIndex: 0,
        winH: 400,
        swiperList: [],
        swiperOption: {
          notNextTick: true,
          direction: 'vertical',
          grabCursor: false,
          setWrapperSize: true,
          mousewheelControl: true,
          observeParents: true,
          observer: true,
          height: $(window).height() - 60,
          initialSlide :0,
          onTransitionStart(swiper){
            that.setCurIndex(swiper.activeIndex);
          },
        }
      }

    },
    mounted(){
      var that = this;
      that.winH = $(window).height() - 60;
      $(window).resize(function () {
        that.swiper.onResize();
      });
      bus.$off(['selectedSite']);
      bus.$off(['curSiteIndex']);
      setTimeout(function () {
        bus.$on('selectedSite', function (data) {
          that.swiperList = data;
        });
        bus.$on('curSiteIndex', function (data) {
          that.curIndex = data;
        });
      },100);
      bus.$off(['mainImgList']);
      bus.$on('mainImgList', function (data) {
        that.mainImgList = data;
      },100);
      bus.$off(['mainDetail']);
      bus.$on('mainDetail', function (data) {
        that.mainDetail = data;
      },100);
      this.mainDetail=this.headDetail;
      this.mainImgList=this.headImgList;

      var that=this;
      this.swiperList=this.planInfoList;
      /*$(this.planInfoList).each(function (index,ele) {
        that.swiperList[index].goodList=ele.goodList;
      })*/
    },
    methods:{
      reCount(){
        bus.$emit('count',true);
      },
      reduceNum(index){
        this.myGoodList[index].num=--this.myGoodList[index].num;
        this.swiperList[index].needNum=--this.swiperList[index].needNum;
      },
      addNum(index){
          console.log('addNum');
        this.myGoodList[index].num=++this.myGoodList[index].num;
        this.swiperList[index].needNum=++this.swiperList[index].needNum;
      },
      setCurGood(index,index2){
        sessionStorage.setItem('curGood',JSON.stringify(this.planInfoList[index].goodList[index2]));
        this.showDetail=true;
      },
      setCurGoodList(list,index){
        this.swiperList[index].goodList=list;
        this.$set(this.myGoodList, index, list);
      },
      setCurIndex(index){
        //this.curIndex = index;
        bus.$emit('curSiteIndex',index-1);
      },
      mainListChange(val){
        this.mainImgList=val;
        bus.$emit('mainImgList',val);
      },
      listChange(val,index){
          console.log(val,index);
          this.swiperList[index].imgList=val;
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      },

    },
    watch: {
      mainDetail(val){
        bus.$emit('siteMainDetail',val);
      },
      myGoodList(){
        this.reCount();
      },
      swiperList(){
          console.log('swiperList change');
         var that = this;
        var array=[];
        $(that.swiperList).each(function (index, ele) {
          array.push(ele.goodList);
        });
        /*that.myGoodList = array;
         setTimeout(function () {
         that.swiper.slideTo(that.swiperList.length, 300, false);
         }, 100);*/
      },
      curIndex(val){
        this.swiper.slideTo(val + 1, 300, false);
      },
      /*headImgList(val){
          that.mainImgList=val;
      },
      headDetail(val){
          that.mainDetail=val;
      }*/
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page_box {
    width: 100%;
    padding: 5px;
    word-wrap: break-word;
  }

  swiper {
    overflow: hidden;
  }
.input_box{
  padding-left: 130px;
  position: relative;
  overflow: hidden;
  min-height:80px;
}
  .label{
    position: absolute;
    left:0;
    font-size: 2rem;
    color: #999;
  }

  .good_box{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width:400px;
    background: #fff;
    z-index:40;
  }
  .page_swiper{
    padding-right:405px;
  }
  .good_list{
    word-break:keep-all;
    white-space:nowrap;
    overflow-x:auto;
    text-overflow:ellipsis;
    background: #fff;
    margin:0 1px 5px;
    border-radius: 5px;
  }
  .img_box{
    width:120px;
    display: inline-block;
  }
  .number_box{
    text-align: center;
    border:1px solid #333;
    margin:5px 10px;
    border-radius: 5px;
  }
  .number_box>span{
    display: inline-block;
  }
  .num_add,.num_reduce{
    cursor: pointer;
    text-align: center;
  }
  .num_reduce{
    width:20%;
    border-right:1px solid #333;
  }
  .num_add{
    width:20%;
    border-left:1px solid #333;
  }
  .num_cur{
    width:50%;
  }
</style>
