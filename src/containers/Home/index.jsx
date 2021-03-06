import React from 'react'
import logo from '../../images/logo.svg'
import bg from '../../images/bg.png'

import bed from '../../images/bed.png'
import end from '../../images/end.jpg'
import frontbg from '../../images/frontbg.png'
import pc from '../../images/pc.png'

import quilt from '../../images/quilt.png'

// import bg from "../../public/images/bg.png"

import PicWall from '../../components/PicWall.jsx'
import Bed from '../../components/Bed.jsx'
import Monkey from '../../components/Monkey.jsx'
import Header from '../../components/Header.jsx'
import Tree from '../../components/Tree.jsx'
import Market from '../../components/Market.jsx'
import Bag from '../../components/Bag.jsx'
import Wallet from '../../components/Wallet.jsx'
import Quilt from '../../components/Quilt.jsx'
import PC from '../../components/PC.jsx'

import {connect} from 'react-redux';


import './home.css'

import {transaction, simpleStoreContract} from '../../simpleStore'

import nervos from '../../nervos'
import axios from 'axios'

const {
    apiAddress, from
} = require('../../config')

// const from = '9b408a683b284fd3dae967bfe50528b0983c4865'

class Home extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            hasLogin: false, //有无猴
            monkey: {}, //猴子状态
            fruits: 0, //钱
            treeFruits: 0, //树上钱
            bag: [], //背包
            picWall: [], //照片墙
            market: [], //商店
            Screen: PC, //电脑图片
            status: [1, 0, 1], //旅行状态

            pics: {},
            marketData: [], //商店数据
            picArray: [], //照片墙图片序号
            picArrayy: [], //照片墙图片序号
            monkeyClass: false,
            i: 0
        }
    }

    componentDidMount() {
        //其实没用
        this.getMonkeycount()
        //开始
        this.checkLoginStatus();
        this.getProducts();

    }


    loadData() {
        this.refreshStatus()

        setTimeout(() => {
            this.checkWalkout()
            this.storyHappen()
            this.timer = setInterval(()=>this.refreshTravleStatus(), 5000)
        }, 10000)

    }

    refreshStatus() {
        this.getowner2product();
        this.getowner2picture();
        this.getTree();
        this.getMonkey();
    }

    // buyProduct(i) {
    //     nervos.appchain
    //         .getBlockNumber()
    //         .then(current => {
    //             const tx = {
    //                 ...transaction,
    //                 validUntilBlock: +current + 88,
    //             }
    //             console.log("buyProduct---res")
    //             return simpleStoreContract.methods.buyProduct(i).send(tx)
    //         })
    //         .then(res => {
    //
    //             console.log("res", res)
    //             if (res.hash) {
    //                 return nervos.listeners.listenToTransactionReceipt(res.hash)
    //             } else {
    //                 throw new Error('No Transaction Hash Received')
    //             }
    //         })
    // }

    getBananaFromTree() { //收割香蕉
        nervos.appchain
            .getBlockNumber()
            .then(current => {
                const tx = {
                    ...transaction,
                    validUntilBlock: +current + 88,
                }
                console.log("getBananaFromTree---res")
                return simpleStoreContract.methods.getBananaFromTree().send(tx)
            })
            .then(res => {
                console.log("getBananaFromTree res", res)
                this.getTree()
                this.getMonkey()
                if (res.hash) {
                    alert('收获到了' + res + '果实，交易hash为' + res.hash)
                    return nervos.listeners.listenToTransactionReceipt(res.hash)
                } else {

                    alert('交易失败！')
                    throw new Error('No Transaction Hash Received')
                }
            })
    }

    checkWalkout() {
        console.log('checkWalkout',this)

        console.log('checkWalkout state',this.state)
        nervos.appchain
            .getBlockNumber()
            .then(current => {
                const tx = {
                    ...transaction,
                    validUntilBlock: +current + 88,
                }
                console.log("checkWalkout---res")
                return simpleStoreContract.methods.checkWalkout().send(tx)
            })
            .then(res => {
                console.log("checkWalkout res", res)
                this.getowner2picture()
                if (res.hash) {
                    return nervos.listeners.listenToTransactionReceipt(res.hash)
                } else {
                    throw new Error('No Transaction Hash Received')
                }
            })
    }

    storyHappen() {
        axios.post(apiAddress + '/bitrun/api/v1/story_happen', {
            "address": from,
            "randombackground": this.state.status[0],
            "randomanimals": this.state.status[1],
            "state": this.state.status[2],
            "timestamp": (60 + Math.round(new Date().getTime() / 1000)).toString()
        }).then(res => console.log('story_happen', res))
    }

    getTree() {
        simpleStoreContract.methods
            .getBananacount()
            .call({
                from,
            })
            .then(treeFruits => {
                this.setState({treeFruits: treeFruits})
                console.log('getTree res', treeFruits)
            })
            .catch(console.error)
    }


    refreshTravleStatus() {

        axios.get(apiAddress + '/bitrun/api/v1/get_monkey_status/' + from)
            .then((res) => {
                console.log("get_monkey_status", res);
                if (res.data.status != 2) {
                    this.setState({
                        picWall: [...this.state.picWall,res.data.pic_url],
                        where: res.data.status
                    })
                }else{
                    this.setState({
                        picWall: [...this.state.picWall,res.data.pic_url],
                        where: res.data.status
                    })
                    clearInterval(this.timer)
                }
            })

    }

    delTimer(){
        clearInterval(this.timer)
    }


    getMonkeycount() {
        simpleStoreContract.methods
            .getMonkeycount()
            .call({
                from,
            })
            .then(res => {
                console.log('getMonkeycount res', res)
            })
            .catch(console.error)
    }


    loadPic() {
        axios.post(apiAddress + '/bitrun/api/v1/get_images', {
            images: '1-0-1,1-1-1,1-2-1,2-1-1',
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    checkLoginStatus() {
        simpleStoreContract.methods
            .checkFirst()
            .call({
                from,
            })
            .then(status => {
                this.setState({hasLogin: status})
                console.log("statusOnChain", status)
                if (status) {
                    this.freeMonkey()
                    alert('看你没猴子，免费送你一个，收好了！')
                }
                else {
                    this.loadData()

                }
            })
            .catch(console.error)
    }


    freeMonkey() {
        nervos.appchain
            .getBlockNumber()
            .then(current => {
                const tx = {
                    ...transaction,
                    validUntilBlock: +current + 88,
                }
                console.log("freeMonkey---res")
                return simpleStoreContract.methods.freeMonkey().send(tx)
            })
            .then(res => {
                console.log("res", res)
                this.getMonkey()
                this.loadData()
                if (res.hash) {
                    return nervos.listeners.listenToTransactionReceipt(res.hash)
                } else {
                    throw new Error('No Transaction Hash Received')
                }
            })
    }

    getMonkey() {
        simpleStoreContract.methods
            .getMonkey()
            .call({
                from,
            })
            .then((arr) => {
                    console.log("getMonkey success", arr)
                    this.setState({
                        fruits: arr[3],
                        // where: arr[4]
                    })
                    //key gene mood banana state owner
                }
            )
            .catch(console.error)
    }


    getowner2picture() {
        simpleStoreContract.methods
            .getowner2picture()
            .call({
                from,
            })
            .then((indexs) => {

                    console.log('getowner2picture', indexs)
                    indexs.map(
                        idx => {
                            simpleStoreContract.methods
                                .getPicture(idx)
                                .call({
                                    from,
                                })
                                .then(pic => {
                                    // console.log("getPic", pic)
                                    if (pic) {
                                        this.setState({status: pic})

                                        var picString = pic[0] + '-' + pic[1] + '-' + pic[2]
                                        var picArray = this.state.picArray;
                                        picArray.push(picString)
                                        picArray = [...new Set(picArray)];
                                        this.setState({picArray})
                                    }
                                    // return Promise.all(times.map(time => simpleStoreContract.methods.get(time).call({ from })))
                                })
                        }
                    )

                    console.log("picArray", this.state.picArray)

                }
            )
            .catch(console.error)
    }

    getowner2product() {
        simpleStoreContract.methods
            .getowner2product()
            .call({
                from,
            })
            .then((indexs) => {
                    console.log('getowner2product', indexs)
                    var bag = [];
                    indexs.map(
                        idx => {
                            simpleStoreContract.methods
                                .getProduct(idx)
                                .call({
                                    from,
                                })
                                .then(goods => {
                                    // console.log("getPic", pic)
                                    if (goods) {
                                        var goodsTyped = {
                                            key: goods[0],
                                            name: goods[1],
                                            price: goods[2],
                                            effect: goods[3]
                                        }
                                        bag.push(goodsTyped)
                                    }
                                    // return Promise.all(times.map(time => simpleStoreContract.methods.get(time).call({ from })))
                                })
                        }
                    )

                    this.setState({bag})
                    console.log("bag", this.state.bag)
                }
            )
            .catch(console.error)
    }

    getPictures() {
        simpleStoreContract.methods
            .getPicturelength()
            .call({
                from,
            })
            .then(len => {
                console.log('getPictures', len)
                for (let i = 1; i < len; i++) {
                    simpleStoreContract.methods
                        .getPicture(i)
                        .call({
                            from,
                        })
                        .then(pic => {
                            if (pic) {
                                var picTyped = {
                                    key: pic[0],
                                    bgId: pic[1],
                                    animalId: pic[2],
                                    monkeyStatus: pic[3]
                                }
                                var pics = this.state.pics

                                pics.push(picTyped)
                                this.setState({pics})
                            }
                            // return Promise.all(times.map(time => simpleStoreContract.methods.get(time).call({ from })))
                        })
                        // .then(texts => {
                        //     this.setState({ texts })
                        // })
                        .catch(console.error)
                }

                console.log('getPics', this.state.pics)
                console.log("picWall:", this.state.market)
            })
    }

    getProducts() {
        simpleStoreContract.methods
            .getProductlength()
            .call({
                from,
            })
            .then(len => {
                console.log('getProducts', len)
                for (let i = 1; i < len; i++) {
                    simpleStoreContract.methods
                        .getProduct(i)
                        .call({
                            from,
                        })
                        .then(goods => {
                            if (goods) {
                                var goodsTyped = {
                                    key: goods[0],
                                    name: goods[1],
                                    price: goods[2],
                                    effect: goods[3]
                                }
                                var market = this.state.market
                                market.push(goodsTyped)
                                this.setState({market})
                            }
                            // return Promise.all(times.map(time => simpleStoreContract.methods.get(time).call({ from })))
                        })
                        .catch(console.error)
                }
                console.log("market:", this.state.market)
            })
    }

    // walkOut() {
    //     nervos.appchain
    //         .getBlockNumber()
    //         .then(current => {
    //             const tx = {
    //                 ...transaction,
    //                 validUntilBlock: +current + 88,
    //             }
    //             console.log("walkOut---res")
    //             return simpleStoreContract.methods.walkOut().send(tx)
    //         })
    //         .then(() => {
    //             simpleStoreContract.methods
    //                 .getPictureLength()
    //                 .call({
    //                     from,
    //                 })
    //                 .then(picLength => {
    //
    //                     console.log("picLength---res", picLength)
    //                     simpleStoreContract.methods
    //                         .getPicture(picLength - 1)
    //                         .call({
    //                             from,
    //                         })
    //                         .then(picArr => {
    //                             console.log("picArr", picArr)
    //
    //
    //                         })
    //                 })
    //         })
    //     var monkey = this.state.monkey
    //     monkey[3] = 1
    //     this.setState({monkey: monkey})
    // }

    // finalPicture() {
    //     nervos.appchain
    //         .getBlockNumber()
    //         .then(current => {
    //             const tx = {
    //                 ...transaction,
    //                 validUntilBlock: +current + 88,
    //             }
    //             console.log("comeHome---res")
    //             return simpleStoreContract.methods.finalPicture().send(tx)
    //         })
    //         .then((pic) => {
    //             console.log("final pic", pic)
    //             var picString = '1-1-2'
    //             var picArray = this.state.picArray;
    //             picArray.push(picString)
    //             this.setState({picArray})
    //             console.log(this.state.picArray)
    //         })
    // }

    // reapFruits() {
    //     var num = 5;
    //     var fruits = this.state.fruits + num;
    //     this.setState({
    //         fruits: fruits,
    //         treeFruits: 0
    //     })
    //     console.log(this.state.treeFruits)
    // }

    render() {
        return (
            <div className='stage'>
                {/*<Header hasLogin={this.state.hasLogin} onClick={this.freeMonkey.bind(this)}/>*/}
                <img className="bg" src={bg}/>
                <PicWall data={this.state.picWall}/>
                <PC data={this.state.Screen}/>
                <Bed/>
                <Monkey data={this.state.monkeyClass} where={this.state.where}/>
                {/*<Quilt onCick={()=>console.log('this.state:',this.state)} />*/}

                <Tree data={this.state.treeFruits} onClick={this.getBananaFromTree.bind(this)}/>

                {/*<Monkey/>*/}
                <div className="bg_quilt">
                    <img src={quilt} onClick={() => console.log('this.state:', this.state)}/>
                </div>

                {/*<img className="bg_pic" src={frontbg} />*/}
                <img className="bg_frontbg" src={this.state.monkey[3] == 2 ? end : frontbg}/>

                <Market data={this.state.market} fruits={this.state.fruits}
                    // onClick={this.buyProduct.bind(this)}
                />
                <Bag bag={this.state.bag}/>
                <Wallet fruits={this.state.fruits} />

            </div>)
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        initList(e) {
            const action = {
                type: 'init_list'
            }
            dispatch(action);
        },
        handleChangeInput(e) {
            const action = {
                type: 'change_input_value',
                value: e.target.value
            }
            dispatch(action);
        },

        handleAddInput(e) {
            const action = {
                type: 'add_input_value'
            }
            dispatch(action);
        },
        handleDelInput(idx) {
            const action = {
                type: 'del_input_value',
                value: idx
            }
            dispatch(action);
        }
    }
}

const mapStateToProps = (state) => {
    return {
        hasLogin: state.hasLogin, //有无猴
        monkey: state.monkey, //猴子状态
        fruits: state.fruits, //钱
        treeFruits: state.treeFruits, //树上钱
        bag: state.bag, //背包
        picWall: state.picWall, //照片墙
        market: state.market, //商店
        marketData: state.marketData, //商店数据
        Screen: state.Screen, //电脑图片
        picArray: state.picArray, //照片墙图片序号
        picArrayy: state.picArrayy, //照片墙图片序号
        monkeyClass: state.monkeyClass,
        where: state.where,
        status: state.status,
        i: state.i
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
