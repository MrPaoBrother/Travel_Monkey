import PC from "../components/PC";

const initState = {
    hasLogin: false, //有无猴
    monkey: [], //猴子状态
    fruits: 0, //钱
    treeFruits: 30, //树上钱
    bag: [], //背包
    picWall: [], //照片墙
    market: [], //商店
    marketData: [], //商店数据
    Screen: PC, //电脑图片
    picArray: [], //照片墙图片序号
    picArrayy: [], //照片墙图片序号
    monkeyClass: false,
    where: 2,
    status: [1, 0, 1],
    i:0
}

export default (state = initState,action) => {
	if( action.type === 'init_list_data'){
		const newState = JSON.parse(JSON.stringify(state));
		newState.list = action.data;
		return newState;
	}
	if( action.type === 'change_input_value'){
		const newState = JSON.parse(JSON.stringify(state));
		newState.inputValue = action.value;
		return newState;
	}
	if( action.type === 'add_input_value'){
		const newState = JSON.parse(JSON.stringify(state));
		newState.list.push(newState.inputValue);
		newState.inputValue = '';
		return newState;
	}
	if( action.type === 'del_input_value'){
		const newState = JSON.parse(JSON.stringify(state));
		newState.list.splice(action.value, 1);
		return newState;
	}

	return state;
}
