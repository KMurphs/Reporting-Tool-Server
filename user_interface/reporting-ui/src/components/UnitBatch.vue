<template>
  <div class="unit-group-results-container" v-bind:style="'border-color: ' + (configData.isPass ? configStyle.passDarkColor : configStyle.failDarkColor)+ ';'">
    <a href="#" v-bind:style="'background-color: ' + (configData.isPass ? configStyle.passPrimaryColor : configStyle.failPrimaryColor)+ ';'"
                v-on:click="onUnitSelected()">
      <span>
        <span>
          <span>{{configData.sn}}</span>
        </span>
        <span>
          <span v-bind:style="'background-color: ' + (configData.isPass ? configStyle.passDarkColor : configStyle.failDarkColor)+ ';'">
            {{configData.isPass ? 'PASS' : 'FAIL'}}
          </span>
          <span v-bind:style="'background-color: ' + (configData.client == 'Periseo' ? configStyle.normalClientColor : configStyle.fieldClientColor) + ';'">
                {{configData.client}}
          </span>
        </span>
        <span class="unit-group-results__data">
          <span v-bind:style="'width: calc(100% / ' + (configData.data.length) + '); background-color: ' + (item.isPass ? configStyle.passPrimaryColor : configStyle.failPrimaryColor) + ';'"
                v-for="(item, index) in configData.data" 
                v-bind:key="index">
                {{item.content}}
          </span>
        </span>


      </span>
    </a>
  </div>
</template>



<script>
export default {
    name: 'UnitBatch',
    
    props: {
        configData: Object,
        configStyle: Object,
    },
    data: function () {
        return {
            someData: true
        }
    },
    created: function () {
    },
    methods: {
      onUnitSelected: function(){
        this.$emit('snunitbatchmsg', 'unitselected', this.configData.sn)
      }
    },
};
</script>




<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.unit-group-results-container {
  --var-txt-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  margin: 0 auto;
  width: 100%;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  border: 1px solid black;
  border-top: 0;
}

.unit-group-results-container > a,
.unit-group-results-container > a:hover,
.unit-group-results-container > a:active,
.unit-group-results-container > a:visited {
    text-decoration: none;
    color: var(--var-txt-color);
}

.unit-group-results-container > a {
  background-color: white;
  border-radius: 3px;
  overflow: hidden; 
}
.unit-group-results-container > a > span {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}
.unit-group-results-container > a > span > span {
  padding: 0;
  display: flex;
  align-items: stretch;
}
.unit-group-results-container > a > span > span:last-child {
  transition: all .6s;
  margin-right: -15rem;
  opacity: 0;
  color: #1f196b;
  font-weight: bold;
}
.unit-group-results-container > a > span > span:nth-child(2) {
  color: white;
}
.unit-group-results-container > a > span > span:nth-child(2) > span:last-child {
  color: black;
}
.unit-group-results-container > a:hover > span > span:last-child {
  transition: all .6s;
  margin-right: 0;
  opacity: 1;
  /* border: 1px solid black; */
}
.unit-group-results-container > a > span > span > span {
  padding: 1rem 1.5rem;
}



.unit-group-results__data > span{
  padding-left: 1rem;
  padding-right: 1rem;
  border: 0;
  /* border-left: 1px solid black; */
  display: flex;
  justify-content: center;
  align-items: center;
  /* color: white; */
}
/* .unit-group-results__data > span:last-child{
  margin-left: 1.5rem;
} */
/* .unit-group-results__data > span:nth-last-child(2){
  border-right: 1px solid;
} */


</style>
