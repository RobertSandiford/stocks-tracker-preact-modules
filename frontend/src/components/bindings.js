
export const runBindings = function() {
    //console.log("run bindings", this)

    //const understandRelationship = function(relationship) {
    //    const sides = relationship.split("=")
    //    sides.map( x => {
    //        return x.trim()
    //    })
    //    const leftSide = sides[0]
    //    const rightSide = sides[1]
    //    const rightSideParts = rightSide.split(" ")
    //}

    const enoughItemsHaveValues = function(items, activeItemName) {
        let nUnset = 0
        const ret = { }
        for (const [name, item] of Object.entries(items)) {
            if (name != activeItemName) {
                if (item.ref.current.value === "") {
                    if (++nUnset > 1) return false
                    item.name = name
                    ret.emptyItem = item
                } else {
                    //console.log(ret.oldestItem)
                    if ( ! ret.oldestItem || ! ("lastChanged" in item) || item.lastChanged < ret.oldestItem.lastChanged) {
                        item.name = name
                        ret.oldestItem = item
                    }
                }
            }
        }
        if (ret.emptyItem) delete ret.oldestItem
        return ret
    }

    for (const [bindingName, binding] of Object.entries(this.bindings)) {
        const items = binding.items
        for (const [itemName, item] of Object.entries(items)) {
            //console.log("item", itemName, item)
            item.ref.current.addEventListener("change", (event) => {
                const el = event.target
                item.lastChanged = new Date().getTime()

                let i = enoughItemsHaveValues(items, itemName)
                if ( i ) {
                    
                    i = (i.emptyItem || i.oldestItem)
                    const v = i.value(items)
                    i.ref.current.value = v
                    //i.lastChanged = new Date().getTime();
                    //binding.items[i.name].lastChanged = new Date().getTime();

                    // save to other variables
                    if (i.saveTo) i.saveTo = v
                    if (i.saveToObj) i.saveToObj[i.name] = v
                    
                    //console.log("ss", this.form, i.saveToObj[i.name])

                }
            })
        }
    }

}