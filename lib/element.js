/**
 * Element Object
 * @param {*} tagName 
 * @param {*} props 
 * @param {*} children 
 */
function Element (tagName, props, children) {
  if (!this instanceof Element) {
    return new Element(tagName, props, children)
  }

  if (_.isArray(props)) {
    children = props
    props = {}
  }

  this.tagName = tagName
  this.props = props || {}
  this.children = children || []
}

Element.prototype.render = function () {
  var el = document.createElement(this.tagName)
  var props = this.props
  var tagName = this.tagName.toLowerCase()
  
  for (var propName in props) {
    var propValue = props[propName]
    
    if (propName === 'style') {
      el.cssText = propValue
    } else if ((tagName === 'input' || tagName == 'textarea') && propName == 'value') {
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
