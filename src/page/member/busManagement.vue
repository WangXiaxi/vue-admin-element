<template>
  <div class="fillcontain busManagement">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-input v-model="listInfo.Name" placeholder="请输入商户名称关键词" min="100"></el-input>
        <el-select v-model="listInfo.Crowd" placeholder="请选择商户身份" :clearable="true">
          <el-option v-for="(item, index) in optionsSelectIden" :label="item.label" :value="item.value" :key="index"></el-option>
        </el-select>
        <el-select v-model="listInfo.Status" placeholder="请选择会员类型" :clearable="true">
          <el-option v-for="(item, index) in optionsSelectStatus" :label="item.label" :value="item.value" :key="index"></el-option>
        </el-select>
        <el-button type="primary" @click="MerchantGetPageHua">搜 索</el-button>
      </el-row>

      <div class="table_container">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            label="会员号"
            width="150px"
            prop="MerchantCode">
          </el-table-column>
          <el-table-column
            label="商户名称"
            prop="MerchantName">
          </el-table-column>
          <el-table-column
            label="身份"
            prop="CrowdName">
          </el-table-column>
          <el-table-column
            label="状态"
            prop="StatusName">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.StatusValue == 1 ? 'primary' : 'success'"
                disable-transitions>{{scope.row.StatusName}}</el-tag>
            </template>
          </el-table-column>
          
          <el-table-column
            label="申请时间"
            prop="SubmitTime">
          </el-table-column>
          <el-table-column
            width="200px"
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="handleLook(scope.$index, scope.row)">查看</el-button>
              <el-button
                v-if="scope.row.StatusValue == 1"
                size="small"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">审核</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 选择页码 -->
        <div class="Pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listInfo.PageIndex"
            :page-size="listInfo.PageSize"
            layout="total, prev, pager, next"
            :total="listInfo.TotalRecords">
          </el-pagination>
        </div>
        <!-- 选择页码 end -->
      </div>

      <!-- 查看操作 -->
      <el-dialog title="查看商户信息" :visible.sync="dialogLookVisible" v-if="dialogLookVisible" center width="500px">
        <el-form :model="lookOptions">
          <el-form-item label="商家名称" label-width="100px">
            <el-input v-model="lookOptions.MerchantName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="商家类别" label-width="100px">
            <div class="specialrecord"><span>{{lookOptions.CrowdType | formshoptype(lookOptions.CrowdType) }}</span></div>
          </el-form-item>
          <el-form-item label="联系电话" label-width="100px">
            <el-input v-model="lookOptions.MerchantPhone" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="营业执照号" label-width="100px" v-if="lookOptions.CrowdType!=3">
            <el-input v-model="lookOptions.LicenseCode" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="营业执照图片" label-width="100px" v-if="lookOptions.CrowdType!=3">
            <div class="yu-photobox">
              <img v-if="lookOptions.LicensePicture" :src="baseImgPath+lookOptions.LicensePicture" alt="" @click="changepiccontet" class="pic-big-show">
            </div>
          </el-form-item>
          <el-form-item label="负责人姓名" label-width="100px" v-if="lookOptions.CrowdType!=3">
            <el-input v-model="lookOptions.Director" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" label-width="100px" v-if="lookOptions.CrowdType==3">
            <el-input v-model="lookOptions.IdentityCode" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="身份证图片" label-width="100px" v-if="lookOptions.CrowdType==3">
            <div class="yu-photobox" v-for="item in IdentityPictureLook">
              <img v-if="item" :src="baseImgPath+item" alt="" @click="changepiccontet" class="pic-big-show">
            </div>
          </el-form-item>
          <el-form-item label="省市区" label-width="100px" v-if="lookOptions.CrowdType!=3">
            <div class="specialrecord"><span>{{lookOptions.ProvincevName}}/{{lookOptions.CityName}}/{{lookOptions.CountyName}}</span></div>
          </el-form-item>
          <el-form-item label="详细地址" label-width="100px" v-if="lookOptions.CrowdType!=3">
            <el-input v-model="lookOptions.Address" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="车牌号码" label-width="100px" v-if="lookOptions.CrowdType!=1">
            <el-input v-model="lookOptions.TruckCode" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="车头图片" label-width="100px"  v-if="lookOptions.CrowdType!=1">
            <div class="yu-photobox">
              <img v-if="lookOptions.TruckPicture" :src="baseImgPath+lookOptions.TruckPicture" alt="" @click="changepiccontet" class="pic-big-show">
            </div>
          </el-form-item>
          
          <!-- 车辆承运险 -->
          <el-form-item label="车辆承运险" label-width="100px"  v-if="lookOptions.CrowdType!=1">
            <div class="yu-photobox">
              <img v-if="lookOptions.InsurancePicture" :src="baseImgPath+lookOptions.InsurancePicture" alt="" @click="changepiccontet" class="pic-big-show">
            </div>
          </el-form-item>
          <!-- 车辆承运险 -->

          <el-form-item label="车辆信息" label-width="100px" v-if="lookOptions.CrowdType!=1">
            <div class="specialrecord"><span>{{lookOptions.TruckModel}}/{{lookOptions.TruckLong}}/{{lookOptions.TruckLoad}}（车型/车长.米/载重.吨）</span></div>
          </el-form-item>
          <el-form-item label="行驶证照片" label-width="100px" v-if="lookOptions.CrowdType!=1">
            <div class="yu-photobox">
              <img v-if="lookOptions.RunPicture" :src="baseImgPath+lookOptions.RunPicture" alt="" @click="changepiccontet" class="pic-big-show">
            </div>
          </el-form-item>
          <el-form-item label="驾驶证照片" label-width="100px" v-if="lookOptions.CrowdType!=1">
            <div class="yu-photobox">
              <img v-if="lookOptions.DrivePicture" :src="baseImgPath+lookOptions.DrivePicture" alt="" @click="changepiccontet" class="pic-big-show">
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 查看操作 end -->

      <!-- 审核操作 -->
      
      <el-dialog title="审核商户信息" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" center width="500px">
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
              <img v-if="categoryOptions.InsurancePicture" :src="baseImgPath+categoryOptions.InsurancePicture" alt="" @click="changepiccontet" class="pic-big-show">
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

      <!-- 审核操作 end -->
      <!-- 查看图片操作 -->
      <el-dialog title="图片查看" :visible.sync="dialogpicVisible" center width="700px">
        <el-carousel trigger="click" height="600px" v-if="dialogpicVisible" :initial-index="picBigShowIndex">
          <el-carousel-item v-for="(item, index) in piccontet" :key="index">
            <a :href="item.pic" target="_blank" class="piccontet">
              <img v-if="item.pic" :src="item.pic">
            </a>
          </el-carousel-item>
        </el-carousel>
      </el-dialog>
      <!-- 查看图片操作 end -->
    </div>
  </div>
