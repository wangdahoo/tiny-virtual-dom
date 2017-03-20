/**
 * Element Object
 * @param {*} tagName
 * @param {*} props
 * @param {*} children
 */
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
  var tagName = this.tagName.toLowerCase()

  for (var propName in props) {
    var propValue = props[propName]

    if (propName === 'className') {
      el.className = propValue
    } else if (propName === 'style') {
      el.cssText = propValue
    } else if ((tagName === 'input' || tagName === 'textarea') && propName === 'value') {
      el.value = propValue
    } else {
      el.setAttribute(propName, propValue)
    }
  }

  _.each(this.children, function (c) {
    var child = c instanceof Element
      ? c.render()
      : document.createTextNode(c)
    el.appendChild(child)
  })

  return el
}

_.node = function (e) {
  return _.isString(e)
    ? e
    : { tagName: e.tagName, props: e.props, key: e.key, parent: e.parent }
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

if (typeof window !== 'undefined') {
  window.E = Element
}
