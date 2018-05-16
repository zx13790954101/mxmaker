<template>
  <div class="whole-scene">
    <iframe src="" frameborder="0">

    </iframe>
  </div>
</template>

<script>
  import bus from '../assets/bus'
export default {
  name: 'whole-scene',
  data () {
    return {

    }
  },
  mounted:function () {
      console.debug(JSON.parse(sessionStorage.userInfo));
      var win=$(window);
      var iframe=$('iframe');
      //iframe[0].src='http://720yun.com/t/3a7jz0yvek2?from=singlemessage&pano_id=6138118';
      //iframe[0].src='http://720yun.com/t/b77j6wozledtw2d2fa?pano_id=Cp6HpV3xsxOOkesS';

      iframe[0].src=decodeURIComponent(JSON.parse(sessionStorage.userInfo).vrUrl)||'';
      iframe[0].onload=function () {
        $('iframe').width(win.width()-iframe.offset().left-5);
        $('iframe').height(win.height()-iframe.offset().top-5);
      };
    $(window).resize(function () {
      $('iframe').width(win.width()-iframe.offset().left-5);
      $('iframe').height(win.height()-iframe.offset().top-5);
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
