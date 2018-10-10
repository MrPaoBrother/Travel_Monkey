import React from 'react'

import Modal from 'react-modal';
import {simpleStoreContract} from '../simpleStore'

// import {transaction, simpleStoreContract} from '../../simpleStore'

import nervos from '../nervos'

import wallet from '../images/wallet.png'
import walletModalStyle  from '../modalStyle'


require('./style/wallet.css')

class Wallet extends React.Component {
    constructor() {
        super();
        this.state = {
            times: [],
            texts: [],
            modalIsOpen: false,
            newWallet: ""
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    setNewWallet = e => {
        this.setState({newWallet: e.target.value})
    }

    componentDidMount() {
        // this.openModal()
    }

    render() {
        return (
            <div>
                <img src={wallet} className="wallet-button" onClick={this.props.onClick} />
                <span className="wallet-button">{this.props.fruits}</span>
            </div>
        )
    }
}

export default Wallet
