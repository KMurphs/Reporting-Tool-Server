<template>
    <div class="moving-in-container"
         v-bind:class="{ visible: isVisible }"
         v-bind:style="configStyle">

        <slot></slot>

    </div>
</template>

<script>
export default {
  name: 'MovingInElt',

  props: {
    isVisible: Boolean,
    configStyle: Object,
  },
  data() {
    return {
      someData: true,
    };
  },
  created() {
  },
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.moving-in-container{
    position: absolute;
    opacity: 0;
    left: 100vw;
    transition: all .6s;
    /* display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; */
}
.visible{
    opacity: 1;
    left: 0;
}
</style>
