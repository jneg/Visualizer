<template lang='pug'>
div(class='ui center aligned basic segment')
  h3(class='ui header') Journal
  div(class='ui transparent left icon input')
    input(v-model='filter.moment' placeholder='Moment')
    i(class='alarm outline icon')
  div(class='ui transparent left icon input')
    input(v-model='filter.source' placeholder='Source')
    i(class='cube icon')
  div(class='ui transparent left icon input')
    input(v-model='filter.message' placeholder='Message')
    i(class='comment outline icon')
  table(class='ui very basic center aligned sorted table')
    thead
      tr
        th Jid
        th Moment
        th Source
        th Message
    tbody
      tr(v-for='log in journal')
        td {{log.jid}}
        td {{log.moment}}
        td {{log.source}}
        td {{log.message}}
</template>

<script>
import Store from '../Store/Store.js'

export default {
  data() {
    return {
      'filter': { 
        'moment': '',
        'source': '',
        'message': ''
      },
      'journal': []
    }
  },
  computed: {
    filteredJournal() {
      return this.journal.filter(function (v) {
        return v.moment.includes(this.filter.moment) && v.source.includes(this.filter.source) && v.message.includes(this.filter.message);
      }, this);
    }
  },
  created() {
    this.$options.sockets.journal = (j) => this.journal = j
  }
}
</script>
