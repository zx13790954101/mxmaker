<template>
  <div class="disign-area">
    <div class="row_center" v-for="(item,index) in selectedSite">
      <div class="selected_site" :class="index==curIndex?'active':''" @click="curIndex=index">
        <i class="iconfont" :class="item.icon"></i>
        {{item.text}}
      </div>
      <div class="edit_bar" v-show="index==curIndex">
        <i class="iconfont icon-bianji" @click="showSiteChange($event)"></i>
        <i class="iconfont icon-shanchu-copy" @click="selectedSite.splice(curIndex,1)"></i>
      </div>
    </div>
    <div class="row_center">
      <i class="iconfont icon-tianjia1 " style="font-size: 3rem" @click="showCover($event)"></i>
    </div>
    <cover-locat :isShow="changeShow" @showChange="siteChange" :styleData="styleData">
      <div class="addPlane" slot="insert">
        <design-site @curItem="changeSite"></design-site>
      </div>
    </cover-locat>
    <cover-locat :isShow="addShow" @showChange="showChange" :styleData="styleData">
      <div class="addPlane" slot="insert">
        <design-site @curItem="addSite"></design-site>
      </div>
    </cover-locat>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import CoverLocat from '../components/CoverLocat.vue'
  import DesignSite from '../components/DesignSite.vue'
  export default {
    name: 'disign-area',
    components: {CoverLocat, DesignSite},
    data () {
      return {
        changeShow: false,
        addShow: false,
        styleData: {
          left: '200px',
          top: '200px'
        },
        siteId: 0,
        curIndex: 0,
        selectedSite: [],
      }
    },
    mounted(){
      var that = this;
      bus.$off(['curSiteIndex']);
      setTimeout(function () {
        bus.$on('curSiteIndex', function (data) {
          that.curIndex = data;
        });
      },100);

    },
    methods: {
      showChange(val){
        this.addShow = val;
      },
      addSite(val){
        var data = val;
        data.id = ++this.siteId;
        data.input = 'hello world';
        data.imgList=[{
          url:"http://7xo8yg.com1.z0.glb.clouddn.com/temp136789525111505439656118.jpg"
        }];
        this.selectedSite.push(data);
        this.curIndex = this.selectedSite.length - 1;
      },
      showCover(obj){
        this.addShow = !this.addShow;
        //this.left=$(obj).offsetX
        this.styleData.left = $(obj)[0].pageX + 30 + 'px';
        this.styleData.top = $(obj)[0].pageY - 107 + 'px';
      },
      siteChange(val){
        this.changeShow = val;
      },
      changeSite(val){
        var id = this.selectedSite[this.curIndex].id;
        this.selectedSite[this.curIndex] = val;
        this.selectedSite[this.curIndex].id = id;
      },
      showSiteChange(obj){
        this.changeShow = !this.changeShow;
        //this.left=$(obj).offsetX
        this.styleData.left = $(obj)[0].pageX + 30 + 'px';
        this.styleData.top = $(obj)[0].pageY - 107 + 'px';
      },
    },
    watch: {
      selectedSite(val){
        bus.$emit('selectedSite', val);
      },
      curIndex(val){
        bus.$emit('curSiteIndex', val);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .row_center {
    text-align: center;
    color: #ffa538;
  }

  .row_center .iconfont {
    cursor: pointer;
  }

  .row_center > div {
    display: inline-block;
  }

  .row_center .iconfont:active {
    color: #ffbf8b;
  }

  .selected_site {
    background: #ddd;
    color: #333;
    padding: 5px 20px;
    width: 140px;
    margin: 5px;
    border-radius: 30px;
    cursor: pointer;
  }

  .active {
    color: #fff;
    background: #ffa538;
  }

  .edit_bar .iconfont {
    padding: 3px;
    font-size: 2rem;
  }
</style>
