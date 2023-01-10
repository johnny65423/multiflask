"use strict";
exports.__esModule = true;
exports.getSeconds = exports.getRandomInt = exports.getNowFormatDate = exports.GenerateRandom = void 0;
/**
 * 產生隨機亂數30位元
 */
function GenerateRandom() {
    var Random_length = 30;
    var characters = "0123456789abcdefghijklmnopqrstuvwxyz";
    var seed = "";
    var cnt = 0;
    var randomNumber = 0;
    while (cnt < Random_length) {
        cnt++;
        randomNumber = Math.floor(characters.length * Math.random());
        seed += characters.substring(randomNumber, randomNumber + 1);
    }
    return seed;
}
exports.GenerateRandom = GenerateRandom;
/**
 * 取得目前時間
 * @returns dateStr example: 2021-12-23 16:08:28
 */
function getNowFormatDate() {
    var date = new Date();
    var dateStr = date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getDate()).slice(-2) +
        " " +
        ("0" + date.getHours()).slice(-2) +
        ":" +
        ("0" + date.getMinutes()).slice(-2) +
        ":" +
        ("0" + date.getSeconds()).slice(-2);
    return dateStr;
}
exports.getNowFormatDate = getNowFormatDate;
/**
 * 生成>=min, <max的隨機整數
 * @param min 隨機的最小數(含)
 * @param max 隨機的最大數(不含)
 */
function getRandomInt(min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    return Math.floor(Math.random() * (max - min)) + min;
}
exports.getRandomInt = getRandomInt;
/**
 * 自動把1/1000秒轉為秒
 * @param second
 * @returns
 */
function getSeconds(second) {
    return second * 1000;
}
exports.getSeconds = getSeconds;
