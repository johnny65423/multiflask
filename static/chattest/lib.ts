/**
 * 產生隨機亂數30位元
 */
export function GenerateRandom() {
  let Random_length = 30;
  let characters = "0123456789abcdefghijklmnopqrstuvwxyz";
  let seed = "";
  let cnt = 0;
  let randomNumber = 0;
  while (cnt < Random_length) {
    cnt++;
    randomNumber = Math.floor(characters.length * Math.random());
    seed += characters.substring(randomNumber, randomNumber + 1);
  }

  return seed;
}

/**
 * 取得目前時間
 * @returns dateStr example: 2021-12-23 16:08:28
 */
export function getNowFormatDate() {
  let date = new Date();
  let dateStr =
    date.getFullYear() +
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

/**
 * 生成>=min, <max的隨機整數
 * @param min 隨機的最小數(含)
 * @param max 隨機的最大數(不含)
 */
export function getRandomInt(min: number = 0, max: number = 1) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 自動把1/1000秒轉為秒
 * @param second
 * @returns
 */
export function getSeconds(second: number) {
  return second * 1000;
}
