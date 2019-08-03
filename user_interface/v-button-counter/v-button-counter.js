// Define a new component called button-counter
Vue.component('button-counter', {
    data: function() {
        return {
            count: 0
        }
    },
    template: '<button class="v-button-counter" v-on:click="count++">You clicked me {{ count }} times.</button>'
})