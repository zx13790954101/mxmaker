<template>
  <!-- 轮播图 -->
  <div class="img-swiper-show">
    <!--<p>数组{{bannerList}}</p>-->
    <div class="box" v-if="typeof(imgList.length)!='undefined'&&imgList.length==0">
      <i class="iconfont icon-tianjiatupian" @click="chooseImg($event)"></i>
    </div>
    <swiper :options="swiperOption" ref="mySwiper" v-if="typeof(imgList.length)!='undefined'&&imgList.length!=0">
      <!-- slides -->
      <swiper-slide  v-for="(item,index) in imgList" key="index">

        <div class="box" :style="{'background-image':'url('+detecte(item)+')'}">


        </div>
      </swiper-slide>

      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>

    <!-- 图片上传 -->
    <form class="imgUpload" method="post" action="http://upload.qiniu.com/"
          enctype="multipart/form-data" style="display:none;">
      <input name="key" type="hidden" value="<resource_key>" v-model="form.key">
      <input name="x:<custom_name>" type="hidden" value="<custom_value>">
      <input name="token" type="hidden" value="" v-model="form.token">
      <input name="file" type="file" class="uploadImg"/>
      <!--<input name="crc32" type="hidden"/>-->
      <input name="accept" type="hidden"/>
      <input type="submit">
    </form>

   <!--  商品选择
    <div class="good_box">
      <good-select></good-select>
    </div>-->
  </div>
</template>

<script>
  import GoodSelect from '../components/GoodSelect.vue'
  export default {
    name: 'img-swiper-show',
    components:{GoodSelect},
    props: ['list'],
    data () {
      var that = this;
      return {
        curIndex: 0,
        imgKeys: [],
        target: '',
        form: {
          token: '',
          key: ''
        },
        imgList: [],
        swiperOption: {
          notNextTick: true,
          grabCursor: true,
          setWrapperSize: true,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          mousewheelControl: false,
          observeParents: true,
          observe: true,
          onTransitionStart(swiper){
            that.curIndex = swiper.activeIndex
          },
          prevButton:'.swiper-button-prev',
          nextButton:'.swiper-button-next',
        }
      }
    },
    mounted: function () {
      var that = this;
      $('input[name=file][type=file]').change(function (e) {
        //console.log(this.files[0].name);
        that.uploadImg(this.files[0].name)
      });
      //this.imgList=this.list;
      var array=[];
      $(this.list).each(function(index,ele){
         array.push(that.detecte(ele));
      });
      this.imgList=array;
    },
    methods: {
      detecte(url){
        var mUrl=url;
        var pattern=/http/ig;
        if(!pattern.test(url)){
          mUrl='http://orbi0d8g8.bkt.clouddn.com/'+url;
        }
        return mUrl;
      },
      setTarget(obj){
        this.target = $(obj.currentTarget).parents('.img-swiper');
      },
      handleCommand(command) {
        switch (parseInt(command)) {
          case 1:
            this.target.find('.uploadImg').click();
            break;
          case 2:
            this.imgList.splice(this.curIndex, 1);
            break;
          case 3:
            this.imgList = [];
            break;
        }
      },
      chooseImg(obj){
        $(obj.currentTarget).parents('.img-swiper').find('.uploadImg').click();
        this.target = $(obj.currentTarget).parents('.img-swiper');
      },
      uploadImg(name){
        var userInfo = JSON.parse(sessionStorage.userInfo);
        //console.log(userInfo);
        var that = this;
        that.form.key = 'temp' + userInfo.phoneNum + (new Date().getTime() + '.jpg');
        this.$http.get(globalPath+'/GetQiNiuToken?name=' + that.form.key).then(function (res) {

          that.form.token = res.body;

          setTimeout(function () {
            that.target.find('.imgUpload').ajaxSubmit(function (res) {
              //console.log(res);
              var obj =  'http://orbi0d8g8.bkt.clouddn.com/' + res.key;
              that.imgList.push(obj);
              that.imgKeys.push(res.key);
              that.$emit('imgKeys', that.imgKeys);

            });
          }, 300);

        });
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    watch: {
      list(val){
        this.imgList = val;
      },
      imgList(val){
        this.$emit('listChange', val);
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .img-swiper {
    background: #fff;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    margin: 5px 1px;
  }

  .box {
    height: 60vh;
    position: relative;
    line-height: 60vh;
    text-align: center;
    background: center center;
    background-repeat: no-repeat;
    -webkit-background-size: auto 100%;
    background-size: auto 100%;
  }

  .iconfont {
    font-size: 15rem;
    color: #ffa538;
    cursor: pointer;
  }

  .bar {
    position: absolute;
    line-height: 64px;
    border: 1px solid #ffa538;
    transform: rotate(135deg);
    padding: 100px 25px;
    right: -15px;
    top: -108px;
    z-index: 20;
  }

  .bar .iconfont {
    font-size: 3rem;
  }

  .swiper-slide {
    overflow: hidden;
  }
  .swiper-button-prev,.swiper-button-next{
    filter: hue-rotate(151deg) !important;
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
</style>
