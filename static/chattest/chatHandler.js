"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.checkFinished_T = exports.getCEP = exports.send_userJson_chitchatting = exports.send_userJson_chat = exports.send_userJson_exp_long = exports.send_userJson_exp = exports.send_userJson = exports.reset = exports.testfunc = void 0;
//var axios_1 = require("axios");
import * as axios_1 from "axios";
//var lib_1 = require("./lib");
import * as lib_1 from './lib';
//import { chatWith } from "../index";
//import { ROUTE_IP } from "../config";
//import { Game } from "@gathertown/gather-game-client";
var ROUTE_IP = "http://127.0.0.1:80";
var Words;
var TalkWords;
var Suggestions;
var res_data;
var random_pitch;
// 這邊下面是主要傳前端json的地方 comment by Lin-YenYu 20211215
var sceneName = "startWithoutCheckPlayer"; // input_userId 或是 Get_bookName
sceneName = "Get_bookName";
// let handler = { name: "input_userId" };
var handler = { name: sceneName };
var intent = { params: {}, query: "" };
// let scene = { name: "input_userId" };
var scene = { name: sceneName };
var session = { id: (0, lib_1.GenerateRandom)(), params: {} };
var user = { lastSeenTime: "", character: "fish_teacher", player: 1 };
// var user = { "lastSeenTime" : "", "character" : "fish_classmate" };
var chatbotWords = [];
var chatbotWords_speech = [];
var chatbotWords_delay = [];
var chatbotWords_last = "";
var sync_waitInput_flag = 0;
// var rec_imageUrl = "";
var post_count = 0;
// var suggest_arr = ["丁班", "戊班"];
// var score = 0;
// var suggest_exist = 0;
// 心情變數 PA
var chatbotWords_expression = "happy";
var CE_P = 0;
var CE_A = 0;
var CE_P_old = 0;
var CE_A_old = 0;
var cutNumber; // 決定聊幾句要強制中斷
/**
 * 將所有狀態回到初始值
 * @author LIN-YENYU
 * @since 2021/12/3
 */
