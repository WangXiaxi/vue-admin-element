<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-button type="primary" @click="dialognewform = true">添加货物类型</el-button>

      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="车型名称"
          prop="TruckTypeName">
        </el-table-column>
        <el-table-column
          label="创建者"
          prop="Creator">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="CreateTime"
          width="200">
        </el-table-column>
        <el-table-column
          label="修改者"
          prop="Modifier">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)">更新</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改车型信息" :visible.sync="dialogFormVisible" class="specaildialog" width="500px">
        <el-form :model="categoryOptions" >
          <el-form-item label="车型名称" label-width="100px">
            <el-input v-model="categoryOptions.TruckTypeName" auto-complete="off"></el-input>
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
          <el-button type="primary" @click="TruckTypeUpdate" >修 改</el-button>
        </div>
      </el-dialog>
      <el-dialog title="车型类型" :visible.sync="dialognewform" ref="loginForm"  class="specaildialog" width="500px">
        <el-form :model="loginForm" ref="loginForm">
          <el-form-item label="车型名称" label-width="100px" prop="Name" :rules="[
                        { required: true, message: '车型名称不能为空', trigger: ['blur', 'change'] },
                      ]">
            <el-input v-model="loginForm.Name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="车型描述" label-width="100px">
            <el-input v-model="loginForm.Describe" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialognewform = false">取 消</el-button>
          <el-button type="primary" @click="TruckTypeCreate('loginForm')">确 定</el-button>
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
    import {TruckTypeGetList, TruckTypeCreate, TruckTypeGet, TruckTypeUpdate,TruckTypeDelete} from '@/api/getdatas'
    import {mapState} from 'vuex'
    export default {
      data(){
        return {
          baseUrl,
          loading:true,
          stauts:2,
          count: 40,
          tableData: [],
          TruckTypeID:'',
          PageID:'',
          dialogFormVisible: false,
          dialognewform:false,
          categoryOptions: {},
          selectedCategory: [],
          loginForm: {
            Name: '',
            Describe:'',
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
        this.TruckTypeGetList();
      },
      computed: {
        ...mapState(['adminInfo']),
      },
      methods:{
        //获取车型列表
        async TruckTypeGetList(){
          this.loading=true;
          const GetList = await TruckTypeGetList();
          if(GetList.ResultCode=="000000"){
            if(this.tableData==''){
              this.$message({
                type: 'success',
                message: GetList.ResultMessage
              });
            }
            this.count=GetList.TotalRecords;
            this.tableData=GetList.ResultValue;
            this.loading=false;
          }else{
            this.$message({
              type: 'error',
              message: GetList.ResultMessage
            });
          }
        },
        //获取车型单条信息（编辑操作用到）
        async TruckTypeGet(){
            let form = new FormData();
            form.append("TruckTypeID", this.TruckTypeID);
            const TypeGet = await TruckTypeGet(form);
            if(TypeGet.ResultCode=="000000"){
              this.categoryOptions=TypeGet.ResultValue;
              console.log(this.categoryOptions)
            }else{
              this.$message({
                type: 'error',
                message: TypeGet.ResultMessage
              });
            }
        },
        //修改车型信息（编辑操作用到）
        async TruckTypeUpdate(){
          let form = new FormData();
          console.log(this.adminInfo)
          form.append("TruckTypeID", this.categoryOptions.TruckTypeID);
          form.append("Name", this.categoryOptions.TruckTypeName);
          form.append("PageID", this.PageID);
          form.append("LoginID", this.adminInfo);
          const Updates = await TruckTypeUpdate(form);
          if(Updates.ResultCode=="000000"){
            this.$message({
              type: 'success',
              message: Updates.ResultMessage
            });
            this.dialogFormVisible=false;
            this.TruckTypeGetList()
          }else{
            this.$message({
              type: 'error',
              message: Updates.ResultMessage
            });
          }
        },
        //新增车型
        TruckTypeCreate(formName){
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
              let form = new FormData();
              form.append("Name", this.loginForm.Name);
              form.append("Describe", this.loginForm.Describe);
              form.append("PageID", this.PageID);
              form.append("LoginID", this.adminInfo);
              const TypeCreate = await TruckTypeCreate(form);
              if (TypeCreate.ResultCode == "000000") {
                this.$message({
                  type: 'success',
                  message: TypeCreate.ResultMessage
                });
                this.dialognewform = false;
                this.TruckTypeGetList()
              } else {
                this.$message({
                  type: 'error',
                  message: TypeCreate.ResultMessage
                });
              }
            }
          })
        },
        //删除车型
        async TruckTypeDelete(){
          let form = new FormData();
          form.append("TruckTypeID", this.TruckTypeID);
          form.append("PageID", this.PageID);
          form.append("LoginID", this.adminInfo);
          const TypeDelete = await TruckTypeDelete(form);
          if(TypeDelete.ResultCode=="000000"){
            this.$message({
              type: 'success',
              message: TypeDelete.ResultMessage
            });
            this.dialognewform=false;
            this.TruckTypeGetList()
          }else{
            this.$message({
              type: 'error',
              message: TypeDelete.ResultMessage
            });
          }
        },
        handleEdit(index, row) {
          console.log(index, row);
          this.TruckTypeID=row.TruckTypeID
          console.log(this.TruckTypeID)
          if(this.TruckTypeID!=''){
            this.TruckTypeGet();
            this.dialogFormVisible=true;
          }
        },
        handleDelete(index,row){
          this.TruckTypeID=row.TruckTypeID;
          this.$confirm('此操作将永久删除该车型, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.TruckTypeDelete();
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
      }
    }
</script>

<style lang="less">
  .table_container{
    padding: 20px;
  }
  .Pagination {
    display: flex;
    justify-content: flex-start;
    margin-top: 8px;
  }
</style>
