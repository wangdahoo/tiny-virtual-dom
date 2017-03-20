var NONE = 0 // 节点不变
var DELETED = 1 // 节点被删除
var REPLACED = 2 // 节点被替换为其他标签
var PROP = 3 // 节点属性被修改，包括文本内容

// TODO: 节点被移动（在同一dom层级内）
// var REORDER = 4

_.setAttr = function (el, props) {
  for (var propName in props) {
    var propValue = props[propName]
    var tagName = el.tagName.toLowerCase()

    if (['className', 'textContent'].indexOf(propName) > -1) {
      el[propName] = propValue
    } else if (propName === 'style') {
      el.cssText = propValue
    } else if ((tagName === 'input' || tagName === 'textarea') && propName === 'value') {
      el.value = propValue
    } else {
      el.setAttribute(propName, propValue)
    }
  }
}

_.node = function (e) {
  return _.pick(e, ['tagName', 'props', 'key', 'parent'])
}

function Element (tagName, props, children) {
  if (!(this instanceof Element)) {
    return new Element(tagName, props, children)
  }

  if (_.isArray(props)) {
    children = props
    props = {}
  }

  var key = Math.random().toString(36).substr(3, 8)
  this.tagName = tagName
  this.props = props || {}
  this.children = children || []
  this.key = key
  _.each(this.children, function (child) {
    child.parent = key
  })
}

Element.prototype.render = function () {
  var el = document.createElement(this.tagName)
  var props = this.props
  _.setAttr(el, props)
  _.each(this.children, function (c) {
    el.appendChild(c.render())
  })
  el.setAttribute('v-' + this.key, '')
  return el
}

Element.prototype.rootNode = function () {
  return _.node(this)
}

Element.prototype.childNodes = function () {
  return _.map(this.children, function (child) {
    return _.node(child)
  })
}

Element.prototype.nodeTree = function () {
  return [
    _.node(this),
    _.map(this.children, function (child) {
      return child.nodeTree
        ? child.nodeTree()
        : _.node(child)
    })
  ]
}

Element.prototype.allNodes = function () {
  var nodes = _.filter(_.flattenDeep(this.nodeTree()), 'key')

  function parent (n) {
    return _.find(nodes, function (node) {
      return node.key === n.parent
    })
  }

  function climb (n, degree) {
    degree = degree || 0
    var p = parent(n)
    if (!p) return degree
    return climb(p, ++degree)
  }

  _.each(nodes, function (n) {
    n.degree = climb(n)
  })

  return nodes
}

Element.prototype.degree = function (key) {
  var nodes = this.allNodes()
  var d = _.find(nodes, function (d) {
    return d.key === key
  })
  return d
    ? d.degree
    : _.maxBy(nodes, 'degree').degree
}

Element.prototype.rerender = function (patches) {
  var root = this.key
  _.each(patches, function (patch, key) {
    var target = document.querySelector('[v-' + root + '] [v-' + key + ']')
    if (!target) return

    switch (patch.action) {
      case DELETED:
        target.parentNode.removeChild(target)
        break
      case REPLACED:
        target.parentNode.replaceChild(patch.data.render(), target)
        break
      case PROP:
        _.setAttr(target, patch.data)
        break
      // TODO: REORDER
    }
  })
}

function diff (oldTree, newTree) {
  var patches = {}

  _.each(oldTree, function (oldNode, oldIndex) {
    var key = oldNode.key
    var degree = oldNode.degree
    var patch = {}

    var newNode = _.find(newTree, function (n) {
      return n.degree === degree && n.key === key
    })

    if (newNode === undefined) {
      patch.action = DELETED
    } else if (newNode.tagName !== oldNode.tagName) {
      patch.action = REPLACED
      patch.data = newNode
    } else if (!_.isEqual(newNode.props, oldNode.props)) {
      patch.action = PROP
      patch.data = newNode.props
    } else {
      patch.action = NONE
    }

    if (patch.action !== NONE) {
      patches[key] = patch
    }
  })

  return patches
}

if (typeof window !== 'undefined') {
  window.E = Element
  window.D = diff
}
