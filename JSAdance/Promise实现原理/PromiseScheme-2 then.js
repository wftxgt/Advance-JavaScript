const STATUS_PENDING = 'pending'
const STATUS_FULFILLED = 'fulfilled'
const STATUS_REJECTED = 'rejected'

class MyPromise {
    constructor(executor){
        this.status = STATUS_PENDING
        /**
         * 需要将resolve，reject的返回值保存下来，因为then里面需要他们的返回值
         */
        this.value = undefined
        this.reason = undefined
        const resolve = (value) =>{
            if(this.status === STATUS_PENDING){
                this.status = STATUS_FULFILLED
                this.value = value
                console.log('resolve:',value)
            }
        }

        const reject = (reason) =>{
            if(this.status === STATUS_PENDING){
                this.status = STATUS_REJECTED
                this.reason = reason
                console.log('reason:',reason)
            }
        }

        executor(resolve,reject)
    }
}

const  promise1 = new MyPromise((resolve,reject) =>{
    console.log('executor被执行了')
    // resolve(111)
    reject(2222)
})

promise1.then(onfulfilled,onrejected)

// const  promise2 = new MyPromise((resolve,reject) =>{
//     // resolve(1111)
//     // reject(2222)
// })

// promise2.then(res =>{
//     console.log(res)
// }, err =>{
//     console.log(err)
// })