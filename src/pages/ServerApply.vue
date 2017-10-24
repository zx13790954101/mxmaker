<template>
  <div class="server-apply">
    <div class="question_type">
      <div class="col-xs-9">
        <switch-item :list="switchList" @curIndex="setCurIndex"></switch-item>
      </div>
      <div class="col-xs-3">
        <button class="btn btn-warning pull-right" @click="toAdd"><i class="iconfont icon-icon02"></i>&nbsp;添加申请</button>
      </div>

    </div>
    <table class="table table-striped">
      <thead>
      <tr>
        <th>物料编号</th>
        <th>备注信息</th>
        <th>申请时间</th>
        <th>状态</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) in ApplyList" v-if="(item.state==switchList[curIndex].name)||(curIndex==0)" @click="setCurApply(index)">
        <th>{{item.applyId}}</th>
        <td>{{item.reason}}</td>
        <td>{{item.upDate}}</td>
        <td>{{item.state}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import SwitchItem from '../components/SwitchItem.vue'
  export default {
    name: 'server-apply',
    components: {SwitchItem},
    data () {
      var userInfo = JSON.parse(sessionStorage.userInfo);
      //console.log(userInfo);
      return {
        ApplyList:[],
        params: {
          account: userInfo.name,
          password: userInfo.password,
          userId: userInfo.id,
          type: 0,
        },
        date: '',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        switchList: [{
          id: 0,
          name: '全部申请'
        }, {
          id: 1,
          name: '待处理'
        }, {
          id: 2,
          name: '已处理'
        }],
        curIndex: 0
      }
    },
    methods: {
      setCurApply(index){
          sessionStorage.setItem('curApply',JSON.stringify(this.ApplyList[index]));
          console.log(JSON.parse(sessionStorage.curApply));
          this.$emit('toDetail',true);
      },
      setCurIndex(index){
        this.curIndex = index;
        this.params.type = index
      },
      toAdd(){
        this.$emit('toAdd',true);
      },
      GetPartApplyList(){
        var that = this;
        var userInfo = JSON.parse(sessionStorage.userInfo);
        this.$http.get(globalPath+'/GetPartApplyList', {
          params: {
            userId: userInfo.id,
            account: userInfo.name,
            password: userInfo.password,
          }
        }).then(function (res) {
          this.ApplyList = res.body;
          console.log('配件申请',res);
        })
      }

    },
    mounted: function () {
      var that = this;
      this.GetPartApplyList();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .col_reset {
    overflow: hidden;
    padding: 10px 0;
  }

  .row_title {
    text-align: right;
  }

  textarea, input, .el-date-editor {
    margin-top: -5px;
  }

  .el-date-editor {
    width: 100%;
  }

  .form_con {
    padding-top: 20px;
  }

</style>
