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
        <i class="fas fa-info-circle"></i>
        <!-- <input type="text" placeholder="Enter Serial Number"> -->
        <InputAutoComplete v-on:msg="onSNSelected"
                           v-bind:configData="sns" 
                           v-bind:configStyle="{
                              'placeholder': 'Enter Serial Number',              
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
                           }">
        </InputAutoComplete>
      </div>
      <div class="unit-details-container">
        <div><span>ID: </span><span>{{currentUnit.TestSum_ID}}</span></div>
        <div><span>Batch No: </span><span>{{currentUnit.Batch_ID}}</span></div>
        <div><span>Client: </span><span>{{currentUnit.Client_Name}}</span></div>
        <div><span>Project Code: </span><span>{{currentUnit.Project_Code != '' ? currentUnit.Project_Code + ' (' + currentUnit.Product_Description + ')' : ''}}</span></div>
        <div v-bind:class="{'status-pass': (currentUnit.Final_Pass_Fail != 'FAIL'),
                            'status-fail': (currentUnit.Final_Pass_Fail == 'FAIL') }">
          <span>Status: </span><span>{{currentUnit.Final_Pass_Fail}}</span>
        </div>
      </div>
      <div class="unit-details-data">
        <a href="#" class="fa-long-arrow-alt-left-container" v-on:click="previousDetails()"><i class="fas fa-long-arrow-alt-left"></i></a>

        <MovingInElt 
                      v-bind:isVisible="groupData.currentView == 1"
                      v-bind:configStyle="configStyleCont">
          <UnitGroupResults v-for="(item, index) in groupData.batchResults"
                            v-on:msg="onGroupResultsSelected"
                            v-bind:key="index"
                            v-bind:name="'batchResults'"
                            v-bind:configData="item" 
                            v-bind:configStyle="configStyle">
          </UnitGroupResults>
        </MovingInElt>
        <MovingInElt 
                      v-bind:isVisible="groupData.currentView == 2"
                      v-bind:configStyle="configStyleCont">
          <UnitGroupResults v-for="(item, index) in groupData.summaryGroups"
                            v-on:msg="onGroupResultsSelected"
                            v-bind:key="index"
                            v-bind:name="'summaryGroups'"
                            v-bind:configData="item" 
                            v-bind:configStyle="configStyle">
          </UnitGroupResults>
        </MovingInElt>
        <MovingInElt 
                      v-bind:isVisible="groupData.currentView == 3"
                      v-bind:configStyle="configStyleCont">
          <UnitGroupResults v-for="(item, index) in groupData.summaryItems"
                            v-on:msg="onGroupResultsSelected"
                            v-bind:key="index"
                            v-bind:name="'summaryItems'"
                            v-bind:configData="item" 
                            v-bind:configStyle="configStyle">
          </UnitGroupResults>
        </MovingInElt>
        <MovingInElt 
                      v-bind:isVisible="groupData.currentView == 4"
                      v-bind:configStyle="configStyleCont">
          <UnitGroupResults v-for="(item, index) in groupData.detailedResults"
                            v-on:msg="onGroupResultsSelected"
                            v-bind:key="index"
                            v-bind:name="'detailedResults'"
                            v-bind:configData="item" 
                            v-bind:configStyle="configStyle">
          </UnitGroupResults>
        </MovingInElt>
        <MovingInElt 
                      v-bind:isVisible="groupData.currentView == 5"
                      v-bind:configStyle="configStyleCont">
          <UnitGroupResults v-for="(item, index) in groupData.resultSet"
                            v-on:msg="onGroupResultsSelected"
                            v-bind:key="index"
                            v-bind:name="'resultSet'"
                            v-bind:configData="item" 
                            v-bind:configStyle="configStyle">
          </UnitGroupResults>
        </MovingInElt>
      </div>
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
      historyResults: {},
      batchResults: {},
      sns: [],
      currentUnit: {
        Project_Code: '',
        Product_Description: '',
      },
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
      groupData: {
        currentView: 1,
        batchResults: [],
        summaryGroups: [],
        summaryItems: [],
        detailedResults: [],
        selectionHistory: [],
        resultSet: {},
      },
      configStyle: {
        'passPrimaryColor': 'hsl(120,45%,70%)',
        'passDarkColor': 'hsl(120,55%,35%)',
        'failPrimaryColor': 'hsl(0,45%,70%)',
        'failDarkColor': 'hsl(0,55%,35%)',
        'normalClientColor': 'rgb(214, 198, 174)',
        'fieldClientColor': 'rgb(214, 198, 174)',
      },
      configStyleCont: {
        'height': 'calc(100% - 4rem)',
        'background-color': 'rgba(0,0,0,0)',
        'width': '100%',
        'margin-top': '4rem',
        'overflow-y': 'scroll',
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
    },

    onSNSelected: function(msgType, data){
      if(msgType == 'snselected'){
  
        let temp = [];
        for(const key in this.historyResults){
          if(this.historyResults[key].Serial_Number == data){
            temp.push(key)
          }
        }
        this.updateDetailsPage(temp[0]);
      }
    },
    updateDetailsPage: function(unitID){ 
      

      this.currentUnit = this.batchResults[unitID]

      this.getData("http://localhost:5001/api/v1/data/unitsummary/" + this.currentUnit.Serial_Number)
      .then((res)=>{ 
        this.currentUnit['summary'] = res.data[unitID];

        let instances = '';
        for(const key in this.currentUnit['summary']){
          instances += ',' + key.split(':: ')[1];
        }
        
        this.getData("http://localhost:5001/api/v1/data/unitresults/" + this.currentUnit.Serial_Number + "/?inst=" + instances.substr(1))
        .then((res)=>{ this.currentUnit['results'] = res.data[unitID] }); 
      }); 

      this.currentUnit['Product_Description'] = this.historyResults[unitID].Product_Description;
      this.currentUnit['Project_Code'] = this.historyResults[unitID].Project_Code;
      this.currentUnit['Batch_ID'] = this.historyResults[unitID].Batch_ID;

      this.groupData['batchResults'] = []
      for(const item of ['Ambient','Cold','Hot']){
        this.groupData['batchResults'].push({
          'sn': this.currentUnit.Serial_Number,
          'isPass': this.currentUnit[item] != 'FAIL',
          'testgroup': item
        })
      }
      this.groupData.currentView = 1;
    },
    onGroupResultsSelected: function(container, data){
      if(container == 'batchResults'){
        this.groupData.summaryGroups = this.setupSummaryGroups(this.currentUnit, 'summary', 1, data)
        this.groupData.selectionHistory[this.groupData.currentView - 1] = data;
        this.groupData.currentView = 2;
      } else if(container == 'summaryGroups'){
        this.groupData.summaryItems = this.setupSummaryGroups(this.currentUnit, 'summary', 2, data)
        this.groupData.selectionHistory[this.groupData.currentView - 1] = data;
        this.groupData.currentView = 3;
      } else if(container == 'summaryItems'){     

        this.groupData.selectionHistory[this.groupData.currentView - 1] = data;

        for(const key in this.currentUnit['summary']){
          let tempKey = key.split(':: ');

          if(tempKey[0] == this.groupData.selectionHistory.join(': ')){
            this.currentUnit['currentInstance'] = tempKey[1];
            break;
          }
        }

        this.groupData.detailedResults = this.setupResultsGroups(this.currentUnit, 'results', this.currentUnit['currentInstance'], this.groupData.selectionHistory.join(': '))
        this.groupData.selectionHistory[this.groupData.currentView - 1] = data;
        this.groupData.currentView = 4;
      } else if(container == 'detailedResults'){     
        this.groupData.selectionHistory[this.groupData.currentView - 1] = data;

        this.groupData.resultSet = this.setupResultsItems(this.currentUnit, 'results', this.currentUnit['currentInstance'], this.groupData.selectionHistory[this.groupData.currentView - 1])
        this.groupData.selectionHistory[this.groupData.currentView - 1] = data;
        this.groupData.currentView = 5;
      }

    },
    setupSummaryGroups: function(currentUnit, rawDataKey, tokenKeyIndex, parentGroup){

        let uiData = [];
        for(const key in currentUnit[rawDataKey]){

          // if(parentGroup != (key.split(':: ')[0]).split(': ')[(tokenKeyIndex - 1 >= 0 ? tokenKeyIndex - 1 : 0)]){
          if(parentGroup != (key.split(':: ')[0]).split(': ')[tokenKeyIndex - 1]){
            continue;
          }

          let item = (key.split(':: ')[0]).split(': ')[tokenKeyIndex]
          
          let isPresent = false;
          for(const elemt of uiData){
            if(elemt.testgroup == item){
              isPresent = true;
              break;
            }
          }

          if(!isPresent){
            uiData.push({
              'sn': currentUnit.Serial_Number,
              'isPass': currentUnit[rawDataKey][key].TestSequence_Group_Pass_Fail != 'FAIL',
              'testgroup': item
            })
          }
          
        }
      return uiData;
    },
    setupResultsGroups: function(currentUnit, rawDataKey, instance){

        let uiData = [];
        for(const key in currentUnit[rawDataKey]){

          if(instance != (key.split(':: ')[0])){
            continue;
          }

          let item = currentUnit[rawDataKey][key]['Test_Description']
          
          let isPresent = false;
          for(const elemt of uiData){
            if(elemt.testgroup == item){
              isPresent = true;
              break;
            }
          }

          if(!isPresent){
            uiData.push({
              'sn': currentUnit.Serial_Number,
              'isPass': currentUnit[rawDataKey][key].Pass_Fail != 'FAIL',
              'testgroup': item
            })
          }
          
        }
      return uiData;
    },
    setupResultsItems: function(currentUnit, rawDataKey, instance, testDescription){

        let uiData = [];
        let titles = {
                "Test_TimeStamp": "Test Time",
                "Test_Description": "Test Description",
                "UUT_Configuration": "UUT Configuration",
                "TestBench_Configuration": "TestBench Configuration",
                "Pass_Fail": "Pass/Fail",
                "LL_Extended": 'Extended Lower Limit',
                "Lower_Limit": 'Lower Limit',
                "Measurement": 'Measurment',
                "Upper_Limit": 'Upper Limit',
                "UL_Extended": 'Extended Upper Limit',
                "SI_Unit": "Measurements Units (SI)",
                "Comments": "Comments",
                "Admin_Comments": "Admin_Comments",
                "reportsection": "Test Item Context",
        }
        for(const key in currentUnit[rawDataKey]){

          if(instance != (key.split(':: ')[0])){
            continue;
          }

          if(testDescription != currentUnit[rawDataKey][key]['Test_Description']){
            continue;
          }

          let item = {
              'sn': currentUnit.Serial_Number,
              'isPass': currentUnit[rawDataKey][key].Pass_Fail != 'FAIL',
              'testgroup': ''
            }
          
          for(let tempKey in currentUnit[rawDataKey][key]){
            if(['itemID', 'Table_ID', 'Board_TestInstance'].indexOf(tempKey) != -1)
              continue;

            let temp = JSON.parse(JSON.stringify(item))
            temp.testgroup = titles[tempKey] + ': ' + currentUnit[rawDataKey][key][tempKey]
            uiData.push(temp)
          }


            return uiData;
        }
    },

    previousDetails: function(){
      this.groupData.currentView--;
      if(this.groupData.currentView == 0){
        this.groupData.currentView = 1;
      }
    },


    getData: function(url) {

      return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            resolve(JSON.parse(this.responseText));
          }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
      })                        
    }

  }, 
  created: function(){

    this.getData("http://localhost:5001/api/v1/data/units")
    .then((res)=>{
      this.historyResults = res.data;
      for(const key in this.historyResults){
        this.sns.push(this.historyResults[key].Serial_Number)
        // this.projectcode_batch
      }
    });

    this.getData("http://localhost:5001/api/v1/data/batch")
    .then((res)=>{ 
      this.batchResults = res.data; 
      console.log('Initial Data fetched!')
    });


    // setInterval(
    //   () => { 
    //     this.isVisible = !this.isVisible
    // }, 2000);
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
  overflow: unset;
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
  margin-right: 0.5rem;
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

    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 1fr 1fr 1.5fr;
    grid-gap: 0.5rem 2rem;
}
.unit-details-container div {
  display: grid;
  grid-template-columns: auto auto;
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
  grid-column: 1/3;
} 
.status-pass{
  background-color: hsl(120,55%,35%) !important;
}
.status-fail{
  background-color: hsl(0,55%,35%) !important;
}
.unit-details-container div:last-child span:last-child{
  justify-content: flex-start;
  /* padding-left: 35%; */
  margin-left: -15%;
} 


.unit-details-data{
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 3rem;
  justify-content: flex-start;
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
