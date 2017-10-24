<template>
  <div class="test">
    <div class="left">
      this is left
    </div>
    <div class="right">
      this is right
    </div>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  export default {
    name: 'test',
    data () {
      return {

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .my-header{
    color: #fff;
    position: fixed;
    top:0;
    left:117px;
    right:0;
    height:60px;
    z-index:12;
    padding:0 5px;
  }
  .left{
    float: left;
    height: 60px;
    line-height:60px;

  }
  .right{
    float: right;
    height: 60px;
    line-height:60px;
  }
</style>
