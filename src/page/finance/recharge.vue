<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-input v-model="MerchantName" placeholder="请输入商家名称" min="100"></el-input>
        <el-button type="primary" @click="RechargeGetPage">搜 索</el-button>
        <el-button type="success" plain @click="changeList(-1)" v-show="Status!=-1">失败的充值记录</el-button>
        <el-button type="success" plain @click="changeList(0)" v-show="Status!=0">全部充值记录</el-button>
        <!-- <el-button type="success" plain @click="changeList(1)" v-show="Status!=1">已成功和已申请的充值记录</el-button> -->
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="会员名称"
          prop="MerchantName">
        </el-table-column>
        <!--<el-table-column-->
          <!--label="会员用户名"-->
          <!--prop="MemberName">-->
        <!--</el-table-column>-->
        <el-table-column
          label="支付方式"
          prop="PayMethod">
        </el-table-column>
        <el-table-column
          label="充值金额"
          prop="Money">
        </el-table-column>
        <!--<el-table-column-->
          <!--label="申请人"-->
          <!--prop="Creator">-->
        <!--</el-table-column>-->
        <el-table-column
          label="申请时间"
          prop="CreateTime"
          width="200">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)">查看</el-button>
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
      <el-dialog title="提现记录详情" :visible.sync="dialogFormVisible" class="specaildialog" width="500px">
        <el-form :model="categoryOptions">
          <el-form-item label="商家名称" label-width="100px">
            <el-input v-model="categoryOptions.MerchantName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="会员用户名" label-width="100px">
            <el-input v-model="categoryOptions.MemberName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="充值方式" label-width="100px">
            <el-input v-model="categoryOptions.PayMethod" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="充值金额" label-width="100px">
            <el-input v-model="categoryOptions.Money" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="充值状态" label-width="100px">
            <el-input v-model="categoryOptions.StatusName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="充值时间" label-width="100px" v-if="Math.abs(categoryOptions.StatusValue)==2">
            <el-input v-model="categoryOptions.CreateTime	" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
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
  import { baseUrl } from '@/config/env'
  import { RechargeGetPage, RechargeGet, WithdrawGetPage, WithdrawGet, WithdrawSuccess, WithdrawFail } from '@/api/getdatas'
  import { mapState } from 'vuex'
  export default {
    data(){
      return {
        baseUrl,
        loading:true,
        Status:0,
        MerchantName:'',
        PageIndex: 1,
        PageSize: 20,
        count: 40,
        tableData: [],
        currentPage: 1,
        dialogFormVisible: false,
        categoryOptions:{},
        RechargeID:'',
      }
    },
    components: {
      headTop,
    },
    created(){
      this.restaurant_id = this.$route.query.restaurant_id;
      this.RechargeGetPage();
    },
    computed: {
      ...mapState(['adminInfo']),
    },
    methods:{
      //获取提现记录列表
      async RechargeGetPage(){
        this.loading=true;
        let form = new FormData();
        form.append("Status", this.Status);
        form.append("PageIndex", this.PageIndex);
        form.append("PageSize", this.PageSize);
        form.append("TotalRecords", "0");
        if(this.MerchantName){
          form.append("MerchantName", this.MerchantName);
        }
        const restaurants = await RechargeGetPage(form);
        if(restaurants.ResultCode=="000000"){
          if(this.tableData==''){
            this.$message({
              type: 'success',
              message: restaurants.ResultMessage
            });
          }
          this.count=restaurants.TotalRecords;
          this.tableData=restaurants.ResultValue;
          this.loading=false;
        }else{
          this.$message({
            type: 'error',
            message: restaurants.ResultMessage
          });
        }
      },
      //获取提现记录单条信息（编辑操作用到）
      async RechargeGet(){
        let form = new FormData();
        form.append("RechargeID", this.RechargeID);
        const WithdrawGets = await RechargeGet(form);
        if(WithdrawGets.ResultCode=="000000"){
          this.categoryOptions=WithdrawGets.ResultValue;
        }else{
          this.$message({
            type: 'error',
            message: WithdrawGets.ResultMessage
          });
        }
      },
      changeList(mun){
        this.Status=mun;
        this.RechargeGetPage();
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.PageIndex = val;
        this.RechargeGetPage()
      },
      handleEdit(index, row) {
        this.RechargeID=row.RechargeID;
        if(this.RechargeID!=''){
          this.RechargeGet();
          this.dialogFormVisible=true;
        }
      },

    }
  }
</script>

<style lang="less">
  
</style>
