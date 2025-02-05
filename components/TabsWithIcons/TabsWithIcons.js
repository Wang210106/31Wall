Component({
    properties: {
        'items' : {
            type: function(value) {
                if (!Array.isArray(value)) {
                    return false;
                }
                
                //注釋：id是标识值，text是要显示的文字信息，iconfont是icon的类名
                for (let i = 0; i < value.length; i++) {
                  const item = value[i];
                  if (
                        typeof item !== 'object' ||
                        item === null ||
                        !('id' in item) ||
                        !('text' in item) ||
                        !('iconfont' in item)
                    ) {
                        return false; 
                    }
                }
                return true;
              },
              value: [] 
        },
    },
})