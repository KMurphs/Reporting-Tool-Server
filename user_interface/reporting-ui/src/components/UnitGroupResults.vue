<template>
  <div class="unit-group-results-container">
    <a href="#" v-bind:style="'background-color: ' + (configData.isPass ? configStyle.passPrimaryColor : configStyle.failPrimaryColor)+ ';'">
      <span>
        <span class="unit-group-results__sn">
          <span>{{configData.sn}}</span>
        </span>
        <span class="unit-group-results__data">
          <span>{{configData.testgroup}}</span>
        </span>
        <span class="unit-group-results__motioned-control">
          <span v-bind:style="'background-color: ' + (configData.isPass ? configStyle.passDarkColor : configStyle.failDarkColor)+ ';'">
            {{configData.isPass ? 'PASS' : 'FAIL'}}
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
    },
    data: function () {
        return {
            someData: true
        }
    },
    created: function () {
    },
    methods: {
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
  margin: 1rem auto;
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
</style>
