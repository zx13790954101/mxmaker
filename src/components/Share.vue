<template>
  <div class="share">
    <el-dialog
      title="请选择分享途径"
      :visible.sync="dialogVisible"
      size="tiny"
      :modal="false">
      <button  @click="QQ" class="btn btn-default"><i class="iconfont icon-qq"></i></button>
      <button  @click="qZone" class="btn btn-default"><i class="iconfont icon-qqkongjian"></i></button>
      <button  @click="sina" class="btn btn-default"><i class="iconfont icon-xinlang"></i></button>
      <button  @click="weixin" class="btn btn-default"><i class="iconfont icon-weixin"></i></button>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
        <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
      </span>
    </el-dialog>
    <div class="qrcode_cover" @click="show=!show" v-show="show">
      <div class="qrcode_box">
        <div id="qrcode"></div>
        微信扫码分享
      </div>

    </div>
  </div>
</template>

<script>
  import bus from '../assets/bus'
export default {
  name: 'share',
  props:['url','title','img'],
  data () {
    return {
      dialogVisible:false,
      show:false
    }
  },
  methods:{
    sina(){
      window.open('http://service.weibo.com/share/share.php?url='+encodeURIComponent(this.url)+'&title='+this.title+'&pic='+this.img);
    },
    QQ(){
   // <a href="http://connect.qq.com/widget/shareqq/index.html?url=http%3A%2F%2Fwww.iqiyi.com%2Fv_19rr8rb4vc.html%3Fsrc%3Dsharemodclk131212&amp;desc=%E3%80%90%E8%A7%86%E9%A2%91%EF%BC%9A%E5%81%B6%E5%83%8F%E6%B4%BB%E5%8A%A8Stars!%20%E7%AC%AC2%E5%AD%A3%20%E7%AC%AC25%E9%9B%86%E3%80%91%EF%BC%88%E5%88%86%E4%BA%AB%40%E7%88%B1%E5%A5%87%E8%89%BA%EF%BC%89&amp;title=%E5%81%B6%E5%83%8F%E6%B4%BB%E5%8A%A8Stars!%20%E7%AC%AC2%E5%AD%A3%20%E7%AC%AC25%E9%9B%86&amp;summary=%20&amp;pics=http%3A%2F%2Fpic0.qiyipic.com%2Fimage%2F20170831%2F22%2F9d%2Fa_100047857_m_601_m2.jpg&amp;flash=&amp;site=%E6%9D%A5%E8%87%AA%E7%88%B1%E5%A5%87%E8%89%BA&amp;style=201&amp;width=32&amp;height=32" title="分享给好友" data-pb-shrtgt="6" rseat="clkshr_6" j-delegate="thirdpartyitem" data-share-trigger="qqshare" target="_blank"><i class="j-share-trigger btn-share share-ico_qq2013"></i><br>QQ好友</a>
      window.open('http://connect.qq.com/widget/shareqq/index.html?url='+encodeURIComponent(this.url)+'&title='+this.title+'&pics='+this.img);
    },
    qZone(){
        window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(this.url)+'&title='+this.title+'&pics='+this.img);
    },
    weixin(){
      this.show=true;
      //$('.qrcode_box').html(' <div id="qrcode"></div>');
     /* setTimeout(function () {
        new QRCode(document.getElementById("qrcode"),this.url);
      },1000);*/
     $('#qrcode img,#qrcode canvas').remove();
      new QRCode(document.getElementById("qrcode"),this.url);

    }
    /*ren(){
      window.open('http://widget.renren.com/dialog/share?resourceUrl='+encodeURIComponent(this.url)+'&title='+this.title+'&srcUrl='+this.img);
    }*/
  },
  watch:{
      url(val){
          console.log('分享的url为'+val);
          if(val!=''){
            this.dialogVisible=true;
          }

      },
    /*dialogVisible(val){
          if(!val){
              this.url='';
          }
    }*/
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.iconfont{
  font-size:2rem;
}
  .qrcode_cover{
    position: fixed;
    z-index: 10000;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
.qrcode_box {
  width: 278px;
  position: absolute;
  left: 50%;
  background: #fff;
  padding: 10px;
  text-align: center;
  transform: translate(-50%,-50%);
  top: 50%;
}
  .qrcode_cover{
    background: rgba(0, 0, 0, 0.4);
  }
</style>
