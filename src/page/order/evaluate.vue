<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-date-picker
          v-model="choosetime"
          type="daterange"
          :unlink-panels="true"
          @change="changetime"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-input v-model="companyname" placeholder="请输入物流公司关键词" min="100"></el-input>
        <el-input v-model="OrderCode" placeholder="请输入订单号关键词" min="100"></el-input>
        <el-button type="primary" @click="EvaluateGetPage">搜索</el-button>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="会员名称"
          prop="MerchantName">
        </el-table-column>
        <el-table-column
          label="	评价人姓名"
          prop="MemberName"
          width="120">
        </el-table-column>
        <el-table-column
          label="	评价时间"
          prop="EvaluateTime"
          width="180">
        </el-table-column>
        <el-table-column
          label="态度评分"
          prop="AttitudeScore" width="100">
        </el-table-column>
        <el-table-column
          label="服务评分"
          prop="ServiceScore" width="100">
        </el-table-column>
        <el-table-column
          label="货源真实性评分"
          prop="ValidityScore" width="140">
        </el-table-column>
        <el-table-column
          label="订单号"
          prop="OrderCode" width="140">
        </el-table-column>
        <el-table-column
          label="	评价内容"
          width="200"
          prop="EvaluateContent">
          <template slot-scope="scope">
            {{scope.row.EvaluateContent.slice(0, 10)}}{{scope.row.EvaluateContent.length > 10 ? "..." : ""}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="PageSize"
          layout="total, prev, pager, next"
          :total="count">
        </el-pagination>
      </div>
      <el-dialog title="运单评价详情" :visible.sync="dialogFormVisible" class="specaildialog" width="500px">
        <el-form :model="tableDatalist">
          <el-form-item label="订单编码" label-width="110px">
            <el-input v-model="tableDatalist.OrderID" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="	订单号" label-width="110px">
            <el-input v-model="tableDatalist.OrderCode" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="会员名称" label-width="110px">
            <el-input v-model="tableDatalist.MerchantName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="评价人姓名" label-width="110px">
            <el-input v-model="tableDatalist.MemberName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="	评价时间" label-width="110px">
            <el-input v-model="tableDatalist.EvaluateTime" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="	态度评分" label-width="110px">
            <el-input v-model="tableDatalist.AttitudeScore" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="服务评分" label-width="110px">
            <el-input v-model="tableDatalist.ServiceScore" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="	态度评分" label-width="110px">
            <el-input v-model="tableDatalist.AttitudeScore" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="货源真实性评分" label-width="110px">
            <el-input v-model="tableDatalist.ValidityScore" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="评价内容" label-width="110px">
            <el-input type="textarea" v-model="tableDatalist.EvaluateContent" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <!--<el-form-item label="修改者" label-width="100px">-->
            <!--<el-input v-model="tableDatalist.Modifier" auto-complete="off" :disabled="true"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="修改时间" label-width="100px">-->
            <!--<el-input v-model="tableDatalist.ModifyTime" auto-complete="off" :disabled="true"></el-input>-->
          <!--</el-form-item>-->
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    // export default {
    //     name: "adminlist"
    // }

    import headTop from '@/components/headTop'
    import {baseUrl} from '@/config/env'
    import {EvaluateGetPage} from '@/api/getdatas'
    import {mapState} from 'vuex'
    import { gettimes } from '@/config/getTimes'
    export default {
      data(){
        return {
          baseUrl,
          loading:true,
          stauts:2,
          PageIndex: 1,
          PageSize: 20,
          count: 0,
          tableData: [],
          PageID:0,
          MessageID:undefined,
          currentPage: 1,
          dialogFormVisible:false,
          dialognewform:false,

          OrderCode:'',
          tableDatalist:{},
          companyname:'',
          FromDate:'',
          ToDate:'',
          choosetime: [new Date().setDate(new Date().getDate() - 7), new Date()],

        }
      },
      components: {
          headTop,
      },
      created(){
        this.FromDate = gettimes(new Date().setDate(new Date().getDate() - 7));
        this.ToDate = gettimes();
        this.EvaluateGetPage();
      },
      computed: {
        ...mapState(['adminInfo']),
      },
      methods:{
        //获取站内信列表
        async EvaluateGetPage(){
          this.loading=true;
          let form = new FormData();
          if(this.companyname){
            form.append("Name", this.companyname);
          };
          if(this.OrderCode){
            form.append("OrderCode", this.OrderCode);
          };
          form.append("FromDate", this.FromDate);
          form.append("ToDate", this.ToDate);
          form.append("PageIndex", this.PageIndex);
          form.append("PageSize", this.PageSize);
          form.append("TotalRecords", "0");
          const GetPage = await EvaluateGetPage(form);
          if(GetPage.ResultCode=="000000"){
            if(this.tableData==''){
              this.$message({
                type: 'success',
                message: GetPage.ResultMessage
              });
            }
            this.tableData=GetPage.ResultValue;

            this.count=GetPage.TotalRecords;
            this.loading=false;
          }else{
            this.$message({
              type: 'error',
              message: GetPage.ResultMessage
            });
          }
        },
        changetime(){
          if(this.choosetime){
            this.FromDate=gettimes(this.choosetime[0]);
            this.ToDate=gettimes(this.choosetime[1]);
          }else{
            this.FromDate=gettimes(new Date().setDate(new Date().getDate() - 7));
            this.ToDate=gettimes();
          }
        },
        handleEdit(index, row) {
          this.MessageID=row.MessageID;
          if(this.MessageID!=''){
            this.tableDatalist=row;
            this.dialogFormVisible=true;
          }
        },
        handleSizeChange(val) {
        },
        handleCurrentChange(val) {
          this.currentPage = val;
          this.PageIndex = val;
          this.EvaluateGetPage()
        },

      }
    }
</script>

<style lang="less">
  .table_container{
    padding: 20px;
  }
  .Pagination{
    display: flex;
    justify-content: flex-start;
    margin-top: 8px;
  }
  .specialrecord{
    width: 100%;
    display: inline-block;
    border: #d1dbe5 1px solid;
    border-radius: 4px;
    color: #6c6c6c;
    background: #ebf2f8;
  }
  .specialrecord span{padding:6px 10px;display: block;line-height:24px;}
  .topFS .el-input{width:250px;}
</style>
