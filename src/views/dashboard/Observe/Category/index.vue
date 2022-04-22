<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <div class="category-header">
          <span>销售额类别占比</span>
          <el-radio-group v-model="value">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上"></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="chart" ref="chart"></div>
      <div></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "Category",
  data() {
    return {
      value: "全部",
    };
  },
  mounted() {
    let pieChart = echarts.init(this.$refs.chart);
    pieChart.setOption({
        title:{
            text:'视频',
            subtext:1048,
            left:'center',
            top:'center'
        },
      tooltip: {
        trigger: "item",
      },
  
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
        //   标签
          label: {
            show: true,
            position: "outsize",
          },
    
        //   指示数据的线
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "视频" },
            { value: 735, name: "搜索引擎" },
            { value: 580, name: "直接访问" },
            { value: 484, name: "联盟广告" },
            { value: 300, name: "邮件营销" },
          ],
        },
      ],
    });
    // 绑定事件
    pieChart.on('mouseover',(params)=>{
        // 获取鼠标移上去那条数据
        const {name,value} =params;
        // 重新设置标题
        pieChart.setOption({
            title:{
                text:name,
                subtext:value
            }
        })
    })
  },
};
</script>

<style>
.header {
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chart {
  width: 100%;
  height: 300px;
}
</style>