<template lang='pug'>
div(class='ui center aligned basic segment')
  h3(class='ui header') Script {{currentScript}} History
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
        th Status
        th Notes
    tbody
      tr(v-for='history in filteredHistory')
        td {{history.hid}}
        td {{history.status}}
        td {{history.notes}}
</template>

<script>
export default {
  data() {
    return {
      filter: {
        status: '',
        notes: ''
      },
      scriptHistory: [],
      currentScript: ''
    }
  },
  computed: {
    filteredHistory() {
      return this.scriptHistory.filter((v) => v.status.includes(this.filter.status) && v.notes.includes(this.filter.notes))
    }
  },
  created() {
    this.$options.sockets.scriptHistory = (sh) => {
      this.currentScript = sh[0].sid
      this.scriptHistory = sh
    }
  }
}
</script>
