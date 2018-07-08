export const MAX_BOUND = "10000000000000000000";
export const MAX_LIMIT = "10000000000000000000";
export const PAGE_LIMIT = 20;

// export const protocol = 'https';
// export const host = 'nodes.get-scatter.com';
// export const port = 443;
// export const chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';

// export const CONTRACT_NAME = 'faceostest12';
// export const TABLE_NAME = 'mcontent';

export const protocol = 'http';
export const host = '127.0.0.1';
export const port = 8888;
export const chainId = "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f";

export const CONTRACT_NAME = 'board';
export const TABLE_NAME = 'mcontent';

export const requiredFields = {
    accounts:[
        {
            blockchain:'eos', 
            host: host, 
            port: port, 
            chainId: chainId
        }
    ]
};

export const NETWORK = {
    blockchain: 'eos',
    protocol: protocol,
    host: host,
    port: port,
    chainId: chainId
};

export const CONFIG = {
    broadcast: true,
    sign: true,
    chainId: chainId
};