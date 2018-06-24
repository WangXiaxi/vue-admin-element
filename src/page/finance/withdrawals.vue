<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-input v-model="MerchantName" placeholder="请输入商家名称" min="100"></el-input>
        <el-button type="primary" @click="WithdrawGetPage">搜 索</el-button>
        <el-button type="success" plain @click="changeList(-1)" v-show="Status!=-1">失败的提现记录</el-button>
        <el-button type="success" plain @click="changeList(0)" v-show="Status!=0">全部提现记录</el-button>
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
          label="提现银行"
          prop="Bank">
        </el-table-column>
        <el-table-column
          label="提现金额"
          prop="Money"
          width="200">
        </el-table-column>
        <el-table-column
          label="提现状态"
          prop="StatusName">
        </el-table-column>
        <el-table-column
          label="申请人"
          prop="Creator">
        </el-table-column>
        <el-table-column
          label="申请时间"
          prop="CreateTime">
        </el-table-column>
        <el-table-column label="操作" width="140">
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
          <el-form-item label="提现银行" label-width="100px">
            <el-input v-model="categoryOptions.Bank" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="提现金额" label-width="100px">
            <el-input v-model="categoryOptions.Money" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="提现状态" label-width="100px">
            <el-input v-model="categoryOptions.StatusName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="申请人" label-width="100px">
            <el-input v-model="categoryOptions.Creator" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="失败原因" label-width="100px" v-if="categoryOptions.StatusValue==-2">
            <el-input v-model="categoryOptions.FailReason	" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="银行流水号" label-width="100px" v-if="categoryOptions.StatusValue==2">
            <el-input v-model="categoryOptions.BankNumber	" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="凭证图片地址" label-width="100px" v-if="Math.abs(categoryOptions.StatusValue)==2">
            <div class="yu-photobox">
              <img v-if="categoryOptions.PictureUrl" :src="baseImgPath+categoryOptions.PictureUrl" alt="">
            </div>
          </el-form-item>
          <el-form-item label="操作人姓名" label-width="100px" v-if="Math.abs(categoryOptions.StatusValue)==2">
            <el-input v-model="categoryOptions.ExecuteName	" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="操作时间" label-width="100px" v-if="Math.abs(categoryOptions.StatusValue)==2">
            <el-input v-model="categoryOptions.ExecuteTime	" auto-complete="off" :disabled="true"></el-input>
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
  import {baseUrl,baseImgPath} from '@/config/env'
  import {WithdrawGetPage, WithdrawGet, WithdrawSuccess,WithdrawFail} from '@/api/getdatas'
  import {mapState} from 'vuex'
  export default {
    data(){
      return {
        baseUrl,
        baseImgPath,
        loading:true,
        Status:0,
        MerchantName:'',
        PageIndex: 0,
        PageSize: 20,
        count: 0,
        tableData: [],
        currentPage: 1,
        dialogFormVisible: false,
        categoryOptions:{},
      }
    },
    components: {
      headTop,
    },
    created(){
      this.restaurant_id = this.$route.query.restaurant_id;
      this.WithdrawGetPage();
    },
    computed: {
      ...mapState(['adminInfo']),
    },
    methods:{
      //获取提现记录列表
      async WithdrawGetPage(){
        this.loading=true;
        let form = new FormData();
        form.append("Status", this.Status);
        form.append("PageIndex", this.PageIndex);
        form.append("PageSize", this.PageSize);
        form.append("TotalRecords", this.count);
        if(this.MerchantName){
          form.append("MerchantName", this.MerchantName);
        }
        const restaurants = await WithdrawGetPage(form);
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
      async WithdrawGet(){
        let form = new FormData();
        form.append("WithdrawID", this.MerchantID);
        const WithdrawGets = await WithdrawGet(form);
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
        this.WithdrawGetPage();
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.PageIndex = val;
        this.WithdrawGetPage()
      },
      handleEdit(index, row) {
        this.MerchantID=row.WithdrawID;
        if(this.MerchantID!=''){
          this.WithdrawGet();
          this.dialogFormVisible=true;
        }
      },

    }
  }
</script>

<style lang="less">

</style>
