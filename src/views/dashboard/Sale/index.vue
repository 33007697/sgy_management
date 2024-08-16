<template>
  <div>
    <!-- 首页中部内容 ,也是一个card卡片-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 里面是标签切换组件el-tabs  -->
        <!-- v-model="activeName" @tab-click="handleClick" -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="active"></el-tab-pane>
        </el-tabs>
        <div class="right">
          <span @click="setDate(0)">本日</span>
          <span @click="setDate(1)">本周</span>
          <span @click="setDate(2)">本月</span>
          <span @click="setDate(3)">本年</span>
          <!--日期组件 v-model="value1" -->
          <!-- 绑定时间，value-format是设置获取值的格式，其值是日期格式 -->
          <el-date-picker
            size="mini"
            v-model="dateValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <!-- 图表和排行榜 -->
      <el-row :gutter="10" class="myrow">
        <el-col :span="18">
          <!-- 准备一个图表的容器 -->
          <div class="charts" ref="chart"></div>
        </el-col>
        <el-col :span="6">
          <h4 class="title">{{ title }}排行榜</h4>
          <!-- ul列表 -->
          <ul class="myul">
            <li v-for="(item,index) in rank" :key="index">
              <span :class="item.no < 4 ? 'spanOne':'spanFour'">{{ item.no }}</span>
              <span class="spanThree">{{ item.name }}</span>
              <span class="spanTwo">{{item.money}}</span>
            </li>
   
          </ul>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
// 引入日期库dayjs
import dayjs from "dayjs";
// 获取vuex中的数据
import { mapState } from "vuex";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      //   用于保存Echarts实例对象
      chart: null,
      //   用于保存收集到的日期时间,其值是数组
      dateValue: [],
      // 列表展示
      rank:[]
    };
  },
  mounted() {
    // 初始化图表echarts
    this.chart = echarts.init(this.$refs.chart);
    // 配置chart图表
    this.chart.setOption({
      title: {
        text: "销售额",
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
          data: [],
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
          data: [],
          color: "yellowgreen",
        },
      ],
    });
  },
  //   计算出tabs标签切换后的名称
  computed: {
    title() {
      // 计算出当前标签是销售额还是访问量
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    // 计算出vuex中的数据
    ...mapState({
      list: (state) => state.home.list,
    }),
  },
  //   监视title的改变，一但title改变了，则重新配置chart图表的title的值
  watch: {
    title() {
      // 一旦title的值改变了，则重新配置chart图表的title
      // 修改了什么值，就用修改后的值，没有修改的则使用原来的值
      this.chart.setOption({
        // 这里只是修改title的值，传入title配置项即可
        title: {
          text: this.title,
        },
        // 还需要修改动态的数据
        xAxis: {
          data:
            this.title == "销售额"
              ? this.list.orderFullYearAxis
              : this.list.userFullYearAxis,
        },
        // 动态系列中数据
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.title == '销售额'? this.list.orderFullYear:this.list.userFullYear,
            color: "yellowgreen",
          },
        ],
      });
      // 还需要修改rank数据
      this.rank = this.title =='销售额'? this.list.orderRank:this.list.userRank
    },
    // 监视list，但list有数据，就执行
    list(){
      // 配置chart图表
    this.chart.setOption({
      title: {
        text: "销售额",
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
          data: this.list.orderFullYearAxis,
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
          data: this.list.orderFullYear,
          color: "yellowgreen",
        },
      ],
    });
    // 将rank数据保存
    this.rank = this.list.orderRank
    },

  },
  methods: {
    // 设置日期，需要使用到第三方库dayjs
    setDate(num) {
      // 使用switch循环判断num的值
      switch (num) {
        case 0:
          // 获取当日的日期
          // 获取当前的日期,并格式化
          let day = dayjs().format("YYYY-MM-DD");
          // 将当前的日期赋予到data中
          this.dateValue = [day, day];
          break;
        case 1:
          // 获取本周日期
          let start = dayjs().day(1).format("YYYY-MM-DD");
          let end = dayjs().day(7).format("YYYY-MM-DD");
          // 将数据更新到data中
          this.dateValue = [start, end];
          break;
        case 2:
          // 获取本月日期
          let startMonth = dayjs().startOf("month").format("YYYY-MM-DD");
          let endMonth = dayjs().endOf("month").format("YYYY-MM-DD");
          // 更新数据到data中
          this.dateValue = [startMonth, endMonth];
          break;
        default:
          // 获取本年日期
          let startYear = dayjs().startOf("year").format("YYYY-MM-DD");
          let endYear = dayjs().endOf("year").format("YYYY-MM-DD");
          // 更新数据
          this.dateValue = [startYear, endYear];
          break;
      }
    },
  },
};
</script>

<style>
.box-card {
  margin: 10px 0;
}
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.el-date-editor--daterange.el-input__inner {
  width: 300px;
}
.el-tabs {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.right span {
  margin: 10px 20px;
}
.charts {
  width: 100%;
  height: 300px;
}
.title {
  padding: 0;
  margin: 0;
}
.myrow .el-col-6 {
  height: 300px;
}
.myul {
  height: 80%;
  padding: 0;
  list-style: none;
}
.myul li {
  height: 14.2%;
}
.myul .spanOne {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  color: white;
  text-align: center;
  line-height: 20px;
}
.myul .spanTwo {
  float: right;
}
.myul .spanThree {
  margin: 0 20px;
}
.myul .spanFour {
  float: left;
  width: 20px;
  height: 20xp;
  line-height: 20px;
  text-align: center;
}
</style>