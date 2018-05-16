<template>
  <div class="switch-item">
    <ul >
      <li class="" v-for="(item,index) in list" :class="curIndex==index?'active':''" @click="curIndex=index">{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
  import bus from '../assets/bus'
export default {
  name: 'switch-item',
  props:['list','initIndex'],
  data () {
    return {
      curIndex:0,
    }
  },
  mounted(){
      if(this.initIndex){
          this.curIndex=this.initIndex;
      }
  },
  computed:{
      curItem(){
          return this.list[this.curIndex];
      }
  },
  watch:{
      curIndex(){
          this.$emit('curIndex',this.curIndex);
          this.$emit('curItem',this.curItem);
      },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ul{
    padding:5px;
  }
li{
  display: inline-block;
  padding:5px 10px;
  margin:0 5px;
  color:#ffa538;
  cursor: pointer;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  -ms-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}
  li.active{
    background:#ffa538;
    color: #fff;
    -webkit-border-radius:2rem;
    -moz-border-radius:2rem;
    border-radius:2rem;
  }
</style>
