<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <SNUnit v-bind:sndata="sndata"
            v-bind:status="snstatus"
            v-on:snunitmsg="onNewSNUnitMsg"/>
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
      sessions: ["54","55","56","58"],
      client: "Periseo",
      batchno: "42",
      projectcode: "14513 (Marce Controller)",
      sndata: {},
      snstatus: {}
    }
  },
  methods: {
    onNewSNUnitMsg: function(msgType, data){
      console.log(`Msg ${msgType} received. Data: ${JSON.stringify(data)}`)
    }
  }, 
  created: function(){
    this.sndata = {
      "sn": this.sn,
      "projectcode": this.projectcode,
      "batchno": this.batchno,
      "client": this.client,
      "sessions": this.sessions,
    }

    this.snstatus = {
      dbStatus: 3,
      repStatus: 3
    }

    setInterval(
      () => { 
        this.snstatus.dbStatus = (this.snstatus.dbStatus >= 3 ? 0 : this.snstatus.dbStatus + 1)
        this.snstatus.repStatus = (this.snstatus.repStatus <= 0 ? 3 :this.snstatus.repStatus - 1)
        //console.log(JSON.stringify(this.snstatus))
    }, 1000);
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
