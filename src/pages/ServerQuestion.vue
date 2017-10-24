<template>
  <div class="server-question">
    <!-- 列表 -->
    <transition name="animate-transition" enter-active-class="animated fadeIn"
                leave-active-class="">
    <div class="question_list" v-if="!detailShow">
      <div class="question_type">
        <switch-item :list="switchList" @curIndex="setCurIndex"></switch-item>
      </div>
      <table class="table table-striped">
        <thead>
        <tr>
          <th>编号</th>
          <th>标题</th>
          <th>提问时间</th>
          <th>状态</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in tableData" v-if="(item.state==switchList[curIndex].name)||(curIndex==0)" @click="setCurQuestion(index)">
          <th>{{item.issueId}}</th>
          <td>[{{item.type}}] {{item.content}}</td>
          <td>{{item.issueTime}}</td>
          <td>{{item.state}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    </transition>
    <!-- 详情页 -->
    <transition name="animate-transition" enter-active-class="animated fadeIn"
                leave-active-class="">
    <div class="question_detail" v-if="detailShow">
      <server-question-detail @setShow="setShow"></server-question-detail>
    </div>
    </transition>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import SwitchItem from '../components/SwitchItem.vue'
  import ServerQuestionDetail from '../pages/ServerQuestionDetail.vue'
  export default {
    name: 'server-question',
    components: {SwitchItem,ServerQuestionDetail},
    data () {
        var userInfo=JSON.parse(sessionStorage.userInfo);
        //console.log(userInfo);
      return {
        detailShow:false,
          tableData:[],
        params:{
          account:userInfo.name,
          password:userInfo.password,
          userId:userInfo.id,
        },
          date:'',
        switchList: [{
          id: 0,
          name: '全部提问'
        }, {
          id: 1,
          name: '进行中'
        }, {
          id: 2,
          name: '已回复'
        },{
          id: 3,
          name: '已完成'
        },],
        curIndex: 0
      }
    },
    methods: {
      setCurIndex(index){
        this.curIndex = index;
        this.params.type=index
      },
      setCurQuestion(index){
          sessionStorage.setItem('curQuestion',JSON.stringify(this.tableData[index]));
          console.log(JSON.parse(sessionStorage.curQuestion));
          this.detailShow=true;
      },
      GetQuestions(){
          var that=this;
        this.$http.get(globalPath+'/GetQuestions',{params:this.params}).then(function (res) {
          //console.log(res);
          //console.log(JSON.parse(decodeURIComponent(res.bodyText)));
          that.tableData=res.body;
        })
      },
      setShow(){
          this.detailShow=false;
      }
    },
    mounted:function(){
        var that=this;
        this.GetQuestions();
    },
    watch:{
      detailShow(val){
          if(!val) this.GetQuestions();
      }
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
  textarea,input,.el-date-editor{
    margin-top:-5px;
  }
  .el-date-editor{
    width:100%;
  }
  .form_con{
    padding-top:20px;
  }

</style>
