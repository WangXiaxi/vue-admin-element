<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-button type="primary" @click="dialognewform = true">待开发查询</el-button>
        <el-button type="primary" @click="rechargeAction">充值</el-button>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        @selection-change="handleCurrentChangeRow"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="会员名称"
          prop="MerchantName">
        </el-table-column>
        <el-table-column
          label="会员ID"
          prop="MerchantCode"
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
          layout=" prev, pager, next"
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
              <img :src="baseImgPath+categoryOptions.LicensePicture" alt="" @click="changepiccontet" class="pic-big-show">
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
              <img :src="baseImgPath+item" alt="" @click="changepiccontet" class="pic-big-show">
            </div>
          </el-form-item>
          <el-form-item label="省市区" label-width="100px" v-if="categoryOptions.CrowdType!=3">
            <div class="specialrecord"><span>{{categoryOptions.ProvincevName}}/{{categoryOptions.CityName}}/{{categoryOptions.CountyName}}</span></div>
          </el-form-item>
          <el-form-item label="详细地址" label-width="100px" v-if="categoryOptions.CrowdType!=3">
            <el-input v-model="categoryOptions.Address" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="车牌号码" label-width="100px" v-if="categoryOptions.CrowdType!=1">
            <el-input v-model="categoryOptions.TruckCode" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="车头图片" label-width="100px"  v-if="categoryOptions.CrowdType!=1">
            <div class="yu-photobox">
              <img :src="baseImgPath+categoryOptions.TruckPicture" alt="" @click="changepiccontet" class="pic-big-show">
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
              <img :src="baseImgPath+categoryOptions.RunPicture" alt="" @click="changepiccontet" class="pic-big-show">
            </div>
          </el-form-item>
          <el-form-item label="驾驶证照片" label-width="100px" v-if="categoryOptions.CrowdType!=1">
            <div class="yu-photobox">
              <img :src="baseImgPath+categoryOptions.DrivePicture" alt="" @click="changepiccontet" class="pic-big-show">
            </div>
          </el-form-item>
          <!--<el-form-item label="拒绝理由" label-width="100px">-->
            <!--<el-input type="textarea" v-model="textareas"></el-input>-->
          <!--</el-form-item>-->
        </el-form>
        <!--<div slot="footer" class="dialog-footer">-->

          <!--&lt;!&ndash;<el-button @click="dialogFormVisible=false">关闭</el-button>&ndash;&gt;-->
          <!--<el-button @click="MerchantAudit(false)">拒 绝</el-button>-->
          <!--<el-button type="primary" @click="MerchantAudit(true)">通 过</el-button>-->
        <!--</div>-->
      </el-dialog>
      <el-dialog title="图片查看" :visible.sync="dialogpicVisible" center width="700px">
        <el-carousel trigger="click" height="500px" v-if="dialogpicVisible" :initial-index="picBigShowIndex">
          <el-carousel-item v-for="(item, key, index) in piccontet" :key="key">
            <a :href="item.pic" target="_blank" class="piccontet">
              <img :src="item.pic" :title="item.title">
              <!--<span>{{item.title}}</span>-->
            </a>
          </el-carousel-item>
        </el-carousel>
      </el-dialog>

      <!-- 新增 充值 -->
      <el-dialog title="充值" :visible.sync="dialogRechargeVisible" center width="500px">
        <el-form :model="rechargeOptions"  :rules="rules"  ref="updataForm">
          <el-form-item label="已选中会员" label-width="100px">
            <el-input v-model="rechargeOptions.MerchantName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="已选中会员ID" label-width="100px">
            <el-input v-model="rechargeOptions.MerchantCode" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="充值金额" label-width="100px" prop="Amount">
            <el-input v-model="rechargeOptions.Amount" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="操作人" label-width="100px">
            <el-input v-model="rechargeOptions.actUserName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="rechargeActionCancel">取消</el-button>
          <el-button type="primary" @click="rechargeActionSubmit('updataForm')">确认充值</el-button>
        </div>
      </el-dialog>
      <!-- 新增 -->

    </div>
  </div>
</template>

