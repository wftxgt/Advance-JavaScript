let activeReactiveFn = null

class Depend {
    constructor(){
        this.reactiveFns = new Set()
    }

    addDepend(){
        if(activeReactiveFn){
            this.reactiveFns.add(activeReactiveFn)
        }  
    }

    notify(){
        this.reactiveFns.forEach(fn => {
            fn()
        })
    }
}

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

function reactive(obj){
    return new Proxy(obj,{
        get: function(target,key,receiver) {
            const depend = getDepend(target,key)
            depend.addDepend()
            return Reflect.get(target,key,receiver)
        },
        set:function(target,key,newValue,receiver) {

            Reflect.set(target,key,newValue,receiver)
            const depend = getDepend(target,key)
            depend.notify()
        }
    })
}

const obj =  reactive({
    name:'hh',
    age: 18
})

watchFn(function(){
    console.log('-----------name 1')
    console.log(obj.name)
})

watchFn(function(){
    console.log('-----------name 2')
    console.log(obj.name)
})

watchFn(function(){
    console.log('-----------age')
    console.log(obj.age)
})

obj.name = 'hm'
obj.age = 20