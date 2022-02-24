import re
import pandas as pd
import mechanicalsoup
import jwt
import datetime
import hashlib

from pymongo import MongoClient
from jwt import encode, ExpiredSignatureError, decode, exceptions
from flask import Flask, render_template, request, jsonify, redirect, url_for

app = Flask(__name__)

#########################################################
#
# 기원님
#
#########################################################

client = MongoClient(
    'mongodb+srv://test:sparta@cluster0.ugwpp.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta


application = Flask(import_name=__name__)

SECRET_KEY = 'SPARTA'


@app.route('/')
def home():
    token_receive = request.cookies.get('mytoken')
    print(token_receive)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.user.find_one({"id": payload['id']})
        return render_template('index.html', nickname=user_info["nick"])
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))


@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)


@app.route('/api/login', methods=['post'])
def api_login():

    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']

    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    result = db.user.find_one({'id': id_receive, 'pw': pw_hash})

    if result is not None:
        payload = {
            'id': id_receive,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=50)
        }
        token = encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})

    else:

        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


@app.route('/signup')
def register():
    return render_template('signup.html')


@app.route('/api/signup', methods=['post'])
def api_register():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    nickname_receive = request.form['nickname_give']

    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    db.user.insert_one(
        {'id': id_receive, 'pw': pw_hash, 'nick': nickname_receive})

    return jsonify({'result': 'success', 'msg': '회원가입 완료'})


#########################################################
#
# 유림님
#
#########################################################
clienty = MongoClient(
    'mongodb+srv://test:sparta@cluster0.7fswg.mongodb.net/?retryWrites=true&w=majority')
dby = clienty.dbsparta


@app.route("/toon", methods=["POST"])
def toon_post():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']

    doc = {
        'name': name_receive,
        'comment': comment_receive
    }

    dby.toon.insert_one(doc)
    return jsonify({'msg': '댓글 남기기!'})


@app.route("/toon", methods=["GET"])
def toon_get():
    comment_list = list(dby.toon.find({}, {'_id': False}))
    return jsonify({'comment': comment_list})





########################################################
#
# 춘님 
#
#########################################################

clientc = MongoClient(
    'mongodb+srv://test:sparta@cluster0.rtpl1.mongodb.net/Cluster0?retryWrites=true&w=majority')
dbc = clientc.dbsparta


@app.route("/webtoons", methods=["GET"])
def webtoon_get():
    webtoon_list = list(dbc.webtoons.find({}, {'_id': False}))
    return jsonify({'webtoons':webtoon_list})



    
#########################################################
# 실행 코드 (맨 아래에 위치해야합니다)
#########################################################

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)