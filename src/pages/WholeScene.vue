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

      var win=$(window);
      var iframe=$('iframe');
      iframe[0].src='http://720yun.com/t/3a7jz0yvek2?from=singlemessage&pano_id=6138118'
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
