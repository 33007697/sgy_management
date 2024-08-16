<template>
  <div>
    <!-- detail详情组件，即每个组件中的样式 -->
     <div class="one">
        <span>{{ title }}</span>
        <span><svg t="1723018558656" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4242" width="20" height="20"><path d="M480 437.344h64v309.312h-64v-245.312h-64v-64h64zM512 288a53.344 53.344 0 1 1 0 106.656A53.344 53.344 0 0 1 512 288z m0-224c246.4 0 448 201.6 448 448s-201.6 448-448 448S64 758.4 64 512 265.6 64 512 64z m0 69.824C304.16 133.824 133.824 304.16 133.824 512c0 207.84 170.336 378.176 378.176 378.176 207.84 0 378.176-170.336 378.176-378.176 0-207.84-170.336-378.176-378.176-378.176z" fill="#333333" p-id="4243"></path></svg></span>
     </div>
     <div class="two">
        <span>{{ num }}</span>
     </div>
     <div class="three">
        <!-- 使用命名插槽 -->
         <slot name="chart"></slot>
     </div>
     <div class="four">
        <!-- 使用插槽 -->
         <slot name="foot"></slot>
     </div>
  </div>
</template>

<script>
export default {
    name:'Detail',
    props:['title','num']
}
</script>

<style scoped>
/* 样式 */
.one{
    display: flex;
    justify-content: space-between;
}
.two{
    font-size: 24px;
    padding: 10px 0;
}
/* 图表插槽 */
.three{
    width: 100%;
    height: 50px;
}
.four{
    border-top: 1px solid #eee;
    height: 30px;
    line-height: 30px;
    padding-top: 10px;
}
</style>