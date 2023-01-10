import axios, { AxiosResponse } from "axios";
import { GenerateRandom, getNowFormatDate } from "./lib";
//import { chatWith } from "../index";
//import { ROUTE_IP } from "../config";
//import { Game } from "@gathertown/gather-game-client";


let ROUTE_IP = "http://127.0.0.1:80"

let Words;
let TalkWords: any;
let Suggestions: any;
let res_data: any;
let random_pitch;
// 這邊下面是主要傳前端json的地方 comment by Lin-YenYu 20211215
let sceneName = "startWithoutCheckPlayer"; // input_userId 或是 Get_bookName
sceneName = "Get_bookName";
// let handler = { name: "input_userId" };
let handler = { name: sceneName };
let intent = { params: {}, query: "" };
// let scene = { name: "input_userId" };
let scene = { name: sceneName };
let session = { id: GenerateRandom(), params: {} };
let user = { lastSeenTime: "", character: "fish_teacher", player: 1 };
// var user = { "lastSeenTime" : "", "character" : "fish_classmate" };
let chatbotWords: any = [];
let chatbotWords_speech: any[] = [];
let chatbotWords_delay: any[] = [];
let chatbotWords_last = "";
let sync_waitInput_flag = 0;
// var rec_imageUrl = "";
let post_count = 0;
// var suggest_arr = ["丁班", "戊班"];
// var score = 0;
// var suggest_exist = 0;
// 心情變數 PA
let chatbotWords_expression = "happy";
let CE_P = 0;
let CE_A = 0;
let CE_P_old = 0;
let CE_A_old = 0;

let cutNumber: number; // 決定聊幾句要強制中斷
/**
 * 將所有狀態回到初始值
 * @author LIN-YENYU
 * @since 2021/12/3
 */

export function testfunc() {
  return 0;
}

export function reset() {
  // handler = { name: "input_userId" };
  handler = { name: sceneName };
  intent = { params: {}, query: "" };
  // scene = { name: "input_userId" };
  scene = { name: sceneName };
  session = { id: GenerateRandom(), params: {} };
  user = { lastSeenTime: "", character: "fish_teacher", player: 1 };
  post_count = 0;
  chatbotWords = [];
  chatbotWords_speech = [];
  chatbotWords_delay = [];

  CE_P = 0;
  CE_A = 0;
  CE_P_old = 0;
  CE_A_old = 0;
}

/**
 * 使用者傳送json的話會藉由這個function將資訊傳輸回後端處理，並且將處理後的資料傳回前端。
 * 會連向python的聊書核心
 * @param playerSaid 使用者輸入的訊息
 * @param senderID 傳送訊息者的ID
 * @param recipientID 接收訊息者的ID
 * @author LIN-YENYU
 * @since 2021/12/23
 */
export async function send_userJson(playerSaid: string, senderID: string, playerName: string, _recipient?: string) {
  cutNumber = 3;
  console.log(post_count);
  post_count++;
  //   intent["query"] = TalkWords.value;
  intent["query"] = playerSaid;
  user["lastSeenTime"] = getNowFormatDate();
  let postData = {
    handler: handler,
    intent: intent,
    scene: scene,
    session: session,
    user: user,
    playerGatherName: playerName,
    cutNumber: cutNumber,
    Speaker_id: "chatbot_talk_book",
  };

  await axios({
    method: "POST",
    url: ROUTE_IP + "/talk",
    data: JSON.stringify(postData), // 前端去後端 -> 分析使用者輸入的訊息
  })
    .then((data) => {
      // 後端回前端 -> chatbot決定要傳給使用者的訊息
      res_data = data["data"];
      // console.log(postData);
      // console.log(">>>>>res_data: ", res_data);
      // console.log(">>>>>res_data-text: ", res_data["prompt"]["firstSimple"]["text"]);
      return analyze_responseData(playerSaid, senderID, playerName, "send_userJson", cutNumber);
    })
    .catch((err) => {
      //chatWith(senderID, "抱歉喔，我現在不是很舒服...讓我休息一下吧。");
      console.log("抱歉喔，我現在不是很舒服...讓我休息一下吧。");
      reset();
      console.log(">>>", err);
    });
}
/**
 * 以角色和事件經驗為主的聊書
 * 會連向python的聊書核心
 * @param playerSaid
 * @param senderID
 * @param playerName
 * @param _recipient
 */
