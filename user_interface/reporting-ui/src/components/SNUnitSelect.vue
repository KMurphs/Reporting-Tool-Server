<template>
  <section class="add-section__controls">

    <section class="add-section__tab-controls">
      <button v-on:click="showAddSectionTab('serial-number-tab')" class='add-section__tab-control--current' >By Serial Number</button>
      <button v-on:click="showAddSectionTab('product-batch-tab')">By Product Name, Batch Number</button>
    </section>

    <section class="add-section__tab add-section__tab--current">
      <p>Enter Serial Number</p>  
      <input type="number" id='serial-number' placeholder="Enter Serial Number" v-model="units.sn">
    </section>

    <section class='add-section__tab'>
      <p>Enter Project Code and Batch ID</p> 

      <select name="ProjectCodes" id='project-code-entries' v-model="units.projectcode"
                                                            v-on:click="updateBatch()">
        <option v-for="(item, index) in Object.keys(projectcode_batch)"
                v-bind:key="index"
                v-bind:value="item">{{item + ' (' + projectcode_batch[item].description + ')'}}</option>
      </select>

      <select name="BatchIDs" id='batch-id-entries' v-model="units.batchno">
        <option v-for="(item, index) in (units.projectcode != '' ? projectcode_batch[units.projectcode]['batches'] : [])"
                v-bind:key="index"
                v-bind:value="item">{{item}}</option>
      </select>

    </section>

    <section class="add-section__add-control-container">
      <button v-on:click="onUnitsAdded()" class="add-section__add-control">Add Serial Numbers</button> 
    </section>
  </section>
</template>



<script>
export default {
    name: 'SNUnitSelect',
    
    props: {
        projectcode_batch: Object,
        // configData: Object,
        // configStyle: Object,
    },
    data: function () {
        return {
          units: {
            sn: '',
            projectcode: '',
            batchno: '',
          }
        }
    },
    created: function () {
    },
    methods: {
      onUnitsAdded: function(){
        this.$emit('snunitselect', 'unitsadded', this.units)
      },
      showAddSectionTab: function(tabName) {
        const tabs = document.querySelectorAll(".add-section__tab")
        const controls = document.querySelectorAll(".add-section__tab-controls button")

        const newClass_tab = "add-section__tab--current";
        const newClass_controls = "add-section__tab-control--current";

        let index_old = 1;
        let index_new = 0;
        if(tabName != "serial-number-tab"){
          index_old = 0;
          index_new = 1;
        }

        tabs[index_old].classList.remove(newClass_tab)
        tabs[index_new].classList.add(newClass_tab);
        controls[index_old].classList.remove(newClass_controls)
        controls[index_new].classList.add(newClass_controls);

      },
      updateBatch: function(){

      },
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

.add-section__controls {
    width: 90%;
    height: 90%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 15% 55% 30%;
    --primary-color: #6200EE;
    --primary-color--dark: #3700B7;
    --primary-color--light: #e4ccff;
    --secondary-color: #03DAC6;
    --secondary-color--dark: #018786;
    --background-color: #FFF;
    --surface-color: #FFF;
    --error-surface: #B00020;
    --text-on-primary-color: #FFF;
    --text-on-secondary-color: #000;
    --text-on-dark-secondary-color: #FFF;
    --text-on-error-surface: #FFF;
    --text-on-background: #000;
    --text-on-surface: #000;
    --text-on-faded-background: #999;
    --faded-background: #EEE;
}

button{
  cursor: pointer;
}

.add-section__tab-controls {
    display: flex;
    justify-content: space-between;
}

.add-section__tab-controls button {
    padding: 0.5rem;
    border: 0;
    background-color: var(--faded-background);
    color: var(--text-on-faded-background);
}
.add-section__tab-controls button:hover {
    background-color: var(--primary-color) !important;
    color: var(--text-on-primary-color) !important;
}

.add-section__add-control-container {
    align-self: stretch;
}

.add-section__add-control {
    margin-top: 1rem;
}

.add-section__tab {
  padding-top: 1rem;
  display: none;
}

.add-section__tab--current {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background-color: var(--faded-background);
    padding-bottom: 1rem;
    border: 2px solid var(--primary-color--light);
} 

 .add-section__tab--current select:nth-of-type(1) {
    margin-bottom: 1rem;
}

.add-section__tab-control--current {
    font-weight: bold;
    background-color: var(--primary-color) !important;
    padding: 0.8rem !important;
    color: var(--text-on-primary-color) !important;
}

.add-section__add-control{
    border: 0;
    width: 50%;
    line-height: 2rem;
    text-align: center;
    color: var(--text-on-dark-secondary-color);
    background-color: var(--secondary-color--dark);
    border-radius: 4px;
    padding: 0.25rem;
    box-shadow: 0 4px 20px 5px rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}


.add-section__controls input,
.add-section__controls select {
    padding: 0.5rem;
    font-size: 0.8rem;
    width: 80%;
}

.add-section__controls select:nth-of-type(2) {
    width: 25%;
} 


</style>
