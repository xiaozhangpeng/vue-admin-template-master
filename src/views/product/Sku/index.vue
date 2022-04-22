<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
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
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            icon="el-icon-sort-down"
            size="mini"
            v-if="isSale == 0"
            @click="onSale(row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-sort-up"
            size="mini"
            v-else
            @click="cancel(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="loading"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器      @size-change="handleSizeChange"
       @current-change="handleCurrentChange"-->
    <el-pagination
      :current-page="page"
      :page-sizes="[2, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      style="text-align: center"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <!-- 抽屉drawer -->
    <el-drawer
      :visible.sync="show"
      :direction="direction"
      size="50%"
      :show-close="false"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              type="success"
              v-for="(attr, index) in skuInfo.skuAttrValueList"
              :key="attr.id"
              style="margin-right: 10px"
              >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
            >
          </template>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">   
           <template>
          <el-carousel height="150px">
            <el-carousel-item v-for="(item,index) in skuInfo.skuImageList" :key="item.id">
           <img :src="item.imgUrl" alt="" style="width:100%;height:100%">
            </el-carousel-item>
          </el-carousel>
        </template>
        </el-col>
    
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 3,
      records: [],
      total: 0,
      isSale: 0,
      skuInfo: {},
      show: false,
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    async getSkuList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      //  console.log(result)
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    handleCurrentChange(page) {
      console.log(page);
      this.page = page;
      this.getSkuList(page);
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    async onSale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "上架成功" });
        this.isSale = 1;
      }
    },
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "下架成功" });
        this.isSale = 0;
      }
    },
    loading() {
      this.$message({ type: "info", message: "正在研发中...." });
    },
    async getSkuInfo(row) {
      let result = await this.$API.sku.reqSkuById(row.id);
      console.log(result);
      if (result.code == 200) {
        this.skuInfo = result.data;
        this.show = true;
      }
    },
  },
};
</script>
<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  .el-carousel__button{
    width:10px;
    height: 10px;
    background: red;
    border-radius: 50%;
  }
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 19px;
  text-align: center;
}
.el-col {
  margin: 10px 10px;
}
</style>