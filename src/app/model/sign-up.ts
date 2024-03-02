export class SignUp {
    email: string
    password: string
    repeatedPassword: string
    displayName: string

    isValid(): boolean {
        if (this.password !== this.repeatedPassword)
            return false

        return this.email != undefined 
            && this.password != undefined
            && this.repeatedPassword != undefined
            && this.displayName != undefined
    }
}