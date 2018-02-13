#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, request
from flask_cors import CORS
from flask_restful import Resource, Api
from sqlalchemy import create_engine
from json import dumps
from flask.ext.jsonpify import jsonify
import time
import datetime

db_connect = create_engine('sqlite:///trades.db')
app = Flask(__name__)
CORS(app)
api = Api(app)

class Trades(Resource):
    def get(self):
        currentconnection = db_connect.connect()
        query = currentconnection.execute("select Sell_Currency, Sell_Amount, Buy_Currency, Buy_Amount, Rate, Date_Booked from Trades")
        res = {'trades': [dict(zip(tuple (query.keys()) ,i)) for i in query.cursor]}
        return jsonify(res)

    def toalphanumeric(self, i):
        chars = '0123456789ABCDEFGHIJKLMNOPQRSTVWXYZ'
        ret = ""
        while i:
            ret = ret + chars[i % len(chars)]
            i = int(round(i / len(chars)))
        return ret

    def createnewid(self):
        # Use the current milliseconds to create a new ID parsing to 35-base alphanumeric.
        milliseconds = int(round(time.time() * 1000))

        # toalphanumeric(milliseconds) returns a string with length equals to 8, we only need 7 alphanumeric
        # characters (to the left milliseconds, to the right date), so we choose first 7 characters.
        return "TR" + self.toalphanumeric(milliseconds)[0:7]

    def getdatebooked(self):
        dt = datetime.datetime.utcnow()
        return str(dt.year) + "-" + str(dt.month) + "-" + str(dt.day) + " " + str(dt.hour) + ":" + str(dt.minute) + ":" + str(dt.second)

    def post(self):
        if (request.json['Sell_Currency'] == "") or (request.json['Sell_Currency'] == "void") or (request.json['Buy_Currency'] == "") \
        or (request.json['Buy_Currency'] == "void") or (request.json['Sell_Amount'] == "NaN") or (request.json['Buy_Amount'] == "NaN") \
        or (request.json['Rate'] == "NaN"):
            return {'status':'error'}

        currentconnection = db_connect.connect()
        newid = self.createnewid()
        newsellcurrency = request.json['Sell_Currency']
        newsellamount = request.json['Sell_Amount']
        newbuycurrency = request.json['Buy_Currency']
        newbuyamount = request.json['Buy_Amount']
        newrate = request.json['Rate']
        newdatebooked = self.getdatebooked()
        currentconnection.execute("insert into Trades values('{0}','{1}','{2}','{3}', '{4}','{5}','{6}')".format(newid,
            newsellcurrency, newsellamount, newbuycurrency, newbuyamount, newrate, newdatebooked))
        return {'status':'success'}

api.add_resource(Trades, '/trades')

if __name__ == '__main__':
     app.run(port=5002) #http://127.0.0.1:5002/trades ;;; http://localhost:5002/trades
