<template lang='pug'>
div(v-if="show" class='ui center aligned basic segment')
  h3(class='ui header') Script {{currentScript}} History
  div(class='ui transparent left icon input')
    input(v-model='filter.start_time' placeholder='Start Time')
    i(class='wait icon')
  div(class='ui transparent left icon input')
    input(v-model='filter.status' placeholder='Status')
    i(class='heartbeat icon')
  div(class='ui transparent left icon input')
    input(v-model='filter.notes' placeholder='Notes')
    i(class='sticky note outline icon')
  table(class='ui very basic center aligned sorted table')
    thead
      tr
        th Hid
        th Start Time
        th End Time
        th Status
        th Inserted
        th Modified
        th Deleted
        th Notes
    tbody
      tr(v-for='history in filteredHistory')
        td {{history.hid}}
        td {{history.start_time}}
        td {{history.end_time}}
        td {{history.status}}
        td {{history.inserted}}
        td {{history.modified}}
        td {{history.deleted}}
        td
          button(v-if="checkNotes(history.notes)" @click='showNotes(history.notes)' class='ui basic circular button' data-tooltip='Expand Notes' data-position='top center')
            i(class='plus icon')
</template>

<script>
import eventHub from '../EventHub/EventHub.js'

export default {
  data() {
    return {
      show: false,
      filter: {
        status: '',
        notes: '',
        start_time:''
      },
      scriptHistory: [],
      currentScript: ''
    }
  },
  computed: {
    filteredHistory() {
      return this.scriptHistory.filter((v) => v.status.includes(this.filter.status) && v.notes.includes(this.filter.notes) && v.start_time.includes(this.filter.start_time))
    }
  },
  methods: {
    showNotes(notes) {
      if(notes) {
        alert(notes)
      }
      else {
      }
    },
    checkNotes(notes) {
       if(notes == "" || notes == null) {
          return false;
       }
       else {
          return true;
       }
    }
  },
  created() {
    this.$options.sockets.scriptHistory = (sh) => {
      this.currentScript = sh[0].name
      this.scriptHistory = sh
      this.show = true
    }
    eventHub.$on('hideRightColumn', () => {
      this.show = false
    })
  }
}
</script>
