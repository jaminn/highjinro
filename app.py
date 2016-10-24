import flask
import codecs
import re
from functools import wraps
import json
from flask import Response, session, redirect, request, Flask, url_for, render_template
import pymongo

app = Flask(__name__)
app.secret_key = 'jaminku'
client = pymongo.MongoClient("mongodb://rnnwkals1:rnwkals1@ds023603.mlab.com:23603/high")
db = client.high

with codecs.open('data.txt', mode='r', encoding='UTF-16') as file:
    data = file.read()
result = re.findall(r'([가-힣)(]+)\s+([0-9\.]+|null)\s+([0-9\.]+|null)', data)
print(result)


def as_json(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        res = f(*args, **kwargs)
        res = json.dumps(res, ensure_ascii=False).encode('utf8')
        return Response(res, content_type='application/json; charset=utf-8')

    return decorated_function


def login_required(f):
    @wraps(f)
    def decorate(*args, **kwargs):
        if 'nickname' not in session:
            return "You are not logged in <br><a href = '/login'></b>" + \
                   "click here to log in</b></a>"
        return f(*args, **kwargs)

    return decorate


@app.route('/test')
def data_test():
    return '<html><body><pre>' + data + '</pre></body></html>'


@app.route('/')
@login_required
def index():
    nickname = session['nickname']
    return 'Logged in as ' + nickname + '<br>' + \
           "<b><a href = '/logout'>click here to log out</a></b>"


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        form = request.form
        user = db.user.find_one({"id": form['id']})
        if not user:
            error = "ID 없음"
            return render_template('login.html', error=error)
        if user['password'] != form['password']:
            error = "비밀번호 틀림"
            return render_template('login.html', error=error)
        else:
            session['nickname'] = user['nickname']
            return redirect(url_for('index'))
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('nickname', None)
    return redirect(url_for('index'))


@app.route('/signup', methods=['GET', 'POST'])
def sign_up():
    form = request.form
    if request.method == 'POST':
        if db.user.find_one({'nickname': form['nickname']}):
            error = 'nickname을 이미 다른 유저가 사용하고 있습니다'
            return render_template('signup.html', error=error)
        if db.user.find_one({"id": form['id']}):
            error = 'ID을 이미 다른 유저가 사용하고 있습니다'
            return render_template('signup.html', error=error)
        db.user.insert({"nickname": form['nickname'],
                        "id": form['id'],
                        "password": form['password']})
        return redirect(url_for('index'))
    return render_template('signup.html')


@app.route('/search/<input>')
@as_json
def search(input):
    school_list = []
    for school in result:
        print(school)
        if input in school[0]:
            print('<-this')
            data_dic = {"name": school[0], "uni_percent": school[1], "job_percent": school[2]}
            school_list.append(data_dic)
    wrap_data = {"result": school_list}
    return wrap_data


if __name__ == '__main__':
    app.run(debug=True)
