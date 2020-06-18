/**
 * 
 * @param {string} type 节点名称
 * @param {object} props 属性对象
 * @param {string} key key
 * @param {array} children 子节点
 * @param {string} text 文本
 */
export function vnode(type, props, key, children, text) {
  return {
    type, 
    props, 
    key, 
    children, 
    text
  }
}