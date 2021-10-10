class ClientApi {
    data: [string, number][]
    base_url: string
    api_prefix: string
    endpoints: {
        getData: string
    }

    constructor(base_url?: string, api_prefix?: string) {
        this.data = []
        this.base_url = base_url ?? process.env.REACT_APP_SERVER_URL ?? "localhost:8000";
        this.api_prefix = api_prefix ?? "/api/";
        this.endpoints = {
            getData: "get_data"
        }
    }

    build_url(endpoint: string) : string {
        return this.base_url + this.api_prefix + endpoint;
    }

    async pullData(){
        try {
            let data: [string, string][] = await (await fetch(this.build_url(this.endpoints.getData))).json();
            this.data = data.map((el) => [el[0], parseInt(el[1])]);
        }catch (e) {
        }
    }
}

export {ClientApi};