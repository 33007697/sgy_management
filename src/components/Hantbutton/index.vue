<template>
  <!-- 使用a标签，不使用div，因为使用div之后这个按钮组件会自己占用一行，而使用a标签就是行内组件 -->
  <a :title="title">
    <!-- 使用el-button组件 -->
    <!-- 使用v-bind绑定其父组件传递给其的所有除props之外的属性，使用v-on绑定其父组件传递给其的所有事件 -->
    <el-button v-bind="$attrs" v-on="$listeners" style="margin-right: 10px;"></el-button>
  </a>
</template>

<script>
export default {
  name: "HantButton",
  props: ["title"],
};
</script>

<style>
</style>