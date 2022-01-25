const  obj = {
    name: 'hhh',
    age: 18,
    _address: '',
    get address(){
        return this._address
    },
    set address(value){
        this._address = value;
    }
}

// Object.defineProperty(obj,"address",{
//     configurable: false,
//     enumerable:  true,
//     get: function(){
//         console.log('---get---')
//         return this._name
//     },
//     set:  function(value){
//         console.log('---set---')
//         this._name = value
//     }
// })

// Object.defineProperty(obj,"address",{
//     configurable: true,
//     enumerable:  false,
//     get: function(){
//         console.log('---get---')
//         return this._name
//     },
//     set:  function(value){
//         console.log('---set---')
//         this._name = value
//     }
// })
// obj.name = 'Alice';
// console.log(obj.name)

// for(var key in obj){
//     console.log(key)
// }



// Object.keys(obj).forEach(key =>{
//     let value = obj[key];

//     Object.defineProperty(obj,key,{
//         get: function(){
//             console.log('--------get-----')
//             return value
//         },
//         set:function(newValue){
//             console.log('------set------')
//             value  =  newValue
//         }
//     })
// })

const objProxy= new Proxy(obj,{
    get: function(target,key,receiver){
        console.log(`监听到${key}属性的get`)
        // return target[key]
        return  Reflect.get(target,key,receiver)
    },
    set: function(target,key,newValue,receiver){
        console.log(`监听到${key}属性的set`)
        // target[key] = newValue
        return Reflect.set(target,key,newValue,receiver)
    }
})

objProxy.name = 'Alice';
objProxy.age =  20;
console.log(objProxy.name,objProxy.age)


obj.name = 'Alice';
obj.age =  20;
console.log(obj.name,obj.age)