export async function send_userJson_exp(playerSaid: string, senderID: string, playerName: string, _recipient?: string) {
  console.log(post_count);
  cutNumber = 3;
  post_count++;
  //   intent["query"] = TalkWords.value;
  intent["query"] = playerSaid;
  user["lastSeenTime"] = getNowFormatDate();
  let postData = {
    handler: handler,
    intent: intent,
    scene: scene,
    session: session,
    user: user,
    playerGatherName: playerName,
    cutNumber: cutNumber,
    Speaker_id: "chatbot_exp",
  };

  await axios({
    method: "POST",
    url: ROUTE_IP + "/talk/exp",
    data: JSON.stringify(postData), // 前端去後端 -> 分析使用者輸入的訊息
  })
    .then((data) => {
      // 後端回前端 -> chatbot決定要傳給使用者的訊息
      res_data = data["data"];
      // console.log(postData);
      // console.log(">>>>>res_data: ", res_data);
      // console.log(">>>>>res_data-text: ", res_data["prompt"]["firstSimple"]["text"]);
      analyze_responseData(playerSaid, senderID, playerName, "send_userJson_exp", cutNumber);
    })
    .catch((err) => {
      //chatWith(senderID, "抱歉喔，我現在不是很舒服...讓我休息一下吧。");
      console.log("抱歉喔，我現在不是很舒服...讓我休息一下吧。");
      reset();
      console.log(">>>", err);
    });
}
/**
 * 只問一個關於書的籠統問題，然後閒聊個10句左右
 * 會連向python的聊書核心
 * @param playerSaid
 * @param senderID
 * @param playerName
 * @param _recipient
 */
export async function send_userJson_exp_long(
  playerSaid: string,
  senderID: string,
  playerName: string,
  _recipient?: string
) {
  console.log(post_count);
  cutNumber = 3;
  post_count++;
  //   intent["query"] = TalkWords.value;
  intent["query"] = playerSaid;
  user["lastSeenTime"] = getNowFormatDate();
  let postData = {
    handler: handler,
    intent: intent,
    scene: scene,
    session: session,
    user: user,
    playerGatherName: playerName,
    cutNumber: cutNumber,
    Speaker_id: "chatbot_exp_long",
  };

  await axios({
    method: "POST",
    url: ROUTE_IP + "/talk/exp/long",
    data: JSON.stringify(postData), // 前端去後端 -> 分析使用者輸入的訊息
  })
    .then((data) => {
      // 後端回前端 -> chatbot決定要傳給使用者的訊息
      res_data = data["data"];
      // console.log(postData);
      // console.log(">>>>>res_data: ", res_data);
      // console.log(">>>>>res_data-text: ", res_data["prompt"]["firstSimple"]["text"]);
      analyze_responseData(playerSaid, senderID, playerName, "send_userJson_exp_long", cutNumber);
    })
    .catch((err) => {
      //chatWith(senderID, "抱歉喔，我現在不是很舒服...讓我休息一下吧。");
      console.log("抱歉喔，我現在不是很舒服...讓我休息一下吧。");
      reset();
      console.log(">>>", err);
    });
}

/**
 * 連向python的閒聊
 * @param playerSaid
 * @param senderID
 * @param senderName
 * @param dbName 0=Chatbart_dialog, 1=Chatbart_QAdialog
 * @param _recipient
 * @returns
 */
export async function send_userJson_chat(
  playerSaid: string,
  senderID: string,
  senderName: string,
  dbName: number,
  _recipient?: string
) {
  let dbList = ["Chatbart_dialog", "Chatbart_QAdialog"];
  let nowTime = getNowFormatDate();
  let postData = { playerName: senderName, playerSaid, sendTime: nowTime, dbName: dbList[dbName] };
  return await axios({
    method: "POST",
    url: ROUTE_IP + "/chat",
    data: JSON.stringify(postData), // 前端去後端 -> 分析使用者輸入的訊息
  })
    .then((result) => {
      // // 後端回前端 -> chatbot決定要傳給使用者的訊息
      return result.data;
    })
    .catch((err) => {
      //chatWith(senderID, "抱歉喔，我現在不是很舒服...讓我休息一下吧。");
      console.log("抱歉喔，我現在不是很舒服...讓我休息一下吧。");
      console.log(">>>", err);
    });
}
/**
 * 對接CEM，架構與聊書機器人一樣
 * 目前沒有使用
 * @param playerSaid
 * @param senderID
 * @param _recipient
 */
