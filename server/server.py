import json
from monkeylearn import MonkeyLearn
import flask
from flask import Flask, request, jsonify, render_template, flash, session
from artifact import util, Database

app = Flask(__name__, template_folder='templates', static_folder='templates')
app.config['SECRET_KEY'] = '/*jkljilfjeklwjvb/#@!*()*^'


@app.route('/')
def home():
    if 'data' not in session:
        return render_template('Home/index.html')
    else:
        return render_template('client.html')

@app.route('/admin')
def admin_home():
    if 'data' not in session:
        return render_template('login.html')
    else:
        return render_template('admin_home.html',data=session.get('data')[0])


@app.route('/signout')
def signout():
    session.pop('data')
    response = flask.redirect('/')
    response.headers.add('Cache-Control', 'no-store,no-cache,must-revalidate,post-check=0,pre-check=0')
    return response


@app.route('/signin', methods=['post'])
def login():
    email = request.form.get('email')
    password = request.form.get('pwd')
    db = Database.Database()
    response = db.login({'email': email, 'password': password})
    if response == False:
        error = "Email or password is wrong"
        return render_template('Home/index.html', error=error)
    else:
        session['data'] = response
        response = flask.redirect('/')
        response.headers.add('Cache-Control', 'no-store,no-cache,must-revalidate,post-check=0,pre-check=0')
        return response


@app.route('/admin/login',methods=['post'])
def admin_login():
    email = request.form.get('email')
    password = request.form.get('password')
    db=Database.Database()
    response = db.admin_login({'email': email, 'password': password})
    if response == False:
        error = "Email or password is wrong"
        return render_template('login.html', error=error)
    else:
        session['data'] = response
        return render_template('admin_home.html', data=session.get('data')[0])

@app.route('/admin/logout')
def admin_logout():
    session.pop('data')
    response = flask.redirect('/admin')
    response.headers.add('Cache-Control', 'no-store,no-cache,must-revalidate,post-check=0,pre-check=0')
    return response

@app.route('/register', methods=['post'])
def register():
    name = request.form.get('name')
    email = request.form.get('email')
    mob_no = request.form.get('mob_no')
    address = request.form.get('address')
    password = request.form.get('pwd')
    db = Database.Database()
    if (db.insert({'name': name, 'mobile_number': mob_no, 'email': email, 'address': address, 'password': password},
                  'client')):
        response = flask.redirect('/')
        response.headers.add('Cache-Control', 'no-store,no-cache,must-revalidate,post-check=0,pre-check=0')
        return response
    else:
        return render_template('Home/index.html', error="Account Already Exist.")


@app.route('/contactus', methods=['post'])
def aboutUs():
    name = request.form.get('name')
    email = request.form.get('email')
    subject = request.form.get('subject')
    message = request.form.get('message')
    ml=MonkeyLearn('your id')
    response = ml.classifiers.classify(
        model_id='cl_Jx8qzYJh',
        data=[
            message
        ]
    )
    message_type=response.body[0]['classifications'][0]['tag_name']
    confidence=response.body[0]['classifications'][0]['confidence']

    db = Database.Database()
    if (db.insert({'name': name, 'email': email, 'subject': subject, 'message': message, 'message_type':message_type, 'confidence':confidence}, 'feedback')):
        flash("Thank you for giving feedback")
        response = flask.redirect('/')

        response.headers.add('Cache-Control', 'no-store,no-cache,must-revalidate,post-check=0,pre-check=0')
        return response
    else:
        return render_template('Home/index.html', error="Something Went Wrong.Try again later..")


@app.route('/addData', methods=['post'])
def addData():
    if 'data' not in session:
        return render_template('Home/index.html')
    sqft = request.form.get('total_sqft')
    bhk = request.form.get('bhk')
    bath = request.form.get('bath')
    location = request.form.get('location')
    price = request.form.get('price')
    db = Database.Database()
    if db.insert({'location': location, 'bhk': bhk, 'bath': bath, 'area_size': sqft, 'price': price}, 'datas'):
        return "True"
    return "False"


@app.route('/updateData', methods=['post'])
def updateData():
    if 'data' not in session:
        return render_template('Home/index.html')
    id = request.form.get('id')
    name = request.form.get('name')
    email = request.form.get('email')
    mobile_number = request.form.get('mobile_number')
    address = request.form.get('address')
    password = request.form.get('password')
    db = Database.Database()
    if db.update({'id': id, 'name': name, 'mobile_number': mobile_number, 'email': email, 'address': address,
                  'password': password}, 'client'):
        return "True"
    return "False"


