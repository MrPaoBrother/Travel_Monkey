import React from 'react'
import tree_hasFruit from '../images/tree_hasfruit.png'
import tree_noFruit from '../images/tree_nofruit.png'
import {simpleStoreContract} from '../simpleStore'

require('./style/tree.css')

const pic = '../../public/images/pic.jpg'

// const Fruit = () => {
//     return (
//         <div className="fruit-bg">
//             fruits
//         </div>
//     )
// }

class Tree extends React.Component {
    state = {
        fruits: this.props.fruits
    }
    componentDidMount() {
    }

    render() {
        return (
                <img className="bg_tree" src={this.props.data == 0 ? tree_noFruit : tree_hasFruit} onClick={this.props.data == 0 ? null : this.props.onClick}/>

        )
    }
}

export default Tree
