<dropdown>
  <select name="dropdown" onchange={ selected }>
    <option each={ opts.options } value={ value }>{ label }</option>
  </select>
  <script>
    var tag = this
    
    selected(event) {
      tag.opts.events.trigger('selected', event.target.value)
    }

    select(event) {
      // TODO update dropdown value
    }
    
  </script>
</dropdown>