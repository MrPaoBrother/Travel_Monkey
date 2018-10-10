import {call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import axios from 'axios'
import {simpleStoreContract, transaction} from "../simpleStore";
import nervos from "../nervos";


const from = '9b408a683b284fd3dae967bfe50528b0983c4865'

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* initList() {
    try {
        const res = yield axios.get('./data.json');
        console.log(res.data)
        yield put({type: "init_list_data", data: res.data});
    } catch (e) {
        console.log(e)
    }
}
//
//
// function* freeMonkey() {
//     const arr = yield simpleStoreContract.methods
//         .freeMonkey()
//         .call({
//             from,
//         })
//
//     console.log('arr', arr)
//     // this.setState({hasLogin: true})
//     // this.loadData()
//
// }
//
// function* loadData() {
//
//     this.getowner2product();
//     this.getProducts();
//     this.getowner2picture();
//
//     setTimeout(() => {
//         setInterval(() => this.getStatus(), 5000)
//     }, 20000)
//
// }
//
//
// function* getStatus() {
//     console.log('getStatus', {
//         "address": from,
//         "randombackground": this.state.status[0],
//         "randomanimals": this.state.status[1],
//         "state": this.state.status[2],
//         "timestamp": Math.round(new Date().getTime() / 1000).toString()
//     })
//     let res = yield axios.post(apiAddress + '/bitrun/api/v1/story_happen', {
//         "address": from,
//         "randombackground": this.state.status[0],
//         "randomanimals": this.state.status[1],
//         "state": this.state.status[2],
//         "timestamp": (60 + Math.round(new Date().getTime() / 1000)).toString()
//     })
//     console.log("getStatus", res);
//
//
//     var status = this.state.status
//     var monkey = this.state.monkey
//
//     status[2] = res.data.status
//     monkey[3] = res.data.status
//
//     var newpicarr = ['https://yimixiaoyuan.top/4-1-2.jpg', 'https://yimixiaoyuan.top/2-1-2-1.jpg', 'https://yimixiaoyuan.top/2-1-2-4.jpg', 'https://yimixiaoyuan.top/3-2-1-1.jpg', 'https://yimixiaoyuan.top/2-1-2.jpg']
//     var i = this.state.i
//     var newPic = newpicarr[i]
//     i++
//     if (i == 5) i = 0
//     this.setState({i: i})
//     var picArrayy = this.state.picArrayy
//     picArrayy.push(newPic)
//     this.setState({picArrayy})
//
// }
//
//
// function* getMonkeycount() {
//     let res = yield simpleStoreContract.methods
//         .getMonkeycount()
//         .call({
//             from,
//         })
//
//     console.log('getMonkeycount res', res)
//
// }
//
//
// function* buyProduct(action) {
//     let res = yield nervos.appchain
//         .getBlockNumber()
//         .then(current => {
//             const tx = {
//                 ...transaction,
//                 validUntilBlock: +current + 88,
//             }
//             console.log("buyProduct---res")
//             return simpleStoreContract.methods.buyProduct(i).send(tx)
//         })
//
//     this.setState({
//         fruits: this.state.fruits - 2,
//         monkeyClass: true
//     })
//     console.log("res", res)
//     if (res.hash) {
//         return nervos.listeners.listenToTransactionReceipt(res.hash)
//     } else {
//         throw new Error('No Transaction Hash Received')
//     }
//
// }
//
// function* loadPic() {
//     let res = yield axios.post(apiAddress + '/bitrun/api/v1/get_images', {
//         images: '1-0-1,1-1-1,1-2-1,2-1-1',
//     })
//     console.log('loadPic res', res)
// }
//
//
// function* checkLoginStatus() {
//     let status = yield simpleStoreContract.methods
//         .checkFirst()
//         .call({
//             from,
//         })
//
//     this.setState({hasLogin: status})
//     console.log("statusOnChain", status)
//     if (status) {
//         this.freeMonkey()
//         alert('看你没猴子，免费送你一个，收好了！')
//     }
//     else {
//         this.loadData()
//
//     }
// }
//
// function* freeMonkey() {
//     let res = yield nervos.appchain
//         .getBlockNumber()
//         .then(current => {
//             const tx = {
//                 ...transaction,
//                 validUntilBlock: +current + 88,
//             }
//             console.log("freeMonkey---res")
//             return simpleStoreContract.methods.freeMonkey().send(tx)
//         })
//
//     console.log("res", res)
//     this.getMonkey()
//     this.loadData()
//     if (res.hash) {
//         return nervos.listeners.listenToTransactionReceipt(res.hash)
//     } else {
//         throw new Error('No Transaction Hash Received')
//     }
//
// }
//
// function* getMonkey() {
//     let arr = simpleStoreContract.methods
//         .getMonkey()
//         .call({
//             from,
//         })
//
//     console.log("getMonkey success")
//     console.log(arr)
//
// }
//
//
// function* getowner2picture() {
//     let indexs = yield simpleStoreContract.methods
//         .getowner2picture()
//         .call({
//             from,
//         })
//
//     console.log('getowner2picture', indexs)
//     indexs.map(
//         idx => {
//             simpleStoreContract.methods
//                 .getPicture(idx)
//                 .call({
//                     from,
//                 })
//                 .then(pic => {
//                     console.log("getPic", pic)
//                     if (pic) {
//                         this.setState({status: pic})
//
//                         var picString = pic[0] + '-' + pic[1] + '-' + pic[2]
//                         var picArray = this.state.picArray;
//                         picArray.push(picString)
//                         picArray = [...new Set(picArray)];
//                         this.setState({picArray})
//                         console.log("picArray", this.state.picArray)
//                     }
//                     // return Promise.all(times.map(time => simpleStoreContract.methods.get(time).call({ from })))
//                 })
//         }
//     )
//
// }
//
// function* getowner2product() {
//     let indexs = yield simpleStoreContract.methods
//         .getowner2product()
//         .call({
//             from,
//         })
//     console.log('getowner2product', indexs)
//     indexs.map(
//         idx => {
//             simpleStoreContract.methods
//                 .getProduct(idx)
//                 .call({
//                     from,
//                 })
//                 .then(pic => {
//                     console.log("getPic", pic)
//                     if (pic) {
//                         this.setState({status: pic})
//
//                         var picString = pic[0] + '-' + pic[1] + '-' + pic[2]
//                         var picArray = this.state.picArray;
//                         picArray.push(picString)
//                         picArray = [...new Set(picArray)];
//                         this.setState({picArray})
//                         console.log("picArray", this.state.picArray)
//                     }
//                     // return Promise.all(times.map(time => simpleStoreContract.methods.get(time).call({ from })))
//                 })
//         }
//     )
//
// }
//
// function* getProducts() {
//     let len = yield simpleStoreContract.methods
//         .getProductlength()
//         .call({
//             from,
//         })
//     console.log('getProducts', len)
//     for (let i = 1; i < len; i++) {
//         simpleStoreContract.methods
//             .getProduct(i)
//             .call({
//                 from,
//             })
//             .then(goods => {
//                 if (goods) {
//                     var goodsTyped = {
//                         key: goods[0],
//                         name: goods[1],
//                         price: goods[2],
//                         effect: goods[3]
//                     }
//                     var market = this.state.market
//
//                     market.push(goodsTyped)
//                     this.setState({market})
//                     console.log(this.state.market)
//                 }
//                 // return Promise.all(times.map(time => simpleStoreContract.methods.get(time).call({ from })))
//             })
//             // .then(texts => {
//             //     this.setState({ texts })
//             // })
//             .catch(console.error)
//     }
// }
//
// function* walkOut() {
//     let current = yield nervos.appchain
//         .getBlockNumber()
//
//     const tx = {
//         ...transaction,
//         validUntilBlock: +current + 88,
//     }
//     console.log("walkOut---res")
//     let a = yield simpleStoreContract.methods.walkOut().send(tx)
//
//     let picLength = yield simpleStoreContract.methods
//         .getPictureLength()
//         .call({
//             from,
//         })
//
//
//     console.log("picLength---res", picLength)
//     let picArr = yield         simpleStoreContract.methods
//         .getPicture(picLength - 1)
//         .call({
//             from,
//         })
//     console.log("picArr", picArr)
//
//
//     var monkey = this.state.monkey
//     monkey[3] = 1
//     this.setState({monkey: monkey})
// }
//
// function* finalPicture() {
//     let current = yield nervos.appchain
//         .getBlockNumber()
//     const tx = {
//         ...transaction,
//         validUntilBlock: +current + 88,
//     }
//     console.log("comeHome---res")
//     let pic = yield simpleStoreContract.methods.finalPicture().send(tx)
//
//     console.log("final pic", pic)
//     var picString = '1-1-2'
//     var picArray = this.state.picArray;
//     picArray.push(picString)
//     this.setState({picArray})
//     console.log(this.state.picArray)
// }
//
// reapFruits()
// {
//     var num = 5;
//     var fruits = this.state.fruits + num;
//     this.setState({
//         fruits: fruits,
//         treeFruits: 0
//     })
//     console.log(this.state.treeFruits)
// }
//
function* mySaga() {
    yield takeEvery("init_list", initList);
    // yield takeLatest("freeMonkey", freeMonkey);
    // yield takeLatest()
}
//
//
export default mySaga;
