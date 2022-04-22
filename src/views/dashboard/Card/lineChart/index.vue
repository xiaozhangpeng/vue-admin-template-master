<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts
import echarts from "echarts";
export default {
  name: "lineChart",
  mounted() {
    // 初始化echarts
    let lineChart = echarts.init(this.$refs.charts);
    // 配置数据
    lineChart.setOption({
      // x轴
      xAxis: {
        // 隐藏x轴
        show: false,
        type: "category",
      },
      // y轴
      yAxis: {
        // 隐藏y轴
        show: false,
      },
      // 系列
      series: [
        {
          type: "line",
          data: [99,33,22,66,44,55,33,22,88,9],
          //拐点的样式设置
          itemStyle: {
            opacity: 0,
          },
          //线条的样式
          lineStyle: {
            color: "purple",
          },
          // 填充样式的颜色
          areaStyle: {
            color: "purple",
          },
        },
      ],
      // 布局调式
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>