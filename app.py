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

#################################
##  정보수정을 위한 API         ##
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

@app.route('/main')
def main():
    token_receive = request.cookies.get('mytoken')
    try:
        token_receive = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = toonUser.find_one({"id": token_receive['id']})
        print(user_info)

        return render_template('index.html', email=user_info["id"], nickname=user_info["nick"])
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return render_template('index.html')



@app.route('/')
def home():
    token_receive = request.cookies.get('mytoken')
    try:
        token_receive = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = toonUser.find_one({"id": token_receive['id']})
        print(user_info)
        token = True
    except:
        token = False
        # return render_template('index.html')
    return redirect(url_for("main"))

# 닉네임 가져와야함!


############################################
##  유저 정보 확인 api (로그인된 유저만 call)  ##
############################################

@app.route('/api/Verif', methods=['GET'])
def verif():
    token_receive = request.cookies.get('mytoken')

    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        # print(payload)
        user_info = toonUser.find_one({"id": payload['id']})
        print(user_info)
        return redirect(url_for("main"))
    # , nickname = user_info['nick']

    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
        #유효 시간이 만료 에러문구
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))
        # jwt 토큰이 유효하지 않다는 에러문구

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
########################################################

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
########################################################



########################################################
#
# 지호
#
########################################################
@app.route('/searchToons', methods=['POST'])
def search():
    receice_keywords = request.form["give_keyword"]
    print("##################################")
    print("receice_keywords : " + receice_keywords)

    # search_condition_list = []

    # search_condition_list.append({'title': {'$regex': '.*' + receice_keywords + '.*'} })

    searched_webtoons = list(dbc.webtoons.find({'title': {'$regex': '.*' + receice_keywords + '.*'}},{'_id': False}))
    print(searched_webtoons)

    return jsonify({'msg': ' 저장 ','searched_webtoons':searched_webtoons,'receice_keywords':receice_keywords})
    
#########################################################
# 실행 코드 (맨 아래에 위치해야합니다)
#########################################################

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)