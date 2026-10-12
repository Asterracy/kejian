'use strict';
window.AppStorage={getItem:k=>KejianNative.getItem(k),setItem:(k,v)=>{if(!KejianNative.setItem(k,String(v)))throw Error('本机保存失败，请检查存储空间或数据数量。');},removeItem:k=>{if(!KejianNative.removeItem(k))throw Error('本机保存失败。');}};
window.AndroidInflate=async(bytes,limit)=>{let text='';for(let i=0;i<bytes.length;i+=8192)text+=String.fromCharCode(...bytes.subarray(i,i+8192));const result=KejianNative.inflateRaw(btoa(text),limit);if(result===null)throw Error('压缩内容损坏或解压体积超过限制。');return Uint8Array.from(atob(result),c=>c.charCodeAt(0));};
