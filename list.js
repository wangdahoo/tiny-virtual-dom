var app = document.getElementById('app')
var avatar = 'https://avatars0.githubusercontent.com/u/8207553?v=3&u=a269f5bb2f0eff34f3853c9e51f1d5cbb549c910&s=100'
var data = [
  { nickname: '王大虎', memo: '这家伙很懒，什么也没留下', avatar: avatar },
  { nickname: '王大虎', memo: '这家伙很懒，什么也没留下', avatar: avatar },
  { nickname: '王大虎', memo: '这家伙很懒，什么也没留下', avatar: avatar },
  { nickname: '王大虎', memo: '这家伙很懒，什么也没留下', avatar: avatar },
  { nickname: '王大虎', memo: '这家伙很懒，什么也没留下', avatar: avatar }
]
var items = []
_.each(data, function (d) {
  items.push(new E('li', { className: 'item' }, [
    new E('h2', [d.nickname]),
    new E('p', [d.memo]),
    new E('img', { src: d.avatar, className: 'avatar' })
  ]))
})
var ul = new E('ul', { className: 'list' }, items)

app.appendChild(ul.render())

console.log(ul.nodeTree())
console.log(ul.allNodes())
console.log(ul.degree())
