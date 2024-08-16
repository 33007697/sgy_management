<template>
  <div ref="chart" style="width: 100%;height: 100%;"></div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
export default {
    name:'PressChart',
    mounted(){
        // 初始化图表
        let chart = echarts.init(this.$refs.chart)
        // 配置图形设置
        chart.setOption({
            // X轴
            xAxis:{
                show:false,
                // 配置X轴最大值和最小值
                min:0,
                max:100,
            },
            // Y轴
            yAxis:{
                show:false,
                // 均分
                type:'category'
            },
            // 系列
            series:[
                {
                    // 柱形图
                    type:'bar',
                    data:[76],
                    // 配置柱形图的宽度
                    barWidth:10,
                    // 配置柱形图是否显示背景颜色
                    showBackground:true,
                    // 配置柱形图颜色
                    color:'yellowgreen',
                    // 设置图形上的标签
                    label:{
                        show:true,
                        // 设置图形上的文字内容
                        formatter:'|',
                        // 调整图形上的文字位置
                        position:'right'
                    }
                }
            ],
            // 网格配置
            grid:{
                top:0,
                bottom:0,
                left:0,
                right:0
            }
        })
    }
}
</script>

<style>

</style>