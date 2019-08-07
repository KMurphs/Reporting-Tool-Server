<template>
  <div id="app">

    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->

    <div class="container container__overview">
      <div class="tracked-devices-title">
        <h1>Tracked Devices</h1>
      </div>

      <div class="container__message-when-empty" v-bind:style="'display: ' + (trackedUnits.length == 0 ? 'block' : 'none')">
        <h2>Click Here To add a device to track</h2>
        <button>Click here</button>
      </div>

      <div class="container__tracked-units" v-bind:style="'display: ' + (trackedUnits.length != 0 ? 'block' : 'none')">
        <UnitBatch v-bind:configData="configData" 
                          v-bind:configStyle="configStyle"
                          v-for="idx in [1,2,3,4,5,6,7,8,9,10]"
                          v-bind:key="idx">
        </UnitBatch>
      </div>

      <div></div>
      <div></div>
      <div></div>

      <div id="container__add-units-control" v-bind:style="'z-index: ' + (isAdding ? 0 : -1)"> ;
        <MovingInElt 
                      v-bind:isVisible="isAdding"
                      v-bind:configStyle="{
                        'height': '300px',
                        'background-color': '#eee',
                        'color': 'black'
                      }">
          <UnitSelect />
        </MovingInElt>
      </div>



    </div>  

    <div class="container container__details">
      <div class="device-details-title">
        <h1>145130001</h1>
      </div>
      <div class="unit-details-container">
        <div><span>ID</span><span>testContent</span></div>
        <div><span>Batch No</span><span>testContent</span></div>
        <div><span>Client</span><span>testContent</span></div>
        <div><span>Project Code</span><span>testContent</span></div>
        <div><span>Status</span><span>testContent</span></div>
      </div>
      <div class="unit-details-data">
        <a href="#" class="fa-long-arrow-alt-left-container" v-on:click="addUnits(true)"><i class="fas fa-long-arrow-alt-left"></i></a>
        <UnitGroupResults v-bind:configData="configDatap" 
                          v-bind:configStyle="configStyle">
        </UnitGroupResults>

        <UnitGroupResults v-bind:configData="configDataf" 
                          v-bind:configStyle="configStyle">
        </UnitGroupResults>

        <UnitGroupResults v-bind:configData="configDatap" 
                          v-bind:configStyle="configStyle">
        </UnitGroupResults>

        <UnitGroupResults v-bind:configData="configDatap" 
                          v-bind:configStyle="configStyle">
        </UnitGroupResults>


      </div>
      <!-- <div>
        <MovingInElt 
                      v-bind:isVisible="isVisible"
                      v-bind:configStyle="{
                        'height': '100px',
                        'background-color': '#eee',
                        'color': 'black'
                      }">
          <button>Click me!</button>
        </MovingInElt>
      </div> -->


    </div>  




    <a href="#" class="fa-plus-container" v-bind:style="'display: ' + (!isAdding ? 'inline-block' : 'none')" v-on:click="addUnits(true)"><i class="fas fa-plus"></i></a>
    <a href="#" class="fa-check-container" v-bind:style="'display: ' + (isAdding ? 'inline-block' : 'none')" v-on:click="addUnits(false)"><i class="fas fa-check"></i></a>
  </div>
</template>














<script>
import MovingInElt from './components/MovingInElt.vue';
import UnitGroupResults from './components/UnitGroupResults.vue';
import UnitBatch from './components/UnitBatch.vue';
import UnitSelect from './components/UnitSelect.vue';

export default {
  name: 'app',
  components: {
    MovingInElt,
    UnitGroupResults,
    UnitBatch,
    UnitSelect
  },
  data: function () {
    return {
      trackedUnits: [1],
      isAdding: false,
      isVisible: true,
      configData: {
        'sn': '145130001',
        'isPass': true,
        'data': [{
          'content': 'Ambient',
          'isPass': true,
        },{
          'content': 'Cold',
          'isPass': false,
        },{
          'content': 'Hot',
          'isPass': true,
        },{
          'content': 'Hot',
          'isPass': false,
        },]
      },
      configDatap: {
        'sn': '145130001',
        'isPass': true,
        'testgroup': 'Ambient'
      },
      configDataf: {
        'sn': '145130001',
        'isPass': false,
        'testgroup': 'Ambient'
      },
      configStyle: {
        'passPrimaryColor': 'hsl(120,45%,70%)',
        'passDarkColor': 'hsl(120,55%,35%)',
        'failPrimaryColor': 'hsl(0,45%,70%)',
        'failDarkColor': 'hsl(0,55%,35%)',
      },
    }
  },
  methods: {
    onNewSNUnitMsg: function(msgType, data){
      console.log(`Msg ${msgType} received. Data: ${JSON.stringify(data)}`)
    },
    addUnits: function(doStart){
      this.isAdding = doStart;
      console.log(this.isAdding)
      if(this.isAdding){

      }else{

      }
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
*{
  box-sizing: border-box;
  overflow: hidden;
  padding: 0;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  grid-gap: 0.5rem 0.5rem;
}




.container {
  background-color: #fafafa;
  padding: 1rem;
}
.container__overview{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  padding: 0;
}

.container__details{
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 100px 130px 1fr;
  padding: 0;
}

.tracked-devices-title
{
  flex: 0 0 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.device-details-title
{
  flex: 0 0 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}


.fa-plus,
.fa-check{
  font-size: 2rem;
  border-radius: 50%;
  padding: 1rem 1.2rem;
  font-size: 3rem;
  color: white;
  background-color: lightsteelblue;
  bottom: 1rem;
  left: calc(50% - 6rem);
  position: absolute;
}
.fa-plus-container:hover > .fa-plus,
.fa-check-container:hover > .fa-check {
  background-color: steelblue;
}
.container__message-when-empty{
  width: 90%;
  margin: 0 auto;
  padding: 1rem;
  background-color: #ccc;
  
}
.container__tracked-units{
  width: 100%;
  overflow-y: scroll;
  margin: 2rem auto; 
  border-bottom: 2px solid #ccc;
}

#container__add-units-control{
  position: fixed;
  /* z-index: -1; */
  bottom: 0;
  width: calc((100% - 0.5rem)/2);
}





.unit-details-container {
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: 1fr 1fr 1.5fr;
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
.unit-details-container span {
  display: flex;
  align-items: center;
}
.unit-details-container div:last-child {
  background-color: gray;
  grid-column: 1/3;
} 


.unit-details-data{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
}

.fa-long-arrow-alt-left{
  font-size: 2rem;
  border-radius: 3px;
  padding: 0.2rem 1.2rem;
  font-size: 3rem;
  color: white;
  background-color: lightsteelblue;
  position: relative; 
  right: calc(50% - 3rem);
}
.fa-long-arrow-alt-left-container:hover > .fa-plus{
  background-color: steelblue;
}



@media only screen and (min-width: 1200px){
  #app {
    width: 1200px;
    margin: 0 auto;
  }
  #container__add-units-control{
    width: calc((1200px - 0.5rem)/2);
  }
}
</style>
<style src="./assets/css/all.min.css" scoped>
</style>
