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


client = MongoClient(
    'mongodb+srv://test:sparta@cluster0.ugwpp.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta

client = MongoClient(
    'mongodb+srv://test:sparta@cluster0.rtpl1.mongodb.net/Cluster0?retryWrites=true&w=majority')
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


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)


list = ['episode', 'omnibus', 'story', 'daily', 'comic', 'fantasy',
        'action', 'drama', 'pure', 'sensibility', 'thrill', 'historical', 'sports']
for genre in list:
    list_url = 'https://comic.naver.com/webtoon/genre.nhn?genre=' + str(genre)
    browser = mechanicalsoup.StatefulBrowser()
    soup = browser.open(list_url).soup

    for tag in soup.select('div.list_area li'):

        url = str("http://comic.naver.com") + tag.find('a')['href']
        title = tag.find('a')['title']
        img = tag.find('img')['src']
        writer = tag.select('dd.desc')[0].text
        writer_1 = re.sub('\n', ' ', writer)
        star = tag.select('div.rating_type > strong')[0].text
        url_soup = browser.open(url).soup
        body = url_soup.select('div.detail p')[0].text
        body_1 = re.sub(r'^\s+', '', body)
        body_2 = re.sub('\n', ' ', body_1)
        body_3 = " ".join(body_2.split())

        doc = {
            'genre': genre,
            'img': img,
            'title': title,
            'writer': writer_1,
            'url': url,
            'star': star,
            'body': body_3
        }

        db.webtoons.insert_one(doc)
