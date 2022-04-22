<template>
  <div>
    <!-- inline:代表是是行内表单，可以放置多个 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <!-- labe是标签名称 value收集的是标签id并传值给cForm.category1Id  -->
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in list1"
            :key="c1.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  // 父组件向子组件传值---用来决定三级联动是否显示
  props: ["show"],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      // 收集相应的一级，二级，三级id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  //  当组件挂载完毕，向服务器发送请求，获取相应的一级分类的数据
  mounted() {
    this.getCategory1List();
  },
  methods: {
    // 请求一级分类的数据
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      // console.log(result)
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    // 一级分类的select事件回调（当一级分类的option发生变化的时候获取相应二级分类的数据）
    async handler1() {
      (this.list2 = []), (this.list3 = []), (this.cForm.category2Id = "");
      this.cForm.category3Id = "";
      // 解构出一级分类的id
      const { category1Id } = this.cForm;
      // 子组件向父组件传递数据---$emit
      this.$emit("getCategoryId", { categoryId: category1Id, level: 1 });
      // 通过一级分类的id，获取二级分类的数据
      let result = await this.$API.attr.reqCategory2List(category1Id);
      // console.log(result)
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    // 二级分类的select事件回调（当二级分类的option发生变化的时候获取相应的二级分类的数据）
    async handler2() {
      (this.list3 = []), (this.cForm.category3Id = "");
      const { category2Id } = this.cForm;
      // 子组件向父组件传递数据---$emit
      this.$emit("getCategoryId", { categoryId: category2Id, level: 2 });
      let result = await this.$API.attr.reqCategory3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    handler3() {
      // 子组件向父组件传递数据---$emit
      const { category3Id } = this.cForm;
      this.$emit("getCategoryId", { categoryId: category3Id, level: 3 });
    },
  },
};
</script>

<style>
</style>