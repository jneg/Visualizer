<template lang='pug'>
div(class='ui center aligned basic segment')
  h3(class='ui header') Status Map
  div(id='status-map' style='width:100%;height:500px;')
</template>

<script>
import Store from '../Store/Store.js'

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
        'stateSpecificStyles': stateColors
      })
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
