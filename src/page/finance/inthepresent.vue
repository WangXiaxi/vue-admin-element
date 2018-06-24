<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-input v-model="MerchantName" placeholder="请输入商家名称" min="100"></el-input>
        <el-button type="primary" @click="WithdrawGetPage">搜 索</el-button>
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
          <el-form-item label="信息" label-width="100px">
            <el-input type="textarea" v-model="textareas" placeholder='失败理由或者成功流水号'></el-input>
          </el-form-item>
          <el-form-item label="凭证图片" label-width="100px" prop="LicensePicture" v-if="Math.abs(categoryOptions.StatusValue)==1">
            <el-upload
              v-loading="loadingImg"
              class="avatar-uploader"
              ref="upload"
              multiple="false"
              action="string"
              :http-request="LicenseBeforeUpload"
              :show-file-list="false" 
              :auto-upload="true"
              list-type="picture-card"
              :multiple="false">
              <img v-if="picUrl" :src="baseImgPath+picUrl" class="avatar">
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="WithdrawFail">失 败</el-button>
          <el-button type="primary" @click="WithdrawSuccess">成 功</el-button>
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
  import {baseUrl,baseImgPath} from '@/config/env'
  import {mapState} from 'vuex'
  import {WithdrawGetPage, WithdrawGet,WithdrawSuccess,WithdrawFail,UploadSingle} from '@/api/getdatas'
  export default {
    data(){
      return {
        baseUrl,
        baseImgPath,
        loading:true,
        Status:1,
        MerchantName:'',
        PageIndex: 1,
        PageSize: 20,
        count: 40,
        tableData: [],
        currentPage: 1,
        dialogFormVisible: false,
        categoryOptions: {},
        textareas:'',
        LicensePicture: '',
        picUrl:'',
        loadingImg: false
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
      //营业执照上传
      async LicenseBeforeUpload(data) {
        let file = data.file
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isJPG) {
          this.$message.error('请选择正确的图片格式!');
          return false;
        }
        let formData = new FormData();
        formData.append('file', file);
        this.loadingImg = true
        let upload=await UploadSingle(formData);
        this.loadingImg = false
        if(upload.ResultCode == "000000"){
          this.$message({
            type: 'success',
            message: upload.ResultMessage
          });
          this.picUrl = upload.ResultValue;
          //this.enterData.LicensePicture = res.data.ResultValue;
        }else{
          this.$message({
            type: 'error',
            message: upload.ResultMessage
          });
        }
        return false;
      },

      //获取提现记录列表
      async WithdrawGetPage(){
        this.loading=true;
        let form = new FormData();
        form.append("Status", this.Status);
        form.append("PageIndex", this.PageIndex);
        form.append("PageSize", this.PageSize);
        form.append("TotalRecords", "0");
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
      //提现成功接口（编辑操作用到）
      async WithdrawSuccess(){
        let form = new FormData();
        form.append("WithdrawID", this.MerchantID);
        form.append("Number", this.textareas);
        form.append("Picture", this.picUrl);
        form.append("LoginID", this.adminInfo);
        const Success = await WithdrawSuccess(form);
        if(Success.ResultCode=="000000"){
          this.$message({
            type: 'success',
            message: Success.ResultMessage
          });
          this.dialogFormVisible =false;
          this.currentPage = 1;
          this.PageIndex = 1;
          this.WithdrawGetPage();
        }else{
          this.$message({
            type: 'error',
            message: Success.ResultMessage
          });
        }
      },
      //提现失败接口（编辑操作用到）
      async WithdrawFail(){
        let form = new FormData();
        form.append("WithdrawID", this.MerchantID);
        form.append("Reason", this.textareas);
        form.append("Picture", this.picUrl);
        form.append("LoginID", this.adminInfo);
        const Success = await WithdrawFail(form);
        if(Success.ResultCode=="000000"){
          this.$message({
            type: 'success',
            message: Success.ResultMessage
          });
          this.dialogFormVisible =false;
          this.currentPage = 1;
          this.PageIndex = 1;
          this.WithdrawGetPage();
        }else{
          this.$message({
            type: 'error',
            message: Success.ResultMessage
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
        this.picUrl = '';
        this.textareas = '';
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
  .avatar-uploader {
    width: 148px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /*.avatar-uploader .el-upload:hover{*/
    /*border-color: #409EFF;*/
  /*}*/
  /*.el-upload--picture-card{*/
    /*width: 0;*/
    /*height: 0;*/
  /*}*/
  .avatar {
    width: 146px;
    height: 146px;
    display: block;
  }
</style>
