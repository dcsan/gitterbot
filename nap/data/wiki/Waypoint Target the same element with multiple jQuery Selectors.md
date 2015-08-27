# Target the same element with multiple jQuery Selectors
The multiple jQuery selectors are:
1. By type: `$("button")`
2. By class: `$(".btn")`
3. By id: `$("#target1")`

```
<script>
  $(document).ready(function() {
    $("button").addClass("animated");
    $(".btn").addClass("shake");
    $("#target1").addClass("animated shake btn-primary");
  });
</script>
```
