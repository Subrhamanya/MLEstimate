import json
import os
import pickle
import numpy as np

document_path = os.getcwd()

__location = None
__data_columns = None
__model = None


def get_estimated_price(location, sqft, bhk, bath):
    global __data_columns
    load_saved_artifact()
    try:
        loc_index = __data_columns.index(location.lower())
    except:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    return round(__model.predict([x])[0], 2)


def get_location_names():
    global __data_columns
    global __location
    with open(document_path + '\\artifact\\columns.json', 'r') as f:
        __data_columns = json.load(f)['data_columns']
        __location = __data_columns[3:]
    return __location


def load_saved_artifact():
    print('Loading saved artifacts ... started')
    global __data_columns
    global __location
    global __model

    get_location_names()

    with open(document_path + '\\artifact\\Real_Estate_Price_Prediction_Project.pickle', 'rb') as f:
        __model = pickle.load(f)
    print('Loading saved artifacts ... done')