export async function send_userJson_chitchatting(playerSaid: string, senderID: string, _recipient?: string) {
  handler = { name: "chitchat" };
  intent = { params: {}, query: "" };
  scene = { name: "chitchat" };
  session = { id: GenerateRandom(), params: {} };
  user = { lastSeenTime: "", character: "fish_teacher", player: 1 };

  intent["query"] = playerSaid;
  user["lastSeenTime"] = getNowFormatDate();
  let postData = {
    handler: handler,
    intent: intent,
    scene: scene,
    session: session,
    user: user,
  };

  await axios({
    method: "POST",
    url: ROUTE_IP + "/chitchatting",
    data: JSON.stringify(postData), // 前端去後端 -> 分析使用者輸入的訊息
  })
    .then((data) => {
      // 後端回前端 -> chatbot決定要傳給使用者的訊息
      res_data = data["data"];
      responesdJsonProcess();
      let hasMessage = false;
      if (senderID && chatbotWords) {
        // 偵測是不是有訊息在字串裡面
        for (let i = 0; i < chatbotWords.length; i++) {
          if (chatbotWords[i] != "") {
            hasMessage = true;
          }
        }
        for (let i = 0; i < chatbotWords.length; i++) {
          console.log("senderID is ", senderID, " i:", i);
          console.log(`chatbotWords[${i}]: ${chatbotWords[i]}`);
          if (chatbotWords[i] != "") {
            //chatWith(senderID, chatbotWords[i]);
            console.log(chatbotWords[i]);
          } else if (!hasMessage) {
            setTimeout(() => {
              send_userJson_chitchatting("", senderID);
            }, 1500);
          }
        }
        // 對話傳完之後就清空字串
        chatbotWords = [];
        // 閒聊完成就回到初始狀態
        reset();
      } else {
        console.log("Need senderID and chatbotWords");
        console.log("sender id: ", senderID);
        console.log("chatbotWords: ", chatbotWords);
      }
    })
    .catch((err) => {
      //chatWith(senderID, "抱歉喔，我現在不是很舒服...讓我休息一下吧。");
      console.log("抱歉喔，我現在不是很舒服...讓我休息一下吧。");
      reset();
      console.log(">>>", err);
    });
}

/**
 * Respone JSON process, consider scene and reply to user.
 * @param playerSaid 使用者輸入的訊息
 * @param senderID 傳送訊息者的ID
 * @param recipientID 接收訊息者的ID
 * @param cutNumber 決定聊多少句要中斷場景
 * @author LIN-YENYU
 * @since 2021/12/23
 */
function analyze_responseData(
  playerSaid: string,
  senderID: string,
  playerName: string,
  call: string,
  cutNumber: number
) {
  /* Step1： Respone JSON 處理 */
  responesdJsonProcess();
  chatbotMood();

  /* Step2：顯示機器人回應 */
  let hasMessage = false;
  if (senderID && chatbotWords) {
    // 偵測是不是有訊息在字串裡面
    for (let i = 0; i < chatbotWords.length; i++) {
      if (chatbotWords[i] != "") {
        hasMessage = true;
      }
    }
    for (let i = 0; i < chatbotWords.length; i++) {
      console.log("senderID is ", senderID, " i:", i);
      console.log(`chatbotWords[${i}]: ${chatbotWords[i]}`);
      if (chatbotWords[i] != "") {
        //chatWith(senderID, chatbotWords[i]);
        console.log(chatbotWords[i]);
        return chatbotWords[i];
      } else if (!hasMessage) {
        setTimeout(() => {
          if (call == "send_userJson") send_userJson("", senderID, playerName);
          else if (call == "send_userJson_exp") send_userJson_exp("", senderID, playerName);
          else if (call == "send_userJson_exp_long") send_userJson_exp_long("", senderID, playerName);
        }, 1500);
      }
    }
    // 對話傳完之後就清空字串
    chatbotWords = [];
  } else {
    console.log("Need senderID and chatbotWords");
    console.log("sender id: ", senderID);
    console.log("chatbotWords: ", chatbotWords);
  }

  /* Step3：考慮場景 */
  considerScene(playerSaid, senderID, playerName, call, cutNumber);
}

/**
 * Respone JSON 處理
 * @author LIN-YENYU
 * @since 2021/12/23
 */
function responesdJsonProcess() {
  // JSON 存在 prompt
  if (res_data.hasOwnProperty("prompt")) {
    //機器人回應文字
    let item_text: any;
    for (item_text in res_data["prompt"]["firstSimple"]["text"]) {
      chatbotWords[item_text] = res_data["prompt"]["firstSimple"]["text"][item_text];

      chatbotWords_speech[item_text] = res_data["prompt"]["firstSimple"]["speech"][item_text];

      chatbotWords_delay[item_text] = res_data["prompt"]["firstSimple"]["delay"][item_text];
      //console.log(chatbotWords[item_text])
    }
  } else {
    chatbotWords = [];
  }

  // JSON 存在 scene 用作場景切換功能
  if (res_data.hasOwnProperty("scene")) {
    handler["name"] = res_data["scene"]["next"]["name"];
    scene["name"] = res_data["scene"]["next"]["name"];
  }

  // JSON 存在 session 用作對話存取
  if (res_data.hasOwnProperty("session")) {
    session["params"] = Object.assign(session["params"], res_data["session"]["params"]);
  }
}
/**
 * 考慮場景
 * @author LIN-YENYU
 * @since 2021/12/23
 */
