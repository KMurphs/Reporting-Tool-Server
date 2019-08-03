<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <SNUnit v-bind:sndata="sndata"
            v-on:unitErased="onUnitErased"
            v-on:sessionChanged="onSessionChanged"/>
  </div>
</template>

<script>
import SNUnit from './components/SNUnit.vue';

export default {
  name: 'app',
  components: {
    SNUnit,
  },
  data: function () {
    return {
      sn: "145130002",
      sessions: ["54","55","56"],
      client: "Periseo",
      batchno: "42",
      projectcode: "14513 (Marce Controller)",
      sndata: {},
    }
  },
  methods: {
    onUnitErased: function(someSN){
      console.log(`Unit ${someSN} was erased`)
    },
    onSessionChanged: function(someSN, someSession){
      console.log(`Session for unit ${someSN} changed to ${someSession}`)
    },
  }, 
  created: function(){
    this.sndata = {
      "sn": this.sn,
      "projectcode": this.projectcode,
      "batchno": this.batchno,
      "client": this.client,
      "sessions": this.sessions,
    }
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
