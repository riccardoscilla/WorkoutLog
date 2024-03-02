export interface RepDocument {
    order: number
    value: string
}

export class Rep {
    order: number
    value: number
    max: boolean = false

    toggleMax() {
        this.max = !this.max
    }

    static fromDocument(doc: RepDocument): Rep {
        const rep = new Rep()
        rep.order = doc.order
        if (doc.value === "max") {
            rep.max = true
        } else {
            rep.value = parseInt(doc.value)
        }
        return rep
    } 

    static deepcopy(r: Rep): Rep {
        const rep = new Rep()
        rep.order = r.order
        rep.value = r.value
        rep.max = r.max
        return rep
    }

    toDocument(): object {
        return {
            order: this.order,
            value: this.toString()
        }
    }

    toString(): string {
        if (this.max)
            return "max"
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