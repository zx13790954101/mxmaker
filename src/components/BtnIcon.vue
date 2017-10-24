<template>
  <div class="btn-icon">
      <div class="iconfont" :class="icon"></div>
      <div>{{text}}</div>
  </div>
</template>

<script>
  import bus from '../assets/bus'
export default {
  name: 'btn-icon',
  props:['icon','text'],
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .iconfont{
    font-size:3rem;
  }
.btn-icon{
  padding:15px 10px 5px;
  height:40px;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
  color: #ffa538;
}
  .btn-icon:active{
    color: #ffc780;
  }
</style>
