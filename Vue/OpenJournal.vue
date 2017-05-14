<template lang='pug'>
div(class='ui center aligned basic segment')
  button(@click='openJournal' class='ui teal basic button') Open Journal
</template>

<script>
import eventHub from '../EventHub/EventHub.js'

export default {
  methods: {
    openJournal() {
      eventHub.$emit('hideRightColumn')
      eventHub.$emit('showJournal')
      window.scroll(0, 0)
    }
  }
}
</script>
