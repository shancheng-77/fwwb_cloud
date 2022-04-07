const baseUrl = '192.168.0.100:8083' ;
export const automaticUrl = 'http://'+baseUrl + '/orders/automatic';
export const manualUrl ='http://'+ baseUrl + '/orders/manual';

export const orderWebSocket = 'ws://'+baseUrl+'/order/{userId}';

export const fetchPost = async (url,data) => {
    const response =  await fetch(url,{
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data)
    })
    return await response.json()
}