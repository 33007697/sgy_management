<template>
  <el-card>
    <div slot="header" class="header">
      <div class="search-header">
        <span>销售额类别占比</span>
        <!--单选框 -->
        <el-radio-group v-model="value" size="mini">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <!-- 饼图 -->
      <div class="chart" ref="chart"></div>
    </div>
  </el-card>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
export default {
  name: "Search",
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    // 初始化图表
    let chart = echarts.init(this.$refs.chart);
    // 配置图表
    chart.setOption({
      title:{
        text:"视频广告",
        subtext:300,
        // 调整标题位置,为图表中间
        top:'center',
        left:'center'
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            // 标签在图表外侧
            position: "outside",
          },
          //标签与图表连接线
          labelLine: {
            show: true,
          },
          data: [
            { value: 300, name: "视频广告" },
            { value: 1048, name: "搜索引擎" },
            { value: 580, name: "邮件营销" },
            { value: 484, name: "联盟广告" },
            { value: 735, name: "直销访问" },
          ],
        },
      ],
    });
    // 图表可以绑定事件，通过echarts的on方法，其需要传入两个参数，一个是事件名称，一个是回调函数
    // 其回调函数会接收到一个参数，就是当前echarts图表的信息
    // 图表的鼠标移动事件
    chart.on('mouseover',(params)=>{
      // 从参数params中解构出需要的数据
      const {name,value} = params.data
      // 重新设置图表的标题
      chart.setOption({
        // 图表的标题
        title:{
          text:name,
          subtext:value
        }
      })
    })
  },
};
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.chart{
  width: 100%;
  height: 300px;
}
</style>