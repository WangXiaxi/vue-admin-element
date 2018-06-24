<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-button type="primary" @click="adddialog=true">代理添加</el-button>
        <el-input v-model="companyname" placeholder="请输入公司关键词" min="100" style="margin:0 10px"></el-input>
        <el-select class="spec-100" v-model="Status" placeholder="请选择">
          <el-option label="已启用" :value="1"></el-option>
          <el-option label="已停用" :value="2"></el-option>
          <el-option label="全部" :value="99"></el-option>
        </el-select>
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
                <span>{{ props.row.Linkman }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ props.row.Phone }}</span>
              </el-form-item>
              <el-form-item label="公司名称">
                <span>{{ props.row.AgentName }}</span>
              </el-form-item>
              <el-form-item label="登录手机">
                <span>{{ props.row.Mobile}}</span>
              </el-form-item>
              <el-form-item label="创建者">
                <span>{{ props.row.CreatorName}}</span>
              </el-form-item>
              <el-form-item label="会员编号">
                <span>{{ props.row.AgentID}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="公司名称(全称)"
          prop="AgentName">
        </el-table-column>
        <el-table-column
          label="代理等级"
          prop="agentgrade">
        </el-table-column>
        <el-table-column
          label="代理地区"
          prop="registplace">
        </el-table-column>
        <el-table-column
          label="状态"
          prop="StatusName">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.StatusValue <= 0 ? 'primary' : 'success'"
              disable-transitions>{{scope.row.StatusName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="primary"
              @click="handlechage(scope.$index, scope.row)">改密码</el-button>
            <el-button
              size="small"
              type="danger"
              plain
              v-if="scope.row.StatusValue > 0"
              @click="handleDelete(scope.$index, scope.row)">停用</el-button>
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
      <el-dialog title="修改公司代理区域" :visible.sync="dialogFormVisible" class="specaildialog" width="500px">
        <el-form :model="categoryOptions" ref="categoryOptions">
          <el-form-item label="登录手机" label-width="100px"prop="Mobile" :rules="[
                        { required: true, message: '登录手机不能为空', trigger: 'blur' },
                      ]">
            <el-input v-model="categoryOptions.Mobile" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="公司名称" label-width="100px"prop="AgentName" :rules="[
                        { required: true, message: '公司全称不能为空', trigger: 'blur' },
                      ]">
            <el-input v-model="categoryOptions.AgentName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="公司简称" label-width="100px"prop="AgentBrief" :rules="[
                        { required: true, message: '公司简称不能为空', trigger: 'blur' },
                      ]">
            <el-input v-model="categoryOptions.AgentBrief" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" label-width="100px">
            <el-input v-model="categoryOptions.Phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人" label-width="100px">
            <el-input v-model="categoryOptions.Linkman" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" label-width="100px">
            <el-input v-model="categoryOptions.CreateTime	" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建者" label-width="100px">
            <el-input v-model="categoryOptions.CreatorName	" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="代理等级" label-width="100px">
            <el-select v-model="chageGrade" placeholder="请选择">
              <el-option
                v-for="item in Gradeoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="代理地区" label-width="100px" >
            <el-cascader
              class="normal"
              change-on-select
              :options="address"
              v-model="getCategory"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="AgentUpdate('categoryOptions')" >更 新</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增公司代理区域" :visible.sync="adddialog" class="specaildialog" width="500px">
        <el-form :model="addlist" ref="addlist">

          <el-form-item label="手机号码" label-width="100px" prop="Mobile" :rules="[
                        { required: true, message: '手机号码不能为空', trigger: 'blur' },
                      ]">
            <el-input placeholder="手机号码用于代理商登录" v-model="addlist.Mobile" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" label-width="100px" prop="Password" :rules="[
                        { required: true, message: '登录密码不能为空', trigger: 'blur' },
                      ]">
            <el-input v-model="addlist.Password " auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="公司全称" label-width="100px" prop="Name" :rules="[
                        { required: true, message: '公司全称不能为空', trigger: 'blur' },
                      ]">
            <el-input v-model="addlist.Name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="公司简称" label-width="100px" prop="Brief" :rules="[
                        { required: true, message: '公司简称不能为空', trigger: 'blur' },
                      ]">
            <el-input v-model="addlist.Brief" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人" label-width="100px">
            <el-input v-model="addlist.Linkman" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" label-width="100px">
            <el-input v-model="addlist.Phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="代理等级" label-width="100px" prop="Grade">
            <el-select v-model="addlist.Grade" placeholder="请选择">
              <el-option
                v-for="item in Gradeoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="代理地区" label-width="100px">
            <el-cascader
              class="normal"
              change-on-select
              :options="address"
              v-model="selectedCategory"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="adddialog = false">取 消</el-button>
          <el-button type="primary" @click="AgentCreate('addlist')" >提 交</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改登录密码" :visible.sync="changedialog" class="specaildialog" width="500px">
        <el-form :model="PWD" ref="PWD">
          <el-form-item label="新密码" label-width="100px" prop="Password" :rules="[
                        { required: true, message: '新密码不能为空', trigger: 'blur' },
                      ]">
            <el-input v-model="PWD.Password" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="changedialog = false">取 消</el-button>
          <el-button type="primary" @click="AgentModifyPWD('PWD')" >提 交</el-button>
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
    import {AgentGetPage, AgentGetinfo, AgentUpdate,AgentCreate,AgentModifyPWD,AgentDisable} from '@/api/getdatas'
    import {mapState} from 'vuex'
    export default {
      data(){
        return {
          baseUrl,
          loading:true,
          address:address.area,
          PageIndex: 1,
          PageSize: 20,
          Status: 1,
          count: 40,
          tableData: [],
          currentPage: 1,
          dialogFormVisible: false,
          adddialog: false,
          changedialog: false,
          PWD:{
            Password:''
          },
          categoryOptions: {},
          selectedCategory: [],
          companyname:'',
          getCategory:[],
          MerchantID:'',
          AgentID:'',
          chageGrade:'',
          Gradeoptions: [{
            value: 1,
            label: '省级代理'
          }, {
            value: 2,
            label: '市级代理'
          }, {
            value: 3,
            label: '区级代理'
          }],
          addlist:{
            Name:'',
            Brief:'',
            Linkman:'',
            Phone:'',
            Grade:'',
            ProvinceID:'',
            CityID:'',
            CountyID:'',
            Mobile:'',
            Password:'',
            selectedCategory:[],
          }
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
          this.loading=true;
          let form = new FormData();
          if(this.companyname){
            form.append("Name", this.companyname);
          };
          form.append("PageIndex", this.PageIndex);
          form.append("Status", this.Status);
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
              tableData.AgentName = item.AgentName;
              tableData.AgentBrief = item.AgentBrief;
              tableData.Phone = item.Phone;
              tableData.Grade = item.Grade;
              tableData.CreateTime = item.CreateTime;
              tableData.CreatorName = item.CreatorName;
              tableData.AgentID = item.AgentID;
              tableData.Linkman = item.Linkman;
              tableData.Mobile = item.Mobile;
              tableData.StatusName = item.StatusName;
              tableData.StatusValue = item.StatusValue;
              if(item.Grade==1){
                tableData.registplace = item.ProvincevName;
                tableData.agentgrade='省级代理'
              }else if(item.Grade==2){
                tableData.registplace = item.ProvincevName+'/'+item.CityName;
                tableData.agentgrade='市级代理'
              }else{
                tableData.registplace = item.ProvincevName+'/'+item.CityName+'/'+item.CountyName;
                tableData.agentgrade='区级代理'
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
            form.append("AgentID", this.AgentID);
            const AgentGetinfos = await AgentGetinfo(form);
            if(AgentGetinfos.ResultCode=="000000"){
              this.categoryOptions=AgentGetinfos.ResultValue;
              this.chageGrade=AgentGetinfos.ResultValue.Grade;
              if(AgentGetinfos.ResultValue.Grade==1){
                this.getCategory = [parseInt(AgentGetinfos.ResultValue.ProvinceID)];

              }else if(AgentGetinfos.ResultValue.Grade==2){
                this.getCategory = [parseInt(AgentGetinfos.ResultValue.ProvinceID),parseInt(AgentGetinfos.ResultValue.CityID)];
              }else{
                this.getCategory = [parseInt(AgentGetinfos.ResultValue.ProvinceID),parseInt(AgentGetinfos.ResultValue.CityID),parseInt(AgentGetinfos.ResultValue.CountyID)];
              }
              console.log(this.getCategory)
            }else{
              this.$message({
                type: 'error',
                message: StaffModels.ResultMessage
              });
            }
        },
        //修改管理员信息（编辑操作用到）
        AgentUpdate(formName){
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
              let form = new FormData();
              form.append("AgentID", this.AgentID);
              form.append("Name", this.categoryOptions.AgentName);
              form.append("Brief", this.categoryOptions.AgentBrief);
              form.append("Linkman", this.categoryOptions.Linkman);
              form.append("Phone", this.categoryOptions.Phone);
              form.append("Grade", this.chageGrade);
              console.log(this.getCategory,this.getCategory.length,this.chageGrade)
              if(!this.getCategory||this.getCategory.length!=(this.chageGrade)||!this.chageGrade){
                this.$message({
                  type: 'error',
                  message: '请先选择正确等级的代理区域'
                });
                return false;
              }
              form.append("ProvinceID", this.getCategory[0]);
              form.append("CityID", this.getCategory[1]);
              form.append("CountyID", this.getCategory[2]);
              form.append("Mobile", this.categoryOptions.Mobile);
              form.append("LoginID", this.adminInfo);
              const AgentUpdates = await AgentUpdate(form);
              if (AgentUpdates.ResultCode == "000000") {
                this.$message({
                  type: 'success',
                  message: AgentUpdates.ResultMessage
                });
                this.dialogFormVisible = false;
                this.AgentGetPage()
              } else {
                this.$message({
                  type: 'error',
                  message: AgentUpdates.ResultMessage
                });
              }
            }
          })
        },
        //新增管理员角色（编辑操作用到）
        AgentCreate(formName) {
          console.log(this.selectedCategory)
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
              let form = new FormData();
              form.append("Name", this.addlist.Name);
              form.append("Brief", this.addlist.Brief);
              form.append("Linkman", this.addlist.Linkman);
              form.append("Phone", this.addlist.Phone);
              form.append("Grade", this.addlist.Grade);
              if(!this.selectedCategory||this.selectedCategory.length!=(this.addlist.Grade)||!this.addlist.Grade){
                this.$message({
                  type: 'error',
                  message: '请先选择正确等级的代理区域'
                });
                return false;
              }
              form.append("ProvinceID", this.selectedCategory[0]);
              form.append("CityID", this.selectedCategory[1]);
              form.append("CountyID", this.selectedCategory[2]);
              // form.append("ProvinceID", this.addlist.ProvinceID);
              // form.append("CityID", this.addlist.CityID);
              // form.append("CountyID", this.addlist.CountyID);
              form.append("Mobile", this.addlist.Mobile);
              form.append("Password", this.addlist.Password);
              form.append("LoginID", this.adminInfo);
              const AgentCreates = await AgentCreate(form);
              if (AgentCreates.ResultCode == "000000") {
                this.$message({
                  type: 'success',
                  message: AgentCreates.ResultMessage
                });
                this.adddialog = false;
                this.AgentGetPage()
              } else {
                this.$message({
                  type: 'error',
                  message: AgentCreates.ResultMessage
                });
              }
            }
          })
        },
        //代理停用
        async AgentDisable(){

          let form = new FormData();
          form.append("AgentID", this.AgentID);
          form.append("LoginID", this.adminInfo);
          const Disables = await AgentDisable(form);
          if(Disables.ResultCode=="000000"){
            this.$message({
              type: 'success',
              message: Disables.ResultMessage
            });
            this.dialognewform=false;
            this.currentPage = 1;
            this.PageIndex = 1;
            this.AgentGetPage()
          }else{
            this.$message({
              type: 'error',
              message: Disables.ResultMessage
            });
          }
        },
        //修改密码
        AgentModifyPWD(formName) {
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
              let form = new FormData();
              form.append("AgentID", this.AgentID);
              form.append("Password", this.PWD.Password);
              form.append("LoginID", this.adminInfo);
              const ModifyPWD = await AgentModifyPWD(form);
              if (ModifyPWD.ResultCode == "000000") {
                this.$message({
                  type: 'success',
                  message: ModifyPWD.ResultMessage
                });
                this.changedialog = false;
                this.AgentGetPage()
              } else {
                this.$message({
                  type: 'error',
                  message: ModifyPWD.ResultMessage
                });
              }
            }
          })
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
        handleEdit(index, row) {
          this.AgentID=row.AgentID;
          if(this.AgentID!=''){
            this.AgentGetinfo();
            this.dialogFormVisible=true;
          }
        },
        handleDelete(index, row) {
          this.$confirm('确认停用该代理商吗？')
            .then(_ => {
              this.AgentID=row.AgentID;
              if(this.AgentID!=''){
                this.AgentDisable();
              }
            })
            .catch(_ => {});
        },
        handlechage(index, row) {
          this.AgentID=row.AgentID;
          if(this.AgentID!=''){
            //this.AgentModifyPWD();
            this.changedialog=true;
          }
        },
      }
    }
</script>

<style lang="less">
.fillcontain {
  .spec-100 {
    .el-input {
      width: 100px;
    }
  }
}
</style>
