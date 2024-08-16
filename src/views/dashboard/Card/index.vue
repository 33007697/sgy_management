<template>
  <div>
    <!-- 首页头部组件,使用el-row 和el-col 均分为4部分 -->
    <el-row :gutter="10">
        <!-- 均分为4部分，每个部分为6 -->
        <el-col :span="6">
            <!-- 每个el-col标签中都是el-card标签 -->
            <el-card>
                <Detail title="总销售额" num="￥ 12306">
                    <!-- 命名插槽chart使用 -->
                     <template slot="chart">
                        <span>周同比</span>&nbsp;<span>56.67%</span>&nbsp;
                        <svg t="1723019406718" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5443" width="16" height="16"><path d="M529.143158 7.436293l347.212925 397.874796a21.748783 21.748783 0 0 1-16.375554 36.077393h-170.66398a21.492915 21.492915 0 0 0-21.492915 18.678367c-12.793402 92.624229-90.065549 502.268955-455.95684 562.909679a21.748783 21.748783 0 0 1-17.654895-38.380206c62.687669-49.126663 144.56544-144.309572 167.593564-313.694212a1571.285609 1571.285609 0 0 0 12.793402-207.508977 22.260519 22.260519 0 0 0-21.748783-22.260519H165.298811a21.748783 21.748783 0 0 1-16.375554-36.077393L496.39205 7.436293a21.748783 21.748783 0 0 1 32.751108 0z" p-id="5444" fill="#1afa29"></path></svg>
                        &nbsp;&nbsp;
                        <span>日同比</span>&nbsp;<span>19.16%</span>&nbsp;
                        <svg t="1723019506960" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6599" width="16" height="16"><path d="M507.649902 1015.81158L160.153845 618.161453a21.75049 21.75049 0 0 1 16.376839-36.080224h187.565987a22.262266 22.262266 0 0 0 21.750489-22.262266 1630.774944 1630.774944 0 0 0-12.538517-207.525259C350.022825 182.895773 268.138628 87.705395 204.934264 38.574877A21.75049 21.75049 0 0 1 223.102321 0.447548C588.766434 60.837143 665.532868 470.514012 679.350826 563.401397a21.238713 21.238713 0 0 0 21.494601 18.679832h170.677372a21.75049 21.75049 0 0 1 16.120951 36.080224L540.403581 1015.81158a21.75049 21.75049 0 0 1-32.753679 0z" p-id="6600" fill="#d81e06"></path></svg>
                     </template>
                     <!-- 命名插槽foot的使用 -->
                      <template slot="foot">
                        <span>日销售额 ￥ 12306</span>
                      </template>
                </Detail>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card>
                <Detail title="访问量" num="88460">
                    <!-- 命名插槽foot的使用 -->
                    <template slot="foot">
                        <span>日访问量 1234</span>
                    </template>
                    <!-- 命名插槽chart的使用 -->
                     <template slot="chart">
                        <!-- 折线图表 -->
                        <LineChart></LineChart>
                     </template>
                </Detail>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card>
                <Detail title="支付笔数" num="88460">
                    <!-- 命名插槽foot的使用 -->
                    <template slot="foot">
                        <span>转化率 65%</span>
                    </template>
                    <!-- 命名插槽chart的使用 -->
                     <template slot="chart">
                        <BarChart/>
                     </template>
                </Detail>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card>
                <Detail title="运营活动效果" num="76%">
                    <!-- 命名插槽foot的使用 -->
                    <template slot="foot">
                        <span>周同比</span>&nbsp;<span>56.67%</span>&nbsp;
                        <svg t="1723019406718" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5443" width="16" height="16"><path d="M529.143158 7.436293l347.212925 397.874796a21.748783 21.748783 0 0 1-16.375554 36.077393h-170.66398a21.492915 21.492915 0 0 0-21.492915 18.678367c-12.793402 92.624229-90.065549 502.268955-455.95684 562.909679a21.748783 21.748783 0 0 1-17.654895-38.380206c62.687669-49.126663 144.56544-144.309572 167.593564-313.694212a1571.285609 1571.285609 0 0 0 12.793402-207.508977 22.260519 22.260519 0 0 0-21.748783-22.260519H165.298811a21.748783 21.748783 0 0 1-16.375554-36.077393L496.39205 7.436293a21.748783 21.748783 0 0 1 32.751108 0z" p-id="5444" fill="#1afa29"></path></svg>
                        &nbsp;&nbsp;
                        <span>日同比</span>&nbsp;<span>19.16%</span>&nbsp;
                        <svg t="1723019506960" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6599" width="16" height="16"><path d="M507.649902 1015.81158L160.153845 618.161453a21.75049 21.75049 0 0 1 16.376839-36.080224h187.565987a22.262266 22.262266 0 0 0 21.750489-22.262266 1630.774944 1630.774944 0 0 0-12.538517-207.525259C350.022825 182.895773 268.138628 87.705395 204.934264 38.574877A21.75049 21.75049 0 0 1 223.102321 0.447548C588.766434 60.837143 665.532868 470.514012 679.350826 563.401397a21.238713 21.238713 0 0 0 21.494601 18.679832h170.677372a21.75049 21.75049 0 0 1 16.120951 36.080224L540.403581 1015.81158a21.75049 21.75049 0 0 1-32.753679 0z" p-id="6600" fill="#d81e06"></path></svg>
                     </template>
                     <!-- 命名插槽chart的使用 -->
                      <template slot="chart">
                        <!-- 进度条图 -->
                        <PressChart/>
                      </template>
                </Detail>
            </el-card>
        </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入详情组件
import Detail from './Detail'
// 引入lineChart图表组件
import LineChart from './Detail/lineChart.vue'
// 引入barChart图表组件
import BarChart from './Detail/barChart.vue'
// 引入pressChart图表组件
import PressChart from './Detail/pressChart.vue'
export default {
    name:'Card',
    components:{Detail,LineChart,BarChart,PressChart}
}
</script>

<style>

</style>