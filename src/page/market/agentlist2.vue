<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-cascader
          class="normal"
          :show-all-levels="true"
          :options="address"
          v-model="selectedCategory"
          change-on-select
          clearable
        ></el-cascader>
        <el-input v-model="companyname" placeholder="请输入物流公司关键词" min="100"></el-input>
        <el-button type="primary" @click="AgentGetPage">搜 索</el-button>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props" >
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="联系人">
                <span>{{ props.row.Director }}</span>
              </el-form-item>
              <el-form-item label="公司名称">
                <span>{{ props.row.MerchantName }}</span>
              </el-form-item>
              <el-form-item label="注册地">
                <span>{{ props.row.registplace}}</span>
              </el-form-item>
              <el-form-item label="会员编号">
                <span>{{ props.row.MerchantID}}</span>
              </el-form-item>
              <el-form-item label="申请时间">
                <span>{{ props.row.CreateTime}}</span>
              </el-form-item>
              <el-form-item label="审核时间">
                <span>{{ props.row.AuditTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="公司名称"
          prop="MerchantName">
        </el-table-column>
        <el-table-column
          label="代理地区"
          prop="agentiaddress">
        </el-table-column>
        <el-table-column
          label="联系电话"
          prop="MerchantPhone"
          width="200">
        </el-table-column>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              plain
              @click="handleDelete(scope.$index, scope.row)">注销</el-button>
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
      <el-dialog title="修改物流公司代理区域" :visible.sync="dialogFormVisible" class="specaildialog" width="500px">
        <el-form :model="categoryOptions">
          <el-form-item label="物流公司名称" label-width="100px">
            <el-input v-model="categoryOptions.MerchantName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="物流公司简称" label-width="100px">
            <el-input v-model="categoryOptions.MerchantBrief" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" label-width="100px">
            <el-input v-model="categoryOptions.MerchantPhone" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="联系人" label-width="100px">
            <el-input v-model="categoryOptions.Director" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="注册地" label-width="100px">
            <el-input v-model="categoryOptions.ProvincevName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="申请时间" label-width="100px">
            <el-input v-model="categoryOptions.CreateTime	" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="审核时间" label-width="100px">
            <el-input v-model="categoryOptions.AuditTime" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="代理地区" label-width="100px">
            <el-cascader
              class="normal"
              :show-all-levels="true"
              :options="address"
              v-model="selectedCategory"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="AgentUpdate" >提 交</el-button>
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
  import {AgentGetPage, AgentGetinfo, AgentUpdate} from '@/api/getdatas'
  import {mapState} from 'vuex'
  export default {
    data(){
      return {
        baseUrl,
        loading:true,
        address:address.area,
        PageIndex: 0,
        PageSize: 20,
        count: 40,
        tableData: [],
        currentPage: 1,
        dialogFormVisible: false,
        categoryOptions: {},
        selectedCategory: [],
        companyname:'',
        ProvinceID:'',
        CityID:'',
        CountyID:'',
        MerchantID:'',
        LoginID:'',
      }
    },
    components: {
      headTop,
    },
    created(){
      this.restaurant_id = this.$route.query.restaurant_id;
      this.AgentGetPage();
    },
    computed: {
      ...mapState(['adminInfo']),
    },
    methods:{
      //获取管理员列表
      async AgentGetPage(){
        let form = new FormData();
        if(this.companyname){
          form.append("Name", this.companyname);
        };
        if(this.selectedCategory.length>0){
          form.append("ProvinceID", this.selectedCategory[0]);
          form.append("CityID", this.selectedCategory[1]);
          form.append("CountyID", this.selectedCategory[2]);
        };
        form.append("PageIndex", this.PageIndex);
        form.append("PageSize", this.PageSize);
        form.append("TotalRecords", "0");
        const restaurants = await AgentGetPage(form);
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
            tableData.MerchantName = item.MerchantName;
            tableData.MerchantBrief = item.MerchantBrief;
            tableData.MerchantPhone = item.MerchantPhone;
            if(item.ProvincevName!=''){
              tableData.registplace = item.ProvincevName+'/'+item.CityName+'/'+item.CountyName;
            }else{
              tableData.registplace="暂无注册地区"
            }
            tableData.CreateTime = item.CreateTime;
            tableData.AuditTime = item.AuditTime;
            tableData.MerchantID = item.MerchantID;
            if(item.AgentProvince!=''){
              tableData.agentiaddress = item.AgentProvince+'/'+item.AgentCity+'/'+item.AgentCounty;
            }else{
              tableData.agentiaddress="暂无代理地区"
            }
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
      //获取管理员单条信息（编辑操作用到）
      async AgentGetinfo(){
        let form = new FormData();
        form.append("MerchantID", this.MerchantID);
        const AgentGetinfos = await AgentGetinfo(form);
        if(AgentGetinfos.ResultCode=="000000"){
          this.categoryOptions=AgentGetinfos.ResultValue;
          this.selectedCategory=[AgentGetinfos.ResultValue.AgentProvince,AgentGetinfos.ResultValue.AgentCity,AgentGetinfos.ResultValue.AgentCounty]
        }else{
          this.$message({
            type: 'error',
            message: StaffModels.ResultMessage
          });
        }
      },
      //修改管理员信息（编辑操作用到）
      async AgentUpdate(){
        let form = new FormData();
        //this.LoginID=getStore('UseId');
        form.append("MerchantID", this.MerchantID);
        form.append("LoginID", this.adminInfo);
        console.log(this.adminInfo);
        if(this.selectedCategory.length>1){
          form.append("ProvinceID", this.selectedCategory[0]);
          form.append("CityID", this.selectedCategory[1]);
          form.append("CountyID", this.selectedCategory[2]);
        }else{
          this.$message({
            type: 'error',
            message: '操作提交前请先选择代理地区'
          });
          return false;
        }
        const AgentUpdates = await AgentUpdate(form);
        if(AgentUpdates.ResultCode=="000000"){
          this.$message({
            type: 'success',
            message: AgentUpdates.ResultMessage
          });
          this.dialogFormVisible=false;
          this.AgentGetPage()
        }else{
          this.$message({
            type: 'error',
            message: AgentUpdates.ResultMessage
          });
        }
      },
      //新增管理员角色（编辑操作用到）
      async StaffNew(){
        let form = new FormData();
        form.append("RoleID", this.loginForm.RoleID);
        form.append("Name", this.loginForm.Name);
        form.append("Sex", 0);
        form.append("Mobile", this.loginForm.Mobile);
        form.append("Email", "");
        const StaffsNews = await StaffNew(form);
        if(StaffsNews.ResultCode=="000000"){
          this.$message({
            type: 'success',
            message: StaffsNews.ResultMessage
          });
          this.dialognewform=false;
          this.AgentGetPage()
        }else{
          this.$message({
            type: 'error',
            message: StaffsNews.ResultMessage
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
        this.AgentGetPage()
      },
      handleSelect(index){
        this.loginForm.RoleName = index;
        this.loginForm.RoleID = this.selectedCategory[index].value;
      },
      handleEdit(index, row) {
        this.MerchantID=row.MerchantID;
        if(this.MerchantID!=''){
          this.AgentGetinfo();
          this.dialogFormVisible=true;
        }
      },

    }
  }
</script>

<style lang="less">

</style>
