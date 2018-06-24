<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-button type="primary" @click="addnewmoudle">添加新功能模块</el-button>
      </el-row>

      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%" @row-dblclick="changeLink">
        <el-table-column
          label="顺序号"
          prop="Sequence"
          width="200">
        </el-table-column>
        <el-table-column
          label="功能模块名称"
          prop="Name">
        </el-table-column>
        <el-table-column
          label="创建者"
          prop="Creator"
          width="200">
        </el-table-column>
        <el-table-column
          label="级别"
          prop="Level">
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="success"
              plain
              @click="changeList(scope.row)">新增</el-button>
            <el-button
              size="small"
              type="danger"
              plain
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改功能模块信息" :visible.sync="dialogFormVisible" class="specaildialog" width="500px">
        <el-form :model="categoryOptions">
          <el-form-item label="序列号" label-width="100px">
            <el-input v-model="categoryOptions.Sequence" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="功能模块名称" label-width="100px" @click="alert('shit')">
            <el-input v-model="categoryOptions.Name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="创建者" label-width="100px">
            <el-input v-model="categoryOptions.Creator" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" label-width="100px">
            <el-input v-model="categoryOptions.CreateTime" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="修改者" label-width="100px">
            <el-input v-model="categoryOptions.Modifier" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="修改时间" label-width="100px">
            <el-input v-model="categoryOptions.ModifyTime" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="ModuleUpdate">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增功能模块" :visible.sync="dialogtype" class="specaildialog" width="500px">
        <el-form :model="updataForm" ref="updataForm">
          <el-form-item label="模块名称" label-width="100px" prop="Name" :rules="[
                        { required: true, message: '功能模块不能为空', trigger: 'blur' },
                      ]">
            <el-input v-model="updataForm.Name" auto-complete="off"></el-input>
          </el-form-item>
          <!--<el-form-item label="上级编码" label-width="100px">-->
            <!--<el-input v-model="Higher" auto-complete="off" :disabled="true"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="顺序号" label-width="100px" prop="Sequence" :rules="[
                        { required: true, message: '顺序号不能为空', trigger: 'blur' },
                      ]">
            <el-input v-model="updataForm.Sequence" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" label-width="100px">
            <el-input v-model="updataForm.Describe" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogtype = false">取 消</el-button>
          <el-button type="primary" @click="ModuleNew('updataForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import {baseUrl} from '@/config/env'
    import {ModuleGetList, ModuleNew, ModuleGet, ModuleUpdate,ModuleDelete} from '@/api/getdatas'
    import {mapState} from 'vuex'
    export default {
      data(){
        return {
          baseUrl,
          loading:true,
          Higher:'',
          LoginId:'',
          tableData: [],
          tableDatalist:[],
          ModuleID:'',
          dialogFormVisible: false,
          categoryOptions: {},
          updataForm: {
            Higher:'',
            Name: '',
            Sequence: '1',
            Describe:'',
            PageID:0,
            LoginID:undefined,
          },
          dialogtype:false,
          dialogoptions:'',
        }
      },
      components: {
          headTop,
      },
      mounted:function(){
        this.$nextTick(function() {
          this.ModuleGetList();
        })
      },
      computed: {
        ...mapState(['adminInfo']),
      },
      methods:{
        //获取功能模块列表
        async ModuleGetList(){
          this.loading=true;
          let form = new FormData();
          form.append("Higher", this.Higher);
          const restaurants = await ModuleGetList(form);
          if(restaurants.ResultCode=="000000"){
            if(this.tableData==''){
              this.$message({
                type: 'success',
                message: restaurants.ResultMessage
              });
            }
            if(this.Higher){
              this.tableDatalist=restaurants.ResultValue;
            }else{
              this.tableData=restaurants.ResultValue;
            }
            this.loading=false;
          }else{
            this.$message({
              type: 'error',
              message: restaurants.ResultMessage
            });
          }
        },
        //获取角色单条功能模块（编辑操作用到）
        async ModuleGet(){
            let form = new FormData();
            form.append("ModuleID", this.ModuleID);
            const RoleModels = await ModuleGet(form);
            if(RoleModels.ResultCode=="000000"){
              this.categoryOptions=RoleModels.ResultValue;
              console.log(this.categoryOptions)
            }else{
              this.$message({
                type: 'error',
                message: RoleModels.ResultMessage
              });
            }
        },
        //修改功能模块（编辑操作用到）
        async ModuleUpdate(){
            let form = new FormData();
            form.append("ModuleID", this.categoryOptions.ModuleID);
            form.append("Name", this.categoryOptions.Name);
            form.append("Sequence", this.categoryOptions.Sequence);
            form.append("Describe", this.categoryOptions.Describe);
            form.append("PageID", this.updataForm.PageID);
            form.append("LoginID", this.adminInfo);
            const Update = await ModuleUpdate(form);
            if(Update.ResultCode=="000000"){
              this.$message({
                type: 'success',
                message: Update.ResultMessage
              });
              this.dialogFormVisible=false;
              this.ModuleGetList();
            }else{
              this.$message({
                type: 'error',
                message: Update.ResultMessage
              });
            }
        },
        //新增功能模块（编辑操作用到）
        ModuleNew(formName){
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
              console.log("true")
              let form = new FormData();
              form.append("Name", this.updataForm.Name);
              form.append("Higher", this.Higher);
              form.append("Sequence", this.updataForm.Sequence);
              form.append("Describe", this.updataForm.Describe);
              form.append("PageID", this.updataForm.PageID);
              form.append("LoginID", this.adminInfo);
              const Updates = await ModuleNew(form);
              if (Updates.ResultCode == "000000") {
                this.$message({
                  type: 'success',
                  message: Updates.ResultMessage
                });
                this.dialogtype = false;
                this.ModuleGetList();
              } else {
                this.$message({
                  type: 'error',
                  message: Updates.ResultMessage
                });
                return false;
              }
            }else{
              console.log("fasle")
            }
          })
        },
        //删除功能模块（编辑操作用到）
        async ModuleDelete(){
          let form = new FormData();
          form.append("ModuleID", this.ModuleID);
          form.append("PageID", this.updataForm.PageID);
          form.append("LoginID", this.adminInfo);
          const Update = await ModuleDelete(form);
          if(Update.ResultCode=="000000"){
            this.$message({
              type: 'success',
              message: Update.ResultMessage
            });
            this.dialogFormVisible=false;
            this.ModuleGetList();
          }else{
            this.$message({
              type: 'error',
              message: Update.ResultMessage
            });
          }
        },
        //编辑角色
        handleEdit(row) {
          this.ModuleID=row.ModuleID
          if(this.ModuleID!=''){
            this.ModuleGet();
            this.dialogFormVisible=true;
          }
        },
        handleDelete(row){
          this.ModuleID=row.ModuleID
          this.$confirm('此操作将永久删除该功能模块, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.ModuleDelete();
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        addnewmoudle(){
          this.Higher='';
          this.dialogtype=true;
        },
        changeList(row){
          console.log(row)
          this.Higher=row.ModuleID;
          this.dialogtype=true;
        },
        changeLink(row){
          this.$router.push({path:'modulelist',query:{ModuleID:row.ModuleID}})
        }
      }
    }
</script>

<style lang="less">

</style>
