export abstract class Data {
    data: boolean = false
    loading: boolean = false
    noData: boolean = false
    error: boolean = false

    isData(): void {
        this.data = true
        this.loading = false
        this.noData = false
        this.error = false
    }

    isLoading(): void {
        this.data = false
        this.loading = true
        this.noData = false
        this.error = false
    }

    isNoData(): void {
        this.data = false
        this.loading = false
        this.noData = true
        this.error = false
    }

    isError(): void {
        this.data = false
        this.loading = false
        this.noData = false
        this.error = true
    }

}