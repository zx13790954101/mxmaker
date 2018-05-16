<template>
  <div class="img-upload">
    <div class="row">
      <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 col_reset " v-for="(item,index) in imgList">
        <div class="img_box">
          <img-limit :url="item.url"></img-limit>
          <i class="iconfont icon-shanchu-copy" @click="deteleImg(index)"></i>
        </div>
      </div>
      <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 col_reset">
        <div class="upload_box" @click="chooseImg">
          <img src="static/images/extra/usurp.png" alt="">
          <p class="default_text">+</p>
        </div>
      </div>
    </div>

    <form id="imgUpload" method="post" action="http://upload.qiniu.com/"
          enctype="multipart/form-data"  style="display:none;">
      <input name="key" type="hidden" value="<resource_key>" v-model="form.key">
      <input name="x:<custom_name>" type="hidden" value="<custom_value>">
      <input name="token" type="hidden" value="" v-model="form.token">
      <input name="file" type="file" id="uploadImg"/>
      <!--<input name="crc32" type="hidden"/>-->
      <input name="accept" type="hidden"/>
      <input type="submit">
    </form>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import ImgLimit from './ImgLimit.vue'
  export default {
    name: 'img-upload',
    components: {ImgLimit},
    data () {
      return {
        imgKeys: [],
        form: {
          token: '',
          key: ''
        },
        imgList: []
      }
    },
    mounted: function () {
      var that = this;
      $('input[name=file][type=file]').change(function (e) {
        //console.log(this.files[0].name);
        that.uploadImg(this.files[0].name)
      });
    },
    methods: {
      deteleImg(index){
          this.imgList.splice(index,1);
          this.imgKeys.splice(index,1);
        this.$emit('imgKeys',this.imgKeys);
      },
      chooseImg(){
        $('#uploadImg').click();
      },
      save: function (res) {

      },
      uploadImg(name){
        var userInfo = JSON.parse(sessionStorage.userInfo);
        //console.log(userInfo);
        var that = this;
        that.form.key = 'temp' + userInfo.phoneNum + (new Date().getTime() + '.jpg');
        this.$http.get(globalPath+'/GetQiNiuToken?name=' + that.form.key).then(function (res) {

          that.form.token = res.body;

          setTimeout(function () {
            $('#imgUpload').ajaxSubmit(function (res) {
              //console.log(res);
              var obj = {url: 'http://orbi0d8g8.bkt.clouddn.com/' + res.key};
              that.imgList.push(obj);
              that.imgKeys.push(res.key);
              that.$emit('imgKeys',that.imgKeys);

            });
          }, 300);

        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .col_reset {
    /*padding:10px;*/
  }

  .img_box {
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 10px;
    position: relative;
  }
  .icon-shanchu-copy{
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    font-size:2rem;
  }
  .upload_box {
    width: 100%;
    border: 1px dashed #999;
    border-radius: 5px;

    cursor: pointer;
  }

  .upload_box img {
    width: 100%;
  }

  .default_text {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    display: block;
    font-size: 4rem;
    color: #999;
  }
</style>
