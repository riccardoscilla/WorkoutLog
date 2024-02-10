export class Rep {
    value: number
    max: boolean = false

    toggleMax() {
        this.max = !this.max
    }

    static fromDocument(docValue: string): Rep {
        const rep = new Rep()
        if (docValue === 'max') {
            rep.max = true
        }
        else {
            rep.value = parseInt(docValue)
        }
        return rep
    } 

    static fromRep(r: Rep): Rep {
        const rep = new Rep()
        rep.value = r.value
        rep.max = r.max
        return rep
    }

    toDocumentValue(): String {
        if (this.value !== undefined && this.value > 0 && this.max === false)
            return this.value.toString()

        if (this.max === true)
            return 'max'

        return ''    
    }
}