<template>
  <div id="app">

    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
        <InputAutoComplete v-bind:configData="['1','11','111']"
                           v-bind:configStyle="{
                             'placeholder': 'myplaceholder',
                           }">
        </InputAutoComplete>
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
</style>
<style src="./assets/css/all.min.css" scoped>
</style>
