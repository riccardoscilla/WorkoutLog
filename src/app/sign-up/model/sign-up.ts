export class SignUp {
    email: string
    password: string
    displayName: string

    isValid(): boolean {
        return this.email != undefined 
            && this.password != undefined
            && this.displayName != undefined
    }
}