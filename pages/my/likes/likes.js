// pages/my/likes/likes.js
Page({
    data: {
        "items" : [
            { id : 10001, text : '消息一車車車', subText : 'chebaile', isIcon : true},
            { id : 10002, text : '消息2車車車', subText : 'chebaile' , isIcon : false, imageUrl : '/image/hd1.png'},
            { id : 10003, text : '消息三車車車',subText : '小文字小蚊子' , isIcon : false, imageUrl : '/image/hd1.png'},
            { id : 10004, text : '消息4車車車',subText : 'chebaile' , isIcon : true},
            { id : 10005, text : '消息五lll',subText : 'chebaile' , isIcon : true},
            { id : 10006, text : '消息6lll',subText : 'chebaile' , isIcon : true},
            { id : 10007, text : '消息7lll',subText : 'chebaile' , isIcon : true},
            { id : 10008, text : '消息8lll',subText : 'chebaile' , isIcon : true},
            { id : 10009, text : '消息9lll',subText : 'chebaile' , isIcon : true},
            { id : 10010, text : '消息10lll',subText : 'chebaile' , isIcon : true},
            { id : 10011, text : '消息11lll',subText : 'chebaile' , isIcon : true},
            { id : 10012, text : '消息12lll',subText : 'chebaile' , isIcon : true},
        ],
    },
    itemtap: e => {
        const id = e.detail.type;
        console.log("To" + id)
    },
    onLoad: options => {
        console.log(options.type)
    }
})