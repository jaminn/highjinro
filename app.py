import flask
from flask import Flask
import re
from functools import wraps
import json
from flask import Response

app = Flask(__name__)
with open('data.txt', mode='r') as file:
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


@app.route('/')
def index():
    return '<html><body><pre>' + data + '</pre></body></html>'


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
    wrap_data = {"result":school_list}
    return wrap_data


if __name__ == '__main__':
    app.run(debug=True)
