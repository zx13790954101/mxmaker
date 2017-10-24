<template>
  <div class="design-site">
    <div class="btn_box">
      <div class="row">
        <div class="col-xs-6 reset" v-for="(item,index) in list" key="index">
          <button class="btn btn-warning btn-block btn-xs " @click="setSite(index)">
            <i class="iconfont" :class="item.icon"></i>
            {{item.text}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  export default {
    name: 'design-site',
    data () {
      return {
        list: [{
          value: 10,
          icon: 'icon-keting',
          text: '客厅'
        }, {
          value: 15,
          icon: 'icon-hekriconqingjingyushicesuo',
          text: '洗手间'
        }, {
          value: 11,
          icon: 'icon-canting',
          text: '餐厅'
        }, {
          value: 16,
          icon: 'icon-yangtai',
          text: '阳台'
        }, {
          value: 12,
          icon: 'icon-icon-test',
          text: '主卧'
        }, {
          value: 17,
          icon: 'icon-ertongfang',
          text: '儿童房'
        }, {
          value: 13,
          icon: 'icon-ciwo',
          text: '次卧'
        }, {
          value: 18,
          icon: 'icon-shufang',
          text: '书房'
        }, {
          value: 14,
          icon: 'icon-chufang',
          text: '厨房'
        }, {
          value: 19,
          icon: 'icon-yimaojian',
          text: '衣帽间'
        }]
      }
    },
    methods:{
        setSite(index){
            //console.log(index);
            this.$emit('curItem',this.list[index]);
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .design-site {
    width: 200px;
    background: #fff;
    padding: 10px;
    -webkit-border-radius:5px;
    -moz-border-radius:5px;
    border-radius:5px;
  }
  .reset{
    padding:0 10px;
    margin:5px 0;
  }

</style>
