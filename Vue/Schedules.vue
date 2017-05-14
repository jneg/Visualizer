<template lang='pug'>
div(class='ui center aligned basic segment')
  h3(class='ui header') Schedules
  div(class='ui transparent left icon input')
    input(v-model='filter.name' placeholder='Name')
    i(class='calendar icon')
  div(class='ui transparent left icon input')
    input(v-model='filter.time' placeholder='Time')
    i(class='wait icon')
  table(class='ui very basic center aligned sorted table')
    thead
      tr
        th Name
        th Time (UTC)
        th # of Scripts
        th Actions
    tbody
      tr(v-for='schedule in filteredSchedules' class='filteredSchedules' v-bind:id='schedule.sched_id')
        td {{schedule.name}}
        td {{schedule.day}} {{schedule.time}}
        td {{schedule.numScripts}}
        td
          button(@click='manageSchedule(schedule.sched_id)' class='ui basic circular button' data-tooltip='Manage' data-position='top center')
            i(class='write icon')
          button(@click='deleteSchedule(schedule.sched_id)' class='ui basic circular button' data-tooltip='Delete' data-position='top center')
            i(class='minus icon')
          button(@click='executeSchedule(schedule.sched_id)' class='ui basic circular button' data-tooltip='Execute' data-position='top center')
            i(class='play icon')
  div(class='ui basic segment')
    div(class='ui transparent left icon input')
      input(v-model='createScheduleName' placeholder='Name')
      i(class='tag icon')
    button(@click='createSchedule' class='ui basic circular button' data-tooltip='Create' data-position='right center' style='color:#00B5AD!important')
      i(class='plus icon')
</template>

<script>
import eventHub from '../EventHub/EventHub.js'

export default {
  data() {
    return {
      filter: {
        name: '',
        time: ''
      },
      schedules: [],
      createScheduleName: ''
    }
  },
  computed: {
    filteredSchedules() {
      return this.schedules.filter((v) => v.name.includes(this.filter.name) && (v.day + ' ' + v.time).includes(this.filter.time))
    }
  },
  methods: {
    createSchedule() {
      this.$socket.emit('createSchedule', {'name': this.createScheduleName, 'day': 'Daily', 'time': '00:00:00'})
      this.createScheduleName = ''
    },
    manageSchedule(schId) {
      eventHub.$emit('hideRightColumn')
      this.$socket.emit('manageSchedule', {'schId': schId})
      window.scroll(0,0)
    },
    deleteSchedule(schId) {
      this.$socket.emit('deleteSchedule', {'schId': schId})
    },
    executeSchedule(schId) {
      this.$socket.emit('executeSchedule', {'schId': schId})
    }
  },
  created() {
    this.$options.sockets.schedules = (s) => this.schedules = s
  }
}
</script>
