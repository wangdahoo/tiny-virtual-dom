/* eslint no-unused-vars: "off" */
var REPLACED = 0 // 节点被替换
var MOVED = 1 // 节点被移动（在同一dom层级内）
var PROP = 2 // 节点属性被修改
var TEXT = 3 // 节点本身为文本节点，且文本内容被更改

function diff (oldTree, newTree) {
  var patches = {}

  _.each(newTree, function (newNode) {
    console.log(newNode)
  })

  return patches
}
