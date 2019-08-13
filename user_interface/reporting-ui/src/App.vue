<template>
  <div id="app">

    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->


    <div class="container container__overview">
      <div class="tracked-devices-title">
        <h1>Tracked Devices</h1>
      </div>

      <div class="container__message-when-empty"
           v-bind:style="'display: ' + (trackedUnits.length === 0 ? 'block' : 'none')">
        <h2>Click Here To add a device to track</h2>
        <button v-on:click="addUnits(true)"><i class="fas fa-plus"></i>Add Units to Track</button>
      </div>

      <div class="container__tracked-units"
           v-bind:style="'display: ' + (trackedUnits.length !==0 ? 'block' : 'none')">
        <UnitBatch v-bind:configData="item"
                   v-bind:configStyle="configStyle"
                   v-on:snunitbatchmsg="onSNSelected"
                   v-for="(item, index) in trackedUnitsData"
                   v-bind:key="index">
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
                        'color': 'black',
                        'width': '100%',
                        'display': 'flex',
                        'flex-direction': 'column',
                        'justify-content': 'center',
                        'align-items': 'center',
                      }">
          <SNUnitSelect v-bind:projectcode_batch="projectcode_batch"
                        v-on:snunitselect="onTrackNewUnits"/>
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
        <div><span>Project Code: </span>
          <span>{{currentUnit.Project_Code !==''
                ? currentUnit.Project_Code + ' (' + currentUnit.Product_Description + ')'
                : ''}}
          </span>
        </div>
        <div v-bind:class="{'status-pass': (currentUnit.Final_Pass_Fail !=='FAIL'),
                            'status-fail': (currentUnit.Final_Pass_Fail === 'FAIL') }">
          <span>Status: </span><span>{{currentUnit.Final_Pass_Fail}}</span>
        </div>
      </div>
      <div class="unit-details-data">
        <a href="#" class="fa-long-arrow-alt-left-container"
                    v-on:click="previousDetails()">
          <i class="fas fa-long-arrow-alt-left"></i>
        </a>

        <MovingInElt
                      v-bind:isVisible="groupData.currentView === 1"
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
                      v-bind:isVisible="groupData.currentView === 2"
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
                      v-bind:isVisible="groupData.currentView === 3"
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
                      v-bind:isVisible="groupData.currentView === 4"
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
                      v-bind:isVisible="groupData.currentView === 5"
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


    <a href="#" class="fa-plus-container"
        v-bind:style="'display: ' + (!isAdding ? 'inline-block' : 'none')"
        v-on:click="addUnits(true)"><i class="fas fa-plus"></i></a>
    <a href="#" class="fa-check-container"
        v-bind:style="'display: ' + (isAdding ? 'inline-block' : 'none')"
        v-on:click="addUnits(false)"><i class="fas fa-check"></i></a>
  </div>
</template>


<script>
import MovingInElt from './components/MovingInElt.vue';
import UnitGroupResults from './components/UnitGroupResults.vue';
import UnitBatch from './components/UnitBatch.vue';
import SNUnitSelect from './components/SNUnitSelect.vue';
import InputAutoComplete from './components/InputAutoComplete.vue';

