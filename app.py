import json
import pandas as pd
import mechanicalsoup
# JWT 패키지를 사용합니다. (설치해야할 패키지 이름: PyJWT)
import jwt
# 토큰에 만료시간을 줘야하기 때문에, datetime 모듈도 사용합니다.
import datetime
# PW 문자열 암호화
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

client = MongoClient('mongodb+srv://test:sparta@cluster0.ugwpp.mongodb.net/Cluster0?retryWrites=true&w=majority')
dbtoon = client.toon
toonInfo = dbtoon.toonInfo
toonUser = dbtoon.toonUser
toonLikes = dbtoon.toonLikes


application = Flask(import_name=__name__)

SECRET_KEY = 'SPARTA'



@app.route('/update_like', methods=['POST'])
def update_like():
    # 누가 좋아요를 눌렀는지알아야함
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        # 좋아요 수 변경
        user_info = toonUser.find_one({"id": payload["id"]})
        # 난 id가맞음
        post_id_receive = request.form["post_id_give"]
        type_receive = request.form["type_give"]
        action_receive = request.form["action_give"]
        doc = {
            "post_id": post_id_receive,
            "username": user_info["username"],
            "type": type_receive
        }
        if action_receive == "like":
            toonLikes.insert_one(doc)
        else:
            toonLikes.delete_one(doc)
        count = toonLikes.count_documents({"post_id": post_id_receive, "type": type_receive})
        return jsonify({"result": "success", 'msg': 'updated', "count": count})

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))




#################################
##  정보수정을 위한 API           ##
#################################

@app.route('/api/information', methods=['post'])
def api_information():
    token_receive = request.cookies.get('mytoken')
    idload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
    user_info = toonUser.find_one({"id": idload['id']})

    id_receive = user_info["id"]
    pw_receive = request.form['pw_give']

    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    result = toonUser.find_one({'id': id_receive, 'pw': pw_hash})

    if result is not None:
        payload = {
            'id': id_receive,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=24 * 60 * 60)
        }
        token = encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})
    # 회원정보 확인후 암호화/토큰발행
    toonUser.update_one({'id': id_receive}, {'$set': {'pw': pw_hash}})
    # pymongo에 pw변경
    return jsonify({'result': 'success','msg': '정보변경 완료!'})






@app.route('/information')
def information():
        token_receive = request.cookies.get('mytoken')
        try:
            payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
            user_info = toonUser.find_one({"id": payload['id']})

            return render_template('information.html', email=user_info["id"], nickname=user_info["nick"])
        except jwt.ExpiredSignatureError:
            return redirect(url_for("main", msg="로그인 시간이 만료되었습니다."))
        except jwt.exceptions.DecodeError:
            return redirect(url_for("main", msg="로그인 정보가 존재하지 않습니다."))

############################################
##  유저 정보 확인 api (로그인된 유저만 call)  ##
############################################


@app.route('/main')
def main():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = toonUser.find_one({"id": payload['id']})
        print(user_info)

        return render_template('index.html', email=user_info["id"], nickname=user_info["nick"])
    except jwt.ExpiredSignatureError:
        return redirect(url_for("main", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("main", msg="로그인 정보가 존재하지 않습니다."))



@app.route('/')
def home():
    return render_template('index.html')

# 닉네임 가져와야함!





@app.route('/signup')
def register():
    return render_template('signup.html')

@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)


############################################
##  로그인 API  id,pw 맞춰보고 토큰생성/발급   ##
############################################

@app.route('/api/login', methods=['post'])
def api_login():

    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']

    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    result = toonUser.find_one({'id': id_receive, 'pw': pw_hash})

    if result is not None:
        payload = {
            'id': id_receive,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=24*60*60)
        }
        token = encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})

    else:

        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})



#################################
##  회원가입을 위한 API           ##
#################################

@app.route('/api/signup', methods=['post'])
def api_signup():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    nickname_receive = request.form['nickname_give']

    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    doc = {'id': id_receive, 'pw': pw_hash, 'nick': nickname_receive}
    toonUser.insert_one(doc)
    toonLikes.insert_one({'id': id_receive, 'toonId': []})

    return jsonify({'result': 'success','msg': '회원가입을 축하드립니다!'})


#################################
##  아이디 중복확인 API           ##
#################################

@app.route('/signup/check_dup', methods=['POST'])
def check_dup():
    username_receive = request.form['username_give']
    # bool=>값이 있느 문자열 리스트 등을 true, 값이 없는건 false
    exists = bool(toonUser.find_one({"id": username_receive}))

    return jsonify({'result': 'success', 'exists': exists})

#################################
##        로그아웃 API           ##
#################################

@app.route('/logout')
def logout():
    return redirect(url_for("login"))

#########################################################
#
# 유림님
#
#########################################################






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


########################################################
#
# 주환
#
#########################################################
clientj = MongoClient(
    'mongodb+srv://test:sparta@cluster0.oqwac.mongodb.net/myCluster0?retryWrites=true&w=majority')
dbj = clientj.dbsparta


@app.route("/toon", methods=["POST"])
def toon_post():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']
    title_receive = request.form['title_give']
    time_receive = request.form['time_give']

    doc = {
        'name': name_receive,
        'comment': comment_receive,
        # 타이틀을 받아줍니다.
        'title': title_receive,
        'time' : time_receive
    }

    dbj.toon.insert_one(doc)
    return jsonify({'msg': '댓글 남기기!'})



@app.route("/toon/comment", methods=["POST"])
def toon_get():
    title_name = request.form['title_give']
    
    title_comment_list = list(dbj.toon.find({'title': title_name}, {'_id': False}))
    
    return jsonify({'comment': title_comment_list})



    
#########################################################
# 실행 코드 (맨 아래에 위치해야합니다)
#########################################################

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)