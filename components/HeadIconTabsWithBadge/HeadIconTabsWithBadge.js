Component({
    properties: {
        'items' : {
            type: Array,
            value: [] 
        },
    },
    methods: {
        handleItemTap(event) {
            const itemType = event.currentTarget.dataset.type;
            this.triggerEvent('itemtap', { type: itemType });
        }
    },
})