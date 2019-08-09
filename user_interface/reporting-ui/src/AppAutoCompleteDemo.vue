<template>
  <div id="app">

    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
        <InputAutoComplete v-bind:configData="someData" 
                           v-bind:configStyle="{
                              'placeholder': 'myplaceholder',              
                              'font-size': '2rem',
                              'font-weight': 'bold',
                              'text-align': 'center',
                              'padding': '0.5rem',
                              'border': '0',
                              'border-bottom': '1px solid #949494',
                              'background-color': 'rgba(0,0,0,0)',
                              'color': 'gray',
                              'placeholder-color': 'rgb(211, 211, 211)',
                              'focus-outline': '0',
                              'focus-border-bottom': '2px solid gray;',
                           }"
                           style="width: 50%">
        </InputAutoComplete>

        <input type="text" placeholder="placeholder">
</div>
</template>




<script>
import MovingInElt from './components/MovingInElt.vue';
import UnitGroupResults from './components/UnitGroupResults.vue';
import UnitBatch from './components/UnitBatch.vue';
import UnitSelect from './components/UnitSelect.vue';
import InputAutoComplete from './components/InputAutoComplete.vue';

export default {
  name: 'app',
  components: {
    MovingInElt,
    UnitGroupResults,
    UnitBatch,
    UnitSelect,
    InputAutoComplete
  },
  data: function () {
    return {
      data: {},
      someData: [],
      trackedUnits: [1],
      isAdding: false,
      isVisible: true,
      configData: {
        'sn': '145130001',
        'isPass': true,
        'client': 'Periseo',
        'data': [{
          'content': 'Ambient',
          'isPass': true,
        },{
          'content': 'Cold',
          'isPass': false,
        },{
          'content': 'Hot',
          'isPass': true,
        }]
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
        'normalClientColor': 'rgb(214, 198, 174)',
        'fieldClientColor': 'rgb(214, 198, 174)',
      },
    }
  },
  methods: {
  }, 
  created: function(){
    setInterval(
      () => { 
        this.someData.push(this.someData.length + '')
        console.log(this.someData)
    }, 2000);
  }
};
</script>
















<style>
</style>
<style src="./assets/css/all.min.css" scoped>
</style>
