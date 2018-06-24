<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-input v-model="companyname" placeholder="请输入物流公司关键词" min="100"></el-input>
        <el-button type="primary" @click="RouteApplyGetPage">搜 索</el-button>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props" >
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="车 长:">
                <span>{{ props.row.LongS }}</span>
              </el-form-item>
              <el-form-item label="车 型:">
                <span>{{ props.row.ModelS }}</span>
              </el-form-item>
              <el-form-item label="重货单价:">
                <span>{{ props.row.HeavyPrice }}</span>
              </el-form-item>
              <el-form-item label="轻货单价:">
                <span>{{ props.row.LightPrice}}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="商家名称"
          prop="MerchantName">
        </el-table-column>
        <el-table-column
          label="已审核条数"
          prop="AuditCount">
        </el-table-column>
        <el-table-column
          label="起始地-目的地"
          prop="registplace">
        </el-table-column>
        <el-table-column
          label="申请时间"
          prop="CreateTime">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)">审核</el-button>
            <!--<el-button-->
              <!--size="small"-->
              <!--type="danger"-->
              <!--plain-->
              <!--@click="handleDelete(scope.$index, scope.row)">注销</el-button>-->
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
      <el-dialog title="审核专线信息" :visible.sync="dialogFormVisible" class="specaildialog" width="500px">
        <el-form :model="categoryOptions">
          <el-form-item label="商家名称" label-width="120px">
            <el-input v-model="categoryOptions.MerchantName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="已审核条数" label-width="120px">
            <el-input v-model="categoryOptions.AuditCount" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="起始地-目的地" label-width="120px">
            <el-input v-model="categoryOptions.registplace" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="申请时间" label-width="120px">
            <el-input v-model="categoryOptions.CreateTime" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="车长" label-width="120px">
            <el-input v-model="categoryOptions.LongS" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="车型" label-width="120px">
            <el-input v-model="categoryOptions.ModelS" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="重货单价" label-width="120px">
            <el-input v-model="categoryOptions.HeavyPrice" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="轻货单价" label-width="120px">
            <el-input v-model="categoryOptions.LightPrice" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="拒绝理由" label-width="120px">
            <el-input type="textarea" v-model="Reason"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AuditRefuse">拒 绝</el-button>
          <el-button type="primary" @click="AuditPass" >通 过</el-button>
        </div>
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
  import getStore from '@/config/mUtils'
  import address from '@/config/address'

  import {RouteApplyGetPage, RouteAuditPass, RouteAuditRefuse} from '@/api/getdatas'
  import {mapState} from 'vuex'
  export default {
    data(){
      return {
        baseUrl,
        loading:true,
        address:address.area,
        PageIndex: 1,
        PageSize: 20,
        count: 40,
        tableData: [],
        currentPage: 1,
        dialogFormVisible: false,
        categoryOptions: {},
        companyname:'',
        Reason:'',
      }
    },
    components: {
        headTop,
    },
    created(){

      this.RouteApplyGetPage();
    },
    computed: {
      ...mapState(['adminInfo']),
    },
    methods:{
      //获取管理员列表
      async RouteApplyGetPage(){
        this.loading=true;
        let form = new FormData();
        if(this.companyname){
          form.append("Name", this.companyname);
        };
        form.append("PageIndex", this.PageIndex);
        form.append("PageSize", this.PageSize);
        form.append("TotalRecords", "0");
        const restaurants = await RouteApplyGetPage(form);
        if(restaurants.ResultCode=="000000"){
          this.count=restaurants.TotalRecords;
          if(this.tableData==''){
            this.$message({
              type: 'success',
              message: restaurants.ResultMessage
            });
          }
          this.tableData=[];
          restaurants.ResultValue.forEach(item => {
            const tableData = {};
            tableData.RouteID = item.RouteID;
            tableData.MerchantName = item.MerchantName;
            tableData.AuditCount = item.AuditCount;
            tableData.CreateTime = item.CreateTime;
            tableData.LongS = item.LongS;
            tableData.ModelS = item.ModelS;
            tableData.HeavyPrice = item.HeavyPrice;
            tableData.LightPrice = item.LightPrice;
            tableData.Mobile = item.Mobile;
            tableData.registplace=item.FromProvinceName+' '+item.FromCityName+' '+item.FromCountyName+' - '+item.ToProvinceName+' '+item.ToCityName+' '+item.ToCountyName
            this.tableData.push(tableData);

          })

          this.loading=false;
        }else{
          this.$message({
            type: 'error',
            message: restaurants.ResultMessage
          });
        }
      },
      //专线审核通过
      async AuditPass(){
        let form = new FormData();
        form.append("RouteID", this.RouteID);
        form.append("LoginID", this.adminInfo);
        const Disables = await RouteAuditPass(form);
        if(Disables.ResultCode=="000000"){
          this.$message({
            type: 'success',
            message: Disables.ResultMessage
          });
          this.dialogFormVisible=false;
          this.RouteApplyGetPage()
        }else{
          this.$message({
            type: 'error',
            message: Disables.ResultMessage
          });
        }
      },
      //专线审核拒绝
      async AuditRefuse(){
        let form = new FormData();
        if(!this.Reason){
          this.$message({
            type: 'error',
            message: '请先填写拒绝原因'
          });
        }
        form.append("RouteID", this.RouteID);
        form.append("Reason", this.Reason);
        form.append("LoginID", this.adminInfo);
        const Disables = await RouteAuditRefuse(form);
        if(Disables.ResultCode=="000000"){
          this.$message({
            type: 'success',
            message: Disables.ResultMessage
          });
          this.dialogFormVisible=false;
          this.RouteApplyGetPage();
        }else{
          this.$message({
            type: 'error',
            message: Disables.ResultMessage
          });
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.PageIndex = val;
        //this.PageIndex = (val - 1)*this.PageSize;
        this.RouteApplyGetPage()
      },
      handleEdit(index, row) {
        this.Reason = ''; // 打开弹窗清除 textarea
        this.RouteID=row.RouteID;
        this.categoryOptions=row;
        if(this.RouteID!=''){
          this.dialogFormVisible=true;
          //this.RouteApplyGetPage();
        }
      },
    }
  }
</script>

<style lang="less">

</style>
