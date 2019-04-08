<template>
  <div class="droplist" :style="{width:`${width}px`}">
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
  props:['width']
}
</script>

<style lang='scss'>
.droplist {
    position: absolute;
    width: 280px;
    height: 370px;
    overflow:auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 2px rgba(0,0,0,0.5);
    background: #FAFAFA;
    z-index: 200;
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 10px;
        background: rgba(236,236,236,1);
        &:hover {
          background: #CFCFD1;
        }
    }
    &::-webkit-scrollbar-track {
        border-right:1px solid rgba(100,100,100,.2);
        background: rgba(188,188,188,.1);
    }
}
</style>