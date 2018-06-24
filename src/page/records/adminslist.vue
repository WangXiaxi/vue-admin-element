<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-button type="primary" @click="dialognewform = true">添加新管理员</el-button>
        <el-button type="success" plain @click="changeList(1)" v-show="stauts!=1">查看有效的管理员</el-button>
        <el-button type="success" plain @click="changeList(2)" v-show="stauts!=2">查看所有的管理员</el-button>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          :label="admintitlelist[stauts].admintitle"
          prop="StaffName">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="ModifyTime"
          width="200">
        </el-table-column>
        <el-table-column
          label="角色名称"
          prop="RoleName">
        </el-table-column>
        <el-table-column
          label="状态"
          prop="StatusName">
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
          :page-size="20"
          layout="total, prev, pager, next"
          :total="count">
        </el-pagination>
      </div>
      <el-dialog title="修改管理员信息" :visible.sync="dialogFormVisible" class="specaildialog" width="500px">
        <el-form :model="categoryOptions">
          <el-form-item label="管理员名称" label-width="100px">
            <el-input v-model="categoryOptions.StaffName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" label-width="100px">
            <el-input v-model="categoryOptions.Mobile" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建人" label-width="100px">
            <el-input v-model="categoryOptions.Creator" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" label-width="100px">
            <el-input v-model="categoryOptions.ModifyTime" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" label-width="100px">
            <el-select v-model="categoryOptions.RoleName" :placeholder="categoryOptions.RoleID">
              <el-option
                v-for="item in selectedCategory"
                :key="item.value"
                :label="item.label"
                :value="item.index" disabled>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="StaffUpdate" >确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新加管理员信息" :visible.sync="dialognewform" class="specaildialog" width="500px">
        <el-form :model="categoryOptions">
          <el-form-item label="管理员姓名" label-width="100px">
            <el-input v-model="loginForm.Name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" label-width="100px">
            <el-input v-model="loginForm.Mobile" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色身份" label-width="100px">
            <el-select v-model="loginForm.RoleName" :placeholder="loginForm.RoleID" @change="handleSelect">
              <el-option
                v-for="item in selectedCategory"
                :key="item.value"
                :label="item.label"
                :value="item.index">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialognewform = false">取 消</el-button>
          <el-button type="primary" @click="StaffNew()">确 定</el-button>
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
    import {StaffPage, StaffNew, StaffModel, StaffUpdate,DropdownRole} from '@/api/getdatas'
    export default {
      data(){
        return {
          baseUrl,
          loading:true,
          stauts:2,
          PageIndex:1,
          PageSize: 20,
          count: 40,
          tableData: [],
          StaffID:'',
          admintitlelist:[
            {admintitle:""},
            {admintitle:"有效的管理员"},
            {admintitle:"管理员名称"},
          ],
          currentPage: 10,
          dialogFormVisible: false,
          dialognewform:false,
          categoryOptions: {},
          selectedCategory: [],
          loginForm: {
            Name: '',
            Mobile: '',
            Email: '',
            RoleID: '',
            RoleName:'',
          },
          rules: {
            Name: [
              { required: true, message: '请输入用户名', trigger: 'blur' },
            ],
            Mobile: [
              { required: true, message: '请输入密码', trigger: 'blur' }
            ],
          },
        }
      },
      components: {
          headTop,
      },
      created(){
        this.restaurant_id = this.$route.query.restaurant_id;
        this.StaffPage();
        this.RoleList();
      },
      methods:{
        //获取管理员列表
        async StaffPage(){
          this.loading=true;
          let form = new FormData();
          form.append("Status", this.stauts);
          form.append("PageIndex", this.PageIndex);
          form.append("PageSize", this.PageSize);
          form.append("TotalRecords", "0");
          const restaurants = await StaffPage(form);
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
        //获取管理员单条信息（编辑操作用到）
        async StaffModel(){
            let form = new FormData();
            form.append("StaffID", this.StaffID);
            const StaffModels = await StaffModel(form);
            if(StaffModels.ResultCode=="000000"){
              this.categoryOptions=StaffModels.ResultValue;
              console.log(this.categoryOptions)
            }else{
              this.$message({
                type: 'error',
                message: StaffModels.ResultMessage
              });
            }
        },
        //修改管理员信息（编辑操作用到）
        async StaffUpdate(){
          let form = new FormData();
          form.append("StaffID", this.categoryOptions.StaffID);
          form.append("Name", this.categoryOptions.StaffName);
          form.append("Sex", 0);
          const StaffUpdates = await StaffUpdate(form);
          if(StaffUpdates.ResultCode=="000000"){
            this.$message({
              type: 'success',
              message: StaffUpdates.ResultMessage
            });
            this.dialogFormVisible=false;
            this.StaffPage()
          }else{
            this.$message({
              type: 'error',
              message: StaffUpdates.ResultMessage
            });
          }
        },
        //获取管理员角色（编辑操作用到）
        async RoleList(){
          const RoleLists = await DropdownRole();
          RoleLists.ResultValue.forEach((item, index) => {
            this.selectedCategory.push({
              label: item.RoleName,
              value: item.RoleID,
              index,
            })
          })
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
            this.StaffPage()
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
          this.StaffPage()
        },
        handleSelect(index){
          this.loginForm.RoleName = index;
          this.loginForm.RoleID = this.selectedCategory[index].value;
        },
        handleEdit(index, row) {
          console.log(index, row);
          this.StaffID=row.StaffID
          console.log(this.StaffID)
          if(this.StaffID!=''){
            this.StaffModel();
            this.dialogFormVisible=true;
          }
        },
        changeList(status){
          if(this.stauts!=status){
            this.stauts=status;
            this.StaffPage();
          }
        }
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
</style>
