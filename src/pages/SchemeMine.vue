<template>
  <div class="scheme-mine">
    <div class="row">
      <div v-for="(item,index) in dataList" class="reset" :class="[index%3==0?'col-xs-12':'col-xs-6']">
        <div class="item_box" @click="toDetail(index)"  @mouseenter="curIndex=index">
          <img-limit-widther :url="detecte(item.thumbImg)" v-if="index%3==0"></img-limit-widther>
          <img-limit :url="detecte(item.thumbImg)" v-if="index%3!=0"></img-limit>
          <div class="item_explain_cover">
            <div class="item_explain">
              <p>{{item.name}}</p>
              <p>{{item.house}} {{item.mianji}} {{item.style}}</p>
              <p>{{item.mainDetail}}</p>
            </div>
          </div>
          <div class="site_action">
            <el-dropdown @command="handleCommand" >
              <span class="el-dropdown-link">
                <i class="iconfont icon-sitting"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">编辑</el-dropdown-item>
                <el-dropdown-item command="2">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
    name: 'scheme-mine',
    components: {ImgLimit, ImgLimitWidther},
    data () {
      return {
        dataList: [],
        curIndex:0
      }
    },
    mounted(){
      this.GetPlanListByUserId();
    },
    methods: {
      handleCommand(command) {
        //this.$message('click on item ' + command);
        console.log(command);
        var that=this;
        switch(parseInt(command)){
          case 1:

            that.setCurSite(this.curIndex);
              break;
          case 2:


            var userInfo=JSON.parse(sessionStorage.userInfo);

            var data={
              opt:2,
              account:userInfo.name,
              password:userInfo.password,
              userId:userInfo.id,
              planId:this.dataList[this.curIndex].id
            };
            console.log(data);

            this.$http.get(globalPath + '/ManagePlan', {params:data}).then(function (res) {
              console.log(res);
              that.loading = false;
              if (res.body == 1001 || res.body == '') {
                that.$message({
                  message: '提交失败',
                  type: 'error'
                })
              } else {
                that.$message({
                  message: '删除成功',
                  type: 'success'
                })
                that.GetPlanListByUserId();
              }
            });
            break;
          default:
              console.log('default');
              break;
        }
      },
      curSite(index){
          console.log(index);
          this.curIndex=index;
      },
      setCurSite(index){
        sessionStorage.setItem('curSite', JSON.stringify(this.dataList[index]));
        bus.$emit('curPage', 'scheme-edit');
      },
      toDetail(index){
        sessionStorage.setItem('curSite', JSON.stringify(this.dataList[index]));
        bus.$emit('curPage', 'scheme-show');
      },
      detecte(url){
        var mUrl = url;
        var pattern = /http/ig;
        if (!pattern.test(url)) {
          mUrl = 'http://7xo8yg.com1.z0.glb.clouddn.com/' + url;
        }
        return mUrl;
      },
      GetPlanListByUserId(){
        var that = this;
        var userInfo = JSON.parse(sessionStorage.userInfo);
        this.$http.get(globalPath + '/GetPlanListByUserId', {
          params: {
            account: userInfo.name,
            password: userInfo.password,
            userId: userInfo.id,
            type: 1
          }
        }).then(function (res) {
          var data = [];
          this.dataList = res.body;
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .item_box {
    width: 100%;
    position: relative;
    cursor: pointer;
  }

  .item_explain_cover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background: linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7))
  }

  .item_explain {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    color: #fff;
    padding: 20px;
  }

  .row {

  }

  .reset {
    padding: 5px;
  }

  .site_action {
    position: absolute;
    right: 0;
    top: 0;
    padding: 10px;
    z-index:30;
    display: block;
  }
  .site_action .iconfont{
    color: #ffa538;
    font-size: 3rem;
  }
</style>
