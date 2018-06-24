<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-button type="success" plain @click="changeList(0)" v-show="stauts!=0">查看未回复</el-button>
        <el-button type="success" plain @click="changeList(1)" v-show="stauts!=1">查看已回复</el-button>
        <el-button type="success" plain @click="changeList(99)" v-show="stauts!=99">全部</el-button>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="用户手机号"
          prop="Mobile"
          width="200">
        </el-table-column>
        <el-table-column
          label="反馈内容"
          prop="desition">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="CreateTime">
        </el-table-column>
        <el-table-column
          label="状态"
          prop="CreateTime">
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="total, prev, pager, next"
          :total="count">
        </el-pagination>
      </div>
      <el-dialog title="查看意见反馈信息" :visible.sync="dialogFormVisible" class="specaildialog" width="500px">
        <el-form :model="categoryOptions">
          <el-form-item label="会员姓名" label-width="100px">
            <el-input v-model="categoryOptions.MemberName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="手机号" label-width="100px">
            <el-input v-model="categoryOptions.Mobile" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" label-width="100px">
            <el-input v-model="categoryOptions.CreateTime" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="反馈内容" label-width="100px">
            <el-input v-model="categoryOptions.Describe" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="反馈图片地址" label-width="100px">
            <div class="yu-photobox" v-for="itempic in picitem">
              <img :src="baseImgPath+itempic" alt="" @click="changepiccontet">
            </div>
          </el-form-item>
          <el-form-item label="反馈回复" label-width="100px">
            <el-input type="textarea" v-model="textareas"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="FeedbackReply">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="图片查看" :visible.sync="dialogpicVisible" center width="700px">
        <el-carousel trigger="click" height="600px">
          <el-carousel-item v-for="(item,key,index) in picitem" key="key">
            <a :href="baseImgPath+item" target="_blank" class="piccontet">
              <img :src="baseImgPath+item">
              <!--<span>{{item.title}}</span>-->
            </a>
          </el-carousel-item>
        </el-carousel>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    // export default {
    //     name: "adminlist"
    // }

    import headTop from '@/components/headTop'
    import {baseUrl,baseImgPath} from '@/config/env'
    import {FeedbackGetPage, FeedbackGet,FeedbackReply} from '@/api/getdatas'
    import {mapState} from 'vuex'
    export default {
      data(){
        return {
          baseUrl,
          baseImgPath,
          loading:true,
          stauts:99,
          PageIndex: 1,
          PageSize: 20,
          count: 0,
          tableData: [],
          categoryOptions:{},
          FeedbackID:'',
          admintitlelist:[
            {admintitle:""},
            {admintitle:"有效的管理员"},
            {admintitle:"管理员名称"},
          ],
          currentPage: 10,
          dialogFormVisible: false,
          textareas:'',
          picitem:{},
          dialogpicVisible:false,
          PageID:'',
        }
      },
      components: {
          headTop,
      },
      created(){
        this.restaurant_id = this.$route.query.restaurant_id;
        this.FeedbackGetPage();
      },
      computed: {
        ...mapState(['adminInfo']),
      },
      methods:{
        //获取建议反馈
        async FeedbackGetPage(){
          this.loading=true;
          let form = new FormData();
          form.append("Status", this.stauts);
          form.append("PageIndex", this.PageIndex);
          form.append("PageSize", this.PageSize);
          form.append("TotalRecords", "0");
          const restaurants = await FeedbackGetPage(form);
          if(restaurants.ResultCode=="000000"){
            if(this.tableData==''){
              this.$message({
                type: 'success',
                message: restaurants.ResultMessage
              });
            }
            this.count=restaurants.TotalRecords;
            this.tableData=[];
            restaurants.ResultValue.forEach(item => {
              const tableDatas = {};
              tableDatas.Mobile=item.Mobile;
              tableDatas.CreateTime=item.CreateTime;
              tableDatas.FeedbackID=item.FeedbackID;
              //tableDatas.stauts=item.Status==0?'未回复':'已处理';
              if(item.Describe.length>12){
                tableDatas.desition=(item.Describe).substring(0,10)+'...';
              }else{
                tableDatas.desition=item.Describe
              }
              this.tableData.push(tableDatas);
            })
            this.loading=false;
          }else{
            this.$message({
              type: 'error',
              message: restaurants.ResultMessage
            });
          }
        },
        //获取建议反馈单条信息（编辑操作用到）
        async FeedbackGet(){
            let form = new FormData();
            form.append("FeedbackID", this.FeedbackID);
            const FeedbackGets = await FeedbackGet(form);
            if(FeedbackGets.ResultCode=="000000"){
              this.categoryOptions=FeedbackGets.ResultValue;
              if(FeedbackGets.ResultValue.PicturesUrl){
                this.picitem=FeedbackGets.ResultValue.PicturesUrl.split(',');
              }
            }else{
              this.$message({
                type: 'error',
                message: FeedbackGets.ResultMessage
              });
            }
        },
        //获取建议反馈单条信息（编辑操作用到）
        async FeedbackReply(){
          let form = new FormData();
          form.append("FeedbackID", this.FeedbackID);
          form.append("Content", this.textareas);
          form.append("LoginID", this.adminInfo);
          form.append("PageID", this.PageID);
          const FeedbackReplys = await FeedbackReply(form);
          if(FeedbackReplys.ResultCode=="000000"){
            this.$message({
              type: 'success',
              message: FeedbackReplys.ResultMessage
            });
            this.dialogFormVisible=false;
          }else{
            this.$message({
              type: 'error',
              message: FeedbackReplys.ResultMessage
            });
          }
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          this.currentPage = val;
          this.PageIndex = val;
          this.FeedbackGetPage()
        },
        handleSelect(index){
          this.loginForm.RoleName = index;
          this.loginForm.RoleID = this.selectedCategory[index].value;
        },
        handleEdit(index, row) {
          console.log(index, row);
          this.FeedbackID=row.FeedbackID
          console.log(this.FeedbackID)
          if(this.FeedbackID!=''){
            this.FeedbackGet();
            this.dialogFormVisible=true;
          }
        },
        changeList(status){
          if(this.stauts!=status){
            this.stauts=status;
            this.FeedbackGetPage();
          }
        },
        changepiccontet(){
          this.piccontet=[];
          this.dialogpicVisible=true;
        },
      }
    }
</script>

<style scoped>
  .table_container{
    padding: 20px;
  }
  .Pagination{
    display: flex;
    justify-content: flex-start;
    margin-top: 8px;
  }
</style>
