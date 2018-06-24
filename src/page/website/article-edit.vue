<template>
    <div class="article-edit">
      <head-top></head-top>
      <div class="table_container">
        <el-form v-loading="submitLoading" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="文章标题" prop="Title">
            <el-input v-model="ruleForm.Title"></el-input>
          </el-form-item>

          <el-form-item label="文章分类" prop="region">
            <el-select v-model="ruleForm.ArticleType" placeholder="请选择文章类型">
              <el-option v-for="item in articleOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="article-box">
            <label class="el-form-item__label">文章内容</label>
            <quill-editor ref="myTextEditor" class="text-editor"
              v-model="Content"
              :options="editorOption">
            </quill-editor>
          </div>
          <el-form-item label="关键词" prop="Keywords">
            <el-input v-model="ruleForm.Keywords"></el-input>
          </el-form-item>

          <el-form-item label="描述" prop="Description">
            <el-input type="textarea" v-model="ruleForm.Description"></el-input>
          </el-form-item>

          <el-form-item label="跳转链接" prop="LinkUrl">
            <el-input v-model="ruleForm.LinkUrl" placeholder="有跳转链接则跳转至跳转链接"></el-input>
          </el-form-item>

          <el-form-item label="发布时间" prop="Publish">
            <el-date-picker
              v-model="ruleForm.Publish"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="点击数" prop="ckicknum">
            <el-input v-model="ruleForm.ClickCount" type="number"></el-input>
          </el-form-item>

          <el-form-item label="缩略图片" label-width="100px" prop="LicensePicture">
            <el-upload
              v-loading="picUrlLoading"
              class="avatar-uploader"
              ref="uploadImg"
              multiple="false"
              action="string"
              :http-request="uploadSLT"
              :show-file-list="false"
              :auto-upload="true"
              list-type="picture-card"
              :multiple="false">
              <img v-if="ruleForm.ThumbnailUrl" :src="baseImgPath + ruleForm.ThumbnailUrl" class="avatar">
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="首页显示">
            <el-radio v-model="ruleForm.ShowHome" :label="false">不显示</el-radio>
            <el-radio v-model="ruleForm.ShowHome" :label="true">显示</el-radio>
          </el-form-item>

          <el-form-item label="是否置顶">
            <el-radio v-model="ruleForm.Istop" :label="false">不置顶</el-radio>
            <el-radio v-model="ruleForm.Istop" :label="true">置顶</el-radio>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="medium" @click="submitForm('ruleForm')" round>确认提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
  import headTop from '../../components/headTop'
  import { quillEditor, Quill } from 'vue-quill-editor'
  import {container, ImageExtend, QuillWatch} from '@/config/quill-image-extend-module'
  import ImageResize from 'quill-image-resize-module'
  import { baseUrl, baseImgPath } from '@/config/env'
  import { UploadSingle, UploadHtml, CreateArticle, ArticleGet, ArticleUpdate } from '@/api/getdatas'
  import { htmlUtil } from '@/config/htmlUtil'
  import {removeStore, getStore} from '@/config/mUtils'

  import { articleHtml } from '@/config/articleHtml' // 文章模板
  import qs from 'qs'
  Quill.register('modules/ImageExtend', ImageExtend)
  Quill.register('modules/ImageResize', ImageResize)

  export default {
    components: {
      headTop,
      quillEditor
    },
    watch:{
        'ruleForm.ClickCount':function(newVal,oldVal){
            if(newVal == '') return;
            this.ruleForm.ClickCount = parseInt(newVal);
        },
    },
    data () {
      return {
        baseUrl,
        baseImgPath,
        submitLoading: false,
        Content: '', // 富文本内容
        ruleForm: { // form 数据
          ArticleID: '', // 文章编辑ID
          Title: '',
          Keywords: '',
          Description: '',
          ArticleType: 2, //文章分类：1公告；2热门；
          ContentUrl: '', //内容网址
          LinkUrl: '', //跳转连接
          ThumbnailUrl: '', //	缩略图网址
          ClickCount: 0, //	点击数
          Istop: false, //	置顶：1是；
          ShowHome: false, //是否在首页展示：1是；
          Publish: '', //2018-06-20 13:48
          LoginID: getStore('UseId'), //登录者编码
        },
        rules: {
          Title: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          Keywords: [
            { required: true, message: '请输入关键词', trigger: 'blur' }
          ],
          Description: [
            { required: true, message: '请输入描述', trigger: 'blur' }
          ],
          ArticleType: [
            { required: true, message: '请输入文章类型', trigger: 'blur' }
          ],
          Publish: [
            { required: true, message: '请输入发布时间', trigger: 'blur' }
          ],
        },
        articleOptions:[
          {
            value: 1,
            label: '公告'
          }, {
            value: 2,
            label: '热门'
          }
        ],
        picUrlLoading: false,
        editorOption: { // 富文本设置
          modules: {
            ImageResize: {},
            ImageExtend: {
              loading: true,
              name: 'img',
              action: baseImgPath + '/Picture/UploadSingle',
              response: (res) => {
                return baseImgPath + res.ResultValue
              }
            },
            toolbar: {
              container: container,
              handlers: {
                'image': function () {
                  QuillWatch.emit(this.quill.id)
                }
              }
            }
          }
        }
      }
    },
    created () {
      if (this.$route.query.ArticleID) { // 存在进行填充
        this.ruleForm.ArticleID = this.$route.query.ArticleID;
        this.articleGet();
      }
    },
    methods: {
      async articleGet () { // 获取文章一页
        let _ = this;
        let form = qs.stringify({ArticleID: this.$route.query.ArticleID});
        _.submitLoading = !_.submitLoading;
        const article = await  ArticleGet(form);
        _.submitLoading = !_.submitLoading;
        if (article.ResultCode === "000000") {
          let data = article.ResultValue;
          this.ruleForm.Title = data.ArticleName;
          this.ruleForm.Keywords = data.Keywords;
          this.ruleForm.Description = data.Description;
          this.ruleForm.ArticleType = data.ArticleType; //文章分类：1公告；2热门；
          this.ruleForm.ContentUrl = data.ContentUrl; //内容网址
          this.ruleForm.LinkUrl = data.LinkUrl; //跳转连接
          this.ruleForm.ThumbnailUrl = data.Thumbnail; //  缩略图网址
          this.ruleForm.ClickCount = data.ClickCount; // 点击数
          this.ruleForm.Istop = Number(data.Istop) ? true : false; //  置顶：1是；
          this.ruleForm.Publish = data.PublishTime; //2018-06-20 13:48
        }
      },
      async uploadSLT (data) { // 自定义上传图片方法
        let file = data.file
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isJPG) {
          this.$message.error('请选择正确的图片格式!');
          return false;
        }
        let formData = new FormData()
        formData.append('file', file)
        this.picUrlLoading = true
        let upload = await UploadSingle(formData)
        this.picUrlLoading = false
        if (upload.ResultCode === "000000") {
          this.$message({
            type: 'success',
            message: upload.ResultMessage
          })
          this.ruleForm.ThumbnailUrl = upload.ResultValue;
        }else{
          this.$message({
            type: 'error',
            message: upload.ResultMessage
          });
        }
        return false;
      },
      submitForm (formname) {
        let _ = this;
        _.$refs[formname].validate(async (valid) => {
          if (valid) {
            //等待上传
            _.submitLoading = !_.submitLoading;
            let submitFirst = {Title: _.ruleForm.Title, Content: htmlUtil.htmlEncode(articleHtml(_.Content, _.ruleForm.Title, _.ruleForm.Publish)), Keywords: _.ruleForm.Keywords, Description: _.ruleForm.Description}
            //html创建
            const result = await UploadHtml(qs.stringify(submitFirst))
            //html创建失败

            if(result.ResultCode !== '000000'){
              _.$message({
                type: 'error',
                message:  article.ResultMessage
              });
              _.submitLoading = !_.submitLoading;
              return;
            }
            _.ruleForm.ContentUrl = result.ResultValue;

            //非必须字段  同时要保证上传的值为整型
            if(!_.ruleForm.ClickCount){
              _.ruleForm.ClickCount = 0;
            }
            //文章创建
            let article = {};
            if (!this.$route.query.ArticleID) {
              article = await  CreateArticle(qs.stringify(_.ruleForm));
            } else {
              article = await  ArticleUpdate(qs.stringify(_.ruleForm));
            }

            //校验上传结果
            _.submitLoading = !_.submitLoading;

            if(article.ResultCode === '000000'){
              _.$message({
                type: 'success',
                message: article.ResultMessage
              });
              setTimeout(function(){
                _.$router.push('/article-list')
              },2000);
            } else {
              _.$message({
                type: 'error',
                message:  article.ResultMessage
              });
            }

          }
        })
      }
    }
  }
</script>
<style>
  .ql-snow .ql-tooltip {

  }
</style>
<style scoped lang="less">
  @import '../../style/mixin';
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .avatar {
      width: 146px;
      height: 146px;
      display: block;
    }
  }
  .article-edit {
    .el-form-item {
      width: 460px;
    }
    .el-select, .el-date-editor {
      width: 100%;
    }
  }
  .article-box {
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
    height: 470px;
    label {
      width: 100px;
    }
    .text-editor {
      width: 900px;
      height: 400px;
      margin-left: 100px;
    }
  }
  .avatar-uploader {
    width: 148px;
  }
</style>
