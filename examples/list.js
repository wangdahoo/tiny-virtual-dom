var app = document.getElementById('app')
var avatar = 'https://avatars0.githubusercontent.com/u/8207553?v=3&u=a269f5bb2f0eff34f3853c9e51f1d5cbb549c910&s=100'
var data = [
  { nickname: '王大虎', memo: '这家伙很懒，什么也没留下', avatar: avatar, active: true },
  { nickname: '王大虎', memo: '这家伙很懒，什么也没留下', avatar: avatar },
  { nickname: '王大虎', memo: '这家伙很懒，什么也没留下', avatar: avatar },
  { nickname: '王大虎', memo: '这家伙很懒，什么也没留下', avatar: avatar },
  { nickname: '王大虎', memo: '这家伙很懒，什么也没留下', avatar: avatar }
]

function makeList (data) {
  var items = []
  _.each(data, function (d) {
    items.push(new E('li', { className: d.active ? 'item active' : 'item' }, [
      new E('h2', { textContent: d.nickname }),
      new E('p', { textContent: d.memo }),
      new E('img', { src: d.avatar, className: 'avatar' })
    ]))
  })
  return new E('ul', { className: 'list' }, items)
}

// Root Element
var ul = makeList(data)
app.appendChild(ul.render())
var tree1 = ul.allNodes()

// 变更 node tree
var ul2 = _.cloneDeep(ul)
// 1. 删除列表的最后一个节点
ul2.children.pop()
// 2. 更改第二个列表项的 h2 标签内容为 '张大牛'
ul2.children[1].children[0].props.textContent = '张大牛'
// 3. 更改第三个列表项的 img 标签的 src 属性值
ul2.children[2].children[2].props.src = 'https://gold-cdn.xitu.io/images/app/logo.png'

// app.appendChild(ul2.render())

var tree2 = ul2.allNodes()

console.info('===== all nodes =====')
console.info(ul.allNodes())

console.info('===== tree degree =====')
console.info(ul.degree())

console.info('===== degree by key =====')
console.info(ul.degree(ul.children[1].key))

// diff 结果
var patches = D(tree1, tree2)
console.info('===== diff result =====')
console.log(patches)

// apply patches
var sec = 5
var countDown = setInterval(function () {
  if (sec === 0) {
    clearInterval(countDown)
    ul.rerender(patches)
  }
  document.querySelector('.count-down').innerHTML = sec ? sec-- + '秒后更新视图' : ''
}, 1000)
