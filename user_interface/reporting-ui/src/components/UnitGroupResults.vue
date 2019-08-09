<template>
  <div class="unit-group-results-container">
    <a href="#" v-bind:style="'background-color: ' + (!configData.isPass ? configStyle.failPrimaryColor : configStyle.passPrimaryColor)+ ';'"
                v-on:click="onClick">
      <span>
        <span class="unit-group-results__sn">
          <span>{{configData.sn}}</span>
        </span>
        <span class="unit-group-results__data">
              <!-- v-bind:style="'background-color: ' + (configData.isPass ? configStyle.passDarkColor : configStyle.failDarkColor)+ ';'"> -->
          <span>Click to Look at Results for Test Group</span>
          <span>{{configData.testgroup}}</span>
        </span>
        <span class="unit-group-results__motioned-control">
          <span v-bind:style="'background-color: ' + (!configData.isPass ? configStyle.failDarkColor : configStyle.passDarkColor)+ ';'">
            {{!configData.isPass ? 'FAIL' : 'PASS'}}
          </span>
        </span>

      </span>
    </a>
  </div>
</template>



<script>
export default {
    name: 'UnitGroupResults',
    
    props: {
        configData: Object,
        configStyle: Object,
        name: String,
    },
    data: function () {
        return {
            someData: true
        }
    },
    created: function () {
    },
    methods: {
      onClick: function(){
        this.$emit('msg', this.name, this.configData.testgroup)
      }
    },
};
</script>




<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.unit-group-results-container {
  --var-txt-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  margin: .2rem auto;
  width: 98%;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
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
/* .unit-group-results-container > a > span > span:first-child {
  padding: 0;
  display: flex;
  align-items: stretch;
}
.unit-group-results-container > a > span > span:nth-child(2) {
  padding: 0;
  display: flex;
  align-items: stretch;
} */
.unit-group-results-container > a > span > span:last-child {
  color: white;
  font-weight: bold;
  transition: all .6s;
  margin-right: -5rem;
  opacity: 0;
}
.unit-group-results-container > a:hover > span > span:last-child {
  transition: all .6s;
  margin-right: 0;
  opacity: 1;
}
.unit-group-results-container > a > span > span > span {
  padding: 1.5rem 1rem;
}

.unit-group-results__data{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}
.unit-group-results__data > span:first-child{
  margin: 0;
  padding: 0;
  color: gray;
  margin-top: 0.5rem;
}
.unit-group-results__data > span:nth-child(2){
  padding: 0.5rem 1rem !important;
}
</style>