function testfunc() {
    return 0;
}
exports.testfunc = testfunc;
function reset() {
    // handler = { name: "input_userId" };
    handler = { name: sceneName };
    intent = { params: {}, query: "" };
    // scene = { name: "input_userId" };
    scene = { name: sceneName };
    session = { id: (0, lib_1.GenerateRandom)(), params: {} };
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
exports.reset = reset;
/**
 * 使用者傳送json的話會藉由這個function將資訊傳輸回後端處理，並且將處理後的資料傳回前端。
 * 會連向python的聊書核心
 * @param playerSaid 使用者輸入的訊息
 * @param senderID 傳送訊息者的ID
 * @param recipientID 接收訊息者的ID
 * @author LIN-YENYU
 * @since 2021/12/23
 */
function send_userJson(playerSaid, senderID, playerName, _recipient) {
    return __awaiter(this, void 0, void 0, function () {
        var postData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cutNumber = 3;
                    console.log(post_count);
                    post_count++;
                    //   intent["query"] = TalkWords.value;
                    intent["query"] = playerSaid;
                    user["lastSeenTime"] = (0, lib_1.getNowFormatDate)();
                    postData = {
                        handler: handler,
                        intent: intent,
                        scene: scene,
                        session: session,
                        user: user,
                        playerGatherName: playerName,
                        cutNumber: cutNumber,
                        Speaker_id: "chatbot_talk_book"
                    };
                    return [4 /*yield*/, (0, axios_1["default"])({
                            method: "POST",
                            url: ROUTE_IP + "/talk",
                            data: JSON.stringify(postData)
                        })
                            .then(function (data) {
                            // 後端回前端 -> chatbot決定要傳給使用者的訊息
                            res_data = data["data"];
                            // console.log(postData);
                            // console.log(">>>>>res_data: ", res_data);
                            // console.log(">>>>>res_data-text: ", res_data["prompt"]["firstSimple"]["text"]);
                            return analyze_responseData(playerSaid, senderID, playerName, "send_userJson", cutNumber);
                        })["catch"](function (err) {
                            //chatWith(senderID, "抱歉喔，我現在不是很舒服...讓我休息一下吧。");
                            console.log("抱歉喔，我現在不是很舒服...讓我休息一下吧。");
                            reset();
                            console.log(">>>", err);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.send_userJson = send_userJson;
/**
 * 以角色和事件經驗為主的聊書
 * 會連向python的聊書核心
 * @param playerSaid
 * @param senderID
 * @param playerName
 * @param _recipient
 */
function send_userJson_exp(playerSaid, senderID, playerName, _recipient) {
    return __awaiter(this, void 0, void 0, function () {
        var postData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(post_count);
                    cutNumber = 3;
                    post_count++;
                    //   intent["query"] = TalkWords.value;
                    intent["query"] = playerSaid;
                    user["lastSeenTime"] = (0, lib_1.getNowFormatDate)();
                    postData = {
                        handler: handler,
                        intent: intent,
                        scene: scene,
                        session: session,
                        user: user,
                        playerGatherName: playerName,
                        cutNumber: cutNumber,
                        Speaker_id: "chatbot_exp"
                    };
                    return [4 /*yield*/, (0, axios_1["default"])({
                            method: "POST",
                            url: ROUTE_IP + "/talk/exp",
                            data: JSON.stringify(postData)
                        })
                            .then(function (data) {
                            // 後端回前端 -> chatbot決定要傳給使用者的訊息
                            res_data = data["data"];
                            // console.log(postData);
                            // console.log(">>>>>res_data: ", res_data);
                            // console.log(">>>>>res_data-text: ", res_data["prompt"]["firstSimple"]["text"]);
                            analyze_responseData(playerSaid, senderID, playerName, "send_userJson_exp", cutNumber);
                        })["catch"](function (err) {
                            //chatWith(senderID, "抱歉喔，我現在不是很舒服...讓我休息一下吧。");
                            console.log("抱歉喔，我現在不是很舒服...讓我休息一下吧。");
                            reset();
                            console.log(">>>", err);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.send_userJson_exp = send_userJson_exp;
/**
 * 只問一個關於書的籠統問題，然後閒聊個10句左右
 * 會連向python的聊書核心
 * @param playerSaid
 * @param senderID
 * @param playerName
 * @param _recipient
 */
function send_userJson_exp_long(playerSaid, senderID, playerName, _recipient) {
    return __awaiter(this, void 0, void 0, function () {
        var postData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(post_count);
                    cutNumber = 3;
                    post_count++;
                    //   intent["query"] = TalkWords.value;
                    intent["query"] = playerSaid;
                    user["lastSeenTime"] = (0, lib_1.getNowFormatDate)();
                    postData = {
                        handler: handler,
                        intent: intent,
                        scene: scene,
                        session: session,
                        user: user,
                        playerGatherName: playerName,
                        cutNumber: cutNumber,
                        Speaker_id: "chatbot_exp_long"
                    };
                    return [4 /*yield*/, (0, axios_1["default"])({
                            method: "POST",
                            url: ROUTE_IP + "/talk/exp/long",
                            data: JSON.stringify(postData)
                        })
                            .then(function (data) {
                            // 後端回前端 -> chatbot決定要傳給使用者的訊息
                            res_data = data["data"];
                            // console.log(postData);
                            // console.log(">>>>>res_data: ", res_data);
                            // console.log(">>>>>res_data-text: ", res_data["prompt"]["firstSimple"]["text"]);
                            analyze_responseData(playerSaid, senderID, playerName, "send_userJson_exp_long", cutNumber);
                        })["catch"](function (err) {
                            //chatWith(senderID, "抱歉喔，我現在不是很舒服...讓我休息一下吧。");
                            console.log("抱歉喔，我現在不是很舒服...讓我休息一下吧。");
                            reset();
                            console.log(">>>", err);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.send_userJson_exp_long = send_userJson_exp_long;
/**
 * 連向python的閒聊
 * @param playerSaid
 * @param senderID
 * @param senderName
 * @param dbName 0=Chatbart_dialog, 1=Chatbart_QAdialog
 * @param _recipient
 * @returns
 */
function send_userJson_chat(playerSaid, senderID, senderName, dbName, _recipient) {
    return __awaiter(this, void 0, void 0, function () {
        var dbList, nowTime, postData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dbList = ["Chatbart_dialog", "Chatbart_QAdialog"];
                    nowTime = (0, lib_1.getNowFormatDate)();
                    postData = { playerName: senderName, playerSaid: playerSaid, sendTime: nowTime, dbName: dbList[dbName] };
                    return [4 /*yield*/, (0, axios_1["default"])({
                            method: "POST",
                            url: ROUTE_IP + "/chat",
                            data: JSON.stringify(postData)
                        })
                            .then(function (result) {
                            // // 後端回前端 -> chatbot決定要傳給使用者的訊息
                            return result.data;
                        })["catch"](function (err) {
                            //chatWith(senderID, "抱歉喔，我現在不是很舒服...讓我休息一下吧。");
                            console.log("抱歉喔，我現在不是很舒服...讓我休息一下吧。");
                            console.log(">>>", err);
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.send_userJson_chat = send_userJson_chat;
/**
 * 對接CEM，架構與聊書機器人一樣
 * 目前沒有使用
 * @param playerSaid
 * @param senderID
 * @param _recipient
 */
function send_userJson_chitchatting(playerSaid, senderID, _recipient) {
    return __awaiter(this, void 0, void 0, function () {
        var postData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handler = { name: "chitchat" };
                    intent = { params: {}, query: "" };
                    scene = { name: "chitchat" };
                    session = { id: (0, lib_1.GenerateRandom)(), params: {} };
                    user = { lastSeenTime: "", character: "fish_teacher", player: 1 };
                    intent["query"] = playerSaid;
                    user["lastSeenTime"] = (0, lib_1.getNowFormatDate)();
                    postData = {
                        handler: handler,
                        intent: intent,
                        scene: scene,
                        session: session,
                        user: user
                    };
                    return [4 /*yield*/, (0, axios_1["default"])({
                            method: "POST",
                            url: ROUTE_IP + "/chitchatting",
                            data: JSON.stringify(postData)
                        })
                            .then(function (data) {
                            // 後端回前端 -> chatbot決定要傳給使用者的訊息
                            res_data = data["data"];
                            responesdJsonProcess();
                            var hasMessage = false;
                            if (senderID && chatbotWords) {
                                // 偵測是不是有訊息在字串裡面
                                for (var i = 0; i < chatbotWords.length; i++) {
                                    if (chatbotWords[i] != "") {
                                        hasMessage = true;
                                    }
                                }
                                for (var i = 0; i < chatbotWords.length; i++) {
                                    console.log("senderID is ", senderID, " i:", i);
                                    console.log("chatbotWords[".concat(i, "]: ").concat(chatbotWords[i]));
                                    if (chatbotWords[i] != "") {
                                        //chatWith(senderID, chatbotWords[i]);
                                        console.log(chatbotWords[i]);
                                    }
                                    else if (!hasMessage) {
                                        setTimeout(function () {
                                            send_userJson_chitchatting("", senderID);
                                        }, 1500);
                                    }
                                }
                                // 對話傳完之後就清空字串
                                chatbotWords = [];
                                // 閒聊完成就回到初始狀態
                                reset();
                            }
                            else {
                                console.log("Need senderID and chatbotWords");
                                console.log("sender id: ", senderID);
                                console.log("chatbotWords: ", chatbotWords);
                            }
                        })["catch"](function (err) {
                            //chatWith(senderID, "抱歉喔，我現在不是很舒服...讓我休息一下吧。");
                            console.log("抱歉喔，我現在不是很舒服...讓我休息一下吧。");
                            reset();
                            console.log(">>>", err);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.send_userJson_chitchatting = send_userJson_chitchatting;
/**
 * Respone JSON process, consider scene and reply to user.
 * @param playerSaid 使用者輸入的訊息
 * @param senderID 傳送訊息者的ID
 * @param recipientID 接收訊息者的ID
 * @param cutNumber 決定聊多少句要中斷場景
 * @author LIN-YENYU
 * @since 2021/12/23
 */
function analyze_responseData(playerSaid, senderID, playerName, call, cutNumber) {
    /* Step1： Respone JSON 處理 */
    responesdJsonProcess();
    chatbotMood();
    /* Step2：顯示機器人回應 */
    var hasMessage = false;
    if (senderID && chatbotWords) {
        // 偵測是不是有訊息在字串裡面
        for (var i = 0; i < chatbotWords.length; i++) {
            if (chatbotWords[i] != "") {
                hasMessage = true;
            }
        }
        for (var i = 0; i < chatbotWords.length; i++) {
            console.log("senderID is ", senderID, " i:", i);
            console.log("chatbotWords[".concat(i, "]: ").concat(chatbotWords[i]));
            if (chatbotWords[i] != "") {
                //chatWith(senderID, chatbotWords[i]);
                console.log(chatbotWords[i]);
                return chatbotWords[i];
            }
            else if (!hasMessage) {
                setTimeout(function () {
                    if (call == "send_userJson")
                        send_userJson("", senderID, playerName);
                    else if (call == "send_userJson_exp")
                        send_userJson_exp("", senderID, playerName);
                    else if (call == "send_userJson_exp_long")
                        send_userJson_exp_long("", senderID, playerName);
                }, 1500);
            }
        }
        // 對話傳完之後就清空字串
        chatbotWords = [];
    }
    else {
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
        var item_text = void 0;
        for (item_text in res_data["prompt"]["firstSimple"]["text"]) {
            chatbotWords[item_text] = res_data["prompt"]["firstSimple"]["text"][item_text];
            chatbotWords_speech[item_text] = res_data["prompt"]["firstSimple"]["speech"][item_text];
            chatbotWords_delay[item_text] = res_data["prompt"]["firstSimple"]["delay"][item_text];
            //console.log(chatbotWords[item_text])
        }
    }
    else {
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
function considerScene(playerSaid, senderID, playerName, call, cutNumber) {
    // 判斷同步等待使用者輸入再觸發一次request傳送
    if (scene["name"] == "check_input") {
        sync_waitInput_flag = 1;
    }
    else {
        sync_waitInput_flag = 0;
    }
    // 判斷不等待使用者輸入直接觸發request傳送
    console.log("scene name", scene["name"]);
    if (scene["name"] == "Prompt_character" ||
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
        scene["name"] == "prompt_startQuestion") {
        setTimeout(function () {
            if (call == "send_userJson")
                send_userJson(playerSaid, senderID, playerName);
            else if (call == "send_userJson_exp")
                send_userJson_exp(playerSaid, senderID, playerName);
            else if (call == "send_userJson_exp_long")
                send_userJson_exp_long(playerSaid, senderID, playerName);
            console.log("判斷不等待使用者輸入直接觸發request傳送");
        }, 1500);
    }
    // 判斷不等待使用者輸入直接觸發request傳送(對話達到指定次數)
    if (res_data.hasOwnProperty("session")) {
        if (res_data["session"]["params"].hasOwnProperty("dialog_count")) {
            if (res_data["session"]["params"]["dialog_count"] > cutNumber) {
                setTimeout(function () {
                    if (call == "send_userJson")
                        send_userJson(playerSaid, senderID, playerName);
                    else if (call == "send_userJson_exp")
                        send_userJson_exp(playerSaid, senderID, playerName);
                    else if (call == "send_userJson_exp_long")
                        send_userJson_exp_long(playerSaid, senderID, playerName);
                    console.log("判斷不等待使用者輸入直接觸發request傳送(對話達到指定次數)");
                }, 1500);
            }
        }
    }
    // 判斷不等待使用者輸入直接觸發request傳送(書名階段比對失敗)
    if (res_data.hasOwnProperty("session")) {
        if (res_data["session"]["params"].hasOwnProperty("User_first_match")) {
            if (res_data["session"]["params"]["User_first_match"] == true ||
                res_data["session"]["params"]["User_second_check"] == true) {
                if (call == "send_userJson")
                    send_userJson(playerSaid, senderID, playerName);
                else if (call == "send_userJson_exp")
                    send_userJson_exp(playerSaid, senderID, playerName);
                else if (call == "send_userJson_exp_long")
                    send_userJson_exp_long(playerSaid, senderID, playerName);
                console.log("判斷不等待使用者輸入直接觸發request傳送(書名階段比對失敗)");
            }
        }
    }
    if (scene["name"] == "exit_system") {
        setTimeout(function () {
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
function getCEP() {
    return CE_P;
}
exports.getCEP = getCEP;
function checkFinished_T(content) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, axios_1["default"])({
                        method: "POST",
                        url: ROUTE_IP + "/checkFinished",
                        data: JSON.stringify(content)
                    })
                        .then(function (result) {
                        // 後端回前端 -> chatbot決定要傳給使用者的訊息
                        return result.data;
                    })["catch"](function (err) {
                    })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
exports.checkFinished_T = checkFinished_T;
