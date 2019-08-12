<template>
  <div id="app">

    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
        <InputAutoComplete v-bind:configData="['1','11','111']"
                           v-bind:configStyle="{
                             'placeholder': 'myplaceholder',
                           }">
        </InputAutoComplete>

    <div class="container container__overview">
      <div class="tracked-devices-title">
        <h1>Tracked Devices</h1>
      </div>

      <div class="container__message-when-empty"
            v-bind:style="'display: ' + (trackedUnits.length === 0 ? 'block' : 'none')">
        <h2>Click Here To add a device to track</h2>
        <button>Click here</button>
      </div>

      <div class="container__tracked-units"
            v-bind:style="'display: ' + (trackedUnits.length != 0 ? 'block' : 'none')">
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
        <i class="fas fa-info-circle"></i>
        <input type="text" placeholder="Enter Serial Number">
      </div>
      <div class="unit-details-container">
        <div><span>ID: </span><span>214</span></div>
        <div><span>Batch No: </span><span>2</span></div>
        <div><span>Client: </span><span>Marce</span></div>
        <div><span>Project Code: </span><span>14513 (Marce Controller)</span></div>
        <div><span>Status: </span><span>PASS</span></div>
      </div>
      <div class="unit-details-data">
        <a href="#" class="fa-long-arrow-alt-left-container" v-on:click="addUnits(true)">
          <i class="fas fa-long-arrow-alt-left"></i>
        </a>
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


    <a href="#" class="fa-plus-container"
        v-bind:style="'display: ' + (!isAdding ? 'inline-block' : 'none')"
        v-on:click="addUnits(true)"><i class="fas fa-plus"></i></a>
    <a href="#" class="fa-check-container"
        v-bind:style="'display: ' + (isAdding ? 'inline-block' : 'none')"
        v-on:click="addUnits(false)"><i class="fas fa-check"></i></a>
  </div>
</template>


<script>
// import MovingInElt from './components/MovingInElt.vue';
// import UnitGroupResults from './components/UnitGroupResults.vue';
// import UnitBatch from './components/UnitBatch.vue';
// import SNUnitSelect from './components/SNUnitSelect.vue';
import InputAutoComplete from './components/InputAutoComplete.vue';

export default {
  name: 'app',
  components: {
    // MovingInElt,
    // UnitGroupResults,
    // UnitBatch,
    // SNUnitSelect,
    InputAutoComplete,
  },
  data() {
    return {
      data: {},
      trackedUnits: [1],
      isAdding: false,
      isVisible: true,
      configData: {
        sn: '145130001',
        isPass: true,
        client: 'Periseo',
        data: [{
          content: 'Ambient',
          isPass: true,
        }, {
          content: 'Cold',
          isPass: false,
        }, {
          content: 'Hot',
          isPass: true,
        }],
      },
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
        normalClientColor: 'rgb(214, 198, 174)',
        fieldClientColor: 'rgb(214, 198, 174)',
      },
    };
  },
  methods: {
    onNewSNUnitMsg(msgType, data) {
      console.log(`Msg ${msgType} received. Data: ${JSON.stringify(data)}`);
    },
    addUnits(doStart) {
      this.isAdding = doStart;
      console.log(this.isAdding);
    },
    getData(url) {
      return new Promise((resolve) => {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
          if (this.readyState === 4 && this.status === 200) {
            resolve(JSON.parse(this.responseText));
          }
        };
        xhttp.open('GET', url, true);
        xhttp.send();
      });
    },
  },
  created() {
    this.getData('http://localhost:5001/api/v1/data/units')
      .then((res) => {
        this.data = res.data;
        console.log(this.data);
        console.log('Hello');
      });


    // setInterval(
    //   () => {
    //     this.isVisible = !this.isVisible
    // }, 2000);
  },
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

  display: none !important;
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
  grid-template-rows: 150px 130px 1fr;
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
.device-details-title input
{
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    padding: 0.5rem;
    border: 0;
    border-bottom: 1px solid #949494;
    background-color: rgba(0,0,0,0);
    color: gray;
}
.device-details-title input::placeholder{
    color: rgb(211, 211, 211);
}
.device-details-title input:focus{
    outline: 0;
    border-bottom: 2px solid gray;
}
.device-details-title{
    display: flex;
    align-items: center;
}
.device-details-title .fas{
    font-size: 1.5rem;
  font-weight: bold;
}


.fa-plus,
.fa-check{
  font-size: 2rem;
  border-radius: 50%;
  padding: 1rem 1.2rem;
  font-size: 3rem;
  color: white;
  background-color: #676b95;
  bottom: 1rem;
  left: calc(50% - 6rem);
  position: absolute;
}
.fa-plus-container:hover > .fa-plus,
.fa-check-container:hover > .fa-check {
  background-color: #454c95;
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
  grid-gap: 0.5rem 2rem;
}
.unit-details-container div {
  display: grid;
  grid-template-columns: 100px auto;
  grid-gap: 0.5rem 0.5rem;
  padding: 0.5rem 0.5rem;
  text-align: left;
  border-bottom: 1px solid #676b95;;
}
.unit-details-container span {
  display: flex;
  align-items: center;
}
.unit-details-container span:last-child {
  justify-content: center;
}

.unit-details-container div:last-child {
  background-color: gray;
  color: white;
  background-color: hsl(120,55%,35%);
  grid-column: 1/3;
}
.unit-details-container div:last-child span:last-child{
  justify-content: flex-start;
  padding-left: 35%;
}


.unit-details-data{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
}
.unit-details-data > a{
  align-self: flex-start;
}

.fa-long-arrow-alt-left{
  font-size: 2rem;
  border-radius: 3px;
  padding: 0.2rem 1.2rem;
  font-size: 3rem;
  color: white;
  background-color: #676b95;
  position: relative;
  right: calc(50% - 3rem);
}
.fa-long-arrow-alt-left-container:hover > .fa-long-arrow-alt-left{
  background-color: #454c95;
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
