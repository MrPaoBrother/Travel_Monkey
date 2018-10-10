import React from 'react'


import bagModalStyle  from '../modalStyle'
import pic from '../images/pic.jpg'
import bag from '../images/bag.png'
import goods0 from '../images/goods0.png'
import goods1 from '../images/goods1.png'
import goods2 from '../images/goods2.png'
import goods3 from '../images/goods3.png'
import goods4 from '../images/goods4.png'
import Modal from 'react-modal';
import {simpleStoreContract} from '../simpleStore'


require('./style/bag.css')


const Thing = ({thingPic}) => {
    // console.log(thingPic)
    return (
        <div className="thing-bg">
            <img src={thingPic} />
        </div>
    )
}

class Bag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            times: [],
            texts: [],
            modalIsOpen: false,
            goodsPics:[goods0,goods1,goods2,goods3,goods4],

        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.submitBag = this.submitBag.bind(this);
    }

    openModal() {

        console.log('bag',this.props)
        console.log('bag',this.state)
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    submitBag(){
        // const from = 'e3fba7efa7e9b68b18c31f42b41c2dff7dc69b0c'
        //
        // var times=[]
        // for(let i = 0;i < 10; i++){
        //     times.push(new Date())
        // }
        // console.log(times)
        // Promise.all(times.map(time => simpleStoreContract.methods.get(time).call({ from })))
        //     .then(texts => {
        //         this.setState({ texts })
        //         console.log(texts)
        //     })
        //     .catch(console.error)
        this.closeModal()
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <img src={bag} className="bag-button" onClick={this.openModal} />
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={bagModalStyle}
                    contentLabel=""
                >

                    <div className="bag-bg">
                        <div className="thing-container">
                    {this.props.bag.map((goods, idx) => (
                        <Thing
                            key={idx}
                            thingPic={this.state.goodsPics[goods.key-1] }/>
                    ))}
                        </div>
                    {/*<button onClick={this.submitBag}>close</button>*/}
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Bag
