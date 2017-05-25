<template lang='pug'>
div(class='ui center aligned basic segment')
  h3(class='ui header') Scripts
  div(class='ui transparent left icon input')
    input(v-model='filter.status' placeholder='Status')
    i(class='heartbeat icon')
  div(class='ui transparent left icon input')
    input(v-model='filter.name' placeholder='Name')
    i(class='code icon')
  div(class='ui transparent left icon input')
    input(v-model='filter.state' id='scriptStateFilter' placeholder='State')
    i(class='map pin icon')
  table(class='ui very basic center aligned sorted table')
    thead
      tr
        th Name
        th State
        th Actions
    tbody
      tr(v-for='script in filteredScripts' class='filteredScripts' v-bind:id='script.sid')
        td(v-bind:class='script.status') {{script.name}}
        td {{script.state}}
        td
          button(@click='historyScript(script.sid)' class='ui basic circular button' data-tooltip='History' data-position='top center')
            i(class='list icon')
          button(@click='updateScript(script.sid)' class='ui basic circular button' data-tooltip='Update' data-position='top center')
            i(class='write icon')
          button(@click='deleteScript(script.sid)' class='ui basic circular button' data-tooltip='Delete' data-position='top center')
            i(class='minus icon')
          button(@click='executeScript(script.sid)' class='ui basic circular button' data-tooltip='Execute' data-position='top center')
            i(class='play icon')
  div(class='ui basic segment')
    div(class='ui transparent left icon input')
      input(v-model='createScriptName' placeholder='Name')
      i(class='code icon')
    div(class='ui transparent left icon input')
      input(v-model='createScriptPath' placeholder='Path')
      i(class='folder open outline icon')
    div(class='ui transparent left icon input')
      input(v-model='createScriptState' placeholder='State')
      i(class='map pin icon')
    button(@click='createScript' class='ui basic circular button' style='color:#00B5AD!important' data-tooltip='Create' data-position='right center')
      i(class='plus icon')
</template>

<script>
import eventHub from '../EventHub/EventHub.js'

export default {
  data() {
    return {
      filter: {
        status: '',
        name: '',
        state: ''
      },
      scripts: [],
      createScriptName: '',
      createScriptPath: '',
      createScriptState: ''
    }
  },
  computed: {
    filteredScripts() {
      return this.scripts.filter((v) => v.status.includes(this.filter.status) && v.name.includes(this.filter.name) && v.state.includes(this.filter.state))
    }
  },
  methods: {
    createScript() {
      if (this.createScriptName == '' || this.createScriptPath == '') {
        alert("Script name and Script path must not be empty");
      }
      // Hard coded state check
      else if (this.createScriptState != 'CA' && this.createScriptName != 'NY') {
        alert("State does not exist in the database");
      }
      else {
        this.$socket.emit('createScript', {'name': this.createScriptName, 'path': this.createScriptPath, 'state': this.createScriptState})
        // If statement to check if any of the fields are empty
        this.createScriptName = ''
        this.createScriptPath = ''
        this.createScriptState = ''
      }
    },
    historyScript(sid) {
      eventHub.$emit('hideRightColumn')
      this.$socket.emit('historyScript', {'sid': sid})
      window.scroll(0, 0)
    },
    updateScript(sid) {

    },
    deleteScript(sid) {
      var r = confirm("Are you sure you want to delete this script?")
      
      if (r == true) {
         this.$socket.emit('deleteScript', {'sid': sid})
      }
    },
    executeScript(sid) {
      this.$socket.emit('executeScript', {'sid': sid})
    }
  },
  created() {
    this.$options.sockets.scripts = (s) => this.scripts = s
  },
  mounted() {
    eventHub.$on('setFilterState', (stateName) => {
      this.filter.state = stateName;
    })
  }
}
</script>
