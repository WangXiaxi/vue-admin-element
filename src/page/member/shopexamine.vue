<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="会员名称"
          prop="name">
        </el-table-column>
        <el-table-column
          label="会员ID"
          prop="code"
          width="200">
        </el-table-column>
        <el-table-column
          label="登录账号"
          prop="">
        </el-table-column>
        <el-table-column
          label="地址"
          prop="address">
        </el-table-column>
        <el-table-column
          label="申请时间"
          prop="CreateTime" width="200">
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
          :page-size="PageSize"
          layout="total, prev, pager, next"
          :total="count">
        </el-pagination>
      </div>
      <el-dialog title="审核商家信息" :visible.sync="dialogFormVisible" center width="500px">
        <el-form :model="categoryOptions">
          <el-form-item label="商家名称" label-width="100px">
            <el-input v-model="categoryOptions.MerchantName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="商家类别" label-width="100px">
            <div class="specialrecord"><span>{{categoryOptions.CrowdType | formshoptype(categoryOptions.CrowdType) }}</span></div>
          </el-form-item>
          <el-form-item label="联系电话" label-width="100px">
            <el-input v-model="categoryOptions.MerchantPhone" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="营业执照号" label-width="100px" v-if="categoryOptions.CrowdType!=3">
            <el-input v-model="categoryOptions.LicenseCode" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="营业执照图片" label-width="100px" v-if="categoryOptions.CrowdType!=3">
            <div class="yu-photobox">
              <img v-if="categoryOptions.LicensePicture" :src="baseImgPath+categoryOptions.LicensePicture" alt="" @click="changepiccontet" class="pic-big-show">
            </div>
          </el-form-item>
          <el-form-item label="负责人姓名" label-width="100px" v-if="categoryOptions.CrowdType!=3">
            <el-input v-model="categoryOptions.Director" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" label-width="100px" v-if="categoryOptions.CrowdType==3">
            <el-input v-model="categoryOptions.IdentityCode" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="身份证图片" label-width="100px" v-if="categoryOptions.CrowdType==3">
            <div class="yu-photobox" v-for="item in IdentityPicture">
              <img v-if="item" :src="baseImgPath+item" alt="" @click="changepiccontet" class="pic-big-show">
            </div>
          </el-form-item>
          <el-form-item label="省市区" label-width="100px" v-if="categoryOptions.CrowdType!=3">
            <div class="specialrecord"><span>{{categoryOptions.ProvincevName}}/{{categoryOptions.CityName}}/{{categoryOptions.CountyName}}</span></div>
          </el-form-item>
          <el-form-item label="详细地址" label-width="100px" v-if="categoryOptions.CrowdType!=3">
            <el-input v-model="categoryOptions.Address" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="车牌号码" label-width="100px" v-if="categoryOptions.CrowdType!=1">
            <el-input v-if="categoryOptions.TruckPicture" v-model="categoryOptions.TruckCode" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="车头图片" label-width="100px" v-if="categoryOptions.CrowdType!=1">
            <div class="yu-photobox">
              <img v-if="categoryOptions.TruckPicture" :src="baseImgPath+categoryOptions.TruckPicture" alt="" @click="changepiccontet" class="pic-big-show">
            </div>
          </el-form-item>

          <!-- 车辆承运险 -->
          <el-form-item label="车辆承运险" label-width="100px"  v-if="categoryOptions.CrowdType!=1">
            <div class="yu-photobox">
              <img :src="baseImgPath+categoryOptions.InsurancePicture" alt="" @click="changepiccontet" class="pic-big-show">
            </div>
          </el-form-item>
          <!-- 车辆承运险 -->

          <el-form-item label="车辆信息" label-width="100px" v-if="categoryOptions.CrowdType!=1">
            <div class="specialrecord"><span>{{categoryOptions.TruckModel}}/{{categoryOptions.TruckLong}}/{{categoryOptions.TruckLoad}}（车型/车长.米/载重.吨）</span></div>
          </el-form-item>
          <el-form-item label="行驶证照片" label-width="100px" v-if="categoryOptions.CrowdType!=1">
            <div class="yu-photobox">
              <img v-if="categoryOptions.RunPicture" :src="baseImgPath+categoryOptions.RunPicture" alt="" @click="changepiccontet" class="pic-big-show">
            </div>
          </el-form-item>
          <el-form-item label="驾驶证照片" label-width="100px" v-if="categoryOptions.CrowdType!=1">
            <div class="yu-photobox">
              <img v-if="categoryOptions.DrivePicture" :src="baseImgPath+categoryOptions.DrivePicture" alt="" @click="changepiccontet" class="pic-big-show">
            </div>
          </el-form-item>
          <el-form-item label="拒绝理由" label-width="100px">
            <el-input type="textarea" v-model="textareas"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="MerchantAudit(false)">拒 绝</el-button>
          <el-button type="primary" @click="MerchantAudit(true)">通 过</el-button>
        </div>
      </el-dialog>
      <el-dialog title="图片查看" :visible.sync="dialogpicVisible" center width="700px">
        <el-carousel trigger="click" height="600px" v-if="dialogpicVisible" :initial-index="picBigShowIndex">
          <el-carousel-item v-for="(item, index) in piccontet" :key="index">
            <a :href="item.pic" target="_blank" class="piccontet">
              <img v-if="item.pic" :src="item.pic">
            </a>
          </el-carousel-item>
        </el-carousel>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import headTop from '@/components/headTop'
  import {baseUrl,baseImgPath} from '@/config/env'
  import {MerchantApplyPage, MerchantAudit,MerchantGetApply} from '@/api/getdatas'
  export default {
    data() {
      return {
        baseUrl,
        baseImgPath,
        loading:true,
        PageSize: 20,
        count: 0,
        tableData: [],
        shopID: '',
        currentPage: 1,
        MercStatus:1,
        dialogFormVisible: false,
        dialogpicVisible:false,
        categoryOptions: {},
        dialogtype: false,
        textareas:'',
        IdentityPicture:[],
        piccontet:[],
        picBigShowIndex: 0
      }
    },
    components: {
      headTop,
    },
    created() {
      this.restaurant_id = this.$route.query.restaurant_id;
      this.MerchantApplyPage();
    },
    methods: {
      //获取角色列表
      async MerchantApplyPage() {
        this.loading=true;
        let form = new FormData();
        form.append("PageIndex", this.currentPage);
        form.append("PageSize", this.PageSize);
        form.append("TotalRecords", "0");
        const restaurants = await MerchantApplyPage(form);
        if (restaurants.ResultCode == "000000") {
          if(this.tableData==''){
            this.$message({
              type: 'success',
              message: restaurants.ResultMessage
            });
          }
          this.tableData=[];
          this.count=restaurants.TotalRecords;
          restaurants.ResultValue.forEach(item => {
            const tableData = {};
            tableData.name = item.MerchantName;
            tableData.address = item.ProvincevName+item.CityName;
            tableData.id = item.MerchantID;
            tableData.code= item.MerchantCode;
            //tableData.phone = item.phone;
            tableData.CreateTime = item.CreateTime;
            this.tableData.push(tableData);
          })
          this.loading=false;
        } else {
          this.$message({
            type: 'error',
            message: restaurants.ResultMessage
          });
        }
      },
      //获取商家单条信息（编辑操作用到）
      async MerchantGetApply(){
        let form = new FormData();
        console.log(this.shopID)
        form.append("MerchantID", this.shopID);
        const MerchantGetApplys = await MerchantGetApply(form);
        if(MerchantGetApplys.ResultCode=="000000"){
          this.categoryOptions=MerchantGetApplys.ResultValue;
          this.IdentityPicture=MerchantGetApplys.ResultValue.IdentityPicture.split(",");
        }else{
          this.$message({
            type: 'error',
            message: MerchantGetApplys.ResultMessage
          });
        }
      },
      //审核商家提交（编辑操作用到）
      async MerchantAudit(data){
        let form = new FormData();
        form.append("MerchantID", this.shopID);
        form.append("Audit", data);
        form.append("Reason", this.textareas);
        const MerchantAudits = await MerchantAudit(form);
        if(MerchantAudits.ResultCode=="000000"){
          this.$message({
            type: 'success',
            message: MerchantAudits.ResultMessage
          });
          this.dialogFormVisible=false;
          // 重置页面到第一页
          this.currentPage = 1;
          this.MerchantApplyPage();
        }else{
          this.$message({
            type: 'error',
            message: MerchantAudits.ResultMessage
          });
        }
      },
      changepiccontet (e) {
        this.piccontet = []
        let picEls = document.querySelectorAll(".pic-big-show")
        let curEl = e.target
        let index = 0
        picEls.forEach((cur, i) => {
          if (curEl == cur) {
            index = i
          }
          this.piccontet.push({pic: cur.src})
        })
        this.picBigShowIndex = index
        this.dialogpicVisible = true
      },
      handleEdit(index, row){
        this.textareas = '' // 打开弹窗清除 textarea
        this.shopID=row.id
        if(this.shopID!=''){
          this.MerchantGetApply();
          this.dialogFormVisible=true;
        }
      },
      handleSizeChange(val) {
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.MerchantApplyPage()
      },
    },
    filters: {
      formshoptype: function (value) {
        let valuestring='';
        if (value==1) {
          valuestring="工厂"
        } else if (value==2) {
          valuestring="物流公司"
        } else if (value==3) {
          valuestring="司机"
        }
        return valuestring
      },
    },
  }
</script>

<style scoped>
  .el-input.is-disabled .el-input__inner {
    color: #6c6c6c;
    background: #ebf2f8;
    cursor: default;
  }
  .specialrecord {
    width: 100%;
    display: inline-block;
    border: #d1dbe5 1px solid;
    border-radius: 4px;
    color: #6c6c6c;
    background: #ebf2f8;
  }
  .specialrecord span{ padding:0 10px; }
</style>
