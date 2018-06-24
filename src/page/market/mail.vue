<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-button type="primary" @click="dialognewform = true">编辑站内信</el-button>

      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="站内信目标"
          prop="TagValue">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="CreateTime"
          width="200">
        </el-table-column>
        <el-table-column
          label="创建者"
          prop="CreatorName"
          width="120">
        </el-table-column>
        <el-table-column
          label="标题"
          prop="Title">
        </el-table-column>
        <el-table-column
          label="内容"
          prop="Describe">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)">查看</el-button>
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
      <el-dialog title="站内信详情" :visible.sync="dialogFormVisible" class="specaildialog" width="500px">
        <el-form :model="tableDatalist">
          <el-form-item label="站内信目标" label-width="100px">
            <el-input v-model="tableDatalist.TagValue" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="站内信标题" label-width="100px">
            <el-input v-model="tableDatalist.Title" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="站内信内容" label-width="100px">
            <!--<el-input v-model="tableDatalist.Describe" auto-complete="off"></el-input>-->
            <div class="specialrecord"><span>{{tableDatalist.Describe}}</span></div>
          </el-form-item>
          <el-form-item label="创建人" label-width="100px">
            <el-input v-model="tableDatalist.CreatorName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" label-width="100px">
            <el-input v-model="tableDatalist.CreateTime" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <!--<el-form-item label="修改者" label-width="100px">-->
            <!--<el-input v-model="tableDatalist.Modifier" auto-complete="off" :disabled="true"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="修改时间" label-width="100px">-->
            <!--<el-input v-model="tableDatalist.ModifyTime" auto-complete="off" :disabled="true"></el-input>-->
          <!--</el-form-item>-->
        </el-form>
      </el-dialog>

      <el-dialog title="站内信发送" :visible.sync="dialognewform" class="specaildialog" width="40%">
        <el-form :model="loginForm" ref="loginForm">
          <el-form-item label="发送对象" label-width="120px" prop="Tag" :rules="{ required: true, message: '发送对象不能为空', trigger: 'blur' }">
            <el-select v-model="loginForm.Tag" placeholder="请选择" @change="handleSelect">
              <el-option
                v-for="item in selectedCategory"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接收者ID" label-width="120px" v-if="loginForm.Tag==10" prop="ObjectID" :rules="{ required: true, message: '接收者ID不能为空', trigger: 'blur' }">
            <el-input v-model="loginForm.ObjectID" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="站内信标题" label-width="120px" prop="Title" :rules="{ required: true, message: '站内信标题不能为空', trigger: 'blur' }">
            <el-input v-model="loginForm.Title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="站内信内容" label-width="120px" prop="Describe" :rules="{ required: true, message: '站内信内容不能为空', trigger: 'blur' }">
            <el-input type="textarea" v-model="loginForm.Describe"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialognewform = false">取 消</el-button>
          <el-button type="primary" @click="CargoTypeCreate('loginForm')">确 定</el-button>
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
    import {MessageGetPage, MessageCreate, MessageGet} from '@/api/getdatas'
    import {mapState} from 'vuex'
    export default {
      data(){
        return {
          baseUrl,
          loading:true,
          stauts:2,
          PageIndex: 1,
          PageSize: 20,
          count: 0,
          tableData: [],
          PageID:0,
          MessageID:undefined,
          currentPage: 1,
          dialogFormVisible:false,
          dialognewform:false,
          tableDatalist:{
            Title:'',
            Describe:'',
            CreateTime:'',
            TagValue:'',
          },
          selectedCategory: [{
            value: '1',
            label: '工厂'
          }, {
            value: '2',
            label: '物流公司'
          }, {
            value: '3',
            label: '个体司机'
          }, {
            value: '9',
            label: '全部'
          }, {
            value: '10',
            label: '单一对象'
          }],
          loginForm: {
            Tag: '',
            ObjectID:'',
            Title:'',
            Describe:'',
          },
        }
      },
      components: {
          headTop,
      },
      created(){
        this.MessageGetPage();
      },
      computed: {
        ...mapState(['adminInfo']),
      },
      methods:{
        //获取站内信列表
        async MessageGetPage(){
          this.loading=true;
          let form = new FormData();
          form.append("PageIndex", this.PageIndex);
          form.append("PageSize", this.PageSize);
          form.append("TotalRecords", "0");
          const TypeGetList = await MessageGetPage(form);
          if(TypeGetList.ResultCode=="000000"){
            if(this.tableData==''){
              this.$message({
                type: 'success',
                message: TypeGetList.ResultMessage
              });
            }
            this.tableData=[];
            TypeGetList.ResultValue.forEach(item => {
              const tableData = {};
              if(item.TagValue==10){
                tableData.TagValue = item.ObjectaName;
              }else{
                tableData.TagValue = item.TagValue==1?'工厂':item.TagValue==2?'物流公司':item.TagValue==3?'个体司机':item.TagValue==9?'全部':'单一对象';
              }
              tableData.MessageID = item.MessageID;
              if(item.Title.length>10){
                tableData.Title = item.Title.substring(0,10)+'...';
              }else{
                tableData.Title = item.Title;
              }
              tableData.CreatorName = item.CreatorName;
              if(item.Describe.length>12){
                tableData.Describe = (item.Describe).substring(0,10)+'...';
              }else{
                tableData.Describe = item.Describe;
              }
              tableData.CreateTime = item.CreateTime;
              this.tableData.push(tableData);
            })
            this.count=TypeGetList.TotalRecords;
            this.loading=false;
          }else{
            this.$message({
              type: 'error',
              message: TypeGetList.ResultMessage
            });
          }
        },
        //获取站内信单条信息（编辑操作用到）
        async MessageGet(){
            let form = new FormData();
            form.append("MessageID", this.MessageID);
            const TypeGet = await MessageGet(form);
            if(TypeGet.ResultCode=="000000"){
              let item=TypeGet.ResultValue;
              if(item.TagValue==10){
                this.tableDatalist.TagValue = item.ObjectaName;
              }else{
                this.tableDatalist.TagValue = item.TagValue==1?'工厂':item.TagValue==2?'物流公司':item.TagValue==3?'个体司机':item.TagValue==9?'全部':'单一对象';
              }
              //this.tableDatalist.MessageID = item.MessageID;
              this.tableDatalist.Title = item.Title;
              this.tableDatalist.Describe = item.Describe;
              this.tableDatalist.CreateTime = item.CreateTime;
              this.tableDatalist.CreatorName = item.CreatorName;
            }else{
              this.$message({
                type: 'error',
                message: TypeGet.ResultMessage
              });
            }
        },
        //新增站内信
        CargoTypeCreate(formName){
          this.$refs[formName].validate(async (valid) => {
            console.log(valid)
            if (valid) {
              let form = new FormData();
              form.append("Tag", this.loginForm.Tag);
              if(this.loginForm.Tag==10){
                form.append("ObjectID", this.loginForm.ObjectID);
              }
              form.append("Title", this.loginForm.Title);
              form.append("Describe", this.loginForm.Describe);
              form.append("PageID", this.PageID);
              form.append("LoginID", this.adminInfo);
              console.log(this.adminInfo)
              const TypeUpdate = await MessageCreate(form);
              if (TypeUpdate.ResultCode == "000000") {
                this.$message({
                  type: 'success',
                  message: TypeUpdate.ResultMessage
                });
                this.dialognewform = false;
                this.MessageGetPage()
              } else {
                this.$message({
                  type: 'error',
                  message: TypeUpdate.ResultMessage
                });
              }
            }
          })
        },
        handleEdit(index, row) {
          console.log(index, row);
          this.MessageID=row.MessageID
          console.log(this.MessageID)
          if(this.MessageID!=''){
            this.MessageGet();
            this.dialogFormVisible=true;
          }
        },
        handleSizeChange(val) {
        },
        handleCurrentChange(val) {
          this.currentPage = val;
          this.PageIndex = val;
          this.MessageGetPage()
        },
        handleSelect(index){
          console.log(index)
          this.loginForm.Tag = index;
          //this.loginForm.Tag = this.selectedCategory[index].value;
        },
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
  .specialrecord{
    width: 100%;
    display: inline-block;
    border: #d1dbe5 1px solid;
    border-radius: 4px;
    color: #6c6c6c;
    background: #ebf2f8;
  }
  .specialrecord span{padding:6px 10px;display: block;line-height:24px;}
</style>
