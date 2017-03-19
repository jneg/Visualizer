const manageSchedule = function (scheduleRow) {
  $(document).ready(function () {
    const scheduleTime = scheduleRow.time.split(':')

    $('.ui.dropdown#day').dropdown('set text', scheduleRow.day)
    $('.ui.dropdown#hour').dropdown('set text', scheduleTime[0])
    $('.ui.dropdown#minute').dropdown('set text', scheduleTime[1])
    $('.ui.dropdown#second').dropdown('set text', scheduleTime[2])

    dragula([document.querySelector('#schedule-scripts'), document.querySelector('#all-scripts')], {
      accepts: function(el, target, source, sibling) {
        return target == document.querySelector('#schedule-scripts')
      },
      copy: function (el, source) {
        return source == document.querySelector('#all-scripts')
      },
      removeOnSpill: true
    })

    $('button#update-schedule').click(function (e) {
      var body = {}
      const day = $('.ui.dropdown#day').dropdown('get text')
      body.name = $('h2#scheduleName').text()
      body.day = day
      body.time = $('.ui.dropdown#hour').dropdown('get text') + ':' + $('.ui.dropdown#minute').dropdown('get text') + ':' + $('.ui.dropdown#second').dropdown('get text')
      body.sids = []
      $.each($('#schedule-scripts > div'), function (i, v) {
        body.sids.push(parseInt($(v).text().match(/\d+/)[0], 10))
      })

      var updateEndpoint = window.location.href.split('/')
      updateEndpoint.pop()
      updateEndpoint = updateEndpoint.join('/') + '/update'

      $.ajax({
        url: updateEndpoint,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(body),
        success: function () {
          window.location.reload()
        }
      })
    })

    $('button#delete-schedule').click(function (e) {
      var deleteEndpoint = window.location.href.split('/')
      deleteEndpoint.pop()
      deleteEndpoint = deleteEndpoint.join('/') + '/delete'

      $.ajax({
        url: deleteEndpoint,
        type: 'PUT',
        success: function () {
          window.location.href = window.location.protocol + '//' + window.location.hostname + '/system/schedules'
        }
      })
    })
  })
}