</template>

<script>
  import headTop from '@/components/headTop'
  import {baseUrl,baseImgPath} from '@/config/env'
  import {MerchantGetPageHua, MerchantAudit, MerchantGetApply} from '@/api/getdatas'
  import qs from 'qs'
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        baseUrl,
        baseImgPath,
        loading: true,
        optionsSelectIden: [{label: '全部', value: 99}, {label: '工厂企业', value: 1}, {label: '物流公司', value: 2}, {label: '个体司机', value: 3}],
        optionsSelectStatus: [{label: '全部', value: 99}, {label: '待审核', value: 1}, {label: '已审核', value: 2}],
        listInfo: {
          LoginID: '',
          Name: '',
          Crowd: 99,
          Status: 1, // 默认1待审核
          PageIndex: 1,
          PageSize: 20,
          TotalRecords: 0
        },
        tableData: [],
        dialogLookVisible: false, // 查看显示
        lookOptions: {}, // 查看信息
        IdentityPictureLook: [],
        categoryOptions: {}, // 审核信息
        IdentityPicture: [], // 身份照分割
        dialogFormVisible: false,
        ShopID: '',
        textareas: '',
        dialogpicVisible: false
      }
    },
    components: {
      headTop,
    },
    computed: {
      ...mapState(['adminInfo'])
    },
    created() {
      this.listInfo.LoginID = this.adminInfo // 赋值1个值
      this.MerchantGetPageHua()
    },
    methods: {
      // 查看获取一页
      handleLook (index, row) {
        this.ShopID = row.MerchantID
        this.MerchantGetApply()
        this.dialogLookVisible = true
      },
      // 审核获取一页
      handleEdit (index, row) {
        this.textareas = '' // 打开弹窗清除 textarea
        this.ShopID = row.MerchantID
        this.MerchantGetApplyEdit()
        this.dialogFormVisible = true
      },
       // 查看商家信息
      async MerchantGetApply () {
        let form = qs.stringify({MerchantID: this.ShopID}, {arrayFormat: 'indices'})
        const MerchantGetApplys = await MerchantGetApply(form)
        if (MerchantGetApplys.ResultCode == "000000") {
          this.lookOptions = MerchantGetApplys.ResultValue
          this.IdentityPictureLook = MerchantGetApplys.ResultValue.IdentityPicture.split(",")
        } else {
          this.$message({
            type: 'error',
            message: MerchantGetApplys.ResultMessage
          })
        }
      },
      // 编辑商家获取信息
      async MerchantGetApplyEdit () {
        let form = qs.stringify({MerchantID: this.ShopID}, {arrayFormat: 'indices'})
        const MerchantGetApplys = await MerchantGetApply(form)
        if (MerchantGetApplys.ResultCode == "000000") {
          this.categoryOptions = MerchantGetApplys.ResultValue
          this.IdentityPicture = MerchantGetApplys.ResultValue.IdentityPicture.split(",")
        } else {
          this.$message({
            type: 'error',
            message: MerchantGetApplys.ResultMessage
          })
        }
      },
      // 获取table列表
      async MerchantGetPageHua () {
        this.loading = true
        let form = qs.stringify(this.listInfo, {arrayFormat: 'indices'})
        const restaurants = await MerchantGetPageHua(form)
        if (restaurants.ResultCode == "000000") {
          if (this.tableData == '') {
            this.$message({
              type: 'success',
              message: restaurants.ResultMessage
            })
          }
          this.tableData = restaurants.ResultValue
          this.listInfo.TotalRecords = restaurants.TotalRecords
          this.loading = false
        } else {
          this.$message({
            type: 'error',
            message: restaurants.ResultMessage
          });
        }
      },
      //审核商家提交（编辑操作用到）
      async MerchantAudit (data) {
        let form = new FormData()
        form.append("MerchantID", this.ShopID)
        form.append("Audit", data)
        form.append("Reason", this.textareas)
        const MerchantAudits = await MerchantAudit(form)
        if(MerchantAudits.ResultCode == "000000") {
          this.$message({
            type: 'success',
            message: MerchantAudits.ResultMessage
          });
          this.dialogFormVisible = false
          // 重置页面到第一页
          this.currentPage = 1
          this.MerchantGetPageHua()
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
      handleSizeChange (val) {
      },
      handleCurrentChange (val) {
        this.listInfo.PageIndex = val
        this.MerchantGetPageHua()
      },
    },
    filters: {
      formshoptype: function (value) {
        let valuestring = ''
        if ( value == 1 ) {
          valuestring = "工厂"
        }else if (value == 2 ) {
          valuestring = "物流公司"
        }else if ( value== 3 ) {
          valuestring="司机"
        }
        return valuestring
      },
    }
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
