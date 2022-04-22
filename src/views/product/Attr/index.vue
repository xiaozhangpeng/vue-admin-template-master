<template>
  <div>
    <!-- 三级联动 -->
    <el-card>
      <CategorySelect @getCategoryId="getCategoryId" :show="!isTableShow"></CategorySelect>
    </el-card>
    <!-- 展示品牌信息列表 -->
    <el-card>
      <div v-show="isTableShow">
        <el-button type="primary" @click="addValue" :disabled="!category3Id">添加属性</el-button>
        <!-- 表格 -->
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column type="index" label="序号"  width="80px" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性值名称" width="150px" align="center"></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                style="margin: 0 10px"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.attrId">
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150px">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateValue(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 显示与隐藏可编辑栏 -->
      <div v-show="!isTableShow">
        <el-form
          :inline="true"
          ref="form"
          label-width="80px"
          style="margin: 20px 0"
          :model="attrInfo"
        >
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue()"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button>取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡弹出框 -->
              <!-- 因为elementui的版本是2.1.6,所以确认的方法是onConfirm -->
              <el-popconfirm
                :title="`你确定要删除${row.valueName}?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button type="danger" icon="el-icon-delete" slot="reference"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button type="primary" @click="isTableShow = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入(深拷贝)
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      // 控制显示table表格
      isTableShow: true,
      // 手机新增属性|修改属性使用的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个，因此用数组,每一个属性值都是一个对象需要attrId和valueName
          // attrID: 0, //相应属性名的ID
          // valueName: "",
        ],
        categoryId: 0, //三级分类的id(不能直接写this.category3Id，因为对象中的数据是无序的)
        categoryLevel: 3, //因为服务器需要区分是几级id
      },
    };
  },
  methods: {
    // 自定义事件的回调
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
        // 发请求
        this.getAttrList();
      }
    },

    // 获取平台属性的数据
    // 当用户确定点击分类的数据的时候,可以向服务器发请求获取平台属性的数据进行展示
    async getAttrList() {
      // 从组件中解构获取分类的Id----this代表是本组件
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      console.log(result);
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值的回调
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //对于修改某一属性的时候，可以再已有的属性值基础之上新增新的属性值
        valueName: "",
        flag: true,
      });
      // 点击添加属性值后自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加属性按钮的回调
    addValue() {
      // 显示与隐藏Table
      this.isTableShow = false;
      // 清空之前的数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 编辑属性按钮的回调
    updateValue(row) {
      // 显示与隐藏Table
      this.isTableShow = false;

      // 深拷贝
      this.attrInfo = cloneDeep(row);

      this.attrInfo.attrValueList.forEach((item) => {
        // $set可以给属性添加响应式的效果
        // 第一个参数：对象 第二个参数：添加新的响应式属性 第三个：新的属性的属性值
        this.$set(item, "flag", false);
      });
    },
    // 控制属性值input和span的切换
    // 失去焦点的事件--切换查看模式
    toLook(row) {
      // row：形参，用户当前添加的属性值

      // 如果属性值为空，不能作为新的属性值，需要提醒用户输入新的合法属性值
      if (row.valueName.trim() == "") {
        this.$message("请你输入一个正确的属性值");
        return;
      }

      // 新增的属性值不能与已有的属性值重复
      // 需要将row从数组里面判断的时候去除
      // row是最新新增的属性值【也就是数组的最后一个元素】
      // 判断的时候需要把已有的数组当中新增的属性值去掉
      // some方法用于检测数组当中的元素是否满足指定条件
      // some会一次执行数组当中的每个元素，如果有一个满足条件，返回true，否则返回false
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        // 如果我当前输入的和所有数组中的都不相同
        if (row !== item) {
          // 让当前的等于输入的
          return row.valueName == item.valueName;
        }
      });

      console.log(isRepat);
      if (isRepat) return;

      row.flag = false;
    },
    // 自动聚焦
    toEdit(row, index) {
      row.flag = true;

      // $nextTick。当节点渲染完毕了，会执行一次
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 删除属性值
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
      //  console.log('删除了')
    },
    // 保存属性
    async addOrUpdateAttr() {
      // this.isTableShow=true;
      // 整理参数(过滤掉用户提交的空数据)
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            delete item.flag;
            return true;
          }
        }
      );
      try {
        // 发请求
        let result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        // console.log(result)
        // 保存成功之后展示平台属性
        this.isTableShow = true;
        this.$message({ type: "success", message: "保存成功" });
        // 保存成功以后需要再次获取平台属性进行展示
        this.getAttrList();
      } catch (error) {
        this.$message({ type: "danger", message: "保存失败" });
      }
    },
  },
};
</script>

<style>
</style>