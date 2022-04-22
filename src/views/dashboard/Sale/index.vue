<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0px">
      <div slot="header" class="clearfix">
        <!-- 头部左侧内容 -->
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visite"></el-tab-pane>
        </el-tabs>
        <!-- 头部右侧内容 -->
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>

          <!-- 日期选择器 value-format="yyyy-MM-dd"---更改日历输出的格式  v-model="date"---收集日历的数据-->
          <el-date-picker
            v-model="date"
            class="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>

      <!-- 销售额|访问量 -->
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <div ref="charts" class="charts"></div>
          </el-col>
          <el-col :span="6">
            <div>
              <h3 style="font-size: 20px; margin: 0">{{ title }}</h3>
              <ul>
                <li>
                  <span class="rindex">1</span>
                  <span style="padding: 30px">肯德基</span>
                  <span class="rvalue">323,324</span>
                </li>
                <li>
                  <span class="rindex">2</span>
                  <span style="padding: 30px">麦当劳</span>
                  <span class="rvalue">299,132</span>
                </li>
                <li>
                  <span class="rindex">3</span>
                  <span style="padding: 30px">德克士</span>
                  <span class="rvalue">256,324</span>
                </li>
                <li>
                  <span>4</span>
                  <span style="padding: 35px">华莱士</span>
                  <span class="rvalue">216,324</span>
                </li>
                <li>
                  <span>5</span>
                  <span style="padding: 35px">西贝</span>
                  <span class="rvalue">193,324</span>
                </li>
                <li>
                  <span>6</span>
                  <span style="padding: 35px">必胜客</span>
                  <span class="rvalue">189,324</span>
                </li>
                <li>
                  <span>7</span>
                  <span style="padding: 35px">好运来</span>
                  <span class="rvalue">166,324</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
// 引入dayjs
import dayjs from "dayjs";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      myChart: null,
      //   收集日历的数据
      date: [],
    };
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.charts);
    this.myChart.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220, 22, 44, 55, 55, 566],
          color: "skyblue",
        },
      ],
    });
  },
  //   监听属性
  watch: {
    title() {
      //  重新修改图标的配置数据
      // 图表配置数据可以再次修改，如果有新的数值，用新的，如果没有，还用以前的
      this.myChart.setOption({
        title: {
          text: this.title,
        },
      });
    },
  },
  methods: {
    // 今天
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    // 本周
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      console.log(start,end)
      this.date=[start,end];
    },
    // 本月
    setMonth(){
        const start=dayjs().startOf('month').format('YYYY-MM-DD');
        const end =dayjs().endOf('month').format('YYYY-MM-DD');
        this.date=[start,end]
    },
    // 本年
    setYear(){
        const start=dayjs().startOf('year').format('YYYY-MM-DD');
        const end=dayjs().endOf('year').format('YYYY-MM-DD');
        this.date=[start,end]
    }
  },
};
</script>

<style scoped>
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 20px;
}
.right span {
  margin: 0 10px;
}
.date {
  width: 250px;
  margin: 0 40px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 10px 0;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
.rindex {
  float: left;
  width: 15px;
  height: 15px;

  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>