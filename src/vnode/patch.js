/**
 * 新老节点属性比较
 * @param {object} newVnode 新节点
 * @param {object} oldVnode 老节点
 */
function updateProps(newVnode, oldProps = {}) {
  let domElement = newVnode.domElement; // 新的真实DOM
  let newProps = newVnode.props; // 当前节点的属性
  /**
   * 和老的做对比
   * 1、老的里面有 新的里面没有 这个属性直接干掉
   * 2、老的里面没有 新的里面有
   * 3、style
   */
  // 1
  for (let oldPropName in oldProps) {
    if (!newProps[oldPropName]) {
      delete domElement[oldPropName];
    }
  }
  // 2
  for (let newPropNamin in newProps) {
    domElement[newPropNamin] = newProps[newPropNamin];
  }
  // 3
  let newStyleOjb = newProps.style || {};
  let oldStyleOjb = oldProps.style || {};
  for (let propNmae in oldStyleOjb) {
    if (!newStyleOjb[propNmae]) {
      domElement.style[propNmae] = '';
    }
  }
  // 循环属性给DOM
  for (let newProrsName in newProps) {
    // 如果有style
    if (newProrsName === 'style') {
      let styleObj = newProps.style;
      for (let s in styleObj) {
        domElement.style[s] = styleObj[s];
      }
    } else {
      domElement[newProrsName] = newProps[newProrsName];
    }
  }

}
function createDomElementVnode(vnode) {
  let {
    type,
    props,
    key,
    children,
    text
  } = vnode;
  if (type) {
    vnode.domElement = document.createElement(type);
    // 根据我们虚拟节点的属性 去更新真实的DOM
    updateProps(vnode);
    // 递归调用渲染
    children.forEach(childNode => render(childNode, vnode.domElement));
  }
  else {
    vnode.domElement = document.createTextNode(text);
  }
  return vnode.domElement
}
export function render(vnode, container) {
  let ele = createDomElementVnode(vnode);
  container.appendChild(ele);
}

export function patch(oldVnode, newVnode) {
  // 判断类型 不同
  if (oldVnode.type !== newVnode.type) {
    return oldVnode.domElement.parentNode.replaceChild(
      createDomElementVnode(newVnode),
      oldVnode.domElement
    )
  }
  // 类型相同
  if (oldVnode.text) {
    if (oldVnode.text === newVnode.text) return;
    return oldVnode.domElement.textContent = newVnode.text;
  }
  // 无论节点类型是否相同，到这里都已经换完了，下面开始换属性
  let domElement = newVnode.domElement = oldVnode.domElement;
  updateProps(newVnode, oldVnode.props);
  /**
   * 对比儿子
   * 1、老的有儿子，新的有儿子
   * 2、老的有儿子，新的没儿子
   * 3、新增儿子
   */

  let oldChildren = oldVnode.children;
  let newChildren = newVnode.children;

  if (oldChildren.length > 0 && newChildren.length > 0) { // 1
    updateChildren(domElement, oldChildren, newChildren);
  } else if (oldChildren.length > 0) { // 2
    domElement.innerHTML = ''
  } else if (newChildren.length > 0) { // 3
    // 新增儿子 转成DOM放进去
    for (let i = 0; i < newChildren.length; i++) {
      domElement.appendChild(createDomElementVnode(newChildren[i]))
    }
  }

}

function isSomeVnode(oldVnode, newVnode) {
  return oldVnode.key === newVnode.key && oldVnode.type === newVnode.type;
}

// 创建映射表 {a:0,b:1,c:5,d:9}
function keyMapByIndex(oldChildren) {
  let map = {};
  for (let i = 0; i < oldChildren.length; i++) {
    let current = oldChildren[i];
    if (current.key) {
      map[current.key] = i;
    }
  }
  return map;
}

function updateChildren(parent, oldChildren, newChildren) {
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex];

  let newStartIndex = 0;
  let newStartVnode = newChildren[0];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];

  // 判断老孩子和新的孩子 循环的时候 谁先结束就停止
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex];
    }
    else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    }
    // 如果标签和key相同接着往下走
    else if (isSomeVnode(oldStartVnode, newStartVnode)) {
      // 比较属性
      patch(oldStartVnode, newStartVnode);
      // 如果他们俩一样 分别往'后'走一位
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    }
    else if (isSomeVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode);
      // 如果他们俩一样 分别往'前'走一位
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    }
    else if (isSomeVnode(oldStartVnode, newEndVnode)) { //“旧一” 和 “新最后” 相同
      patch(oldStartVnode, newEndVnode);
      parent.insertBefore(oldStartVnode.domElement, oldEndVnode.domElement.nextSiblings);
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    }
    else if (isSomeVnode(oldEndVnode, newStartVnode)) { //“旧最后” 和 “新一” 相同
      patch(oldEndVnode, newStartVnode);
      parent.insertBefore(oldEndVnode.domElement, oldStartVnode.domElement);
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    }
    else { // 暴力对比
      let map = keyMapByIndex(oldChildren); // 生成映射表
      let index = map[newStartIndex.key];
      if (index === undefined) {
        parent.insertBefore(createDomElementVnode(newStartVnode), oldStartVnode.domElement)
      } else {
        let toMoveNode = oldChildren[index];
        patch(toMoveNode, newStartVnode);
        parent.insertBefore(toMoveNode.domElement, oldStartVnode.domElement);
        oldChildren[index] = undefined;
      }
      // 移动位置
      newStartVnode = newChildren[++newStartIndex];

    }
  }
  // 把多余的节点 放进去 只有小于或者等于 才说明有剩余
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // parent.appendChild(createDomElementVnode(newChildren[i]))
      let beforElement = newChildren[newEndIndex + 1] === undefined ? undefined : newChildren[newEndIndex + 1].domElement;
      parent.insertBefore(createDomElementVnode(newChildren[i]), beforElement);
    }
  }
  // 去除undefined
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if (oldChildren[i]) {
        parent.removeChild(oldChildren[i].domElement);
      }
    }
  }
}