const obj = {
    name: 'hhh',
    age:  18
}

/**
 * 一 响应式函数的封装
 * 现在需要做到的是当name的值发生变化的时候，有name的function都要做出更改
 * 所以就需要收集与name相关的所有functions
 * 将这些functions保存起来
 * 
 * 二  依赖收集类的封装
 * 第一步是将所有的依赖都保存到一个 数组里，不能区分是哪一个属性对应的function，
 * 所以需要重新设计。
 * 应该是每一个属性对应的functions放在不同的数组里
 * name  New Denpend() ---> reactiveFn
 * age   New Depend()  ---> reactiveFn
 * 
 * 三 自动监听对象的变化
 * 当属性值发生变化时可以自动执行相应的函数
 * Proxy  Object.defineProperty()
 * 在 set 中 调用depend.notify()
 * 
 * 四 收集依赖的管理
 * function getDepend()
 * 
 * 五 正确的收集依赖
 * function watchFn(fn){}
 * 需要将fn放进正确的depend对象里[]
 * 那么怎么样才能将是name相关的functions放在一起呢？
 * 
 * 首先肯定得有depend数组，depend.addDepend(fn)才能添加对应的function
 * 
 * 第二，fn要保存到哪一个属性对应的depend对象的数组呢？
 * 怎么才能知道呢？只有fn运行的时候才会知道, fn是关于哪一个属性的
 * 
 * 第三，在哪里运行呢？，在哪里depend.addDepend()呢？
 * 
 * 
 */

// let reactiveFn = []
// function watchFn(fn){
//     reactiveFn.push(fn)
//     fn()
// }

class Depend {
    constructor(){
        // this.reactiveFn = []
        this.reactiveFn = new Set()
    }

    // addDepend(fn){
    //     this.reactiveFn.push(fn)
    // }

    depend(){
        if(activeReactiveFn){
            this.reactiveFn.add(activeReactiveFn)
        }
    }

    notify(){
        this.reactiveFn.forEach(fn => {
            fn()
        })
    }
}


// 还是只能收集一个属性的function，
// let depend = new Depend()
// function watchFn(fn){
//     depend.addDepend(fn)
// }

let activeReactiveFn = null
function watchFn(fn){
    activeReactiveFn = fn
    fn()
    activeReactiveFn = null
}

const targetMap = new WeakMap()
function getDepend(target,key){
    let map = targetMap.get(target)
    if(!map){
        map = new Map()
        targetMap.set(target,map)
    }

   let depend = map.get(key)
   if(!depend){
       depend = new Depend()
       map.set(key,depend)
   }
   return depend
}

const proxyObj = new Proxy(obj,{
    get: function(target, key, reciver){
        const depend = getDepend(target,key)
        depend.depend()
        // depend.addDepend(activeReactiveFn)
       return Reflect.get(target, key, reciver)
    },
    set: function(target, key, newValue, reciver){
        Reflect.set(target, key, newValue, reciver)
        // depend.notify()
        const depend  =  getDepend(target,key)
        // depend.addDepend(activeReactiveFn)
        depend.notify()
    }
})

function reactive(obj){
    return new Proxy(obj,{
        get: function(target, key, reciver){
            const depend = getDepend(target,key)
            depend.depend()
            // depend.addDepend(activeReactiveFn)
           return Reflect.get(target, key, reciver)
        },
        set: function(target, key, newValue, reciver){
            Reflect.set(target, key, newValue, reciver)
            // depend.notify()
            const depend  =  getDepend(target,key)
            // depend.addDepend(activeReactiveFn)
            depend.notify()
        }
    })
}

watchFn(function(){
    console.log("-------第一个name函数开始------");
    console.log('Hello World');
    console.log(proxyObj.name);
    console.log("-------第一个name函数结束------");
})

watchFn(function(){
    console.log(proxyObj.age,'proxyObj age ------1')
})

watchFn(function(){
    console.log(proxyObj.age,'proxyObj age ------2')
})

proxyObj.name = 'Alice';
proxyObj.name = 'Bob';
// proxyObj.name = 'hm';

// proxyObj.age = 20