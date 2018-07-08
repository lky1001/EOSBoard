
let scatter;
export class ScatterClient {
    getClient = () => {
        return new Promise((resolve, reject) => {
            if(scatter) resolve(scatter);

            document.addEventListener('scatterLoaded', scatterExtension => {
                console.log('scatterloaded');
                scatter = window.scatter;
                resolve(scatter);
            });
        })
    }
}

export default ScatterClient;
