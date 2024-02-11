export class Rep {
    order: number
    value: number = 0
    max: boolean = false

    toggleMax() {
        this.max = !this.max
    }

    static fromDocument(doc: Rep): Rep {
        const rep = new Rep()
        rep.order = doc.order
        rep.max = doc.max
        rep.value = doc.value
        return rep
    } 

    static fromRep(r: Rep): Rep {
        const rep = new Rep()
        rep.order = r.order
        rep.value = r.value
        rep.max = r.max
        return rep
    }

    toDocument(): object {
        return {
            order: this.order,
            value: this.value,
            max: this.max
        }
    }

    toString(): string {
        if (this.max)
            return "Max"
        if (this.value)
            return this.value.toString()
        return ""
    }

    isValid(): boolean {
        if (this.value !== undefined && this.value > 0 && this.max === false)
            return true

        if (this.max === true)
            return true

        return false
    }
}