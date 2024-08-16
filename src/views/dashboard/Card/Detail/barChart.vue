<template>
  <div style="width: 100%;height: 100%;" ref="chart"></div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
export default {
    name:'barChart',
    mounted(){
        // 初始化echarts 
        let chart = echarts.init(this.$refs.chart)
        // 配置chart图表
        chart.setOption({
            xAxis:{
              show:false,
              // 均分
              type:'category'
            },
            yAxis:{
              show:false
            },
            series:[{
              // 柱形图
              type:'bar',
              data:[32,43,67,6,22,17,39,64,10]
            }],
            // 网格布局
            grid:{
              top:0,
              bottom:0,
              left:0,
              right:0
            },
            // 显示提示信息
            tooltip:{}
        })
    }
}
</script>

<style>

</style>