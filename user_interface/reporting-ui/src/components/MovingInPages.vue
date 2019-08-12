<template>


  <div class="data-unit" v-bind:id="'data-unit-' + sndata.sn">
    <section class="section section--current">
      <main class="main-section" id="main-section">


      </main>
    </section>
  </div>

</template>

<script>


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
    this.sndata.sessions.forEach((session, index) => {
      this.sessionsData.push({
        sessionNo: index + 1,
        sn: this.sndata.sn,
        sessionid: session,
      });
    });
  },
  components: {

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
<style src="./index.css" scoped>
</style>
<style scoped>
  .section{
    background-color: rgb(0, 119, 255);
  }
</style>
