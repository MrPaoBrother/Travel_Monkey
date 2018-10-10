import React from 'react'


import marketModalStyle from '../modalStyle'
import pic from '../images/pic.jpg'
import market_bg from '../images/market-bg.png'
import market_pricebar from '../images/market-priceban.png'
import market from '../images/market.png'
import goods0 from '../images/goods0.png'
import goods1 from '../images/goods1.png'
import goods2 from '../images/goods2.png'
import goods3 from '../images/goods3.png'
import goods4 from '../images/goods4.png'
import market_confirm from '../images/market-confirm.png'
import market_pocket from '../images/market-pocket.png'
import Modal from 'react-modal';
import {simpleStoreContract, transaction} from '../simpleStore'
import nervos from "../nervos";

require('./style/market.css')


class Market extends React.Component {
    constructor() {
        super();
        this.state = {
            times: [],
            texts: [],
            modalIsOpen: false,
            goodsPics: [goods0, goods1, goods2, goods3, goods4],
            goodsNames: ['2', '5', '1', '10', '3']
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.submitMarket = this.submitMarket.bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    submitMarket() {
        this.closeModal()
    }

    componentDidMount() {

    }


    buyProduct(i) {
        console.log('buyProduct start')
        nervos.appchain
            .getBlockNumber()
            .then(current => {
                const tx = {
                    ...transaction,
                    validUntilBlock: +current + 88,
                }
                console.log("buyProduct---res")
                return simpleStoreContract.methods.buyProduct(i).send(tx)
            })
            .then(res => {
                this.setState({
                    fruits: this.state.fruits - 2,
                    monkeyClass: true
                })
                console.log("res", res)
                if (res.hash) {
                    alert('购买商品'+ i +'成功！交易hash为'+ res.hash)
                    return nervos.listeners.listenToTransactionReceipt(res.hash)
                } else {

                    alert('购买商品'+ i +'失败！')
                    throw new Error('No Transaction Hash Received')
                }
            })
    }

    Goods = (i,goodsPic,goodsName) => {
        return (
            <div key={i} className="goods-bg" onClick={()=>this.buyProduct(i)}>
                <img src={goodsPic}/>
                <span className="goods-price">{goodsName}</span>

            </div>
        )
    }

    render() {
        return (
            <div>
                <img className="market-button" src={market} onClick={this.openModal}/>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={marketModalStyle}
                    contentLabel=""
                >
                    <div className="market-bg">
                        <div className="goods-container">
                            {this.state.goodsPics.map((goodsPic, idx) => (
                                this.Goods(idx, goodsPic, this.state.goodsNames[idx])

                            ))}
                        </div>
                        <div className="market-frontbg"/>
                        {/*<button onClick={this.submitMarket}>关闭</button>*/}
                        {/*<img className="market-confirm" src={market_confirm} onClick={() => {*/}
                            {/*this.props.onClick(2);*/}
                            {/*this.setState({modalIsOpen: false});*/}
                        {/*}*/}
                        {/*}/>*/}
                        {/*<img className="market-pocket" src={market_pocket}/>*/}
                        {/*<span className="market-charge">{this.props.fruits}</span>*/}

                        <span className="market-title">点击商品直接购买，点击弹窗外关闭弹窗</span>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Market
