import React from 'react'
import monkey from '../images/bit_0_0.png'
import monkey_ from '../images/bit_0_1.png'
import monkeyNaked from '../images/bit.png'

import './style/monkey.css'




class Monkey extends React.Component {
    constructor(props){
        super(props)
        this.state={
            action:true
        }
        this.tick = this.tick.bind(this)
    }

    tick(){
        this.setState({
            action:!this.state.action
        })
    }


    componentDidMount() {
        setInterval(this.tick, 1000);
        console.log("monkeyNaked",this.props.data)
    }

    render() {
        if(this.props.where == 1){
            return(<div className="bg_bit">
            </div>)
        }

        if(!this.props.data){
            return(
                <div className="bg_bit">
                    <img src={ monkeyNaked } />
                </div>
            )
        }else{
            return (
                <div className="bg_bit">
                    <img src={ this.state.action ? monkey : monkey_} />
                </div>
            );
        }

    }


}



export default Monkey
