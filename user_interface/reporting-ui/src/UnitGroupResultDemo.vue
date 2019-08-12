<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div class="container">
      <div><h1>145130001</h1></div>
      <div class="unit-details-container">
        <div><span>ID</span><span>testContent</span></div>
        <div><span>Batch No</span><span>testContent</span></div>
        <div><span>Client</span><span>testContent</span></div>
        <div><span>Project Code</span><span>testContent</span></div>
        <div><span>Status</span><span>testContent</span></div>
      </div>
      <div>
        <UnitGroupResults v-bind:configData="configDatap"
                          v-bind:configStyle="configStyle">
        </UnitGroupResults>

        <UnitGroupResults v-bind:configData="configDataf"
                          v-bind:configStyle="configStyle">
        </UnitGroupResults>

        <UnitGroupResults v-bind:configData="configDatap"
                          v-bind:configStyle="configStyle">
        </UnitGroupResults>


      </div>


    </div>


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
import UnitGroupResults from './components/UnitGroupResults.vue';

export default {
  name: 'app',
  components: {
    MovingInElt,
    UnitGroupResults,
  },
  data() {
    return {
      isVisible: true,
      configDatap: {
        sn: '145130001',
        isPass: true,
        testgroup: 'Ambient',
      },
      configDataf: {
        sn: '145130001',
        isPass: false,
        testgroup: 'Ambient',
      },
      configStyle: {
        passPrimaryColor: 'hsl(120,45%,70%)',
        passDarkColor: 'hsl(120,55%,35%)',
        failPrimaryColor: 'hsl(0,45%,70%)',
        failDarkColor: 'hsl(0,55%,35%)',
      },
    };
  },
  methods: {
    onNewSNUnitMsg(msgType, data) {
      console.log(`Msg ${msgType} received. Data: ${JSON.stringify(data)}`);
    },
  },
  created() {
    setInterval(
      () => {
        this.isVisible = !this.isVisible;
      }, 2000,
    );
  },
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


.container {
  display: grid;
  grid-template-rows: 100px 200px auto;
  grid-template-columns: auto;
  height: 100vh;
  background-color: blue;
}
.container > div {
  margin-top: 1rem;
}


.unit-details-container {
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 0.5rem 0.5rem;
}
.unit-details-container div {
  display: grid;
  grid-template-columns: 100px auto;
  grid-gap: 0.5rem 0.5rem;
  background-color: orange;
  padding: 0.5rem 0.5rem;
  text-align: left;
}
.unit-details-container div:last-child {
  background-color: gray;
}
</style>
