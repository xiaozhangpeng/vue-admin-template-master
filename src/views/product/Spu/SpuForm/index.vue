<template>
  <div>
     
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <!-- v-model相当于将标签内的信息收集到spu对象内部，再点击添加的时候直接提交给服务器 -->
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in TradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          v-model="spu.description"
          placeholder="SPU描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU照片">
        <!-- 上传图片: action图片上传的地址: list-type:文件列表的类型 on-preview：
          图片预览的时候触发 on-remove:删除图片的时候触发 file-list:上传的文件列表(注意参数必须是name和url,需要转换)
          on-success:图片上传成功的回调 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}个未选择`"  v-model="attrIdAndAttrName">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect,index) in unSelectSaleAttr" :key="unselect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80px">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性名称列表" width="width">
            <template slot-scope="{ row, $index }">
                <!-- el-tag用于展示已有的属性值 -->
              <el-tag
                :key="tag.id"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 底下的解构可以堪称当年的span和input的切换 "   -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                 @blur="handleInputConfirm(row)"
                 @keyup.enter.native="handleInputConfirm(row)"
              >
              </el-input>
              <!-- @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button type="info" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // spu属性初始化的时候是一个空对象，在修改SPU的时候，会向服务器发请求，返回SPU信息
      // 添加spu,如果添加SPU的时候没有向服务器发请求，需要将数据收集在spu的每个字段里
      spu: {
        // 三级分类的id
        category3Id: 0,
        //spu的名称
        spuName: "",
        //商品描述
        description: "",
        // 品牌的id
        tmId:'',
        // spu图片地址
        spuImageList: [
          {
            id: 0,
            imgName: "",
            imgUrl: "",
            spuId: 0,
          },
        ],
        //  商品属性与属性值
        spuSaleAttrList: [
        
        ],
      }, //Spu信息数据
      TradeMarkList: [], //品牌信息的数据
      spuImageList: [], //spu图片的数据
      saleAttrList: [], //平台全部的销售属性
      attrIdAndAttrName:"",//收集未选择的销售属性的Id和name
    };
  },
  computed: {
    //    计算出还未选择的销售属性
    unSelectSaleAttr() {
        // 数组的过滤方法，可以从已有的数组当中过滤用户需要的元素，并返回一个新的数组
       let result= this.saleAttrList.filter(item=>{
            return this.spu.spuSaleAttrList.every(item1=>{
                // every数组的方法：会返回一个布尔值【真|假】
                return item.name!=item1.saleAttrName;

            })
        })
        return result;
     
    },
  },
  methods: {
    // 子组件初始化数据
    async initSpuData(spu) {
      //   获取Spu信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }

      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.TradeMarkList = tradeMarkResult.data;
      }

      // 获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        //   需要把服务器返回的数据机型修改
        // 因为图片显示图片的数据需要是数组，数组里面的元素必须是name和url名称字段
        let listArr = spuImageResult.data;
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        // 把整理好的数据赋值给spuImageList
        this.spuImageList = listArr;
      }

      //   获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //  删除图片
    handleRemove(file, fileList) {
        // file：代表删除的那张图片
        // fileList:照片墙删除某一张图片后，剩余的其他图片
        //  console.log(fileList)
        // 收集照片墙的数据(对于服务器而言，不需要强调name和url，所以在后面需要处理)
        this.spuImageList=fileList
     
    },
    // 照片墙预览放大
    handlePictureCardPreview(file) {

      this.dialogImageUrl = file.url;

      this.dialogVisible = true;
    },
    // 图片上传成功回调
    handlerSuccess(){
            // 收集图片的信息
            this.spuImageList=fileList;
    },
    // 添加属性
    addSaleAttr(){
        // 把收集到的销售属性数据进行分割
        const [baseSaleAttrId,saleAttrName] =this.attrIdAndAttrName.split(':');
        // 向SPU对象的spuSaleAttrList属性里面添加新的属性
        let newSaleAttr={baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]};
        // 添加新的销售属性
        this.spu.spuSaleAttrList.push(newSaleAttr)
        // 清空下拉框数据
        this.attrIdAndAttrName='';

    },
    // 点击添加按钮的回调
    addSaleAttrValue(row){
        // 将inputVisible变为响应式数据----控制着button与input的切换
        this.$set(row,'inputVisible',true)
        // 通过响应式数据inputValue字段收集新增的销售属性值
        this.$set(row,'inputValue','')
    },
    //el-input失去焦点的事件
    handleInputConfirm(row){

    // 解构出销售属性当中收集的数据
    const {baseSaleAttrId,inputValue}=row;
    // 新增的销售属性值不能为空
    if(inputValue.trim()=='')
    {
        this.$message('属性值不能为空')
    }
    // 属性值不能重复，也可以用some
    let result =row.spuSaleAttrValueList.every(item=> item.saleAttrValueName!=inputValue)
    if(!result) return;
    // 新增的属性值
    let newSaleAttrValue={baseSaleAttrId,saleAttrValueName:inputValue}
    // 新增
    row.spuSaleAttrValueList.push(newSaleAttrValue)
    // 失去焦点后，修改inputVisible为false，从而隐藏button
        row.inputVisible=false;
    },
    // 保存按钮的回调
    async addOrUpdateSpu(){
        // 整理参数:需要整理照片墙的数据
        // 携带参数：对于图片，需要携带imageName与imageUrl字段
      this.spu.spuImageList=this.spuImageList.map(item=>{
            return{
                imageName:item.name,
                imageUrl:(item.response&&item.response.data)||item.url
            }
        });
        // 发请求
      let result=  await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if(result.code==200)
      {
        // 提示
        this.$message({type:'success',message:'保存成功'})
        // 点击后重回scene=0;
        this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'})
      }
          //   清除数据
      Object.assign(this._data,this.$options.data())

    },
    // 点击添加SPU按钮的时候,发请求的函数
    async addSpuData(category3Id){

        // 添加SPU的时候收集三级分类的id
        this.spu.category3Id=category3Id;
       

      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.TradeMarkList = tradeMarkResult.data;
      }
        //   获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }


    },
    // 取消按钮
    cancel(){
        this.$emit('changeScene',0);

        // 清理数据
        // Object.assign是Es6中新增的方法可以合并对象
        // 组件实例this._data可以操作data当中的响应式数据
        // this.$options可以获取配置对象,配置对象的data函数执行,返回的响应式数据为空的
        Object.assign(this._data,this.$options.data())
    }  
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>