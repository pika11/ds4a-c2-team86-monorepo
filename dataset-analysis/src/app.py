import pandas as pd
from pandas_profiling import ProfileReport

df = pd.read_json(
    "./../../dataset-cleaning/result/austin_metrobike_trips.json")
profile = ProfileReport(df, title="MetroBike Trips")
profile.to_file("../result/trips.html")
