<template>
  <div class="pic-upload">
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
  export default {
    name: 'pic-upload',
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
          if($(this).val()=='') return;
        //console.log(this.files[0].name);
        that.uploadImg(this.files[0].name)
      });
    },
    methods: {
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

              that.$emit('url','http://7xo8yg.com1.z0.glb.clouddn.com/'+res.key);
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
