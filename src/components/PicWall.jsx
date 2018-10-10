import React from 'react'
import pic from '../images/pic.jpg'
import pic_wall from '../images/pic-wall-bg.png'
import {Link} from 'react-router-dom'
import {simpleStoreContract} from '../simpleStore'

import modalStyle  from '../modalStyle'

import nervos from '../nervos'

import Modal from 'react-modal';
import axios from "axios";

require('./style/pic_wall.css')
const {
    apiAddress
} = require('../config')


const Pic = ({ pic}) => {
    // const _time = new Date(+time)
    return (
        <div className="pic-bg">
            {/*{hasYearLabel ? <div className="list_record_year">{_time.getFullYear()}</div> : null}*/}
            {/*<span>{`${_time.getMonth() + 1}-${_time.getDate()} ${_time.getHours()}:${_time.getMinutes()}`}</span>*/}

            {/*<Link to={`/show/${time}`}>*/}
                <img src={pic} className="pic"/>
            {/*</Link>*/}
        </div>
    )
}

const Pic_l = ({time, text, pic, hasYearLabel}) => {
    const _time = new Date(+time)
    return (
        <div className="pic-bg_l">
            {/*{hasYearLabel ? <div className="list_record_year">{_time.getFullYear()}</div> : null}*/}
            <span>{`${_time.getMonth() + 1}-${_time.getDate()} ${_time.getHours()}:${_time.getMinutes()}`}</span>

            <Link to={`/show/${time}`}>
                <img src={pic}/>
            </Link>
        </div>
    )
}

class PicWall extends React.Component {
    constructor() {
        super();
        this.state = {
            times: [],
            texts: [],
            modalIsOpen: false
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        console.log("arrstring",this.props.data.join(","))
        axios.post(apiAddress+'/bitrun/api/v1/get_images',{"images":this.props.data.join(",")})
            .then( (res)=>{
                console.log(res);
                this.setState({times:res.data})
            })

        this.setState({modalIsOpen: true});
    }


    closeModal() {
        this.setState({modalIsOpen: false});
    }

    componentDidMount() {
        var times = []
        var texts = []
        for(let i = 0;i < 10; i++){
            times.push(new Date())
            texts.push("hello world")
        }
        this.setState({
            times:times,
            texts:texts
        })
    }

    render() {
        const {times, texts} = this.state

        return (
            <div>
                <div className="pic_wall_button" onClick={this.openModal}>
                    <img src={pic_wall} className="pic_wall_bg_l"/>
                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={modalStyle}

                    contentLabel="照片墙"
                >
                    <div className="pic_wall-bg">
                        <div className="pic-container">
                        {this.props.data.map((pic, idx) => (
                            <Pic
                                pic={pic} key={idx}
                            />
                        ))}
                        </div>
                    </div>
                    {/*<button onClick={this.closeModal}>close</button>*/}
                </Modal>
            </div>

        )


    }
}

export default PicWall
