<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.valueName"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
                :value="`${attr.id}:${attrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="sale.saleAttrName"
            v-for="(sale, index) in spuSaleAttrList"
            :key="sale.id"
          >
            <el-select placeholder="请选择" v-model="sale.saleIdAndSaleValueId">
              <el-option
                :label="saleValue.saleAttrName"
                v-for="(saleValue, index) in sale.spuSaleAttrValueList"
                :key="saleValue.id"
                :value="`${sale.id}:${saleValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :data="spuImageList"
        >
          <el-table-column type="selection" width="55px"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="prop" :label="imgName" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                @click="defaultClick(row)"
                v-if="row.isDefault == 0"
                >设为默认</el-button
              >
              <el-button type="info" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      // 存储图片的信息
      spuImageList: [],
      // 存储销售属性
      spuSaleAttrList: [],
      // 存储平台属性的数据
      attrInfoList: [],
      // 收集sku数据的字段
      skuInfo: {
        // 第一类收集的数据：父组件给的
        category3Id: 0,
        tmId: 0,
        spuId: 0,

        // 第二类数据：需要通过双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",

        // 第三类数据：需要自己书写代码
        // 默认图片
        skuDefaultImg: "",
        // 手机图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   isDefault: "",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu: {},
      // 收集如片的数据字段，但需要注意的是。收集的数据目前缺少isDefault字段，激昂来交给服务器的时候，需要整理参数
      imageList: [],
    };
  },
  methods: {
    // 请求数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件给的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.tmId = spu.tmId;

      this.spu = spu;

      //  获取图片的数据
      console.log("获取数据");
      let result = await this.$API.spu.reqSpuImageList2(spu.id);
      if (result.code == 200) {
        let list = result.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }

      // 获取销售属性的数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }

      // 获取平台属性的数据
      let result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    // 多选图片的事件(收集勾选的图片数据)
    handleSelectionChange(params) {
      // console.log(params)
      this.imageList = params;
    },
    // 点击设为默认事件(排他操作)
    defaultClick(row) {
      // 图片列表的数据isDefault字段为0
      this.spuImageList.forEach((item) => (item.isDefault = 0));
      // 点击的那个图片的数据变为1
      row.isDefault = 1;
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 取消按钮的回调
    cancel() {
      this.$emit("changeScene", 0);
      //清理数据
      // Object.assign是Es6中新增的方法可以合并对象
      // 组件实例this._data可以操作data当中的响应式数据
      // this.$options可以获取配置对象,配置对象的data函数执行,返回的响应式数据为空的
      Object.assign(this._data, this.$options.data());
    },
    // 保存按钮的回调
    async save() {
      //  整理参数
      // 整理平台属性
      const { attrInfoList,skuInfo,spuSaleAttrList,imageList} = this;
      // 整理平台属性的数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.saleIdAndSaleValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      // 整理图片的数据
      skuInfo.skuImageList=imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
            isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      //  发请求
      let result = await this.$API.spu.reqAddSku(skuInfo);
      console.log(result);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功" });
        this.$emit("changeScene", 0);
      } else {
        this.$message({ type: "success", message: "保存失败" });
      }
    },
  },
};
</script>

<style>
</style>