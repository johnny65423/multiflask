from PIL import Image
import base64,io
from io import BytesIO
from flask_pymongo import PyMongo
from flask import Flask

'''
把圖片轉成base64 string存進mongodb的測試
'''


'''
app = Flask(__name__, static_url_path='/static/', 
            static_folder='static/')
app.config['DEBUG'] = True
app.secret_key = '1234321'  
mongo = PyMongo(app, uri="mongodb://localhost:27017/multiflask")


with open("./static/images/character_re.png", "rb") as image_file:
    image_data = image_file.read()
    image_base64 = base64.b64encode(image_data).decode('utf-8')

image_url = f'data:image/png;base64,{image_base64}'
'''



#mongo.db.user.insert_one({'name':"tom",'password':"", 'characterimg':image_url})


def defaultimg64str():
    with open("./static/images/character.png", "rb") as image_file:
        image_data = image_file.read()
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        image_url = f'data:image/png;base64,{image_base64}'
        return image_url