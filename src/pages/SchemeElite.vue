<template>
  <div class="scheme-elite">
      <div class="row">
        <div v-for="(item,index) in dataList" class="reset" :class="['col-xs-6']">
          <div class="item_box" @click="setCurSite(index)">
            <img-limit-widther :url="item.thumbImg" ></img-limit-widther>
            <div class="item_explain_cover">
              <div class="item_explain">
                <p>{{item.name}}</p>
                <p>{{item.house}} {{item.mianji}} {{item.style}}</p>
                <p>{{item.mainDetail}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import ImgLimit from '../components/ImgLimit.vue'
  import ImgLimitWidther from '../components/ImgLimitWidther.vue'
  export default {
    name: 'scheme-elite',
    components:{ImgLimit,ImgLimitWidther},
    data () {
      return {
          dataList:[]
      }
    },
    mounted(){
      this.GetPlanListByUserId();
    },
    methods: {
      setCurSite(index){
          sessionStorage.setItem('curSite',JSON.stringify(this.dataList[index]));
        bus.$emit('curPage','scheme-show');
      },
      GetPlanListByUserId(){
        var that = this;
        var userInfo = JSON.parse(sessionStorage.userInfo);
        this.$http.get(globalPath+'/GetPlanListByUserId', {
          params: {
            account: userInfo.name,
            password: userInfo.password,
            userId: userInfo.id,
            type: 0
          }
        }).then(function (res) {
          this.dataList=res.body;
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item_box{
  width:100%;
  position: relative;
  cursor: pointer;
}
.item_explain_cover{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7))
}
.item_explain{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  color: #fff;
  padding:20px;
}

  .row{

  }
  .reset{
    padding:5px;
  }
</style>
