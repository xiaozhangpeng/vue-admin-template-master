<template>
  <!-- spu可以理解为---类--具体的实例
 -->
  <div>
    <!-- 三级联动 -->
    <el-card>
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!scene == 0"
      ></CategorySelect>
    </el-card>
    <!-- 主面板 -->
    <el-card>
      <div v-show="scene == 0">
        <!-- 底部由三部分组成 -->
        <!-- 第一部分：按钮 -->
        <div>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="addSpu"
            :disabled="!category3Id"
            >添加SPU</el-button
          >
        </div>
        <!-- 第二部分:表格 -->
        <div>
          <el-table style="width: 100%" border :data="records">
            <el-table-column
              type="index"
              label="序号"
              width="80px"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="spuName" label="SPU名称" width="width">
            </el-table-column>
            <el-table-column prop="description" label="SPU描述" width="width">
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
              <!-- 这里按钮将来用hintButton -->
              <template slot-scope="{ row, $index }">
                <hint-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  title="添加sku"
                  @click="addSku(row)"
                ></hint-button>
                <hint-button
                  type="warning"
                  icon="el-icon-edit"
                  size="mini"
                  title="修改spu"
                  @click="editSpu(row)"
                ></hint-button>
                <hint-button
                  type="info"
                  icon="el-icon-info"
                  size="mini"
                  title="查看当前spu全部sku列表"
                  @click="watchSku(row)"
                >
                </hint-button>

                <el-popconfirm
                  title="这是一段内容确定删除吗？"
                  @onConfirm="deleteSpu(row)"
                >
                  <hint-button
                    slot="reference"
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    title="删除spu"
                  ></hint-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 第三部分:分页器 -->
        <div>
          <el-pagination
            :current-page="page"
            :page-sizes="[2, 20, 50]"
            :page-size="limit"
            layout="prev, pager, next, jumper,->,sizes,total"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="getSpuList"
            style="text-align: center"
          >
          </el-pagination>
        </div>
      </div>
      <div v-show="scene == 1">
        <SpuForm ref="spu" @changeScene="changeScene"></SpuForm>
      </div>
      <div v-show="scene == 2">
        <SkuForm ref="sku" @changeScene="changeScene2"></SkuForm>
      </div>
    </el-card>
    <!-- 弹出的sku列表  before-close:关闭前的回调-->
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="默认图片" width="width">
          <template slot-scope="{ row, $index }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from "./SkuFrom";
import SpuForm from "./SpuForm";
export default {
  name: "Spu",
  components: {
    SkuForm,
    SpuForm,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      isTableShow: true,
      page: 1, //代表的是分页器当前第几页
      limit: 3, //代表的是每一页需要展示多少条数据
      total: "",
      records: [],
      scene: 0, //切换el-card主面板
      dialogTableVisible: false, //sku列表的显示与隐藏
      spu: {}, //储存新的spu对象
      skuList: [], //储存sku的列表数据
      loading: true, //loading加载效果
    };
  },
  methods: {
    // 三级联动的自定义事件，可以把子组件相应的id传给父组件
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 发请求,获取SPU数据进行展示
        this.getSpuList();
      }
    },
    // 获取Spu数据列表数据
    async getSpuList(pager = 1) {
      this.page = pager;
      const { page, limit, category3Id } = this;

      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 点击切换页面显示数据数量
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    addSpu() {
      this.scene = 1;
      // 通知子组件发请求
      this.$refs.spu.addSpuData(this.category3Id);
    },
    editSpu(row) {
      this.scene = 1;
      // 通过$refs获取子组件的事件initSpuData
      this.$refs.spu.initSpuData(row);
    },
    changeScene(scene) {
      // flag这个形参是为了区分保存按钮还是修改按钮
      this.scene = scene;
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除Spu按钮的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功!" });
        this.getSpuList(this.records.length>1?this.page : this.page - 1);
      }
    },
    // 添加sku按钮回调
    addSku(row) {
      this.scene = 2;
      // 父组件调用子组件的方法，让子组件发请求---三个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    // 跳转场景--子组件提交的自定义事件
    changeScene2(scene) {
      this.scene = scene;
    },
    // 查看sku列表
    async watchSku(spu) {
      this.dialogTableVisible = true;

      this.spu = spu;

      let result = await this.$API.spu.reqSkuList(spu.id);
      console.log(result);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    // 关闭dialog之前的回调
    close(done) {
      // loading的属性再次为真
      this.loading = true;
      //  清除数据
      this.skuList = [];
      // done是关闭对话框
      done();
    },
  },
};
</script>

<style>
</style>