import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
import Socketio from 'socket.io-client'

import Visualizer from './Vue/Visualizer.vue'
import Inscription from './Vue/Inscription.vue'
import StatusMap from './Vue/StatusMap.vue'
import Schedules from './Vue/Schedules.vue'
import Scripts from './Vue/Scripts.vue'
import ManageSchedule from './Vue/ManageSchedule.vue'
import ScriptHistory from './Vue/ScriptHistory.vue'
import Journal from './Vue/Journal.vue'
import OpenJournal from './Vue/OpenJournal.vue'
import './Stylus/Custom.styl'

Vue.use(VueSocketio, 'http://dw.digitaldemocracy.org:80')

Vue.component('Inscription', Inscription)
Vue.component('StatusMap', StatusMap)
Vue.component('Schedules', Schedules)
Vue.component('Scripts', Scripts)
Vue.component('ManageSchedule', ManageSchedule)
Vue.component('ScriptHistory', ScriptHistory)
Vue.component('Journal', Journal)
Vue.component('OpenJournal', OpenJournal)

new Vue({
  el: '#Mount',
  render: h => h(Visualizer)
})
