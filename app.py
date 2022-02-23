from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.7fswg.mongodb.net/?retryWrites=true&w=majority')
db = client.dbsparta

@app.route('/')
def home():
    return render_template('index.html')

@app.route("/toon", methods=["POST"])
def toon_post():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']


    doc = {
        'name': name_receive,
        'comment': comment_receive
    }

    db.toon.insert_one(doc)
    return jsonify({'msg': '댓글 남기기!'})

@app.route("/toon", methods=["GET"])
def toon_get():
    comment_list = list(db.toon.find({}, {'_id': False}))
    return jsonify({'comment':comment_list})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