@app.route('/get_location_names')
def get_location_names():
    if 'data' not in session:
        return render_template('Home/index.html')
    response = jsonify({
        'locations': util.get_location_names()
    })

    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


@app.route('/predict_home_price', methods=['post'])
def predict_home_price():
    if 'data' not in session:
        return render_template('Home/index.html')
    total_sqft = float(request.form['total_sqft'])
    location = str(request.form['location'])
    bhk = float(request.form['bhk'])
    bath = float(request.form['bath'])
    id = str(request.form['id'])
    db = Database.Database()
    db.insert({'c_id': id, 'sqft': str(total_sqft), 'location': location, 'bhk': str(bhk), 'bath': str(bath)},
              'history')
    response = jsonify({
        'estimated_price': util.get_estimated_price(location, total_sqft, bhk, bath)
    })

    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


@app.route('/admin/get_db_schema', methods=['post'])
def admin_get_db_schema():
    if 'data' not in session:
        return ""
    db = Database.Database()
    response = db.admin_db_schema()
    if not response:
        return "None"
    else:
        response = jsonify({
            'schema': response
        })

        response.headers.add('Access-Control-Allow-Origin', '*')

        return response


@app.route('/admin/get_client_data', methods=['post'])
def admin_get_client():
    if 'data' not in session:
        return ""
    db = Database.Database()
    response = db.admin_get_data('client')
    if not response:
        response = jsonify({
            'exception': response
        })
    else:
        response = jsonify({
            'data': response
        })

        response.headers.add('Access-Control-Allow-Origin', '*')

    return response


@app.route('/admin/get_feedback_data', methods=['post'])
def admin_get_feedback():
    if 'data' not in session:
        return ""
    db = Database.Database()
    response = db.admin_get_data('feedback')
    if not response:
        response = jsonify({
            'exception': response
        })
    else:
        response = jsonify({
            'data': response
        })

        response.headers.add('Access-Control-Allow-Origin', '*')

    return response


@app.route('/admin/get_history_data', methods=['post'])
def admin_get_history():
    if 'data' not in session:
        return ""
    db = Database.Database()
    response = db.admin_get_data('history')
    if not response:
        response = jsonify({
            'exception': response
        })
    else:
        response = jsonify({
            'data': response
        })

        response.headers.add('Access-Control-Allow-Origin', '*')

    return response


@app.route('/admin/get_datas_data', methods=['post'])
def admin_get_datas():
    if 'data' not in session:
        return ""
    db = Database.Database()
    response = db.admin_get_data('datas')
    if not response:
        response = jsonify({
            'exception': response
        })
    else:
        response = jsonify({
            'data': response
        })

        response.headers.add('Access-Control-Allow-Origin', '*')

    return response


@app.route('/admin/get_query_data', methods=['post'])
def admin_get_query_data():
    if 'data' not in session:
        return ""
    query = request.form.get('query')
    if query == None:
        response = jsonify({
            'exception': "No query given..."
        })
        return response
    db = Database.Database()
    response = db.admin_query(query)
    if type(response) == type('list'):
        response = jsonify({
            'exception': response
        })
    else:
        response = jsonify({
            'data': response
        })

    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


@app.route('/admin/update_client_data', methods=['post'])
def admin_update_client():
    if 'data' not in session:
        return ""
    data = request.form.get('data')
    data = json.loads(data)
    db = Database.Database()
    if (db.update(data, 'client')):
        response = jsonify({
            "status": "success"
        })
    else:
        response = jsonify({
            "status": "fail"
        })
    return response


@app.route('/admin/delete_table_data', methods=['post'])
def admin_delete_data():
    if 'data' not in session:
        return ""
    table_name = request.form.get('table_name')
    id = request.form.get('id')
    db = Database.Database()
    if db.delete(id, table_name):
        response = jsonify({
            "status": "success"
        })
    else:
        response = jsonify({
            "status": "fail"
        })
    return response

@app.route('/admin/admin_history_analysis', methods=['get'])
def admin_history_analysis():
    if 'data' not in session:
        return ""
    db = Database.Database()
    response = db.admin_history_analysis()
    if not response:
        return "None"
    else:
        response = jsonify({
            'data': response
        })

        response.headers.add('Access-Control-Allow-Origin', '*')

        return response

@app.route('/admin/admin_feedback_analysis', methods=['get'])
def admin_feedback_analysis():
    if 'data' not in session:
        return ""
    db = Database.Database()
    response = db.admin_feedback_analysis()
    if not response:
        return "None"
    else:
        response = jsonify({
            'data': response
        })

        response.headers.add('Access-Control-Allow-Origin', '*')

        return response


if __name__ == "__main__":
    app.run()
