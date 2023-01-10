import {send_userJson, testfunc} from './chatHandler';

console.log("123");
console.log(testfunc());
send_userJson("123", "123", "中央國小_111522050_johnny", "hallo world");

export async function send_json_test() {
    return send_userJson("123", "123", "中央國小_111522050_johnny", "hallo world");

}