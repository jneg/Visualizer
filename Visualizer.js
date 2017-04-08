import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
import Socketio from 'socket.io-client'
import Store from './Store/Store.js'
import Visualizer from './Vue/Visualizer.vue'
import Inscription from './Vue/Inscription.vue'
import StatusMap from './Vue/StatusMap.vue'
import Schedules from './Vue/Schedules.vue'
import Scripts from './Vue/Scripts.vue'
import Journal from './Vue/Journal.vue'
import ScriptHistory from './Vue/ScriptHistory.vue'
import './Stylus/Custom.styl'

Vue.use(VueSocketio, 'http://dw.digitaldemocracy.org:80')
Vue.use(VueSocketio, Socketio('http://dw.digitaldemocracy.org:80'), Store)

Vue.component('Inscription', Inscription)
Vue.component('StatusMap', StatusMap)
Vue.component('Schedules', Schedules)
Vue.component('Scripts', Scripts)
Vue.component('Journal', Journal)
Vue.component('ScriptHistory', ScriptHistory)

new Vue({
  el: '#Mount',
  Store,
  render: h => h(Visualizer)
})
