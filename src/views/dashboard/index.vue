<template>
  <div class="dashboard-container">
    <!-- 首页头部组件 -->
    <Card/>
    <!-- 首页中部组件 -->
     <Sale/>
     <!-- 首页底部组件 -->
      <Footer></Footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 引入首页头部组件
import Card from './Card'
// 引入首页中部组件
import Sale from './Sale'
// 引入首页底部组件
import Footer from './Footer'

export default {
  name: 'Dashboard',
  components:{Card,Sale,Footer},
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted(){
    // 派发action，获取数据
    this.$store.dispatch('getData')
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    
  }
}
</style>
