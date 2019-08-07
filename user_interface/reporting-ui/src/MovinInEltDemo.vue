<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">

    <MovingInElt v-bind:isVisible="isVisible"
                  v-bind:configStyle="{
                    'height': '100px',
                    'background-color': '#eee',
                    'color': 'black'
                  }">
      <button>Click me!</button>
    </MovingInElt>

  </div>
</template>

<script>
import MovingInElt from './components/MovingInElt.vue';

export default {
  name: 'app',
  components: {
    MovingInElt,
  },
  data: function () {
    return {
      isVisible: true
    }
  },
  methods: {
    onNewSNUnitMsg: function(msgType, data){
      console.log(`Msg ${msgType} received. Data: ${JSON.stringify(data)}`)
    }
  }, 
  created: function(){

    setInterval(
      () => { 
        this.isVisible = !this.isVisible
    }, 2000);
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
