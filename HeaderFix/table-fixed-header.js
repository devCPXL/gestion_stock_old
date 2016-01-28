((jQuery) ->
$.fn.fixedHeader = (options) ->
config =
    topOffset: 40
bgColor: "#EEEEEE"

$.extend config, options  if options
    @each ->
    processScroll = ->
return  unless o.is(":visible")
i = undefined
scrollTop = $win.scrollTop()
t = $head.length and $head.offset().top - config.topOffset
headTop = t  if not isFixed and headTop isnt t
if scrollTop >= headTop and not isFixed
isFixed = 1
else isFixed = 0  if scrollTop <= headTop and isFixed
(if isFixed then $("thead.header-copy", o).removeClass("hide") else $("thead.header-copy", o).addClass("hide"))
o = $(this)
$win = $(window)
$head = $("thead.header", o)
isFixed = 0
headTop = $head.length and $head.offset().top - config.topOffset
$win.on "scroll", processScroll

# hack sad times - holdover until rewrite for 2.1
    $head.on "click", ->
unless isFixed
setTimeout (->
$win.scrollTop $win.scrollTop() - 47
), 10

$head.clone().removeClass("header").addClass("header-copy header-fixed").appendTo o
ww = []
o.find("thead.header > tr:first > th").each (i, h) ->
ww.push $(h).width()

$.each ww, (i, w) ->
o.find("thead.header > tr > th:eq(" + i + "), thead.header-copy > tr > th:eq(" + i + ")").css width: w

o.find("thead.header-copy").css
margin: "0 auto"
width: o.width()
"background-color": config.bgColor

processScroll()

) jQuery