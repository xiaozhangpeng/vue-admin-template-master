<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts
import echarts from "echarts";
export default {
  name: "progressChart",
  mounted() {
    // 初始化echarts
    let progressChart = echarts.init(this.$refs.charts);
    // 配置数据
    progressChart.setOption({
      // x轴
      xAxis: {
        // 隐藏x轴
        show: false,
        // 最小值与最大值的设置
        min:0,
        max:100
      },
      // y轴
      yAxis: {
        // 隐藏y轴
        show: false,
        type: "category",
      },
      // 系列
      series: [
        {
          type: "bar",
          data: [78],
          color: "green",
          // 柱状图的宽度
          barWidth: 10,
          // 背景颜色设置
          showBackground: true,
          // 设置背景颜色
          backgroundStyle: {
            color: "#eee",
          },
          // 文本
        label:{
            show:true,
            // 改变文本的内容
            formatter:'|',
            // 文本标签位置的调式 
            position:'right'
        }
        },
      ],
      // 布局调式
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      // echarts的一个组件---保证没个柱状图点击显示数据
    //   tooltip: {},
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