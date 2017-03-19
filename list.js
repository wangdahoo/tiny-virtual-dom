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
      new E('h2', [d.nickname]),
      new E('p', [d.memo]),
      new E('img', { src: d.avatar, className: 'avatar' })
    ]))
  })
  return new E('ul', { className: 'list' }, items)
}

var ul = makeList(data)
app.appendChild(ul.render())

var tree1 = ul.allNodes()

// 变更 node tree
// 1. 删除列表的最后一个节点
ul.children.pop()
// 2. 更改第二个列表项的 h2 标签内容为 '张大牛'
ul.children[1].children[0].children[0] = '张大牛'
// 3. 更改第三个列表项的 img 标签的 src 属性值
ul.children[2].children[2].props.src = 'https://gold-cdn.xitu.io/images/app/logo.png'

var tree2 = ul.allNodes()

// console.log('node tree =>', ul.nodeTree())
// console.log('all nodes =>', ul.allNodes())
// console.log('node tree degree =>', ul.degree())

// diff 结果
console.log(diff(tree1, tree2))