function considerScene(playerSaid: string, senderID: string, playerName: string, call: string, cutNumber: number) {
  // 判斷同步等待使用者輸入再觸發一次request傳送
  if (scene["name"] == "check_input") {
    sync_waitInput_flag = 1;
  } else {
    sync_waitInput_flag = 0;
  }

  // 判斷不等待使用者輸入直接觸發request傳送
  console.log("scene name", scene["name"]);
  if (
    scene["name"] == "Prompt_character" ||
    scene["name"] == "Prompt_character_sentiment" ||
    scene["name"] == "Prompt_task" ||
    scene["name"] == "Prompt_event" ||
    scene["name"] == "Prompt_action" ||
    scene["name"] == "Prompt_dialog" ||
    scene["name"] == "suggestion" ||
    scene["name"] == "Prompt_character_experience" ||
    scene["name"] == "Prompt_action_experience" ||
    scene["name"] == "bart_chat" ||
    scene["name"] == "prompt_epilogue" ||
    scene["name"] == "prompt_startQuestion"
  ) {
    setTimeout(function () {
      if (call == "send_userJson") send_userJson(playerSaid, senderID, playerName);
      else if (call == "send_userJson_exp") send_userJson_exp(playerSaid, senderID, playerName);
      else if (call == "send_userJson_exp_long") send_userJson_exp_long(playerSaid, senderID, playerName);
      console.log("判斷不等待使用者輸入直接觸發request傳送");
    }, 1500);
  }

  // 判斷不等待使用者輸入直接觸發request傳送(對話達到指定次數)
  if (res_data.hasOwnProperty("session")) {
    if (res_data["session"]["params"].hasOwnProperty("dialog_count")) {
      if (res_data["session"]["params"]["dialog_count"] > cutNumber) {
        setTimeout(function () {
          if (call == "send_userJson") send_userJson(playerSaid, senderID, playerName);
          else if (call == "send_userJson_exp") send_userJson_exp(playerSaid, senderID, playerName);
          else if (call == "send_userJson_exp_long") send_userJson_exp_long(playerSaid, senderID, playerName);
          console.log("判斷不等待使用者輸入直接觸發request傳送(對話達到指定次數)");
        }, 1500);
      }
    }
  }

  // 判斷不等待使用者輸入直接觸發request傳送(書名階段比對失敗)
  if (res_data.hasOwnProperty("session")) {
    if (res_data["session"]["params"].hasOwnProperty("User_first_match")) {
      if (
        res_data["session"]["params"]["User_first_match"] == true ||
        res_data["session"]["params"]["User_second_check"] == true
      ) {
        if (call == "send_userJson") send_userJson(playerSaid, senderID, playerName);
        else if (call == "send_userJson_exp") send_userJson_exp(playerSaid, senderID, playerName);
        else if (call == "send_userJson_exp_long") send_userJson_exp_long(playerSaid, senderID, playerName);
        console.log("判斷不等待使用者輸入直接觸發request傳送(書名階段比對失敗)");
      }
    }
  }

  if (scene["name"] == "exit_system") {
    setTimeout(() => {
      reset();
    }, 1000);
  }
}

/**
 * 機器人心情值計算
 * @author LIN-YENYU
 * @since 2021/12/30
 * @todo 之後要和gather town的表情貼圖和跳舞做連結，目前尚未實裝
 */
function chatbotMood() {
  //機器人情緒
  console.log("----- Chatbod mood -----");

  if (res_data["prompt"]["firstSimple"].hasOwnProperty("expression")) {
    chatbotWords_expression = res_data["prompt"]["firstSimple"]["expression"];
    console.log(chatbotWords_expression);
    //change_chatbotMood()
  }
  //機器人情緒 P/A
  CE_P_old = CE_P;
  CE_A_old = CE_A;
  if (res_data["prompt"]["firstSimple"].hasOwnProperty("expressionP")) {
    CE_P = CE_P + res_data["prompt"]["firstSimple"]["expressionP"];
    CE_A = CE_A + res_data["prompt"]["firstSimple"]["expressionA"];
    console.log("P:%d", CE_P, "A:", CE_A);
  }
  console.log("----------");
}

export function getCEP() {
  return CE_P;
}

export async function checkFinished_T(content: string) {
  let res = await axios({
    method: "POST",
    url: ROUTE_IP + "/checkFinished",
    data: JSON.stringify(content), // 前端去後端 -> 分析使用者輸入的訊息
  })
    .then((result) => {
      // 後端回前端 -> chatbot決定要傳給使用者的訊息
      return result.data
    })
    .catch((err) => {
    });
  return res
}
