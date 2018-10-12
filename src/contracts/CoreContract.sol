pragma solidity 0.4.23;

contract CoreContract {

    struct Monkey {             //猴子  
        uint256 key;            //猴子key   
        uint256 gene;           //猴子基因 会影响猴子的样子等特征
        uint256 mood;           //心情  之后随机事件的重要依据
        uint256 banana;         //拥有的香蕉总数  香蕉可以用来购买商品
        bool state;             //猴子的状态  外出还是在家 true在家，false在外
        uint256 monkeystate;    //猴子商品状态， 标记猴子身上佩戴的物品，从而影响外观
        address owner;          //猴子的主人
    }

    struct Productstr {         //商品
        uint256 key;            //商品key
        string name;            //商品名字
        uint256 price;          //商品价格
        uint256 effect;         //商品效果，对猴子心情的影响
    }

    //图片结构体
    //所有的图片，都是在链上生成相应的backgroundid，animalsid，monkeystate，
    //然后用这三个值，去后端取出对应的图片。
    struct Picturestr {             //图片，猴子外出带回来的图片，由三部分组成，背景，小伙伴，猴子自己
        uint256 key;                //图片key
        uint256 backgroundid;       //背景的id
        uint256 animalsid;          //小伙伴的id
        uint256 monkeystate;        //猴子的状态  这里的状态是指 猴子身上带有的物品（比如从商店里面买了项链，那么照片里面的猴子就会由项链）
    }

    mapping (uint256 => Picturestr) allpictures;          //存放世界所有(key=>value) value为照片
    mapping (uint256 => Productstr) allproducts;          //商店所有商品 value为商品
    mapping (uint256 => Monkey) monkeys;            //世界所有的猴子 value为猴子
    mapping (address => uint256) owner2monkey;      //玩家地址 与 猴子key 的对应
    mapping (address => uint256[]) owner2product;   //玩家地址 与 玩家所拥有的商品key 的对应
    mapping (address => uint256[]) owner2picture;   //玩家地址 与 玩家所拥有的照片key 的对应

    uint256 background = 4;     //猴子出去游玩的场景总数量
    uint256 animals = 3;        //猴子出去游玩能遇到的小伙伴的总数量
    uint256 productcount = 1;   //下一个商品的key， productcount-1 为所有商品的数量
    uint256 picturecount = 1;   //下一个照片的key， picturecount-1 为所有照片的数量
    uint256 monkeycount = 1;    //下一个猴子的key， monkeycount-1 为所有猴子的数量
    uint256 bananacount = 15;           //初始化树上香蕉的数量

    address public owneraddress;
    function CoreContract() public {
        owneraddress = msg.sender;          //初始化owneraddress，发布者地址，用于后面的权限管理
        init();         //初始化商品等信息
    }

    //修改器，用于权限的判断
    modifier onlyOwner() {
        require(msg.sender == owneraddress);
        _;
    }

    //添加商品，仅发布者有权限
    function addProduct(string _name, uint256 _price, uint256 _effect) public onlyOwner {
        Productstr memory product = Productstr({key:productcount, name:_name, price:_price, effect:_effect});
        allproducts[productcount] = product;
        productcount ++;
    }

    //初始化
    function init() private {
        //初始化0号商品
        Productstr memory product = Productstr({key:0, name:"nothing", price:0,effect:0});
        //初始化0号照片
        Picturestr memory picture = Picturestr({key:0, backgroundid:0, animalsid:0, monkeystate:0});
        //初始化0号猴子
        Monkey memory monkey = Monkey({key:0, gene:0, mood:0, banana:0, state:false, monkeystate:0, owner:owneraddress});
        allproducts[0] = product;
        allpictures[0] = picture;
        monkeys[0] = monkey;
        //初始化5个商品
        addProduct("hat", 2, 2);                    //帽子
        addProduct("T-shirt", 5, 5);                //T恤
        addProduct("sugar", 1, 1);                  //糖果
        addProduct("lighting", 3, 3);               //手电筒
        addProduct("gold", 10, 10);                 //金项链
    }

/*
    //判断字符串是否相等
    function strEqual(string strA, string strB) public returns(bool) {
            bytes memory byteA = bytes(strA);
            bytes memory byteB = bytes(strB);
            if (byteA.length != byteB.length) {
                return false;
            }else {
                for (uint256 i=0; i < byteA.length; i++){
                    if (byteA[i] != byteB[i]) {
                        return false;
                    }
                }
            }
            return true;
        }
*/

    //通过玩家地址check玩家是否有猴子，没有猴子则调用freeMonkey（），让玩家免费领取一只猴子
    function checkFirst () public view returns(bool){
        if(owner2monkey[msg.sender] == 0){
            return true;        //没有猴子，可以领取免费猴子
        }
        else{
            return false;       //已经有猴子
        }
    }

    //领取免费猴子，玩家不能重复领取
    function freeMonkey () public {
        uint256 _key = monkeycount;
        uint256 _gene = randomGene();
        uint256 _mood = 60;
        uint256 _banana = 100;
        bool _state = true;
        uint256 _monkeystate = 1;
        address _owner = msg.sender;
        Monkey memory monkey = Monkey({key:_key, gene:_gene, mood:_mood, banana:_banana, state:_state, monkeystate:_monkeystate, owner:_owner});
        monkeys[monkeycount] = monkey;
        owner2monkey[msg.sender] = _key;
        monkeycount ++;
    }

    //获取游戏中猴子总数
    function getMonkeycount () public view returns (uint256) {
        return monkeycount;
    }

    //根据地址获取玩家的猴子信息
    function getMonkey () public view  returns (uint256, uint256, uint256, uint256, bool, uint256, address) {
        uint256 _key = owner2monkey[msg.sender];
        Monkey memory monkey = monkeys[_key];
        return (monkey.key, monkey.gene, monkey.mood, monkey.banana, monkey.state, monkey.monkeystate, monkey.owner);
    }

    //获取当前商品总数量
    function getProductlength() public view returns(uint256) {
        return productcount;
    }

    //根据key值获取某个商品的信息（需要一个参数，参数为商品的key值）
    function getProduct (uint256 _key) public view returns (uint256, string, uint256, uint256) {
        Productstr memory product = allproducts[_key];
        return (product.key, product.name, product.price, product.effect);
    }

    //获取当前照片总数量
    function getPicturelength() public view returns(uint256) {
        return picturecount;
    }

    //7.根据key值获取某个照片的信息（需要一个参数，参数为照片的key值）
    function getPicture (uint256 _key) public view returns (uint256, uint256, uint256, uint256) {
        Picturestr memory picture = allpictures[_key];
        return (picture.key, picture.backgroundid, picture.animalsid, picture.monkeystate);
    }

    //获取香蕉树上拥有的香蕉数量（玩家可以采摘树上的香蕉，通过getBananaFromTree方法）
    function getBananacount () public view returns(uint256) {
        return bananacount;
    }

    //根据地址获取玩家拥有的商品的key
    function getowner2product () public view returns(uint256[]) {
        return owner2product[msg.sender];
    }

    //根据地址获取玩家拥有的照片的key
    function getowner2picture () public view returns(uint256[]) {
        return owner2picture[msg.sender];
    }

    //生成monkeystate用到的二进制转十进制的方法
    function calculate (uint256 num) public view returns(uint256) {
        uint256 res = 1;
        for(uint256 i = 0; i < num; i++){
            res = res * 2;
        }
        return res;
    }

    //更新猴子的monkeystate属性，monkeystate用来和后端的猴子外形的图片做对应
    //例如商店总共有有5件商品， 当前猴子有第1件和第4件，那么猴子的monkeystate为 01001 对应的9
    function setMonkeyState () public  {
        uint256 _key = owner2monkey[msg.sender];
        Monkey memory monkey = monkeys[_key];
        uint256[] tmpproducts = owner2product[msg.sender];     //获取猴子拥有的商品的key
        uint256 i = 0;
        bool[] flag;
        for(i = 1; i < productcount; i++) {
            flag.push(false);
        }
        for(i = 1; i < tmpproducts.length; i++) {               //获取monkeystate的二进制
            flag[tmpproducts[i] - 1] = true;
        }
        uint256 res = 0;
        for(i = 0; i < flag.length; i++) {                      //获取monkeystate对应的十进制数
            if(flag[i] == true){
                res = res + calculate(i);
            }
        }
        monkey.monkeystate = res + 1;                                 //初始化时候，没有猴子，monkeystate = 0 
        monkeys[_key] = monkey;                             //有猴子，但是猴子没有任何商品时 monkeystate = 1，因此进行+1操作
    }

    //更新猴子的mood属性，当猴子购买商品或者外出之后，猴子的mood属性会发生变化
    function setMood (uint256 _mood) private {
        uint256 _key = owner2monkey[msg.sender];
        Monkey memory monkey = monkeys[_key];
        monkey.mood = monkey.mood + _mood;
        if(monkey.mood > 100) {
            monkey.mood = 100;      //猴子的心情值最大为100
        }
        monkeys[_key] = monkey;
    }


    //更新猴子的banana属性，该属性为玩家拥有的banana数量，banana在游戏中可以用来购买商品。
    function setBanana (uint256 _banana) private {
        uint256 _key = owner2monkey[msg.sender];
        Monkey memory monkey = monkeys[_key];
        monkey.banana = monkey.banana + _banana;
        monkeys[_key] = monkey;
    }

    /*
    function setProduct (uint256 _key) private {
        Monkey storage monkey = owner[msg.sender];
        uint256 id = products.push(_key);
        product2owner[id-1] = msg.sender;
        Product memory product = store[_key];
        int256 effect = product.effect;
        if(product.effect < 0) {
            effect = (-1) * effect;
        }
        effect = effect + int256(randomAnimals() % 10);
        monkey.mood = monkey.mood + effect;
        owner[msg.sender] = monkey;
    }
    */

/*    
    function getStore (uint256 _id) public view returns (uint256, string, uint256) {
        Product memory product = store[_id];
        return (product.key, product.name, product.price);
    }
    */
    
    //从商店购买商品，游戏中需要用banana购买商品，当购买商品时，如果此时树上的香蕉数量为0，则会触发addTree事件。购买商品可以改变猴子的mood值。
    //（需要一个参数，参数为商品的key值）
    function buyProduct (uint256 _key) public{
        uint256 _monkeykey = owner2monkey[msg.sender];
        Monkey memory monkey = monkeys[_monkeykey];
        Productstr memory product = allproducts[_key];
            
        //判断猴子是否有足够的香蕉购买商品
        require(monkey.banana >= product.price);
        monkey.banana = monkey.banana - product.price;       //修改猴子拥有的香蕉值
        monkey.mood = monkey.mood + product.effect;          //修改猴子的心情值
        if (monkey.mood > 100) {
            monkey.mood = 100;
        }
        uint256[] products = owner2product[msg.sender];       //将商品的key添加值猴子所拥有的商品列表中
        products.push(_key);
        owner2product[msg.sender] = products;
        monkeys[_monkeykey] = monkey;
        setMonkeyState();                                         //修改猴子的monkeystate属性值
        //如果此时树上的香蕉数量为0 ，则会触发 生长香蕉的事件
        if(bananacount == 0){
            addTree();
        }
    }
/*
    //充值banana
    function addBanana () public payable {
        require(msg.value > 1);
        uint256 value = uint256(msg.value);
        Monkey storage monkey = owner[msg.sender];
        monkey.banana = monkey.banana + value;
        owner[msg.sender] = monkey;
    }
*/
    //一定概率增加香蕉树上香蕉的数量，购买商品时会概率触发。
    //取 0～100 的一个随机数，对5求余，结果即为树上长出来的香蕉数量
    function addTree () public {
        uint256 probability = uint256(sha256(now, msg.sender))%100;
        /*
        if(probability > 80) {
            bananacount = probability % 5;
        }
        */
        bananacount = probability % 5;
        
    }

    //玩家采摘树上的香蕉。游戏中需要用香蕉购买商品，当玩家采摘数量的香蕉时，树上的香蕉数量变为0，猴子增加相应数量的香蕉。
    //在购买商品时，如果树上的香蕉为0，会有一定概率增加树上的香蕉数量
    function getBananaFromTree () public {
        uint256 _monkeykey = owner2monkey[msg.sender];
        Monkey memory monkey = monkeys[_monkeykey];
        monkey.banana = monkey.banana + bananacount;
        monkeys[_monkeykey] = monkey;
        bananacount = 0;
    }

    //在猴子照片墙上增加照片。猴子外出时，会给玩家寄回一张照片，玩家可以在照片墙上查看。
    function addPicture(uint256 _randombackground, uint256 _randomanimals, uint256 _monkeystate) private {
        Picturestr memory picture = Picturestr({key:picturecount, backgroundid:_randombackground, animalsid: _randomanimals, monkeystate: _monkeystate});
        allpictures[picturecount] = picture;                   //将照片添加到世界照片墙
        uint256[] pictures = owner2picture[msg.sender]; 
        pictures.push(picturecount);                        //将照片添加到猴子的照片墙
        owner2picture[msg.sender] = pictures;
        picturecount ++; 
    }

    //随机生成猴子的gene属性，猴子的初始化属性（目前未用到该属性，后面会涉及根据基因来决定其他初始值。）
    function randomGene () public view returns (uint256) {
        return uint256(sha256(now, msg.sender));
    }

    //随机生成Picture的backgroundid属性，即外出的场景。（猴子外出的照片由3部分构成，猴子自己，外出遇到的小伙伴，外出的场景）
    //该部分随机出一个0～3的值，代表了不同的外出场景。
    function randomBackground () public view returns(uint256) {
        return uint256(sha256(now, msg.sender)) % background + 1;       //后端设置background从1开始
    }

    //随机生成Picture的animalsid属性，即外出碰到的小伙伴
    //该部分随机出一个0～2的值，代表了外出遇到的不同小伙伴。
    function randomAnimals () public view returns (uint256) {
        return uint256(sha256(now, msg.sender)) % animals;
    }

    //外出事件，不一定会外出
    //取一个0～100的随机数，当猴子的心情值大于随机数时，则触发外出事件
    //随机判定是否外出，外出则随机生成照片，同时改变相关数据（外出后，猴子的mood值会发生改变，猴子照片墙上会增加形影外出的照片）。外出的照片有三部分组成，外出的背景，遇到的小伙伴，猴子的monkeystate属性
    //比如：1-1-2，为在场景1，遇到了小伙伴1，猴子状态为2，然后用1-1-2可以在后端服务器取出相应的照片。
    function checkWalkout () public returns (uint256, uint256, uint256, uint256) {
        uint256 _monkeykey = owner2monkey[msg.sender];
        Monkey memory monkey = monkeys[_monkeykey];
        uint256 probability = uint256(sha256(now, msg.sender)) % 100;
        uint256 randombackground = 0;
        uint256 randomanimals = 0;
        uint256 mood = 0;
        uint256 gift = 0;                     //外出会一偶一定概率触发礼物时间，即外出时小伙伴会送给猴子香蕉或者商店中的礼物
        if (monkey.mood > uint256(probability)){             //外出
            randombackground = randomBackground();          //随机外出场景
            randomanimals = randomAnimals();                //随机外出小伙伴
            addPicture(randombackground, randomanimals, monkey.monkeystate);          //增加照片
            /*
            if(100 - monkey.mood > int256(probability)) {       //有概率心情值降低
                mood = monkey.mood - int256(probability);      //心情变化值
                if (mood > 10) {
                    mood = 10;
                }
                mood = (-1) * mood;
            }
            */
            mood = monkey.mood - probability;               //心情变化值
            if (mood > 10) {                                //心情最高变化值为10
                mood = 10;
            }
            setMood(mood);                                  //改变心情值
            /*
            //礼物事件
            gift = probability % 20;
            if (gift < 5) {
                //setProduct(gift);
            }
            */
            return (randombackground, randomanimals, monkey.monkeystate, gift);
        } else if (monkey.mood < 30 && (100 - monkey.mood) > probability){
            //心情低于30的时候，一定概率会触发有小伙伴来家中看望猴子
            randombackground = 0;
            randomanimals = randomAnimals();
            addPicture(randombackground, randomanimals, monkey.monkeystate);
            mood = 100 - monkey.mood - uint256(probability);
            if (mood > 15) {                    //mood变化值最大为15
                mood = 15;
            }
            setMood(mood);
            /*
            //礼物事件
            gift = uint256(mood / 2);
            setBanana(gift);
            */
            return (0, randomanimals, monkey.monkeystate, gift);
        } else {                                                //不外出，在家
            uint256 weather = probability % 10;       
            /*   
            //天气影响
            if( weather > 5) {
                weather = (-1) * (weather - 5);
            }
            setMood(weather);
            */
            return (0, 0, 0, weather);
        }
    }

/*
    //比赛演示用的外出function，一定会外出
    function walkOut() public returns (uint256, uint256, uint256, int256) {
        Monkey memory monkey = owner[msg.sender];
        uint256 randombackground = randomBackground();
        uint256 randomanimals = randomAnimals();
        addPicture(randombackground, randomanimals, monkey.state);
        uint256 probability = uint256(sha256(now, msg.sender)) % 10;
        int256 mood = monkey.mood + int256(probability);
        setMood(mood);
        uint256 gift = uint256(probability % 20);
        if (gift < 5) {
            //setProduct(gift);
        }
        return (randombackground, randomanimals, monkey.state, int256(gift));
    }

    //比赛演示用的回家function
    function finalPicture() public returns (uint256, uint256, uint256) {
        uint256 randombackground = 1;
        uint256 randomanimals = 1;
        uint256 state = 2;
        addPicture(randombackground,randomanimals,state);
        return (randombackground,randomanimals,state);
    }
*/
    /*
    //前期设计，但是因为时间原因未实现的功能
    //天气功能，天气会影响猴子的心情
    function weather () public returns (uint256, uint256, uint256, int256) {
        uint256 probability = uint256(sha256(now, msg.sender)) % 10;
        int256 weather = int256(probability);
        if( weather > 5) {
            weather = (-1) * (weather - 5);
        }
        setMood(weather);
        return (0, 0, 0, weather);
    }

    //小伙伴来家里面看望猴子的功能
    function comeHome() public returns (uint256, uint256, uint256, int256) {
        Monkey memory monkey = owner[msg.sender];
        uint256 randombackground = randomBackground();
        uint256 randomanimals = randomAnimals();
        addPicture(randombackground, randomanimals, monkey.state);
        uint256 probability = uint256(sha256(now, msg.sender)) % 10;
        int256 mood = monkey.mood + int256(probability);
        setMood(mood);
        uint256 gift = uint256(mood / 2);
        setBanana(gift);
        return (randombackground, randomanimals, monkey.state, int256(gift));
    }
    */
}
