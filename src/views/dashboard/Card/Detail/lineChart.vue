<template>
    <!-- 图表容器 -->
  <div ref="chart" style="width: 100%;height: 100%;"></div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
export default {
    name:'lineChart',
    mounted(){
        // 初始化echarts实例对象
        let chart = echarts.init(this.$refs.chart)
        // 设置图表chart的配置项
        chart.setOption({
          // X轴配置
          xAxis:{
            // 隐藏x轴
            show:false,
            type:'category',
          },
          // 显示提示信息
          tooltip:{},
          // 网格布局
          grid:{
            left:0,
            right:0,
            top:0,
            bottom:0
          },
          // Y轴配置
          yAxis:{
            // 隐藏Y轴
            show:false
          },
          // 系列配置
          series:[
            {
              // 折线图
              type:'line',
              data:[12,21,33,16,26,34,37,22,11,10,40],

              // 折线拐点的样式
              itemStyle:{
                // 拐点的透明度
                opacity:0
              },
              // 折线的样式
              lineStyle:{
                color:'purple'
              },
              // 折线填充颜色，要渐变色
              areaStyle:{
                color:{
                  type:'linear',
                  x:0,
                  y:0,
                  x2:0,
                  y2:1,
                  colorStops:[
                    {
                      offset:0,
                      color:'purple',  //百分之0处的颜色
                    },
                    {
                      offset:1,
                      color:'#fff',  //百分之百处的颜色
                    }
                  ],
                  global:false,   //缺省为false
                }
              }
            }
          ]
        })
    }
}
</script>

<style>

</style>