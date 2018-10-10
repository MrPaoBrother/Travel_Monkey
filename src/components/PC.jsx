import React from 'react'
import pc from '../images/pc.png'
import pc_screen from '../images/pc.png'
import modalStyle  from '../modalStyle'
import './style/pc.css'
import Modal from "react-modal";
import axios from "axios";

const {
    apiAddress
} = require('../config')


class PC extends React.Component {
    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            pic:''
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true});
            axios.get(apiAddress+'/bitrun/api/v1/get_image/1')
                .then( (res)=>{
                    console.log(res);
                    this.setState({pic: res.data})
                })
            }

    closeModal() {
        this.setState({modalIsOpen: false});
    }


    componentDidMount() {
        // this.openModal()
    }

    render() {
        return (
            <div>
                <div className="bg_pc" >
                    <img src={pc} onClick={this.openModal} />
                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={modalStyle}
                    contentLabel=""
                >
                    <img src={this.state.pic} className='pc' onClick={this.closeModal} />
                </Modal>
            </div>
        )
    }
}



export default PC
