<template>
  <div class="personal">
    <button v-on:click="loginShow">show</button>
  </div>
</template>

<script>
  import bus from '../assets/bus'
export default {
  name: 'personal',
  data () {
    return {

    }
  },
  methods:{
    loginShow:function(){
      bus.$emit('curPage','login');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
