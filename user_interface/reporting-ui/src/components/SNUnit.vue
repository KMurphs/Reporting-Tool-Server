<template>


  <div class="data-unit" v-bind:id="'data-unit-' + sndata.sn">
    <input type="checkbox" class="data-unit__checkbox"
           v-bind:id="'data-unit__checkbox-' + sndata.sn">

    <a href="#" class="data-unit__link">
      <label v-bind:for="'data-unit__checkbox-' + sndata.sn" class="data-unit__label">
        <div class="data-unit__header">
          <span class="data-unit__header-item data-unit__body-state data-unit__body-state--opened">
            ▼<!--alt 31-->
          </span>
          <span class="data-unit__header-item data-unit__body-state data-unit__body-state--closed">
            ►<!--alt 16-->
          </span>
          <span class="data-unit__header-item data-unit__header-item--important">
            {{ sndata.sn }}
          </span>
          <span class="data-unit__header-item data-unit__Batch">
            <span class="data-unit__item--faded">Batch N°</span>
            <span class="data-unit__header-item--important">
              {{ sndata.batchno }}
            </span>
          </span>
          <span class="data-unit__control-container">
            <span class="data-unit__header-item data-unit__motioned-control"
                  v-on:click="onUnitErased()">
              <i class="fas fa-trash-alt"></i>
            </span>
            <span class="data-unit__header-item data-unit__static-control"
                  v-bind:style="{backgroundColor: dbColors[status.dbStatus]}">
              <i class="fas fa-file-signature"></i>
            </span>
            <span class="data-unit__header-item data-unit__static-control"
                  v-bind:style="{backgroundColor: repColors[status.repStatus]}">
              <i class="fas fa-database"></i>
            </span>
          </span>
        </div>
      </label>
    </a>

    <div class="data-unit__body-container">
      <div class="data-unit__body">
        <div class="data-unit__body-item data-unit__projectcode">
          <span class="data-unit__item--faded">Project Code: </span>
          <span>{{  sndata.projectcode }}</span>
        </div>
        <div class="data-unit__body-item data-unit__clientname">
          <span class="data-unit__item--faded">Client Name: </span>
          <span>{{ sndata.client }}</span></div>
        <div class="data-unit__body-item data-unit__userinstruction data-unit__item--faded">
          <p> <br>Choose a Session from the list below</p>
        </div>
        <SNUnitSession v-for="(session, index) in sndata.sessions"
                        v-bind:sessionData="{
                          sessionNo: index + 1,
                          sn: sndata.sn,
                          sessionid: session,
                        }"
                        v-bind:key="index"
                        v-on:sessionChanged="onSessionChanged"/>
        <!-- <SNUnitSession v-for="(session, index) in sessions"
                        v-bind:sn="sn"
                        v-bind:sessionNo="(index + 1).toString()"
                        v-bind:sessionid="session"
                        v-bind:key="session"
                        v-on:sessionChanged="onSessionChanged"/> -->
      </div>
    </div>
  </div>

</template>

<script>
import SNUnitSession from './SNUnit-Session.vue';

export default {
  name: 'SNUnit',
  props: {
    // sn: String,
    // batchno: String,
    // projectcode: String,
    // client: String,
    // sessions: Array[String],
    sndata: Object,
    status: Object,
  },
  data() {
    return {
      sessionsData: [],
      dbColors: ['', '#849a92', '#3c9a77', '#006942'],
      repColors: ['', '#d4b18e', '#b1793f', '#b35b00'],
    };
  },
  created() {
    // for (const session of this.sndata.sessions) {
    //   this.sessionsData.push({
    //     sessionNo: this.sessionsData.length + 1,
    //     sn: this.sndata.sn,
    //     sessionid: session,
    //   });
    // }
  },
  components: {
    SNUnitSession,
  },
  methods: {
    onSessionChanged(newSession) {
      this.$emit('snunitmsg', 'sessionChanged', newSession);
    },
    onUnitErased() {
      this.$emit('snunitmsg', 'unitErased', this.sndata.sn);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./SNUnit.css" scoped>
</style>
<style src="../assets/css/all.min.css" scoped>
</style>
