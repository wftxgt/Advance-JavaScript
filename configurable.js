var myObj = {};
Object.defineProperty(myObj,"a",{
    value:2,
    configurable:false,
    writable:false,
    enumerable:true
})



// Object.defineProperty(myObj,"a",{
//     value:2,
//     configurable:true,
//     writable:true,
//     enumerable:true
// })

Object.defineProperty(myObj,"a",{
    value:2,
    configurable:false,
    writable:true,
    enumerable:true
})

myObj.a = 5;

console.log(myObj.a)