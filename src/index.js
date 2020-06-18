import { createElement, render, patch } from "./vnode";

// 1.创建虚似dom
/**
  let oldVnode = createElement('div',{
    id: 'odiv',
    a: 1,
    key: 'okey'
  },createElement('span',{
    style: {
      color: 'red'
    }
  },'spantext'),'divtext');
*/
let oldVnode = createElement('ul', {},
  createElement('li', {
    style: {
      background: 'red'
    },
    key: 'A'
  }, 'A'),
  createElement('li', {
    style: {
      background: 'green'
    },
    key: 'B'
  }, 'B'),

  createElement('li', {
    style: {
      background: 'pink'
    },
    key: 'E'
  }, 'E'),
  createElement('li', {
    style: {
      background: 'blue'
    },
    key: 'C'
  }, 'C'),
  createElement('li', {
    style: {
      background: 'yellow'
    },
    key: 'D'
  }, 'D')
);

console.log(oldVnode);
// 2.渲染虚似节点
render(oldVnode, app);


// 1.创建虚似dom
let newVnode = createElement('ul', {},

  
  
  createElement('li', {
    style: {
      background: 'green'
    },
    key: 'B'
  }, 'B'),
  createElement('li', {
    style: {
      background: 'yellow'
    },
    key: 'D'
  }, 'D'),
  createElement('li', {
    style: {
      background: 'red'
    },
    key: 'A'
  }, 'A'),

  createElement('li', {
    style: {
      background: 'blue'
    },
    key: 'C'
  }, 'C'),
);

setTimeout(() => {
  patch(oldVnode, newVnode);
}, 2000);