<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>

    <!-- 表格组件 -->
    <!-- 
      data:收集表格组件将来需要展示的数据---数组类型
      border:是给表格添加边框
      column属性
         label:显示标题
         width:对应列的宽度
         align:标题的对齐方式
         prop:对应列内容的字段

         注意：elementUi中的table组件，展示的数据是以一列一列进行 展示数据
     -->
    <el-table style="width: 100%; margin-top: 20px" border :data="list">
      <el-table-column prop="prop" label="序号" width="80px" align="center" type="index"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width">
        <!-- 作用域插槽 -->
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <!-- 
      currrent-page:当前在第几页
      total:总共有多少数据
      page-size:一页显示多少数据
      page-sizes:可选择的下拉框--一页可以显示多少数据
      page-count:分页器中可连续页数

      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
     -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-count="5"
      :page-sizes="[3, 5, 10]"
      layout=" prev, pager, next, jumper,->, sizes,total"
      @current-change="getPageList"
      @size-change="handleSizeChange">
    </el-pagination>

    <!-- 弹出对话框dialog(修改品牌|添加品牌) -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form :model="tmForm" :rules="rules" ref="ruleForm">
        <!-- 表单验证 -->
        <!-- Form组件提供了表单验证的功能，只需要通过rules属性传入约定的验证规则，并将Form-Item的prop属性设置为需要校验的字段名即可 -->
        <!-- 需要在el-form上添加:rules 和ref(节点) 
        然后再el-form-iten上添加prop
        最后定义rules（规则） -->
        <el-form-item label="品牌名称" label-width="80px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!--upload上传图片  -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <!-- 提示语言 -->
            <div class="el-upload__tip" slot="tip" style="margin-left: 65px">
              只能上传jpg/png文件,且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    // 自定义校验规则（注意所在位置）
    var validateTmName = (rule, value, callback) => {
      if (value.length < 3 || value.length > 10) {
        callback(new Error("请输入3-10位的品牌名称"));
      } else {
        callback();
      }
    };
    return {
      //  代表的分页器第几页
      page: 1,
      // 代表的是当前页数展示数据条数
      limit: 3,
      // 总共数据条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 默认是否显示dialog
      dialogFormVisible: false,
      // upload的图片路径
      //  imageUrl: '',
      //  表单的数据
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // 也可以自定义校验规则
          { validator: validateTmName, trigger: "blur" },
          // { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "change" },
        ],
        logoUrl: [{ required: true, message: "请上传图片" }],
      },
    };
  },
  // 组件挂载完毕后发请求
  mounted() {
    // 获取列表数据方法
    this.getPageList();
  },
  methods: {
    // 获取品牌列表的数据
    async getPageList(pager=1) {
      // 默认每次请求数据都显示第一页
      this.page=pager;
      // 解构出参数 :page是当前点击页面
      const { page, limit } = this;
      // 获取品牌列表的接口
      let result = await this.$API.trademark.reqTradeMarkList(page,limit);
       console.log(result)

      if (result.code == 200) {
        // 分别是展示数据总条数与列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 点击修改每页展示数据数量
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 点击添加品牌dialog
    showDialog() {
      this.dialogFormVisible = true;
      // 点击按钮之后，需要清除之前的数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 点击弹出修改品牌dialog
    updateTradeMark(row) {
      // row:当前用户选中的品牌信息
      // console.log(row);
      this.dialogFormVisible = true;
      // 浅拷贝：目的是当用户点击取消的时候，信息不会自动修改
      this.tmForm = { ...row };
    },
    //upload相关回调---上传图片成功
    handleAvatarSuccess(res, file) {
      //  res：上传成功之后返回前端数据
      //   file:上传成功之后服务器返回前端数据
      this.tmForm.logoUrl = res.data;
    },
    // upload上传图片之前的格式验证
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加按钮（添加品牌|修改品牌）
    addOrUpdateTradeMark() {
      // 加入表单验证
      this.$refs["ruleForm"].validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          console.log(result);
          if (result.code == 200) {
            // 弹出信息：添加品牌成功|修改品牌成功
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            // 再次获取品牌列表
            this.getPageList(this.tmForm.id?this.page:1);
          }
        } else {
          console.log("操作失败");
          return false;
        }
      });
    },
    // 删除品牌
    deleteTradeMark(row) {
      this.$confirm("此品牌信息将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        // 删除成功的回调
        .then(async () => {
          // 向接口传参（id）--删除响应的数据
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          // console.log(result)
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
          // 再次请求列表数据
          this.getPageList(this.list.length>1?this.page:this.page-1);
        })
        // 取消删除的回调
        .catch(() => {
          this.$message({
            type: "warning",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>