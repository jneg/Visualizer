<template lang='pug'>
div(v-if="show" class='ui center aligned basic segment')
  h3(class='ui header') Manage {{name}} ({{schId}})
  div(class='basic ui segment')
    div(class='ui input')
      input(v-model='name' type='text')
    select(v-model='day' class='ui dropdown')
      option Daily
      option Monday
      option Tuesday
      option Wednesday
      option Thursday
      option Friday
      option Saturday
      option Sunday
    select(v-model='hour' class='ui dropdown')
      option 00
      option 01
      option 02
      option 03
      option 04
      option 05
      option 06
      option 07
      option 08
      option 09
      option 10
      option 11
      option 12
      option 13
      option 14
      option 15
      option 16
      option 17
      option 18
      option 19
      option 20
      option 21
      option 22
      option 23
    | :
    select(v-model='minute' class='ui dropdown')
      option 00
      option 01
      option 02
      option 03
      option 04
      option 05
      option 06
      option 07
      option 08
      option 09
      option 10
      option 11
      option 12
      option 13
      option 14
      option 15
      option 16
      option 17
      option 18
      option 19
      option 20
      option 21
      option 22
      option 23
      option 24
      option 25
      option 26
      option 27
      option 28
      option 29
      option 30
      option 31
      option 32
      option 33
      option 34
      option 35
      option 36
      option 37
      option 38
      option 39
      option 40
      option 41
      option 42
      option 43
      option 44
      option 45
      option 46
      option 47
      option 48
      option 49
      option 50
      option 51
      option 52
      option 53
      option 54
      option 55
      option 56
      option 57
      option 58
      option 59
    | :
    select(v-model='second' class='ui dropdown')
      option 00
      option 01
      option 02
      option 03
      option 04
      option 05
      option 06
      option 07
      option 08
      option 09
      option 10
      option 11
      option 12
      option 13
      option 14
      option 15
      option 16
      option 17
      option 18
      option 19
      option 20
      option 21
      option 22
      option 23
      option 24
      option 25
      option 26
      option 27
      option 28
      option 29
      option 30
      option 31
      option 32
      option 33
      option 34
      option 35
      option 36
      option 37
      option 38
      option 39
      option 40
      option 41
      option 42
      option 43
      option 44
      option 45
      option 46
      option 47
      option 48
      option 49
      option 50
      option 51
      option 52
      option 53
      option 54
      option 55
      option 56
      option 57
      option 58
      option 59
  div(class='ui basic segment')
    draggable(v-model='scheduleScripts' @start="drag=true" @end="drag=false")
      div(v-for='(s, i) in scheduleScripts')
        | {{s.sid}} : {{s.name}}
        button(@click="removeScheduleScript(i)" class="ui basic circular button" data-tooltip='Remove' data-position='right center' style="color:rgb(0,0,0,0.8)!important;")
          i(class="minus icon")
  div(class='ui basic segment')
    select(v-model='appendScript' class='ui dropdown')
      option(selected disabled) Append Script
      option(v-for='s in allScripts') {{s.sid}} : {{s.name}}
</template>

<script>
import eventHub from '../EventHub/EventHub.js'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data() {
    return {
      show: false,
      schId: '',
      name: '',
      day: '',
      hour: '',
      minute: '',
      second: '',
      scheduleScripts: [],
      allScripts: [],
      appendScript: 'Append Script'
    }
  },
  computed: {
    time() {
      return this.hour + ':' + this.minute + ':' + this.second;
    },
    sids() {
      return this.scheduleScripts.map(function(o) {return o.sid;});
    }
  },
  created() {
    this.$options.sockets.manageScheduleShow = (show) => this.show = show;
    this.$options.sockets.manageScheduleId = (schId) => this.schId = schId;
    this.$options.sockets.manageScheduleName = (name) => this.name = name;
    this.$options.sockets.manageScheduleDay = (day) => this.day = day;
    this.$options.sockets.manageScheduleHour = (hour) => this.hour = hour;
    this.$options.sockets.manageScheduleMinute = (minute) => this.minute = minute;
    this.$options.sockets.manageScheduleSecond = (second) => this.second = second;
    this.$options.sockets.manageScheduleScripts = (scheduleScripts) => this.scheduleScripts = scheduleScripts;
    this.$options.sockets.manageScheduleAllScripts = (allScripts) => this.allScripts = allScripts;
    eventHub.$on('hideRightColumn', () => {
      this.show = false
    })
  },
  methods: {
    removeScheduleScript(index) {
      this.scheduleScripts.splice(index, 1)
    }
  },
  watch: {
    name() {
      this.$socket.emit('updateScheduleName', {'schId': this.schId, 'name': this.name});
    },
    day() {
      this.$socket.emit('updateScheduleDay', {'schId': this.schId, 'day': this.day});
    },
    time() {
      if (/^\d{2}$/.test(this.hour) && /^\d{2}$/.test(this.minute) && /^\d{2}$/.test(this.second)) {
        this.$socket.emit('updateScheduleTime', {'schId': this.schId, 'time': this.time});
      }
    },
    sids() {
      this.$socket.emit('updateScheduleSids', {'schId': this.schId, 'sids': this.sids});
    },
    appendScript() {
      const scriptArray = this.appendScript.split(' ')
      this.scheduleScripts.push({'sid': scriptArray[0], 'name': scriptArray[2]})
    }
  }
}
</script>
