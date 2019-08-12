<template>
  <div class="autocomplete"> <!--  v-bind:style="configStyle"> -->
    <input id="input-with-autocomplete"
           type="text"
           name="input"
           v-bind:style="styleObject"
           v-on:input="onInput"
           v-on:blur="onFocusOut"
           v-bind:placeholder="configStyle.placeholder"
           v-model="currentInput"
           v-on:keydown="onKeyDown">

    <div v-bind:id="inputID + 'autocomplete-list'"
         class="autocomplete-items"
         ref='autocompleteitems'
         v-bind:style="'height: ' + (matchingData.length <= 10 ? 'auto'  : '22rem' ) + ';'"
         v-bind:class="{'invisible': (!isAutoCompleting || currentInput.length == 0)}">

         <div v-on:click="onSelection(item)"
              v-for="(item, index) in configData.filter((item) => {
                return (item.substr(0, this.currentInput.length)
                            .toUpperCase() == this.currentInput.toUpperCase())
              })"
              v-bind:key="index"
              v-bind:ref="'item-' + index"
              v-bind:class="{
                  'autocomplete-active': (index == currentFocus),
                }">
              <strong>{{ item.substr(0, currentInput.length) }}</strong>
              {{item.substr(currentInput.length)}}
              <input type='hidden' v-bind:value="item">
          </div>

    </div>

  </div>
</template>

<script>
// Original Source Code from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_autocomplete
export default {
  name: 'MovingInElt',

  props: {
    isVisible: Boolean,
    configStyle: Object,
    configData: Array,
    inputID: String,
  },
  data() {
    return {
      currentInput: '',
      augmentedInput: {},
      isAutoCompleting: false,
      areAutoCompleteItemsVisible: false,
      currentFocus: -1,
      matchingData: [],
    };
  },
  computed: {
    styleObject() {
      const temp = this.configStyle;
      temp['--placeholder-color'] = temp['placeholder-color'] || 'blue';
      temp['--focus-outline'] = temp['focus-outline'] || '-webkit-focus-ring-color auto 1px;';
      temp['--focus-border'] = temp['focus-border'] || '';
      temp['--focus-border-bottom'] = temp['focus-border-bottom'] || '';
      return temp;
    },
  },
  mounted() {
    // var sheets = document.styleSheets;
    // console.log(sheets)
  },
  created() {

  },
  methods: {
    onInput() {
      this.currentFocus = -1;
      this.isAutoCompleting = true;
      this.matchingData = this.configData.filter(item => (item.substr(0, this.currentInput.length)
        .toUpperCase() === this.currentInput.toUpperCase()));
      // console.log(this.matchingData)
    },
    onSelection(item) {
      // console.log(`Selected: ${item}`)
      this.$emit('msg', 'snselected', item);
      this.currentInput = item;
      this.closeAllLists();
    },
    onFocusOut() {
      setTimeout(
        () => {
          this.closeAllLists();
        }, 300,
      );
    },
    // scrollAutoCompleteItems(itemIndex, direction) {
    scrollAutoCompleteItems(itemIndex) {
      // $(".wrapper .inner_div").scrollTop(0);//set to top
      // $(".wrapper .inner_div")
      //   .scrollTop($('.element-hover:first').offset().top
      //            - $(".wrapper .inner_div").height());
      // //then set equal to the position of the selected element minus the height of scrolling div

      const { autocompleteitems } = this.$refs;
      const currentElemt = this.$refs[`item-${itemIndex}`];

      // console.log('-----------------------------------')
      // console.log(autocompleteitems.scrollTop)
      // console.log(autocompleteitems.clientHeight)
      // console.log(itemIndex)
      // console.log(this.matchingData.length)

      const elemtHeight = currentElemt[0].scrollHeight + 1;
      const reqHeightStart = itemIndex * elemtHeight;
      const reqHeightEnd = (itemIndex + 1) * elemtHeight;

      autocompleteitems.scrollTop = (reqHeightStart > autocompleteitems.scrollTop)
        ? ((reqHeightEnd < autocompleteitems.scrollTop + autocompleteitems.clientHeight)
          ? autocompleteitems.scrollTop
          : reqHeightEnd - autocompleteitems.clientHeight)
        : reqHeightStart;
    },
    onKeyDown(event) {
      if (event.keyCode === 40) {
        /* If the arrow DOWN key is pressed,
          increase the currentFocus variable: */
        this.matchingData = this.configData.filter(
          item => (item.substr(0, this.currentInput.length)
            .toUpperCase() === this.currentInput.toUpperCase()),
        );
        this.currentFocus += 1;
        if (this.currentFocus >= this.matchingData.length) {
          this.currentFocus = this.matchingData.length - 1;
        }
        this.scrollAutoCompleteItems(this.currentFocus, 'down');
      } else if (event.keyCode === 38) {
        /* If the arrow UP key is pressed,
          decrease the currentFocus variable: */
        this.currentFocus -= 1;
        if (this.currentFocus < 0) this.currentFocus = 0;
        this.scrollAutoCompleteItems(this.currentFocus, 'up');
      } else if (event.keyCode === 13) {
        /* If the ENTER key is pressed, prevent the form from being submitted, */
        event.preventDefault();
        if (this.currentFocus > -1) {
          /* and simulate a click on the "active" item: */
          // this.onSelection(this.matchingData[this.currentFocus])
          this.onSelection(this.configData.filter(
            item => (item.substr(0, this.currentInput.length)
              .toUpperCase() === this.currentInput.toUpperCase()),
          )[this.currentFocus]);
        }
      }
    },


    closeAllLists() {
      /* close all autocomplete lists in the document,
        except the one passed as an argument: */
      this.isAutoCompleting = false;
      this.areAutoCompleteItemsVisible = false;
    },

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  box-sizing: border-box;
}

/*the container must be positioned relative:*/
.autocomplete {
  position: relative;
  display: inline-block;
  overflow: unset;
}

input {
  border: 1px solid transparent;
  background-color: #f1f1f1;
  padding: 0.5rem;
  font-size: 1rem;
}

input[type=text] {
  background-color: #f1f1f1;
  width: 100%;
}
input::placeholder{
  color: var(--placeholder-color);
}
input:focus{
    outline: var(--focus-outline);
    border: var(--focus-border);
    border-bottom: var(--focus-border-bottom);
}

.autocomplete-items {
  position: absolute;
  border: 1px solid #d4d4d4;
  border-bottom: none;
  border-top: none;
  z-index: 999;
  /*position the autocomplete items to be the same width as the container:*/
  top: 100%;
  left: 0;
  right: 0;
  overflow-y: scroll;
  /* height: 22rem; */
}

.autocomplete-items div {
  padding: 0.5rem;
  cursor: pointer;
  background-color: #fff;
  border-bottom: 1px solid #d4d4d4;
}

/*when hovering an item:*/
.autocomplete-items div:hover {
  background-color: #e9e9e9;
}

/*when navigating through the items using the arrow keys:*/
.autocomplete-active {
  background-color: DodgerBlue !important;
  color: #ffffff;
}

.invisible{
  display: none;
}
</style>
