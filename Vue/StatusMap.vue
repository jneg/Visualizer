<template lang='pug'>
div(class='ui center aligned basic segment')
  h3(class='ui header') Status Map
  div(id='status-map' style='width:100%;height:500px;')
  div(class='ui small label' style='background-color:#8fcf83!important;color:#ffffff!important;') Updated
  div(class='ui small label' style='background-color:#ffda89!important;color:#ffffff!important;') Outdated
  div(class='ui small label' style='background-color:#ef5a5a!important;color:#ffffff!important;') Failure
</template>

<script>
import eventHub from '../EventHub/EventHub.js'

export default {
  methods: {
    renderMap() {
      const colors = {'Updated': '#8fcf83', 'Outdated': '#fff789', 'Failure': '#ef5a5a'}

      var stateColors = {}
      for (var i = 0; i < this.map.length; i++) {
        stateColors[this.map[i].state] = {'fill': colors[this.map[i].status]}
      }
     
      $('#status-map').usmap({
        'stateStyles': {'fill': '#FFFFFF', 'stroke': '#777777'},
        'stateHoverStyles': {'fill': '#add8e6'},
        'stateSpecificStyles': stateColors,
        click : function(event, data) {
           eventHub.$emit('setFilterState', data.name);
        }
      })
    },
    setStateValue(stateName) {
      eventHub.$emit('setFilterState', stateName);
    }
  },
  mounted() {
    this.$options.sockets.map = (m) => {
      this.map = m
      this.renderMap()
    }
  }
}
</script>
