import { vnode } from "./vnode";

/**
 * 创建元素 
 * @param {string} type 元素名称
 * @param {object} props 元素属性对旬
 * @param  {...any} children 后面所有参数组成的数组（可能是 标签子节点 或 文本子节点）
 */
export default function createElement(type,props={},...children){
  // 获取key属性 然后删掉(因为不需要渲染为元素的属性)
  let key = '';
  if(props.key) {
    key = props.key;
    delete props.key;
  }
  // 子节点是标签还是文本
  children = children.map(child=>{
    if(typeof child==='string'){
      return vnode(undefined,undefined,undefined,undefined,child);
    }else {
      return child;
    }
  })
  return vnode(type,props,key,children,)
}