export default {
  name: 'app',
  components: {
    MovingInElt,
    UnitGroupResults,
    UnitBatch,
    SNUnitSelect,
    InputAutoComplete,
  },
  data() {
    return {
      projectcode_batch: {},
      historyResults: {},
      batchResults: {},
      sns: [],
      snsids: {},
      currentUnit: {
        Project_Code: '',
        Product_Description: '',
      },
      trackedUnits: [],
      trackedUnitsData: [],
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
        passPrimaryColor: 'hsl(120,45%,70%)',
        passDarkColor: 'hsl(120,55%,35%)',
        failPrimaryColor: 'hsl(0,45%,70%)',
        failDarkColor: 'hsl(0,55%,35%)',
        normalClientColor: 'rgb(214, 198, 174)',
        fieldClientColor: 'rgb(214, 198, 174)',
      },
      configStyleCont: {
        height: 'calc(100% - 4rem)',
        'background-color': 'rgba(0,0,0,0)',
        width: '100%',
        'margin-top': '4rem',
        'overflow-y': 'scroll',
      },
    };
  },
  methods: {
    onTrackNewUnits(msgType, data) {
      // {"sn":"","projectcode":"14511","batchno":0}

      if (data.sn !== '') {
        if (this.trackedUnits.indexOf(data.sn) === -1) {
          this.trackedUnits.push(data.sn);
        }
      }
      if (data.projectcode !== '' && data.batchno !== '') {
        Object.keys(this.batchResults).forEach((key) => {
          if (this.historyResults[key].Project_Code === data.projectcode
              && this.historyResults[key].Batch_ID === data.batchno) {
            if (this.trackedUnits.indexOf(this.batchResults[key].Serial_Number) === -1) {
              this.trackedUnits.push(this.batchResults[key].Serial_Number);
            }
          }
        });
      }
    },
    addUnits(doStart) {
      this.isAdding = doStart;
      console.log(this.isAdding);
    },

    onSNSelected(msgType, data) {
      if (msgType === 'snselected' || msgType === 'unitselected') {
        const temp = [];
        // for (const key in this.historyResults) {
        Object.keys(this.historyResults).forEach((key) => {
          if (this.historyResults[key].Serial_Number === data) {
            temp.push(key);
          }
        });
        this.updateDetailsPage(temp[0]);
      }
    },
    updateDetailsPage(unitID) {
      this.currentUnit = this.batchResults[unitID];

      this.getData(`http://localhost:5001/api/v1/data/unitsummary/\
      ${this.currentUnit.Serial_Number}`)
        .then((res) => {
          this.currentUnit.summary = res.data[unitID];

          let instances = '';
          // for (const key in this.currentUnit.summary) {
          Object.keys(this.currentUnit.summary).forEach((key) => {
            instances += `,${key.split(':: ')[1]}`;
          });

          this.getData(`http://localhost:5001/api/v1/data/unitresults/\
          ${this.currentUnit.Serial_Number}/?inst=${instances.substr(1)}`)
            .then((res1) => { this.currentUnit.results = res1.data[unitID]; });
        });

      this.currentUnit.Product_Description = this.historyResults[unitID].Product_Description;
      this.currentUnit.Project_Code = this.historyResults[unitID].Project_Code;
      this.currentUnit.Batch_ID = this.historyResults[unitID].Batch_ID;

      this.groupData.batchResults = [];
      // for (const item of ['Ambient', 'Cold', 'Hot']) {
      ['Ambient', 'Cold', 'Hot'].forEach((item) => {
        this.groupData.batchResults.push({
          sn: this.currentUnit.Serial_Number,
          isPass: this.currentUnit[item] !== 'FAIL',
          testgroup: item,
        });
      });
      this.groupData.currentView = 1;
    },
    onGroupResultsSelected(container, data) {
      // console.log(container);
      // console.log(data);
      // console.log(this.groupData.currentView);
      // console.log(this.groupData.selectionHistory);
      if (container === 'batchResults') {
        this.groupData.summaryGroups = this.setupSummaryGroups(this.currentUnit, 'summary', 1, data);
        this.groupData.selectionHistory[this.groupData.currentView - 1] = data;
        this.groupData.currentView = 2;
      } else if (container === 'summaryGroups') {
        this.groupData.summaryItems = this.setupSummaryGroups(this.currentUnit, 'summary', 2, data);
        this.groupData.selectionHistory[this.groupData.currentView - 1] = data;
        this.groupData.currentView = 3;
      } else if (container === 'summaryItems') {
        this.groupData.selectionHistory[this.groupData.currentView - 1] = data;
        Object.keys(this.currentUnit.summary).forEach((key) => {
          const [tempKey, tempInst] = key.split(':: ');
          if (tempKey === this.groupData.selectionHistory.filter((item, index) => index <= 2).join(': ')) {
            this.currentUnit.currentInstance = tempInst;
          }
        });

        this.groupData.detailedResults = this.setupResultsGroups(this.currentUnit,
          'results',
          this.currentUnit.currentInstance,
          this.groupData.selectionHistory.filter((item, index) => index <= 2).join(': '));
        this.groupData.selectionHistory[this.groupData.currentView - 1] = data;
        this.groupData.currentView = 4;
      } else if (container === 'detailedResults') {
        this.groupData.selectionHistory[this.groupData.currentView - 1] = data;
        this.groupData.resultSet = this.setupResultsItems(this.currentUnit,
          'results',
          this.groupData.selectionHistory.filter((item, index) => index <= 2).join(': '),
          this.groupData.selectionHistory.filter((item, index) => index > 2).join(': '));
        this.groupData.selectionHistory[this.groupData.currentView - 1] = data;
        this.groupData.currentView = 5;
      }
    },
    setupSummaryGroups(currentUnit, rawDataKey, tokenKeyIndex, parentGroup) {
      const uiData = [];
      // for (const key in currentUnit[rawDataKey]) {
      Object.keys(currentUnit[rawDataKey]).forEach((key) => {
        let isAllowedToProceed = true;
        if (parentGroup !== (key.split(':: ')[0]).split(': ')[tokenKeyIndex - 1]) {
          // continue;
          isAllowedToProceed = false;
        }

        if (isAllowedToProceed) {
          const item = (key.split(':: ')[0]).split(': ')[tokenKeyIndex];

          const isPresent = uiData.find(elemt => elemt.testgroup === item);

          if (!isPresent) {
            uiData.push({
              sn: currentUnit.Serial_Number,
              isPass: currentUnit[rawDataKey][key].TestSequence_Group_Pass_Fail !== 'FAIL',
              testgroup: item,
            });
          }
        }
      });
      return uiData;
    },
    setupResultsGroups(currentUnit, rawDataKey, instance, testDescription) {
      const uiData = [];

      Object.keys(currentUnit[rawDataKey]).forEach((key) => {
        let isAllowedToProceed = true;
        if (testDescription !== (key.split(':: ')[0])) {
          isAllowedToProceed = false;
        }

        if (isAllowedToProceed) {
          const item = currentUnit[rawDataKey][key].Test_Description;

          const isPresent = uiData.find(elemt => elemt.testgroup === item);

          if (!isPresent) {
            uiData.push({
              sn: currentUnit.Serial_Number,
              isPass: currentUnit[rawDataKey][key].Pass_Fail !== 'FAIL',
              testgroup: item,
            });
          }
        }
      });
      return uiData;
    },
    setupResultsItems(currentUnit, rawDataKey, instance, testDescription) {
      const uiData = [];
      const titles = {
        Test_TimeStamp: 'Test Time',
        Test_Description: 'Test Description',
        UUT_Configuration: 'UUT Configuration',
        TestBench_Configuration: 'TestBench Configuration',
        Pass_Fail: 'Pass/Fail',
        LL_Extended: 'Extended Lower Limit',
        Lower_Limit: 'Lower Limit',
        Measurement: 'Measurment',
        Upper_Limit: 'Upper Limit',
        UL_Extended: 'Extended Upper Limit',
        SI_Unit: 'Measurements Units (SI)',
        Comments: 'Comments',
        Admin_Comments: 'Admin_Comments',
        reportsection: 'Test Item Context',
      };

      Object.keys(currentUnit[rawDataKey]).forEach((key) => {
        let isAllowedToContinue = true;
        // console.log("**************************************");
        // console.log((key.split(':: ')[0]));
        // console.log(instance);
        // console.log(currentUnit[rawDataKey][key].Test_Description);
        // console.log(testDescription);
        if (instance !== (key.split(':: ')[0])) {
          // continue;
          isAllowedToContinue = false;
        }

        if (testDescription !== currentUnit[rawDataKey][key].Test_Description) {
          isAllowedToContinue = false;
          // continue;
        }

        if (isAllowedToContinue) {
          const item = {
            sn: currentUnit.Serial_Number,
            isPass: currentUnit[rawDataKey][key].Pass_Fail !== 'FAIL',
            testgroup: '',
          };

          // for (const tempKey in currentUnit[rawDataKey][key]) {
          Object.keys(currentUnit[rawDataKey][key]).forEach((tempKey) => {
            let isAllowedToContinueAgain = true;

            if (['itemID', 'Table_ID', 'Board_TestInstance'].indexOf(tempKey) !== -1) {
              // continue;
              isAllowedToContinueAgain = false;
            }

            if (isAllowedToContinueAgain) {
              const temp = JSON.parse(JSON.stringify(item));
              temp.testgroup = `${titles[tempKey]}: ${currentUnit[rawDataKey][key][tempKey]}`;
              uiData.push(temp);
            }
          });
        }
      });
      return uiData;
    },

    previousDetails() {
      this.groupData.currentView -= 1;
      if (this.groupData.currentView === 0) {
        this.groupData.currentView = 1;
      }
    },

    updateDetails() {
      if (this.trackedUnits.length > 0) {
        this.trackedUnits.sort();
        this.trackedUnitsData = [];

        // for (const sn of this.trackedUnits) {
        this.trackedUnits.forEach((sn) => {
          const key = this.snsids[sn];

          if (this.trackedUnits.indexOf(sn) !== -1) {
            this.trackedUnitsData.push({
              sn: `${sn}`,
              isPass: this.batchResults[key].Final_Pass_Fail !== 'FAIL',
              client: this.batchResults[key].Client_Name,
              data: [{
                content: 'Ambient',
                isPass: this.batchResults[key].Ambient !== 'FAIL',
              }, {
                content: 'Cold',
                isPass: this.batchResults[key].Cold !== 'FAIL',
              }, {
                content: 'Hot',
                isPass: this.batchResults[key].Hot !== 'FAIL',
              }],
            });
          }
        });
      }
    },


    getUpdatedData() {
      this.getData('http://localhost:5001/api/v1/data/batch')
        .then((res) => {
          this.batchResults = res.data;
          this.updateDetails();
          console.log('Updated Data fetched!');
        });
    },


    getData(url) {
      return new Promise((resolve) => {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
          if (xhttp.readyState === 4 && xhttp.status === 200) {
            resolve(JSON.parse(xhttp.responseText));
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
        this.historyResults = res.data;
        this.snsids = {};

        Object.keys(this.historyResults).forEach((key) => {
          this.historyResults[key].Serial_Number = `${this.historyResults[key].Serial_Number}`;
          this.sns.push(this.historyResults[key].Serial_Number);
          this.snsids[this.historyResults[key].Serial_Number] = key;
        });

        this.projectcode_batch = {};
        // for (const key in this.historyResults) {
        Object.keys(this.historyResults).forEach((key) => {
          this.historyResults[key].Project_Code = `${this.historyResults[key].Project_Code}`;
          this.historyResults[key].Batch_ID = `${this.historyResults[key].Batch_ID}`;

          if (Object.keys(this.projectcode_batch)
            .indexOf(this.historyResults[key].Project_Code) === -1) {
            this.projectcode_batch[this.historyResults[key].Project_Code] = {
              batches: [],
              description: this.historyResults[key].Product_Description,
            };
          }

          if (this.projectcode_batch[this.historyResults[key].Project_Code]
            .batches.indexOf(this.historyResults[key].Batch_ID) === -1) {
            this.projectcode_batch[this.historyResults[key].Project_Code]
              .batches.push(this.historyResults[key].Batch_ID);

            this.projectcode_batch[this.historyResults[key].Project_Code]
              .batches.sort();
          }
        });
        console.log('Initial Data fetched!');
      });


    this.getUpdatedData();
    setInterval(this.getUpdatedData, 10000);
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
  display: flex;
  justify-content: space-between;
  /* display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  grid-gap: 0.5rem 0.5rem; */
  --container-width: 700px;
}


.container {
  width: var(--container-width);
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
  box-sizing: unset;
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 150px 130px 1fr;
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


.fa-plus-container > .fa-plus,
.fa-check-container > .fa-check{
  font-size: 2rem;
  border-radius: 50%;
  padding: 1rem 1.2rem;
  font-size: 3rem;
  color: white;
  background-color: #676b95;
  bottom: 1rem;
  left: calc(var(--container-width) - 6rem);
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
  position: relative;
    height: 150px;
}
.container__message-when-empty button{
  position: absolute;
    padding: .8rem 1rem;
    bottom: 0;
    right: 0;
    margin: 1rem;
    width: 15rem;
display: flex;
justify-content: center;
align-items: center;
}
.container__message-when-empty button .fa-plus{
    font-size: 1.4rem;
    padding: 0rem 1.5rem;
    color: blue;
    font-weight: bold;
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
  /* width: calc((550px - 0.5rem)/2); */
  width: var(--container-width);
  height: 300px;
  transition: all .6s;
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
  /* #app {
    width: 1200px;
    margin: 0 auto;
  } */
  /* .container {
    width: 35%;
  }
  .fa-plus,
  .fa-check{
    left: calc(35% - 6rem);
  } */
  /* #container__add-units-control{
    width: calc((1200px - 0.5rem)/2);
    width: 35%;
  } */
}
</style>
<style src="./assets/css/all.min.css" scoped>
</style>
