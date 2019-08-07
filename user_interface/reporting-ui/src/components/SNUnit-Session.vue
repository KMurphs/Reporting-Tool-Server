<template>
    <div class="data-unit__body-item data-unit__session-container">
        <input type="radio" 
                v-bind:name="'option_' + sessionData.sn" 
                v-bind:id="'option_' + sessionData.sn + ' - ' + sessionData.sessionid" 
                v-bind:value="sessionData.sessionid" 
                v-bind:checked="isChecked" 
                v-on:click="sessionChanged('TestInput')">
                <!-- v-on:click="$emit('sessionChanged', sessionData.sn, sessionData.sessionid)"> -->
        
        <label v-bind:for="'option_' + sessionData.sn + ' - ' + sessionData.sessionid" class="data-unit__session">
            <span>Session {{ sessionData.sessionNo }}</span><span>{{ sessionData.sessionid }}</span>
        </label>              
    </div>
</template>

<script>
export default {
    name: 'SNUnit',
    props: {
        sessionData: Object,
        // sn: String,
        // sessionid: String,
        // sessionNo: String,
    },
    data: function () {
        return {
            isChecked: false
        }
    },
    methods: {
        sessionChanged: function(input){
            // console.log(input)
            this.$emit('sessionChanged', {
                sn: this.sessionData.sn, 
                session: this.sessionData.sessionid
            })
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
