<template>
  <div class="scheme-remark">
    <div class="row">
      <div v-for="(item,index) in dataListShow" class="reset" :class="[index%3==0?'col-xs-12':'col-xs-6']">
        <div class="item_box" @click="toDetail(index)"  @mouseenter="curIndex=index">
          <img-limit-widther :url="detecte(item.mainImg)" v-if="index%3==0"></img-limit-widther>
          <img-limit :url="detecte(item.mainImg)" v-if="index%3!=0"></img-limit>
          <div class="item_explain_cover">
            <div class="item_explain">
              <p>{{item.memo}}</p>
            </div>
          </div>
          <div class="site_action">
            <el-dropdown @command="handleCommand" >
              <span class="el-dropdown-link">
                <i class="iconfont icon-sitting"></i>
              </span>
              <el-dropdown-menu slot="dropdown">

                <el-dropdown-item command="2">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!--<i class="iconfont icon-shanchu-copy" @click="deleteRemark"></i>-->
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
    name: 'scheme-remark',
    props:['searchWord'],
    components: {ImgLimit, ImgLimitWidther},
    data () {
      return {
        dataList: [],
        curIndex:0,
        dataListShow:[]
      }
    },
    mounted(){
      this.getMemoLlist();
    },
    methods: {
      deleteRemark(index){
          var that=this;
        this.$http.post(globalPath+'/ManageMemo',{
          model:'del',
          userId:sessionStorage.userId,
          memoId:this.dataListShow[index].id
        },{emulateJSON: true}).then(function (res) {
          console.log(res);
          if(res.body==1000){
            that.$message({
              message:'操作成功！',
              type:'success'
            });
            that.getMemoLlist();
          }else{
            that.$message({
              message:'操作失败！',
              type:'error'
            })
          }
        });

      },
      handleCommand(command) {
        //this.$message('click on item ' + command);
        console.log(command);
        var that=this;
        switch(parseInt(command)){
          case 1:

            that.setCurSite(this.curIndex);
              break;
          case 2:

            this.$http.post(globalPath+'/ManageMemo',{
              model:'del',
              userId:sessionStorage.userId,
              memoId:this.dataListShow[this.curIndex].id
            },{emulateJSON: true}).then(function (res) {
              console.log(res);
              if(res.body==1000){
                that.$message({
                  message:'操作成功！',
                  type:'success'
                });
                that.getMemoLlist();
              }else{
                that.$message({
                  message:'操作失败！',
                  type:'error'
                })
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
        sessionStorage.setItem('curRemark', JSON.stringify(this.dataList[index]));
        bus.$emit('curPage', 'remark-show');
      },
      detecte(url){
        var mUrl = url;
        var pattern = /http/ig;
        if (!pattern.test(url)) {
          mUrl = 'http://7xo8yg.com1.z0.glb.clouddn.com/' + url;
        }
        return mUrl;
      },
      getMemoLlist(){
        var that = this;
        var userInfo = JSON.parse(sessionStorage.userInfo);
        this.$http.get(globalPath + '/ManageMemo', {
          params: {
            model:'find',
            userId: userInfo.id,
          }
        }).then(function (res) {

          console.log(res.body);
          this.dataList = res.body;
          this.dataListShow=res.body;
        });
      }
    },
    watch:{
      searchWord(val){
          //console.log(val);
          if(val==''){
            this.dataListShow=this.dataList;
            return;
          }
          var array=[];
          //var pattern=new RegExp(val,'ig');
          //console.log(pattern);
          $(this.dataList).each(function (index,ele) {
            console.log(index,ele.memo);
            var pattern=new RegExp(val,'ig');
            if(pattern.test(ele.memo)){
                console.log(index);
              array.push(ele);
            }
          });
          this.dataListShow=array;
          //console.log(array);
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
