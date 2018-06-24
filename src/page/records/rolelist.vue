<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-button type="primary" @click="dialogtype = true">添加新角色</el-button>
        <el-button type="success" plain @click="changeList(1)" v-show="stauts!=1">查看有效的角色</el-button>
        <el-button type="success" plain @click="changeList(2)" v-show="stauts!=2">查看所有的角色</el-button>
      </el-row>

      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="角色名称"
          prop="RoleName">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="ModifyTime"
          width="200">
        </el-table-column>
        <el-table-column
          label="创建者"
          prop="Creator">
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
              @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改角色信息" :visible.sync="dialogFormVisible" class="specaildialog" width="500px">
        <el-form :model="categoryOptions">
          <el-form-item label="角色名称" label-width="100px">
            <el-input v-model="categoryOptions.RoleName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="创建人" label-width="100px">
            <el-input v-model="categoryOptions.Creator" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" label-width="100px">
            <el-input v-model="categoryOptions.ModifyTime" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="RoleUpdate">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增角色信息" :visible.sync="dialogtype" class="specaildialog" width="500px">
        <el-form >
          <el-form-item label="角色名称" label-width="100px">
            <el-input v-model="dialogoptions" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogtype = false">取 消</el-button>
          <el-button type="primary" @click="RoleNew">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import {baseUrl} from '@/config/env'
    import {RoleList, RoleNew, RoleModel, RoleUpdate} from '@/api/getdatas'
    export default {
      data(){
        return {
          baseUrl,
          loading:true,
          stauts:2,
          LoginId:'',
          tableData: [],
          RoleID:'',
          dialogFormVisible: false,
          categoryOptions: {},
          dialogtype:false,
          dialogoptions:'',
        }
      },
      components: {
          headTop,
      },
      created(){
        this.restaurant_id = this.$route.query.restaurant_id;
        this.RoleList();
      },
      methods:{
        //获取角色列表
        async RoleList(){
          this.loading=true;
          let form = new FormData();
          form.append("Status", this.stauts);
          const restaurants = await RoleList(form);
          if(restaurants.ResultCode=="000000"){
            if(this.tableData==''){
              this.$message({
                type: 'success',
                message: restaurants.ResultMessage
              });
            }
            this.tableData=restaurants.ResultValue;
            this.loading=false;
          }else{
            this.$message({
              type: 'error',
              message: restaurants.ResultMessage
            });
          }
        },
        //获取角色单条信息（编辑操作用到）
        async RoleModel(){
            let form = new FormData();
            form.append("RoleID", this.RoleID);
            const RoleModels = await RoleModel(form);
            if(RoleModels.ResultCode=="000000"){
              this.categoryOptions=RoleModels.ResultValue;
            }else{
              this.$message({
                type: 'error',
                message: RoleModels.ResultMessage
              });
            }
        },
        //修改角色信息（编辑操作用到）
        async RoleUpdate(){
            let form = new FormData();
            form.append("RoleID", this.categoryOptions.RoleID);
            form.append("Name", this.categoryOptions.RoleName);
            form.append("LoginID", this.LoginId);
            const RoleUpdates = await RoleUpdate(form);
            if(RoleUpdates.ResultCode=="000000"){
              this.$message({
                type: 'success',
                message: RoleUpdates.ResultMessage
              });
              this.dialogFormVisible=false;
              this.RoleList();
            }else{
              this.$message({
                type: 'error',
                message: RoleUpdates.ResultMessage
              });
            }
        },
        //新增角色（编辑操作用到）
        async RoleNew(){
          let form = new FormData();
          form.append("Name", this.dialogoptions);
          form.append("LoginID", this.LoginId);
          const RoleUpdates = await RoleNew(form);
          if(RoleUpdates.ResultCode=="000000"){
            this.$message({
              type: 'success',
              message: RoleUpdates.ResultMessage
            });
            this.dialogtype=false;
            this.RoleList();
          }else{
            this.$message({
              type: 'error',
              message: RoleUpdates.ResultMessage
            });
          }
        },
        //编辑角色
        handleEdit(row) {
          this.RoleID=row.RoleID
          if(this.RoleID!=''){
            this.RoleModel();
            this.dialogFormVisible=true;
          }
        },
        changeList(status){
          if(this.stauts!=status){
            this.stauts=status;
            this.RoleList();
          }
        }
      }
    }
</script>

<style lang="less">

</style>
