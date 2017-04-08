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
    input(v-model='filter.state' placeholder='State')
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
      this.$socket.emit('createScript', {'name': this.createScriptName, 'path': this.createScriptPath, 'state': this.createScriptState})
      this.createScriptName = ''
      this.createScriptPath = ''
      this.createScriptState = ''
    },
    historyScript(sid) {
      this.$socket.emit('historyScript', {'sid': sid})
    },
    updateScript(sid) {

    },
    deleteScript(sid) {
      this.$socket.emit('deleteScript', {'sid': sid})
    },
    executeScript(sid) {
      this.$socket.emit('executeScript', {'sid': sid})
    }
  },
  created() {
    this.$options.sockets.scripts = (s) => this.scripts = s
  }
}
</script>