<script>
  import headTop from '@/components/headTop'
  import { baseUrl, baseImgPath } from '@/config/env'
  import { MerchantPage, MerchantGetApply, CashTopUp } from '@/api/getdatas'
  import {mapState, mapActions} from 'vuex'
  import regExp from '@/config/regExp'
  export default {
    data () {
      return {
        baseUrl,
        loading:true,
        baseImgPath,
        PageIndex: 0,
        PageSize: 20,
        count: 0,
        tableData: [],
        shopID:'',
        MercStatus: 2,
        currentPage: 1,
        dialogFormVisible: false,
        dialogpicVisible:false,
        categoryOptions: {},
        IdentityPicture:[],
        textareas:'',
        piccontet:[],
        picBigShowIndex: 0,
        // 新增
        multipleSelection: [], // 选中会员列表
        dialogRechargeVisible: false,
        rechargeOptions: {
          MerchantName: '',
          Amount: 0,
          MerchantID: '',
          MemberID: '',
          actUserName: '',
          MerchantCode: ''
        },
        rules: {
          Amount: [
            { required: true, message: '请输入大于0的整数', trigger: 'blur' },
            { pattern: regExp.Number1, message: "请输入大于0的整数", trigger: "blur" }
          ]
        }
      }
    },
    components: {
      headTop,
    },
    computed: {
      ...mapState(['adminInfo', 'adminName'])
    },
    created () {
      this.restaurant_id = this.$route.query.restaurant_id;
      this.MerchantPage();
    },
    methods: {
      rechargeActionCancel () {
        this.dialogRechargeVisible = false;
      },
      rechargeActionSubmit (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let form = new FormData();
            form.append("Amount", this.rechargeOptions.Amount);
            form.append("MerchantID", this.rechargeOptions.MerchantID);
            form.append("MemberID", this.rechargeOptions.MemberID);
            const rechargeRes = await CashTopUp(form);
            this.dialogRechargeVisible = false;
            if (rechargeRes.ResultCode == "000000") {
              this.$message({
                type: 'success',
                message: rechargeRes.ResultMessage
              });
            } else {
              this.$message({
                type: 'error',
                message: rechargeRes.ResultMessage
              });
            }
          }
        })
      },
      // 新增 充值操作
      rechargeAction () {
        let len = this.multipleSelection.length
        if (len > 1) {
          this.$message.info({message: '请选中单个会员进行充值！'})
          return
        } else if (len <= 0) {
          this.$message.info({message: '请勾选会员进行充值！'})
          return
        } else if (len == 1) {
          this.rechargeOptions.actUserName = this.adminName // 赋值操作
          this.rechargeOptions.MerchantName = this.multipleSelection[0].MerchantName
          this.rechargeOptions.MerchantCode = this.multipleSelection[0].MerchantCode
          this.rechargeOptions.MerchantID = this.multipleSelection[0].MerchantID 
          this.rechargeOptions.MemberID = this.adminInfo
          this.rechargeOptions.Amount = 0
          this.dialogRechargeVisible = true
        }
      },
      handleCurrentChangeRow (e) { // 选取后执行
        this.multipleSelection = JSON.parse(JSON.stringify(e))
        console.log(this.multipleSelection)
      },
      // 新增 充值操作 结束
      //获取角色列表
      async MerchantPage() {
        this.loading=true;
        let form = new FormData();
        form.append("PageIndex", this.PageIndex);
        form.append("PageSize", this.PageSize);
        form.append("TotalRecords", "0");
        const restaurants = await MerchantPage(form);
        if (restaurants.ResultCode == "000000") {
          if(this.tableData == ''){
            this.$message({
              type: 'success',
              message: restaurants.ResultMessage
            });
          }
          this.count=restaurants.TotalRecords;
          this.tableData=[];
          restaurants.ResultValue.forEach(item => {
            const tableData = {};
            tableData.MerchantName = item.MerchantName;
            tableData.address = item.ProvincevName+item.CityName;
            tableData.MerchantCode = item.MerchantCode;
            //tableData.phone = item.phone;
            tableData.CreateTime = item.CreateTime;
            tableData.MerchantID = item.MerchantID;
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
        form.append("MerchantID", this.shopID);
        form.append("MercStatus", this.MercStatus);
        const MerchantGetApplys = await MerchantGetApply(form);
        if(MerchantGetApplys.ResultCode=="000000"){
          this.categoryOptions=MerchantGetApplys.ResultValue;
          // if(MerchantGetApplys.ResultValue.CrowdType==1){
            this.IdentityPicture=MerchantGetApplys.ResultValue.IdentityPicture.split(",");
          // }

        }else{
          this.$message({
            type: 'error',
            message: MerchantGetApplys.ResultMessage
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
        this.shopID=row.MerchantID;
        if(this.shopID!=''){
          this.MerchantGetApply();
          this.dialogFormVisible=true;
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.PageIndex = val;
        this.MerchantPage()
      },
    },
    filters: {
      formshoptype: function (value) {
        let valuestring='';
        if (value==1) {
          valuestring="工厂"
        }else if(value==2){
          valuestring="物流公司"
        }else if(value==3){
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
