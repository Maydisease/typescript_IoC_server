export class HttpService {
    public get() {
        return {name: 'tandongs', age: 31, work: 'coder'}
    }
    public post() {
        console.log('HttpService post');
    }
}