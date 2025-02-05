Component({
    properties: {
        'items' : {
            type: Array,
            value: [] 
        },
        'badges' : {
            type: Array,
            value: 0,
        }
    },
    methods: {
        handleItemTap(event) {
            const itemType = event.currentTarget.dataset.type;
            this.triggerEvent('itemtap', { type: itemType });
        }
    },
})