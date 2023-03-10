/*
 * ========================================================================
 * Visibility 1.0.3
 * The target was hidden or shown when window scroll to the specified area
 * YILING CHEN
 * Copyright 2023, MIT License
 * How to use it:
 * see README.md
 * ========================================================================
 */
var viewSelf;

class Visibility{
  constructor(arrObjs){
    viewSelf = this;
    this.arrObjs = arrObjs;
  }
  
  get scrSize(){// Return the detailed size of user screen
    return {
      "width": screen.width || screen.availWidth, 
      "height": screen.height || screen.availHeight
    };
  }

  get winSize(){// Return the detailed size of user window
    return {
      "innerWidth": window.innerWidth,    // width without scrollbar-x
      "innerHeight": window.innerHeight,  // height without scrollbar-y
      "outerWidth": window.outerWidth,    // width with scrollbar-x
      "outerHeight": window.outerHeight   // height without scrollbar-y
    };
  }

  get docSize(){// Return the detailed size of user document
    return {
      "docHeight": document.body.scrollHeight || document.body.clientHeight || document.documentElement.scrollHeight || document.documentElement.offsetHeight,
      "docScrollTop": document.documentElement.scrollTop || document.scrollingElement.scrollTop, // docLoadedHeight
      "docScrollBottom": (document.body.scrollHeight || document.body.clientHeight || document.documentElement.scrollHeight || document.documentElement.offsetHeight) 
      - (document.documentElement.scrollTop || document.scrollingElement.scrollTop) // docUnloadedHeight
    };
  }
  
  getObjSize(node){
    if(!node) return;
    let offsetLeft = 0, offsetTop = 0;
    var node = document.querySelector(node);
    let offsetHeight = node.offsetHeight, offsetWidth = node.offsetWidth;
    while(node){ // if null return
      offsetLeft += node.offsetLeft;
      offsetTop += node.offsetTop;
      node = node.offsetParent;
    }
    return {
      "offsetLeft": offsetLeft, 
      "offsetTop": offsetTop,
      "offsetHeight": offsetHeight,
      "offsetWidth": offsetWidth
    };
  }
  isHorizontal(c1){
    return this.winSize.innerWidth <= (this.winSize.innerWidth - this.getObjSize(c1[0]).offsetLeft + this.getObjSize(c1[1]).offsetWidth);
  }
  isVertical(c1, c, offsetExtra, peekaboo){
    let offsetTop = c ? this.getObjSize(c).offsetHeight + offsetExtra ? offsetExtra: 0: 0;
    let pointA = this.getObjSize(c1[0]).offsetTop - offsetTop;
    let pointB = this.docSize.docHeight - this.getObjSize(c1[1]).offsetTop + offsetTop - this.getObjSize(c1[1]).offsetHeight;
    return this.docSize.docScrollTop + (peekaboo ? offsetExtra: 0) >= pointA && pointB <= (peekaboo ? this.docSize.docScrollBottom - this.winSize.innerHeight: this.docSize.docScrollBottom);
  }
  forEach(){
    this.arrObjs.forEach(c=>{
      c.arrVisible = [];
      c.qSelector = document.querySelector(c.selector);
      c.visible = false;
      c.offsetTop = this.getObjSize(c.areas[0][0]).offsetTop;
      c.areas.forEach((c1, i1)=>{
        c.horizVisible = c.horizontal && this.isHorizontal(c1) ? false: true; // if horizontal
        if(this.isVertical(c1, c.selector, c.offsetExtra, c.peekaboo)){
          c.arrVisible[i1] = true;
          c.visible = true;
        }else{
          c.arrVisible[i1] = false;
          c.visible = false;
        }
      })
      if (c.areas.length >= c.arrVisible.length && c.arrVisible.some(c2=>c2==true)) c.visible = true;
      if (c.areas.length >= c.arrVisible.length && c.arrVisible.every(c2=>c2==false)) c.visible = false;
      c.callback && c.callback();
    })
  }
  start(){
    ["DOMContentLoaded", "scroll", "resize"].forEach(c=>window.addEventListener(c, ()=>this.forEach()));
  }
  event(listener, condition, callback){
    if(Object.prototype.toString.call(this.arrObjs) !== "[object Array]") return;
    setTimeout(()=>{
      this.arrObjs.filter(condition).forEach(c1=>{
        c1.qSelector && c1.qSelector.addEventListener(listener, function(event){
          event.preventDefault();
          callback && callback.call(null, c1);
        })
      })
    }, 100)
  }
}