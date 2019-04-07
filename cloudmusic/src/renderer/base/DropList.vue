<template>
  <div class="droplist">
      <header>
        <slot name="header"></slot>
      </header>

      <slot></slot>
      <footer>
        <slot name="footer"></slot>
      </footer>
  </div>
</template>

<script>
export default {

}
</script>

<style lang='scss'>
.droplist {
    position: absolute;
    width: 280px;
    height: 370px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 2px rgba(0,0,0,0.5);
    background: #FAFAFA;
    z-index: 200;
}
</style>