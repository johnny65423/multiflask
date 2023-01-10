from flask import Flask, request, Response, session, stream_with_context, render_template, send_from_directory, redirect, url_for
from flask_socketio import SocketIO, emit, send
from flask_login import LoginManager, UserMixin, login_user, current_user, login_required, logout_user
from flask_pymongo import PyMongo
from pprint import pprint
from user import User
from img64 import defaultimg64str
import datetime


app = Flask(__name__, static_url_path='/static/', 
            static_folder='static/')
app.config['DEBUG'] = True
socketio = SocketIO(app)
app.secret_key = '1234321'  
mongo = PyMongo(app, uri="mongodb://localhost:27017/multiflask")
login_manager = LoginManager(app)
login_manager.init_app(app)

class Server :
    def __init__(self):
        self.Players = {}
    
    def addPlayer(self, newPlayer):
        print("Add:", newPlayer['id'])
        self.Players[newPlayer['id']] = newPlayer
    
    def removePlayer(self, id):
        self.Players.pop(id)

    def getUserName(self, id):
        return self.Players[id]['name']

def get_user(name):
    user_data = mongo.db.user.find_one({'name':name})
    if user_data is None :
        return None
    return User(user_data['name'], user_data['password'])


@app.route('/')
def index():
    return redirect(url_for('Login'))

@app.route('/room')
def room():
    print(current_user.username)
    return render_template('index.html')

@app.route('/playerlist')
def Playerlist():
    return myserver.Players


@app.route('/login', methods=['GET', 'POST'])
def Login():
    print(current_user)
    if current_user.is_authenticated:
        print("already login:",current_user.username)
        return redirect(url_for('room'))
    message = ''
    if request.method == 'POST':
        print("logingogo")
        username = request.form.get('username')
        password_input = request.form.get('password')
        user = get_user(username)
        if user and user.check_password(password_input):
            login_user(user)
            print("login")
            return redirect(url_for('room'))
        else:
            print("error")
            message = 'Failed to login!'

    return render_template('login.html', message=message)

@app.route('/register', methods=['GET', 'POST'])
def Signup():
    message = ''
    print('signup')
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        reppassword = request.form.get('reppassword')
        if get_user(username) is None:
            print("Insert new")
            if username != "" and username !=None and reppassword == password :
                mongo.db.user.insert_one({'name':username,'password':password})
                return redirect(url_for('Login'))
            else :
                print("error")
                message = 'Doesn\'t match'
        else:
            print("error")
            if not username is None :
                message = 'Account already exist!'

    return render_template('signup.html', message=message)

@app.route("/logout/")
@login_required
def logout():
    print("logout")
    logout_user()
    return redirect(url_for('index'))

@login_manager.user_loader
def load_user(username):
    return get_user(username)

@app.route('/mongo', methods=['GET'])
def get_all_docs():
  print(mongo.db.user.find_one({'name':'johnny'}))
  return "test"


@socketio.on('connect')
def test_connect():
    print("Connect:", request.sid)

@socketio.on('disconnect')
def test_disconnect():
    print("Disconnect:", request.sid)
    myserver.removePlayer(request.sid)
    allplayer = [value for key, value in myserver.Players.items()]
    socketio.emit("RemovePlayer", allplayer)
    #logout_user()
    #print(current_user.username)
    #print(current_user.is_authenticated)

@socketio.on('initialize')
def initialize(newPlayer):
    myserver.addPlayer(newPlayer)
    allplayer = [value for key, value in myserver.Players.items()]
    socketio.emit("AddPlayer", allplayer)

@socketio.on('test')
def test(info):
    print(info)
    print('--------------------------')
    user_data = mongo.db.user.find_one({'name':info['name']})
    ##print(user_data['characterimg'])
    socketio.emit("testcallback", {'name':info['name'], 'imgstr':user_data['characterimg']} )

@socketio.on('update')
def update(id, x, y):
    socketio.emit('updateCoordinate', {"id": id,"x": x,"y": y})

@socketio.on('chat')
def updatechat(id, text):
    print(id, " ", text)
    doc = {
        'time':datetime.datetime.now(),
        'user_id':id,
        'user_name':myserver.getUserName(id),
        'msg':text
    }
    mongo.db.message.insert_one(doc)
    socketio.emit('updateChat', {"id": id,"text": text})

    
if __name__ == '__main__':
    print('Start')
    myserver = Server()
    socketio.run(app,debug=True)
    #socketio.run(app,host='127.0.0.1',port=5000,debug=True)
