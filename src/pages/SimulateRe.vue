<template>
  <div class="simulate-re">
    <!-- 左菜单 -->
    <div class="left_bar">
      <div class="toBack" @click="toBack">
        <i class="iconfont icon-fanhui"></i>
        <span>返回</span>
      </div>
      <ul class="menu_bar">
        <li class="bar_item" v-for="(item,index) in leftBarList" @click="menuBar(index,$event)">
          <p :class="['iconfont',item.icon]"></p>
          <p>{{item.text}}</p>
        </li>
      </ul>
    </div>
    <!-- 场景功能 -->
    <!--:class="[onload?'onload':'','cover']"-->
    <transition name="animate-transition" enter-active-class="animated fadeIn"
                leave-active-class="animated slideOutLeft" :duration="200">
      <div class="cover" v-if="barShow">
        <div class="cover_btn" @click="hideCover"></div>
        <div class="barControl" :style="{marginTop:brightnessTop+'px'}">
          <div class="block">
            <div class="select_scence">
              <el-button type="primary" @click="chooseImg">选择本机图片</el-button>
              <el-button type="primary" @click="showSelect=true">选择场景库图片</el-button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 背景滤镜滑条 -->
    <transition name="animate-transition" enter-active-class="animated fadeIn"
                leave-active-class="animated slideOutLeft" :duration="200">
      <div class="cover" v-if="brightnessShow">
        <div class="cover_btn" @click="hideCover"></div>
        <div class="bgBrightnessControl" :style="{marginTop:brightnessTop+'px'}">
          <div class="block">
            <el-slider v-model="bgBrightness" :format-tooltip="formatTooltip" :min="50" :max="150"
                       :step="5"></el-slider>
          </div>
        </div>
      </div>
    </transition>
    <!-- 背景轮换 -->
    <div class="swiper_box">
      <div class="my-swiper">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="item in bgList" key="item.id"
                        :class="[(box.width/box.height-1114/836>0)?'bgSizeReset':'',box.isFlip?'flipx':'']"
                        v-bind:style="{backgroundImage:'url('+item.mainImage+')',filter:'brightness('+bgBrightness+'%)'}">
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <div class="user_img" v-if="userImg!=''"
           :class="[box.width/box.height-userImgWidth/userImgHeight>0?'bgSizeReset':'',box.isFlip?'flipx':'']"
           :style="{backgroundImage:'url('+userImg+')',filter:'brightness('+bgBrightness+'%)'}">
      </div>
      <img-control v-for="(item,index) in curGoodList" :url="item.mainImage" :key="item.id"
                   @deleteUrl="setDeleteUrl" @setCurGood="setCurGood(index)" ></img-control>


    </div>
    <!-- 右商品清单 -->
    <div class="right_goods">
      <good-select @curGoodList="setCurGoodList" :deleteUrl="deleteUrl" :oldList="oldList"></good-select>
    </div>
    <pic-upload @url="setUrl"></pic-upload>
    <pic-upload-less @url="setShareInfo"></pic-upload-less>
    <!-- 对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :modal="false"
      size="tiny">
      <span>选择场景截图并分享，若无截图，请截图保存后再分享。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadShareImg">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框表单 -->
    <el-dialog title="分享设置" :visible.sync="dialogFormVisible" :modal="false">
      <el-form :model="share">
        <div class="my_row">
          <img class="share_img" :src="'http://orbi0d8g8.bkt.clouddn.com/'+shareImg" alt="">
        </div>
        <div class="my_row">
          <input type="title" v-model="share.title" class="form-control" placeholder="请填入标题">
        </div>
        <div class="my_row">
          <textarea name="" id="" v-model="share.reason" rows="5" style="resize: none" class="form-control"
                    placeholder="请填入内容"></textarea>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="shareSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择分享渠道 -->
    <share :url="shareUrl" :title="share.title" :img="'http://orbi0d8g8.bkt.clouddn.com/'+shareImg"></share>
    <!-- 商品详情 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <good-detail-copy v-if="showDetail" @close="showDetail=false"></good-detail-copy>
    </transition>
    <!-- 选择配灯场景 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <scence-select-re v-if="showSelect" @closeSelect="showSelect=false" @bgListChange="bgListChange"></scence-select-re>
    </transition>
    <!--返回时候等待过长，添加loading动画-->
    <div class="my_loading_box" v-if="backLoading">
      <div class="my_loading">
        <img src="static/images/extra/loading.svg" alt="" >
      </div>
    </div>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import GoodSelect from '../components/GoodSelect.vue'
  import ImgControl from '../components/ImgControl.vue'
  import PicUpload from '../components/PicUpload.vue'
  import PicUploadLess from '../components/PicUploadLess.vue'
  import Share from '../components/Share.vue'
  import GoodDetailCopy from '../pages/GoodDetailCopy.vue'
  import ScenceSelectRe from '../pages/ScenceSelectRe.vue'
  export default {
    name: 'simulate-re',
    components: {GoodSelect, ImgControl, PicUpload, PicUploadLess, Share,GoodDetailCopy,ScenceSelectRe},
    data () {
      var data={
          list:[],
          index:0,
      };
      var simulateRe='';
      if(sessionStorage.simulateRe){
          simulateRe=JSON.parse(sessionStorage.simulateRe);
          data.list.push({
            mainImage:this.detecte(simulateRe.bg)
          });
      }
      var url='';
      var curGood=sessionStorage.curGood||'';
      if(curGood) url=(JSON.parse(curGood)).mainImage;
      var that = this;
      return {
        oldList:simulateRe.goodList,
        simulateReList:simulateRe.goodList,
        backLoading:false,
        sessionGoodUrl:url,
        bgList:data.list,
        showSelect:false,
        showDetail:false,
        shareUrl: '',
        share: {
          title: '',
          reason: '',
        },
        dialogFormVisible: false,
        dialogVisible: false,
        deleteUrl: '',
        shareImg: '',
        swiperIndex: data.index,
        userImg: '',
        userImgWidth: 0,
        userImgHeight: 0,
        brightnessTop: 0,
        brightnessShow: false,
        barShow: false,
        onload: false,
        curGoodList: [],
        bgBrightness: 100,
        box: {
          width: $('.swiper_box').width(),
          height: $('.swiper_box').height(),
          isFlip: false
        },
        leftBarList: [
          {
            icon: 'icon-tupian',
            text: '场景'
          },
          {
            icon: 'icon-shape23',
            text: '亮度'
          },
          {
            icon: 'icon-111jingxiang',
            text: '镜像'
          },
          {
            icon: 'icon-baocun',
            text: '保存'
          },
          {
            icon: 'icon-fenxiang11',
            text: '分享'
          },
          {
            icon: 'icon-shanchu-copy',
            text: '清除'
          },

          {
            icon: 'icon-beiwanglu1',
            text: '备忘录'
          }
        ],
        swiperOption: {
          // NotNextTick is a component's own property, and if notNextTick is set to true, the component will not instantiate the swiper through NextTick, which means you can get the swiper object the first time (if you need to use the get swiper object to do what Things, then this property must be true)
          // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
          notNextTick: true,
          // swiper configs 所有的配置同swiper官方api配置
          // direction : 'vertical',
          grabCursor: true,
          setWrapperSize: true,
          initialSlide: data.index,
          // autoHeight: true,
          // paginationType:"bullets",
          mousewheelControl: false,
          observeParents: true,
          observer: true,
          onTransitionStart(swiper){
            that.setCurIndex(swiper.activeIndex);
          },
          // if you need use plugins in the swiper, you can config in here like this
          // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
          // debugger: true,
          // swiper callbacks
          // swiper的各种回调函数也可以出现在这个对象中，和swiper官方一样
          // onTransitionStart(swiper){
          //   console.log(swiper)
          // },
          // more Swiper configs and callbacks...
          // ...
        }
      }
    },
    methods: {
      login: function () {
        var userInfo=JSON.parse(sessionStorage.userInfo);
        var that = this;
        this.$http.get(globalPath+'/Login', {params:{
          account: userInfo.name,
          password: userInfo.password,
        }}).then(function (res) {
          //console.log(res.body);
          if(typeof(res.body)!='object'){
            //$.toast('账号不存在！','cancel');
            this.$message.error('密码已更改，请重新登陆');
            bus.$emit('curPage','login');
            return;
          }
        });
      },
      detecte(url){
        var mUrl = url;
        var pattern = /http/ig;
        if (!pattern.test(url)) {
          mUrl = 'http://orbi0d8g8.bkt.clouddn.com/' + url;
        }
        return mUrl;
      },
      bgListChange(data){
        this.userImg='';
        var that=this;
        this.showSelect=false;
        console.log(data);

        this.bgList=data.list;
        setTimeout(function () {
          that.swiper.slideTo(data.index, 300, false);
        },250);
      },
      setShareInfo(url){
        console.log('setShareInfo');
        console.log(url);
        this.shareImg = url;
        this.dialogFormVisible = true;
      },
      shareSubmit(){
        function randomString(len) {
          len = len || 32;
          var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
          /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
          var maxPos = $chars.length;
          var pwd = '';
          for (var i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
          }
          return pwd;
        }

        this.dialogFormVisible = false;
        var data = {};
        data.userId = sessionStorage.userId;
        data.sceneId = new Date().getTime() + randomString(10);
        data.title = encodeURIComponent(this.share.title);
        data.mainPic = this.shareImg;
        var goodIds = '';
        $(this.curGoodList).each(function (index, ele) {
          goodIds += ele.id + '%7C1,';
        });
        data.goodIds = goodIds;
        data.reason = encodeURIComponent(this.share.reason);
        console.log(data);

        var that = this;
        that.shareUrl='';
        this.$http.post(globalPath + '/ShareScene', data, {emulateJSON: true}).then(function (res) {
          console.log(res);
          if (res.body == 1000) {
            that.$message({
              message: '保存成功',
              type: 'success'
            });
          } else {
            that.$message({
              message: '保存失败',
              type: 'error'
            });
            return;
          }
          that.shareUrl = sharePath+'/shareTemplate/scene_' + data.sceneId + '.html';
        });
      },
      uploadShareImg(){
        if (this.curGoodList.length == 0) {
          this.$message({
            message: '请先添加商品',
            type: 'error'
          });
          return false;
        }
        console.log('uploadShareImg');
        $('#uploadImgLess').click();
        this.dialogVisible = false;
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      setCurIndex(index){
        this.swiperIndex = index;
      },
      setUrl(val){
        var that = this;
        this.userImg = val;
        var img = new Image();
        img.src = val;
        img.onload = function () {
          that.userImgWidth = img.width;
          that.userImgHeight = img.height;
        }
      },
      setCurGood(index){
        sessionStorage.setItem('curGood',JSON.stringify(this.curGoodList[index]));
        this.showDetail=true;
      },
      setCurGoodList(data){
        /*var that=this;*/
        /*this.curGoodList = data;
        var simulateRe=JSON.parse(sessionStorage.simulateRe);*/
        //var array=[];
       /* $(data).each(function (index,ele) {
            var same=false;
            $(that.curGoodList).each(function (index2,ele2) {
              if(ele.id==ele2.id){
                same=true;
                return false;
              }
            });
            console.log(ele.id);
            if(!same) that.curGoodList.push(ele);
        });*/
        this.curGoodList=data;
        //that.curGoodList=array;
        //that.curGoodList.push(...array);
        /*var list=simulateRe.goodList;
        $(this.simulateReList).each(function(index,ele){
          //this.curGoodList.unshift(JSON.parse(sessionStorage.curGood));
          that.curGoodList.unshift(ele);
        });*/

      },
      formatTooltip(val) {
        return val + '%';
      },
      hideCover: function () {
        this.brightnessShow = false;
        this.barShow = false;
      },
      toBack: function () {
        this.backLoading=true
        var that=this;
        setTimeout(function () {
          that.$emit('toBack', 'main');
          that.$emit('curPage', 'main');
        },150);

      },
      setDeleteUrl(url){
        var that = this;
        console.log(url);
        var deleteIndex = '';
        $(this.curGoodList).each(function(index,ele){
           console.log(ele);
          if(url==ele.mainImage){
            that.curGoodList.splice(index,1);
            return;
          }
        });
        this.deleteUrl=url;
        /*setTimeout(function () {//没有这个延迟，可能图片删除不掉，
          $(that.curGoodList).each(function (index, ele) {
            if (ele.mainImage == url) {
              deleteIndex = index;
              that.deleteUrl = index;
              //that.curGoodList.splice(index,1);
              return false;
            }
          });
        },250);*/

        console.log(deleteIndex);

      },
      chooseImg(){
        $('#uploadImg').val('');
        $('#uploadImg').click();
      },
      menuBar: function (index, event) {
        //console.log(index,event);
        var that = this;
        switch (index) {
          case 0:
            var top = $('.iconfont.icon-tupian').offset().top;
            $('.barControl').css('marginTop', top + 5);
            that.barShow = true;
            that.brightnessTop = top;
            break;
          case 1:
            var top = $('.iconfont.icon-shape23').offset().top;
            $('.bgBrightnessControl').css('marginTop', top + 5);
            that.brightnessShow = true;
            that.brightnessTop = top;
            break;
          case 2:
            that.box.isFlip = !that.box.isFlip;
            break;
          case 3:
            /*html2canvas($("body"), {
             onrendered: function (canvas) {
             var url = canvas.toDataURL();
             //以下代码为下载此图片功能
             var triggerDownload = $("<a>").attr("href", url).attr("download", "场景.png").appendTo("body");
             triggerDownload[0].click();
             triggerDownload.remove();
             }
             });*/
            that.$message({
              message: '请使用截图工具截图再保存！',
            });
            break;
          case 4:
            that.dialogVisible = true;
            break;
          case 5:
            that.curGoodList=[];
            bus.$emit('clearGoodList', true);
            break;
          case 6:
            var data = {};
            data.goodList = that.curGoodList;
            if (that.userImg) {
              data.bg = that.userImg;
            } else {
              data.bg = that.bgList[that.swiperIndex].mainImage;
            }
            console.log(data);
            sessionStorage.setItem('curSimulate', JSON.stringify(data));
            bus.$emit('curPage', 'remark-add');
            break;
        }
      }
    },
    mounted: function () {
      var that = this;
      this.setUrl(this.detecte(JSON.parse(sessionStorage.simulateRe).bg));
      //页面加载的时候滑块控件必须要可见，否则会初始化错误，故在页面加载完成之后再display：none
      //$('.cover').css({'z-index':21,'display':'none'});
      $(window).resize(function () {
        console.log('resize')
        /* that.win.width = $(window).width();
         that.win.height = $(window).height();*/
        that.box.width = $('.swiper_box').width();
        that.box.height = $('.swiper_box').height();
        console.log(that.box.width / that.box.height - that.userImgWidth / that.userImgHeight);
      });
      $(window).trigger('resize');
      this.$message.closeAll();
      this.$message({
        showClose: true,
        message: '鼠标左键拖动，滚轮缩放，右键功能面板',
        duration: 3000
      });
      /*bus.$on('curPage',function(page){
       console.log('hello',page);
       if(page=='simulate'){
       $(window).resize(function () {
       /!* that.win.width = $(window).width();
       that.win.height = $(window).height();*!/
       console.log('resize');
       that.box.width = $('.swiper_box').width();
       that.box.height = $('.swiper_box').height();
       });
       }
       })*/
      this.login();
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      },
      /*bgList(){
       var data = JSON.parse(sessionStorage.bgList);
       console.log(data);
       return data.list;
       }*/
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .simulateRe {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 20;
  }

  .banner_img {
    width: 100%;
  }

  .swiper-slide {
    height: 100vh;
    background-position: 50% 50%;
    background-size: auto 100%;
    background-repeat: no-repeat;
    /*filter:brightness(150%)*/
  }

  .bgSizeReset {
    background-size: 100% auto !important;
  }

  .toBack {
    cursor: pointer;
    height: 60px;
    line-height: 60px;
    padding: 0 10px;
    display: inline-block;
    background: #fff;
  }

  .toBack:active {
    color: #ffa538;
  }

  .toBack > .iconfont {
    padding-right: 5px;
  }

  .menu_bar {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .menu_bar .iconfont {
    font-size: 3rem;
  }

  .bar_item {
    cursor: pointer;
    padding: 5px 0;
  }

  .bar_item:active {
    color: #ffa538;
  }

  .left_bar {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100px;
    padding: 5px;
    z-index: 10;
    background: rgba(255, 255, 255, 0.57);
    text-align: center;
    -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.44);
    -moz-box-shadow: 0 0 3px rgba(0, 0, 0, 0.44);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.44);
  }

  .swiper_box {
    width: 100%;
    padding-left: 100px;
    padding-right: 30vw;
    position: relative;
  }

  .user_img {
    position: fixed;
    left: 100px;
    right: 30vw;
    top: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: auto 100%;
    z-index: 1;
  }

  .flipx {
    -moz-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
  }

  .right_goods {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 30vw;
    z-index: 10;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background: #fff;
    -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.44);
    -moz-box-shadow: 0 0 3px rgba(0, 0, 0, 0.44);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.44);
  }

  .bgBrightnessControl {
    width: 200px;
    background: #fff;
    padding: 0 10px;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
    margin-left: 110px;
  }

  .cover {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 21;
  }

  /*.cover.onload{
    z-index: 21;
    display: none;
  }*/

  .cover_btn {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
  }

  .my_row {
    margin: 5px 0;
  }

  .share_img {
    width: 100%;
    border-radius: 5px;
  }

  /*.img-control{
    position: absolute;
    top:0;
    left:0;
  }*/
  p.iconfont {
    padding-bottom: 0;
    margin-bottom: 0;
  }
  .select_scence {
    background: #fff;
    display: inline-block;
    padding: 5px;
    border-radius: 3px;
    box-shadow: 0 1px 1px #5d5d5d;
    margin-left: 115px;
  }
</style>
